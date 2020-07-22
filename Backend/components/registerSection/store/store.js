/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const Profile = require("../models/profile");
const Config = require("../../registerSection/models/configParams");

// Agregar empadronador a la base de datos
async function addProfile(profile) {
  let newProfile = new Profile();
  Object.assign(newProfile, profile);
  newProfile.password = newProfile.encrypthPassword(profile.password);
  return newProfile.save();
}

async function findProfile(filterProfile) {
  const profile = await Profile.findOne({ username: filterProfile.username });
  if (!profile) {
    return null;
  }
  if (!profile.comparePassword(filterProfile.password)) {
    return null;
  }
  return profile;
}

// Inicializa los valores para la elección
async function initializeElectionConfigValues() {
  const initValue = new Config();
  const validationParam = await Config.findOne({ role: "administrator" });
  if (!validationParam) {
    initValue.role = "administrator";
    initValue.registrationOpen = true;
    initValue.votationPeriod = false;
    initValue.dataOnBlockchain = false;
    try {
      await initValue.save();
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}

// Cambiar el valor de registro a "cerrado"
async function closeRegistration() {
  const registrationValue = await Config.findOne({ role: "administrator" });
  registrationValue.registrationOpen = false;
  try {
    await registrationValue.save();
    return true;
  } catch (error) {
    return false;
  }
}

// Cambiar el valor de periodo de elecciones a "abierto"
async function openElections() {
  const registrationValue = await Config.findOne({ role: "administrator" });
  if (
    registrationValue.votationPeriod === true &&
    registrationValue.dataOnBlockchain === true
  ) {
    return false;
  } else if (
    registrationValue.votationPeriod === false &&
    registrationValue.dataOnBlockchain === true
  ) {
    return false;
  } else {
    registrationValue.votationPeriod = true;
    registrationValue.dataOnBlockchain = true; //TODO: Agregar información a blockchain
    await registrationValue.save();
    return true;
  }
}

// Cambiar el valor de periodo de elecciones a "cerrado"
async function closeElections() {
  const registrationValue = await Config.findOne({ role: "administrator" });
  registrationValue.votationPeriod = false;
  try {
    await registrationValue.save();
    return true;
  } catch (error) {
    return false;
  }
}

// Revisa si los registros están abiertos
async function registrationVerifier() {
  // Nótese que está hard codeado
  const registrationValue = await Config.findOne({ role: "administrator" });
  return registrationValue.registrationOpen;
}

// Revisa si el periodo de votación está abierto
async function votationVerifier() {
  const votationDayValue = await Config.findOne({ role: "administrator" });
  return votationDayValue.votationPeriod;
}

module.exports = {
  add: addProfile,
  find: findProfile,
  registrationPeriodVerification: registrationVerifier,
  votationPeriodVerification: votationVerifier,
  initElection: initializeElectionConfigValues,
  closeRegistration,
  openElections,
  closeElections,
};
