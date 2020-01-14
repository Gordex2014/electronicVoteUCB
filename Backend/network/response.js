/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const chalk = require("chalk");

// Manejador de respuestas, tanto internas como salidas de las APIs
exports.success = function(req, res, message, status) {
  res.status(status || 200).json({
    error: "",
    body: message
  });
};

exports.error = function(req, res, message, status, details) {
  console.log(`${chalk.red("[Respuesta de error]")} ${details}`);
  res.status(status || 500).json({
    error: message,
    body: ""
  });
};
