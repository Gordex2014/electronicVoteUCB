/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/
const imageDataURI = require("image-data-uri");
var path = require("path");
const keccakHash = require("keccak");

const voterStore = require("../../voterSection/store/store");
const profileStore = require("../store/store");
const gateway = require("../blockchain/gateway");
const addToWallet = require("../blockchain/addToWallet");
const config = require("../../../config");

// Función para agregar nuevo votante, previamente controlados los ingresos
function addVoter(voterParams) {
  const { name, lastname, ci, city, location, dataUri } = voterParams;
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
  if (!dataUri) {
    message = "No se adjuntó ninguna imagen";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }

  // Ingresar la imagen como archivo al servidor
  imageRoute = path.join(process.cwd(), `/public/votersPhotos/${ci}.jpg`);
  imageDataURI.outputFile(dataUri, imageRoute);

  // Ingreso a base de datos
  let newVoter = {
    name,
    lastname,
    ci: ciNumber,
    city,
    location,
    facial: false,
    fingerprint: false,
    emitedvote: false,
    imgLocation: imageRoute,
  };

  // Interacción con la base de datos
  return voterStore.add(newVoter);
}

//Función para modificar al votante
function modifyVoter(voterParams) {
  const { name, lastname, ci, city, location, oldCi } = voterParams;
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
  if (!oldCi) {
    message = "No se tienen ningún dato de un ci anterior";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }

  // Ingreso a base de datos
  let modifiedVoter = {
    name,
    lastname,
    ci: ciNumber,
    city,
    location,
    oldCi,
  };

  // Interacción con la base de datos
  return voterStore.modify(modifiedVoter);
}

// Función para eliminar al votante del padrón
function deleteVoter(voterParams) {
  const { oldCi } = voterParams;
  let message, status;
  let retObject = { message, status };
  // Revisión de cumplimiento de parámetros ingresados, con sus respectivas respuestas
  if (!oldCi) {
    message = "No se tienen ningún dato de un ci anterior";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }

  // Ingreso a base de datos
  let modifiedVoter = {
    oldCi,
  };

  // Interacción con la base de datos
  return voterStore.delete(modifiedVoter);
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
    password,
  };

  // Interacción con la base de datos
  return profileStore.add(newProfile);
}

