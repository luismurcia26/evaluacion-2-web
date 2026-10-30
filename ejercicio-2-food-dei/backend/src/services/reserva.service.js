import { menu } from "../data/menu.js";
import { HttpError } from "../utils/HttpError.js";

const SALDO_MENSUAL = 25;
const DURACION_MS = 5 * 60 * 1000; // tiempo límite de la reserva: 5 minutos

// Estado de la reserva del usuario
let estado = "inactiva"; // "inactiva"  "activa"  "expirada"  "confirmada"
let items = []; // [{ id, cantidad }]
let saldo = SALDO_MENSUAL;
let expiraEn = null;

// ---------- Funciones auxiliares 
const redondear = (n) => Math.round(n * 100) / 100;//redondea un número a 2 decimales
const buscarPlato = (id) => menu.find((p) => p.id === id);
const cantidadValida = (n) => Number.isInteger(n) && n > 0;//

const calcularTotal = () =>
  redondear(items.reduce((suma, it) => suma + buscarPlato(it.id).precio * it.cantidad, 0));

const requerirReservaActiva = () => {
  if (estado !== "activa") throw new HttpError(404, "No tienes una reserva activa");
};

// ---------- Lógica de negocio
export const obtenerMenu = () => menu;

export const obtenerReserva = () => {
  const total = calcularTotal();
  return {
    estado,
    saldo: redondear(saldo - total), // saldo disponible en tiempo real
    itemsReservados: items.map((it) => {
      const plato = buscarPlato(it.id);
      return { id: it.id, cantidad: it.cantidad, nombre: plato.nombre, precio: plato.precio };
    }),
    total,
    segundosRestantes: estado === "activa" ? Math.ceil((expiraEn - Date.now()) / 1000) : 0,
    mensaje:
      estado === "expirada"
        ? "Tu reserva expiró por tiempo. Añade un plato para iniciarla nuevamente."
        : null,
  };
};

// Si se acabó el tiempo, se cierra la reserva y se devuelve el stock
export const verificarExpiracion = () => {
  if (estado === "activa" && Date.now() >= expiraEn) {
    items.forEach((it) => {
      buscarPlato(it.id).stock += it.cantidad;
    });
    items = [];
    estado = "expirada";
  }
};

export const agregarAlimento = (alimentoId, cantidad) => {
  const plato = buscarPlato(alimentoId);

  if (!plato) throw new HttpError(404, "Alimento no encontrado");
  if (!cantidadValida(cantidad)) throw new HttpError(400, "Cantidad inválida");
  if (plato.stock < cantidad) throw new HttpError(400, "Stock insuficiente");
  if (calcularTotal() + plato.precio * cantidad > saldo) {
    throw new HttpError(400, "Saldo insuficiente para esta cantidad");
  }

  // Si no hay reserva en curso, se inicia (empieza a correr el tiempo)
  if (estado !== "activa") {
    estado = "activa";
    items = [];
    expiraEn = Date.now() + DURACION_MS;
  }

  plato.stock -= cantidad;
  const existente = items.find((it) => it.id === alimentoId);
  if (existente) existente.cantidad += cantidad;
  else items.push({ id: alimentoId, cantidad });

  return obtenerReserva();
};

export const actualizarPorciones = (id, cantidad) => {
  requerirReservaActiva();
  const item = items.find((it) => it.id === id);

  if (!item) throw new HttpError(404, "El plato no está en tu reserva");
  if (!cantidadValida(cantidad)) throw new HttpError(400, "Cantidad inválida");

  const plato = buscarPlato(id);
  const diferencia = cantidad - item.cantidad; // positivo = sube, negativo = baja

  if (diferencia > 0) {
    if (plato.stock < diferencia) throw new HttpError(400, "Stock insuficiente");
    if (calcularTotal() + plato.precio * diferencia > saldo) {
      throw new HttpError(400, "Saldo insuficiente para esta cantidad");
    }
  }

  plato.stock -= diferencia;
  item.cantidad = cantidad;
  return obtenerReserva();
};

export const eliminarAlimento = (id) => {
  requerirReservaActiva();
  const item = items.find((it) => it.id === id);

  if (!item) throw new HttpError(404, "El plato no está en tu reserva");

  buscarPlato(id).stock += item.cantidad;
  items = items.filter((it) => it.id !== id);
  return obtenerReserva();
};

export const confirmarReserva = () => {
  requerirReservaActiva();
  if (items.length === 0) throw new HttpError(400, "Tu reserva está vacía");

  saldo = redondear(saldo - calcularTotal());
  items = []; // el stock queda descontado definitivamente
  estado = "confirmada";
  return obtenerReserva();
};
