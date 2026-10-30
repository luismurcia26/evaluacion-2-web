const API = "http://localhost:3001/api";

// Hace la petición y lanza un Error con el mensaje del backend si responde con error
const pedir = async (ruta, opciones = {}) => {
  const res = await fetch(`${API}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  const datos = await res.json();
  if (!res.ok) throw new Error(datos.mensaje);
  return datos;
};

export const getMenu = () => pedir("/menu");
export const getReserva = () => pedir("/reserva");
export const agregar = (alimentoId, cantidad) =>
  pedir("/reserva/agregar", { method: "POST", body: JSON.stringify({ alimentoId, cantidad }) });
export const actualizarPorciones = (id, cantidad) =>
  pedir(`/reserva/actualizar-porciones/${id}`, { method: "PUT", body: JSON.stringify({ cantidad }) });
export const eliminar = (id) => pedir(`/reserva/eliminar/${id}`, { method: "DELETE" });
export const confirmar = () => pedir("/reserva/confirmar", { method: "POST" });
