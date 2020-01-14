/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const registerController = require("../../registerSection/controllers/registerController");
const voterStore = require("../store/store");

// La función de obtener datos e información a partir del CI se la tiene escrita
// en el panel de empadronamiento (profile), así que se la reutiliza
async function authenticateVoter(ci) {
  return await registerController.getVoterPanel(ci);
}

async function getVoterPanel(ci) {
  return await registerController.getVoterPanel(ci);
}

function updateFingerprintInfo(ci) {
  if (!ci) {
    message = "No se introdujo ningún CI";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  const ciNumber = Number(ci);
  if (!Number.isInteger(ciNumber)) {
    message = "Lo que se adjuntó en el campo de CI no es un número";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  // Interacción con la base de datos para buscar el ci
  return new Promise((resolve, reject) => {
    resolve(voterStore.finger(ciNumber));
  });
}

async function getFingerCharacteristics() {
  return await voterStore.fingerChar();
}

async function getFingerprint(ci) {
  if (!ci) {
    message = "No se introdujo ningún CI";
    status = 400;
    retObject = { message, status };
    return retObject;
  }
  const ciNumber = Number(ci);
  if (!Number.isInteger(ciNumber)) {
    message = "Lo que se adjuntó en el campo de CI no es un número";
    status = 400;
    retObject = { message, status };
    return retObject;
  }
  return await voterStore.fingerUniqueChar(ciNumber);
}

module.exports = {
  authenticateVoter,
  getVoterPanel,
  updateFingerprintInfo,
  getFingerCharacteristics,
  getFingerprint
};
