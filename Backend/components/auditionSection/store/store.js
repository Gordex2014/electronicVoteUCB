/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const Auditor = require("../models/auditor");

// Ingresar un nuevo auditor a la base de datos
async function addAuditor(auditor) {
  const newAuditor = new Auditor();
  newAuditor.username = auditor.username;
  newAuditor.organization = auditor.organization;
  newAuditor.password = newAuditor.encrypthPassword(auditor.password);
  return newAuditor.save();
}

// Encontrar al auditor en la base de datos, dados su nombre de usuario y contraseña
async function findAuditor(filterAuditor) {
  const auditor = await Auditor.findOne({ username: filterAuditor.username });
  if (!auditor) {
    return null;
  }
  if (!auditor.comparePassword(filterAuditor.password)) {
    return null;
  }
  return auditor;
}

// Exportando funciones para ser usadas por controladores
module.exports = {
  add: addAuditor,
  find: findAuditor,
};
