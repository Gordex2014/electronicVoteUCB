/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const fs = require("fs");
// Se usa para parsear el perfil de conexión del archivo YAML
const yaml = require("js-yaml");
const path = require("path");
// Importar la clase Gateway que sirve de conexión con el BC
const { Gateway, FileSystemWallet } = require("fabric-network");
const { response } = require("express");

// Dirección del perfil de conexión
const CONNECTION_PROFILE_PATH = path.resolve(
  __dirname,
  "./profiles/dev-connection.yaml"
);
// Dirección del wallet
const FILESYSTEM_WALLET_PATH = path.resolve(__dirname, "../../../user-wallet");
// Contexto de identidad
const USER_ID = "Admin@ucb.com";
const NETWORK_NAME = "votingchannel";
const CONTRACT_ID = "evoting";

// Se crea una instancia de Gateway
const gateway = new Gateway();

// Agregar votantes
async function addNewVoters(votersList) {
  // Configurar el objeto de gateway
  await setupGateway();
  // Obtener la red
  let network = await gateway.getNetwork(NETWORK_NAME);
  // Obtener el contrato
  const contract = await network.getContract(CONTRACT_ID);
  // Emitir transacción
  try {
    // Transacción
    let response = await contract.submitTransaction("addNewVoters", votersList);
    // console.log("Respuesta del blockchain =", response.toString());
  } catch (e) {
    // Error de Timeout
    console.log(e);
    return false;
  }
  return true;
}

// Abrir la elección
async function openElection() {
  // Configurar el objeto de gateway
  await setupGateway();
  // Obtener la red
  let network = await gateway.getNetwork(NETWORK_NAME);
  // Obtener el contrato
  const contract = await network.getContract(CONTRACT_ID);
  // Emitir transacción
  try {
    // Transacción
    let response = await contract.submitTransaction("openElection");
    // console.log("Respuesta del blockchain =", response.toString());
  } catch (e) {
    // Error de Timeout
    console.log(e);
    return false;
  }
  return true;
}

// Cerrar la elección
async function closeElection() {
  // Configurar el objeto de gateway
  await setupGateway();
  // Obtener la red
  let network = await gateway.getNetwork(NETWORK_NAME);
  // Obtener el contrato
  const contract = await network.getContract(CONTRACT_ID);
  // Emitir transacción
  try {
    // Transacción
    let response = await contract.submitTransaction("closeElection");
    // console.log("Respuesta del blockchain =", response.toString());
  } catch (e) {
    // Error de Timeout
    console.log(e);
    return false;
  }
  return true;
}

// Emitir voto
async function voteEmition(voter, candidate) {
  // Configurar el objeto de gateway
  await setupGateway();
  // Obtener la red
  let network = await gateway.getNetwork(NETWORK_NAME);
  // Obtener el contrato
  const contract = await network.getContract(CONTRACT_ID);
  // Emitir transacción
  try {
    // Transacción
    let response = await contract.submitTransaction(
      "voteEmition",
      voter,
      candidate
    );
    // console.log("Respuesta del blockchain =", response.toString());
  } catch (e) {
    // Error de Timeout
    console.log(e);
    return false;
  }
  return true;
}

// Inspeccionar estado del votante (SOLO PARA DEBUG)
async function voterStatusInspection(voter) {
  // Configurar el objeto de gateway
  await setupGateway();
  // Obtener la red
  let network = await gateway.getNetwork(NETWORK_NAME);
  // Obtener el contrato
  const contract = await network.getContract(CONTRACT_ID);
  // Emitir transacción
  try {
    // Transacción
    let response = await contract.evaluateTransaction(
      "voterStatusInspection",
      voter
    );
    // console.log("Respuesta del blockchain =", response.toString());
  } catch (e) {
    // Error de Timeout
    console.log(e);
    return false;
  }
  return true;
}

// Inspeccionar estado del candidato (SOLO PARA DEBUG)
async function candidateInspection(candidate) {
  // Configurar el objeto de gateway
  await setupGateway();
  // Obtener la red
  let network = await gateway.getNetwork(NETWORK_NAME);
  // Obtener el contrato
  const contract = await network.getContract(CONTRACT_ID);
  // Emitir transacción
  try {
    // Transacción
    let response = await contract.evaluateTransaction(
      "candidateInspection",
      candidate
    );
    // console.log("Respuesta del blockchain =", response.toString());
  } catch (e) {
    // Error de Timeout
    console.log(e);
    return false;
  }
  return true;
}

// Conteo de votos
async function voteCounting() {
  // Configurar el objeto de gateway
  await setupGateway();
  // Obtener la red
  let network = await gateway.getNetwork(NETWORK_NAME);
  // Obtener el contrato
  const contract = await network.getContract(CONTRACT_ID);
  // Emitir transacción
  try {
    // Transacción
    let response = await contract.evaluateTransaction("voteCounting");
    let jsonResponse = JSON.parse(response)
    // console.log("Respuesta del blockchain =", response.toString());
    return jsonResponse;
  } catch (e) {
    // Error de Timeout
    return false;
  }
}

// Función para configurar el Gateway, no se conecta aún con el peer u orderer
async function setupGateway() {
  // Convierte el YAML de conexión a JSON
  let connectionProfile = yaml.safeLoad(
    fs.readFileSync(CONNECTION_PROFILE_PATH, "utf8")
  );

  // Se configuran los credenciales del wallet
  const wallet = new FileSystemWallet(FILESYSTEM_WALLET_PATH);

  // Configuración de opciones de conexión
  let connectionOptions = {
    identity: USER_ID,
    wallet: wallet,
    discovery: { enabled: false, asLocalhost: true },
    eventHandlerOptions: {
      strategy: null,
    },
  };

  // Se conecta la instancia del gateway a la red
  await gateway.connect(connectionProfile, connectionOptions);
}

module.exports = {
  addNewVoters,
  openElection,
  closeElection,
  voteEmition,
  voterStatusInspection,
  candidateInspection,
  voteCounting,
};