function authenticateProfile(profileLogin) {
  const { username, password } = profileLogin;
  if (!username) {
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
    password,
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

function saveFingerprint(ci, fingerprintCharacteristics) {
  if (!ci) {
    message = "No ha llegado ningún CI";
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
  // Si no llegan características quiere decir que no llegaron datos del sensor, con lo que se toman los datos
  // de error proporcionados por el sensor
  if (fingerprintCharacteristics === undefined) {
    return Promise.resolve("No characteristics");
  }

  let fingerMemoryVoter = {
    ci: ciNumber,
    fingerprintCharacteristics: fingerprintCharacteristics,
  };

  return voterStore.addFingerprintCharacteristics(fingerMemoryVoter);
}

// Obtiene todos los usuarios de las bases de datos, los pone en una estructura de árboles de Merkle
// y devuelve un array con estos datos, un hash por usuario
async function processAllDataMerkleTrees() {
  let voterHashes = [];
  try {
    const information = await voterStore.getAllInfo();
    // Si no llega una respuesta de la base de datos, el error se debe a que aun no hay personas registradas o
    // una caída de la base de datos
    if (information.length === 0) {
      return voterHashes;
    } else {
      // Si todo estuvo bien, se procede a hacer un recorrido por todos los usuarios del sistema de voto
      for (let i = 0; i < information.length; i++) {
        let hash = merkleTreesStructuring(information[i]);
        // Si la respuesta no es nula, entonces se procede a agregarlo al array de hashes
        if (hash != null) {
          voterHashes.push(hash);
        }
      }
      // Convierte el array de hashes en un string y lo retorna
      const stringHashes = voterHashes.toString();
      return stringHashes;
    }
  } catch (error) {
    console.log(error);
  }
}

// Inicializa el periodo de elección
async function configInit() {
  const walletEval = await addToWallet.createWallets();
  const initEval = await profileStore.initElection();
  let message, status;
  let retObject = { message, status };
  if (initEval === true && walletEval === true) {
    message = "Proceso electoral iniciado correctamente";
    status = 200;
    retObject = { message, status };
    return retObject;
  } else {
    message =
      "No se pudo inicializar el proceso electoral, por favor revise las configuraciones de la Base de Datos";
    status = 500;
    retObject = { message, status };
    return retObject;
  }
}

// Cambiar el periodo de empadronamiento a cerrado
async function closeRegistration() {
  const verificationVariable = await profileStore.closeRegistration();
  const userHashesString = await processAllDataMerkleTrees();
  const addEval = await gateway.addNewVoters(userHashesString);
  let message, status;
  let retObject = { message, status };
  if (verificationVariable === true && addEval === true) {
    message = "Se ha cerrado la etapa de empadronamiento correctamente";
    status = 200;
    retObject = { message, status };
    return retObject;
  } else {
    message =
      "No se pudo cerrar la etapa de empadronamiento, por favor revise las configuraciones de la Base de Datos";
    status = 500;
    retObject = { message, status };
    return retObject;
  }
}

// Cambiar el periodo de votación a cerrado
async function closeElections() {
  const verificationVariable = await profileStore.closeElections();
  const closeBcEval = await gateway.closeElection();
  let message, status;
  let retObject = { message, status };
  if (verificationVariable == true && closeBcEval == true) {
    message = "Se ha cerrado la etapa de voto correctamente";
    status = 200;
    retObject = { message, status };
    return retObject;
  } else {
    message =
      "No se pudo cerrar la etapa de voto, por favor revise las configuraciones de la Base de Datos";
    status = 500;
    retObject = { message, status };
    return retObject;
  }
}

// Cambiar el periodo de votación a abierto
async function openElections() {
  const verificationVariable = await profileStore.openElections();
  const openBcEval = await gateway.openElection();
  let message, status;
  let retObject = { message, status };
  if (verificationVariable == true && openBcEval == true) {
    message = "Se ha abierto la etapa de voto correctamente";
    status = 200;
    retObject = { message, status };
    return retObject;
  } else {
    message =
      "No se pudo abrir la etapa de voto, por favor revise las configuraciones de la Base de Datos";
    status = 500;
    retObject = { message, status };
    return retObject;
  }
}

// Revisa si el registro está habilitado
async function registrationPeriodChecker() {
  const evaluationParam = await profileStore.registrationPeriodVerification();
  return evaluationParam;
}

// Revisa si el periodo de votación está abierto
async function votationPeriodChecker() {
  const evaluationParam = await profileStore.votationPeriodVerification();
  return evaluationParam;
}

// Obtiene la información de los candidatos
async function retrieveCandidatesData() {
  let message, status;
  const votersData = await profileStore.retrieveCandidatesData();
  let retObject = { message, status };
  if (!votersData) {
    message = "La elección no se ha inicializado";
    status = 400;
    retObject = { message, status };
    return retObject;
  } else {
    message = votersData;
    status = 200;
    retObject = { message, status };
    return retObject;
  }
}

/*******************************************
 * Funciones relacionadas con el blockchain
 ******************************************/

//  Emite el voto directamente en el blockchain y cambia el estado de votante a votado
async function voteEmition(voter, candidate, ci) {
  const voteEmition = await gateway.voteEmition(voter, candidate);
  const internalDBVoteEmitionConfirmation = await voterStore.voteSubmited(ci);
  let message, status;
  let retObject = { message, status };
  if (voteEmition === true && internalDBVoteEmitionConfirmation === true) {
    message = "Voto emitido correctamente";
    status = 200;
    retObject = { message, status };
    return retObject;
  } else {
    message = "Fallo en el BC para la emision del voto";
    status = 500;
    retObject = { message, status };
    return retObject;
  }
}

// Agregar a todos los votantes
async function addNewVotersBlockchain() {
  const userHashesString = await processAllDataMerkleTrees();
  const addEval = await gateway.addNewVoters(userHashesString);
  let message, status;
  let retObject = { message, status };
  if (addEval === true) {
    message = "Todos los votantes fueron agregados";
    status = 200;
    retObject = { message, status };
    return retObject;
  } else {
    message = "Fallo al agregar votantes al blockchain";
    status = 500;
    retObject = { message, status };
    return retObject;
  }
}

async function voteCounting() {
  const response = await gateway.voteCounting();
  let message, status;
  if (response === false) {
    message = "La elección está en curso";
    status = 500;
    retObject = { message, status };
    return retObject;
  } else {
    message = response;
    status = 200;
    retObject = { message, status };
    return retObject;
  }
}

/*************************
 * Funciones de utilidad
 ************************/

function merkleTreesStructuring(data) {
  // La información está estructurada de la siguiente manera:
  //
  //                      H1
  // -  name              ---------   R1
  //                      H2      !---------
  // -  lastname          ---------        |   R5
  //                      H3               |---------
  // -  ci                ---------   R2   |        |
  //                      H4      !---------        |
  // -  markleSalt        ---------                 |   HF
  //                      H5                        |--------- Hash Final
  // -  city              ---------   R3            |
  //                      H6      !---------        |
  // -                    ---------        |   R6   |
  //                      H7               |---------
  // -  location          ---------   R4   |
  //                      H8      !---------
  // -                    ---------
  //
  // Cabe recalcar que se debe comprobar que facial, fingerprint y emitedvote queden en false para poder
  // así evitar un cambio previo en la base de datos

  let H1, H2, H3, H4, H5, H6, H7, H8, HF;
  let R1, R2, R3, R4, R5, R6;

  // Comprueba que la huella dactilar esté registrada
  if (data.fingerprintCharacteristics.length === 0) {
    HF = null;
  }

  // Primera ronda
  H1 = keccakHash("keccak256").update(data.name).digest("hex");
  H2 = keccakHash("keccak256").update(data.lastname).digest("hex");
  H3 = keccakHash("keccak256").update(data.ci.toString()).digest("hex");
  H4 = keccakHash("keccak256").update(config.merkleSalt).digest("hex");
  H5 = keccakHash("keccak256").update(data.city).digest("hex");
  H7 = keccakHash("keccak256").update(data.location).digest("hex");

  // Segunda Ronda
  R1 = keccakHash("keccak256")
    .update(H1 + H2)
    .digest("hex");
  R2 = keccakHash("keccak256")
    .update(H3 + H4)
    .digest("hex");
  R3 = keccakHash("keccak256").update(H5).digest("hex");
  R4 = keccakHash("keccak256").update(H7).digest("hex");

  // Tercera Ronda
  R5 = keccakHash("keccak256")
    .update(R1 + R2)
    .digest("hex");
  R6 = keccakHash("keccak256")
    .update(R3 + R4)
    .digest("hex");

  // Hash Final

  // Si HF no tiene un valor previo, se envía el valor
  if (HF === null) {
    return null;
  } else {
    HF = keccakHash("keccak256")
      .update(R5 + R6)
      .digest("hex");
    return HF;
  }
}

module.exports = {
  addVoter,
  addProfile,
  authenticateProfile,
  getVoterPanel,
  modifyVoter,
  deleteVoter,
  saveFingerprint,
  processAllDataMerkleTrees,
  registrationPeriodChecker,
  votationPeriodChecker,
  configInit,
  closeRegistration,
  closeElections,
  openElections,
  addNewVotersBlockchain,
  merkleTreesStructuring,
  retrieveCandidatesData,
  voteEmition,
  voteCounting,
};
