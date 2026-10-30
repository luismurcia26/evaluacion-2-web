import { ListGroup, ListGroupItem, ButtonGroup, Button } from "reactstrap";

function BandejaReserva({ reserva, cargando, onActualizar, onEliminar, onConfirmar }) {
  const items = reserva.estado === "activa" ? reserva.itemsReservados : [];

  return (
    <>
      <h4>Tu Bandeja de Reserva</h4>
      <ListGroup className="mb-3">
        {items.length === 0 && <ListGroupItem>Aún no has añadido platos</ListGroupItem>}
        {items.map((item) => (
          <ListGroupItem key={item.id}>
            <div className="mb-2">{item.nombre}</div>
            <div className="d-flex justify-content-between align-items-center">
              <ButtonGroup size="sm">
                <Button
                  disabled={cargando || item.cantidad <= 1}
                  onClick={() => onActualizar(item.id, item.cantidad - 1)}
                >
                  -
                </Button>
                <Button disabled>{item.cantidad}</Button>
                <Button disabled={cargando} onClick={() => onActualizar(item.id, item.cantidad + 1)}>
                  +
                </Button>
              </ButtonGroup>
              <Button color="danger" outline size="sm" disabled={cargando} onClick={() => onEliminar(item.id)}>
                Quitar
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
      {items.length > 0 && (
        <Button color="success" block disabled={cargando} onClick={onConfirmar}>
          Confirmar reserva
        </Button>
      )}
    </>
  );
}

export default BandejaReserva;
