/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const voterStore = require("../../voterSection/store/store");
const profileStore = require('../store/store')

// Función para agregar nuevo votante, previamente controlados los ingresos
function addVoter(voterParams) {
  const { name, lastname, ci, city, location } = voterParams;
  let message, status;
  let retObject = { message, status };
  // Revisión de cumplimiento de parámetros ingresados, con sus respectivas respuestas
  if (!name) {
    message = "No se introdujo ningún nombre";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (!lastname) {
    message = "No se introdujo ningún apellido";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
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
  if (!city) {
    message = "No se introdujo ninguna ciudad";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (!location) {
    message = "No se introdujo ningún recinto de voto";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  let newVoter = {
    name,
    lastname,
    ci: ciNumber,
    city,
    location,
    facial: false,
    fingerprint: false,
    emitedvote: false
  };

  // Interacción con la base de datos
  return voterStore.add(newVoter);
}

function addProfile(profileParams) {
  let message, status;
  let retObject = { message, status };
  const { organization, name, lastname, username, password } = profileParams;
  // Revisión de cumplimiento de parámetros ingresados, con sus respectivas respuestas
  if (!name) {
    message = "No se introdujo ningún nombre";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (!lastname) {
    message = "No se introdujo ningún apellido";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (!organization) {
    message = "No se introdujo ningún nombre de organización";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (!username) {
    message = "No se introdujo ningún usuario";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (!password) {
    message = "No se introdujo ninguna contraseña";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  
  let newProfile = {
    name,
    lastname,
    organization,
    username,
    password
  };

  // Interacción con la base de datos
  return profileStore.add(newProfile);
}

function authenticateProfile(profileLogin) {
  const { username, password } = profileLogin
  if ( !username ) {
    message = "No se introdujo ningun nombre de usuario";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (password.length === 0) {
    message = "No se introdujo ninguna contraseña";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }

  const profileParams = {
    username,
    password
  };

  // Interacción con la base de datos, se usa una promesa por asincronía
  return new Promise((resolve, reject) => {
    resolve(profileStore.find(profileParams));
  });
}

function getVoterPanel(ci) {
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
    resolve(voterStore.find(ciNumber));
  });
}

module.exports = {
  addVoter,
  addProfile,
  authenticateProfile,
  getVoterPanel,
};
