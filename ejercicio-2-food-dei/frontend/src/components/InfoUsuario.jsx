import { Alert, Badge } from "reactstrap";

const formatoTiempo = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function InfoUsuario({ reserva, segundos }) {
  return (
    <Alert color="info" className="sticky-top d-flex justify-content-between align-items-center">
      <span>Tu saldo actual: ${reserva.saldo.toFixed(2)}</span>
      {reserva.estado === "activa" && <span>Tiempo restante: {formatoTiempo(Math.max(segundos, 0))}</span>}
      <Badge color="dark" pill>
        Total de tu Reserva: ${reserva.total.toFixed(2)}
      </Badge>
    </Alert>
  );
}

export default InfoUsuario;
