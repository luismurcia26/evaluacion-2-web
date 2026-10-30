import React from "react";
import ReactDOM from "react-dom/client"; //le dice a React que renderice el componente App en el elemento del DOM con id "root"
import "bootstrap/dist/css/bootstrap.min.css"; //importar bootstrap para el diseño de la interfaz
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);