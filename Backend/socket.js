/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

/****************************************************************
 * Manjador de envío de mensajes del sensor de huellas dactilares
 * a través de sockets
 ****************************************************************/

const socketIO = require("socket.io");
const socket = {};

function connect(server) {
  socket.io = socketIO(server);
}

module.exports = {
  connect,
  socket
};
