import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, UncontrolledAlert } from "reactstrap";
import * as api from "./api";
import InfoUsuario from "./components/InfoUsuario";
import MenuDelDia from "./components/MenuDelDia";
import BandejaReserva from "./components/BandejaReserva";

const reservaInicial = { estado: "inactiva", saldo: 0, itemsReservados: [], total: 0, segundosRestantes: 0 };

function App() {
  const [menu, setMenu] = useState([]);
  const [reserva, setReserva] = useState(reservaInicial);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [segundos, setSegundos] = useState(0);

  const cargarDatos = async () => {
    const [datosMenu, datosReserva] = await Promise.all([api.getMenu(), api.getReserva()]);
    setMenu(datosMenu);
    setReserva(datosReserva);
    setSegundos(datosReserva.segundosRestantes);
  };

  // Ejecuta una acción contra el backend y luego refresca menú y reserva
  const ejecutar = async (accion) => {
    setCargando(true);
    setError(null);
    try {
      if (accion) await accion();
      await cargarDatos();
    } catch (e) {
      setError({ id: Date.now(), texto: e.message });
    } finally {
      setCargando(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    ejecutar();
  }, []);

  // Cuenta regresiva mientras la reserva está activa
  useEffect(() => {
    if (reserva.estado !== "activa") return;
    const temporizador = setInterval(() => setSegundos((s) => s - 1), 1000);
    return () => clearInterval(temporizador);
  }, [reserva.estado]);

  // Al llegar a 0 se consulta al backend, que cierra la reserva y devuelve el stock
  useEffect(() => {
    if (reserva.estado === "activa" && segundos <= 0) ejecutar();
  }, [segundos]);

  return (
    <Container className="py-3">
      <InfoUsuario reserva={reserva} segundos={segundos} />

      {error && (
        <UncontrolledAlert key={error.id} color="warning">//color de la alerta
          {error.texto}
        </UncontrolledAlert>
      )}
      {reserva.estado === "expirada" && <Alert color="warning">{reserva.mensaje}</Alert>}
      {reserva.estado === "confirmada" && <Alert color="success">¡Reserva confirmada!</Alert>}
      {cargando && <p>Cargando...</p>}

      <Row>
        <Col md="8">
          <MenuDelDia
            menu={menu}
            cargando={cargando}
            onAgregar={(id) => ejecutar(() => api.agregar(id, 1))}
          />
        </Col>
        <Col md="4">
          <BandejaReserva
            reserva={reserva}
            cargando={cargando}
            onActualizar={(id, cantidad) => ejecutar(() => api.actualizarPorciones(id, cantidad))}
            onEliminar={(id) => ejecutar(() => api.eliminar(id))}
            onConfirmar={() => ejecutar(() => api.confirmar())}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
