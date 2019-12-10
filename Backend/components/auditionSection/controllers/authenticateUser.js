/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const store = require("../store/store");

// Controlador para agregar auditores
function addAuditor(auditorParams) {
  const { username, password, organization } = auditorParams;
  let message, status;
  let retObject = { message, status };
  // Revisión de cumplimiento de parámetros ingresados, con sus respectivas respuestas
  if (!organization) {
    message = "No se introdujo ninguna organizacion";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  if (!username) {
    message = "No se introdujo ningún nombre de usuario";
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
  const auditor = {
    username,
    password,
    organization
  };

  // Interacción con la base de datos
  return store.add(auditor);
}

// Función para la autenticación del usuario y contraseña del auditor
function authenticateAuditor(username, password) {
  if (!username) {
    message = "No se introdujo ningun nombre de usuario";
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

  const auditorParams = {
    username,
    password
  };

  // Interacción con la base de datos, se usa una promesa por asincronía
  return new Promise((resolve, reject) => {
    resolve(store.find(auditorParams));
  });
}

module.exports = {
  addAuditor,
  authenticateAuditor
};
