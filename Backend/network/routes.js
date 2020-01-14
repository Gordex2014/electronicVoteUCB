/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const auditionSection = require("../components/auditionSection/routes/routes");
const voterSection = require("../components/voterSection/routes/routes");
const registerSection = require("../components/registerSection/routes/routes");
const fingerprintSection = require("../components/fingerprintSection/routes/routes");

// Rutas principales de la aplicación en el lado del servidor
const routes = function(server) {
  server.use("/api/auditors", auditionSection);
  server.use("/api/voters", voterSection);
  server.use("/api/register", registerSection);
  server.use("/api/fingerprint", fingerprintSection);
};

module.exports = routes;
