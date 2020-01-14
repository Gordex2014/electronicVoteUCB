/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

// Dependencias
const express = require("express");

// Inicializacion de la app
const app = express();
// Set de servidor para sockets
const server = require("http").Server(app);

// Más dependencias
const chalk = require("chalk");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

// Delegaciones
const socket = require("./socket");
const config = require("./config");
const router = require("./network/routes");

require("./database");

// Middlewares
app.use("/static", express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

// Socket
socket.connect(server);

// Enrutador
router(app);

// Inicialización del servidor
server.listen(config.port, function() {
  console.log(`${chalk.blue("Servidor en puerto: ")} ${config.port}`);
});
