import * as reservaService from "../services/reserva.service.js";//import { Request, Response } from "express";

export const getMenu = (req, res) => {
  res.json(reservaService.obtenerMenu());
};

export const getReserva = (req, res) => {
  res.json(reservaService.obtenerReserva());
};

export const agregar = (req, res) => {
  const { alimentoId, cantidad } = req.body;
  res.status(201).json(reservaService.agregarAlimento(alimentoId, cantidad));
};

export const actualizarPorciones = (req, res) => {
  const id = Number(req.params.id);
  res.json(reservaService.actualizarPorciones(id, req.body.cantidad));
};

export const eliminar = (req, res) => {
  res.json(reservaService.eliminarAlimento(Number(req.params.id)));
};

export const confirmar = (req, res) => {
  res.json(reservaService.confirmarReserva());
};
