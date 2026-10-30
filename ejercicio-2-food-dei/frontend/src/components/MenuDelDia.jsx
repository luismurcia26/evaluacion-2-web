import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Badge, Button } from "reactstrap";

function MenuDelDia({ menu, cargando, onAgregar }) {
  return (
    <>
      <h4>Menú del Día</h4>
      <Row>
        {menu.map((plato) => (
          <Col xs="12" md="4" key={plato.id}>
            <Card className="mb-3">
              <CardBody>
                <CardTitle tag="h5">{plato.nombre}</CardTitle>
                <CardSubtitle className="mb-2 text-muted">{plato.categoria}</CardSubtitle>
                <p>
                  <Badge color="success">${plato.precio.toFixed(2)}</Badge>
                </p>
                <p>Stock: {plato.stock}</p>
                {plato.stock === 0 ? (
                  <Button color="secondary" disabled>
                    Agotado
                  </Button>
                ) : (
                  <Button color="primary" disabled={cargando} onClick={() => onAgregar(plato.id)}>
                    Añadir a la Reserva
                  </Button>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default MenuDelDia;
