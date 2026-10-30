import { useState } from "react";//importar useState para manejar el estado de los componentes
import { Container, Form, Input, Button, Alert, ListGroup, ListGroupItem, Badge } from "reactstrap";//importar componentes de reactstrap para el diseño de la interfaz

const API = "http://localhost:3000";

function App() {
  const [numero, setNumero] = useState("");//estado para el número ingresado por el usuario
  const [intentos, setIntentos] = useState([]); // historial [{ numero, resultado }]
  const [mensaje, setMensaje] = useState("");
  const [ganado, setGanado] = useState(false);//estado para saber si el usuario ha ganado

  const fallidos = intentos.filter((i) => i.resultado !== "correcto").length;//cuenta los intentos fallidos

  const enviarIntento = async (e) => {  //función asincrónica para enviar el intento al servidor
    e.preventDefault();
    const intento = Number(numero);//convierte el número ingresado a tipo Number

    try {
      const res = await fetch(`${API}/guess`, {//envía el intento al servidor
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: intento }),
      });
      const data = await res.json();//convierte la respuesta del servidor a JSON

      if (!res.ok) {//si la respuesta no es ok, muestra el mensaje de error(error de que el número no esté entre 1 y 100)
        setMensaje(data.mensaje);
        return;
      }

      setIntentos([...intentos, { numero: intento, resultado: data.resultado }]);//agrega el intento al historial
      setMensaje(data.mensaje);//muestra el mensaje si es mayor o menor o correcto
      setGanado(data.resultado === "correcto"); //actualiza el estado de ganado
      setNumero("");//limpia el input
    } catch {  
      setMensaje("No se pudo conectar con el servidor");//
    }
  };

  const reiniciar = async () => {
    try {
      await fetch(`${API}/reset`, { method: "POST" });
      setIntentos([]);
      setMensaje("");
      setGanado(false);
      setNumero("");
    } catch {
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 500 }}>
      <h1 className="mb-3">Adivina el Número</h1>
      <p>Adivina el número entre 1 y 100.</p>

      <Form onSubmit={enviarIntento} className="d-flex gap-2 mb-3">
        <Input
          type="number"
          min="1"
          max="100"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          disabled={ganado}
          required
        />
        <Button color="success" disabled={ganado}>Probar</Button>
      </Form>

      {mensaje && <Alert color={ganado ? "success" : "info"}>{mensaje}</Alert>}

      <p>Intentos fallidos: <Badge color="danger">{fallidos}</Badge></p>

      <h5>Historial</h5>
      <ListGroup className="mb-3">
        {intentos.map((i, indice) => (//a
          <ListGroupItem key={indice}>
            {i.numero} — {i.resultado}
          </ListGroupItem>
        ))}
      </ListGroup>

      <Button color="secondary" onClick={reiniciar}>Nuevo juego</Button>
    </Container>
  );
}

export default App; //para exportar el componente App y poder usarlo en main.jsx donde se renderiza en el DOM
