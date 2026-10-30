import express from "express"; // Importa el módulo Express para crear el servidor
import cors from "cors";// Importa el módulo CORS para permitir solicitudes

const app = express();
app.use(cors());//para permitir solicitudes de otros dominios
app.use(express.json());//para pasar solicitudes en json

const generarNumero = () => Math.floor(Math.random() * 100) + 1; // 1 a 100
let numeroOculto = generarNumero();

// Recibe { numero } y responde si el número oculto es "mayor", "menor" o "correcto"
app.post("/guess", (req, res) => {//ruta para adivinar el número
  const { numero } = req.body;

  if (!Number.isInteger(numero) || numero < 1 || numero > 100) {
    return res.status(400).json({ mensaje: "Envía un número entero entre 1 y 100" });
  }

  if (numeroOculto > numero) {
    return res.json({ resultado: "mayor", mensaje: "El número oculto es mayor" });
  }
  if (numeroOculto < numero) {
    return res.json({ resultado: "menor", mensaje: "El número oculto es menor" });
  }
  res.json({ resultado: "correcto", mensaje: "¡Correcto! Adivinaste el número" });
});

// Genera un nuevo número oculto
app.post("/reset", (req, res) => {
  numeroOculto = generarNumero();
  res.json({ mensaje: "Nuevo número generado" });
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));//inicia el servidor en el puerto 3000 y muestra un mensaje en la consola indicando que el servidor está corriendo
