import express from "express";//importar express para crear el servidor
import cors from "cors";
import reservaRoutes from "./src/routes/reserva.routes.js";
import { verificarExpiracion } from "./src/services/reserva.service.js";//importar la función para verificar la expiración de las reservas

const app = express();
app.use(cors());
app.use(express.json());//para poder recibir datos en formato JSON en el body de las peticiones


app.use((req, res, next) => {
  verificarExpiracion();
  next();
});

app.use("/api", reservaRoutes);//declara que todas las rutas de reserva estarán bajo el prefijo /api

// Manejo de errores: todas las respuestas de error tienen la forma { mensaje }
app.use((err, req, res, next) => {
  const status = err.status || 500;//si no tiene un status
  res.status(status).json({ mensaje: status === 500 ? "Error interno del servidor" : err.message });
});

app.listen(3001, () => console.log("Servidor en http://localhost:3001"));//inicia el servidor en el puerto 3001 y muestra un mensaje en la consola indicando que el servidor está corriendo
