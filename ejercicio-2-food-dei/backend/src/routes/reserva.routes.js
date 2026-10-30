import { Router } from "express";
import * as controlador from "../controllers/reserva.controller.js";

const router = Router();//crea un enrutador para manejar las rutas relacionadas con la reserva

router.get("/menu", controlador.getMenu); // muestra el menú completo
router.get("/reserva", controlador.getReserva); // muestra la reserva actual si existe y no ha expirado
router.post("/reserva/agregar", controlador.agregar);
router.put("/reserva/actualizar-porciones/:id", controlador.actualizarPorciones); // 4
router.delete("/reserva/eliminar/:id", controlador.eliminar); // 5
router.post("/reserva/confirmar", controlador.confirmar); // confirmar la reserva

export default router;
