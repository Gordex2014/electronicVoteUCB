/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

//  Proceso para transferir cartera con material criptográfico

const fs = require("fs");
const path = require("path");
const { FileSystemWallet, X509WalletMixin } = require("fabric-network");

// Ubicación del material criptográfico para las pruebas
const CRYPTO_CONFIG = path.resolve(
  __dirname,
  "../../../bcnetwork/orderer/crypto-config"
);
const CRYPTO_CONFIG_PEER_ORGS = path.join(CRYPTO_CONFIG, "peerOrganizations");

// Wallet que contiene las identidades de UCB
const WALLET_FOLDER = "./user-wallet";

// Crea una instancia del FileSystemWallet
const wallet = new FileSystemWallet(WALLET_FOLDER);

async function addToWallet(organizationName, userRole) {
  // Lectura del contenido de la llave y certificado
  try {
    var cert = readCertCryptogen(organizationName, userRole);
    var key = readPrivateKeyCryptogen(organizationName, userRole);
  } catch (e) {
    console.log(
      "Error en la lectura de la llave privada o el certificado! " +
        organizationName +
        "/" +
        userRole
    );
    return false;
  }

  // Creación el MSP ID
  let mspId = createMSPId(organizationName);

  // Creación de etiquetas
  const identityLabel = createIdentityLabel(organizationName, userRole);

  // Creación de la identidad X.509 basada en el certificado y la llave
  const identity = X509WalletMixin.createIdentity(mspId, cert, key);

  // Añadir identidad al wallet
  await wallet.import(identityLabel, identity);

  return true;
}

async function createWallets() {
  // Para este ejemplo, las entidades están pre establecidas
  const ORGANIZATIONS = ["ucb", "audit"];
  const ROLES = ["Admin", "Admin"];
  for (i = 0; i < ORGANIZATIONS.length; i++) {
    try {
      await addToWallet(ORGANIZATIONS[i], ROLES[i]);
    } catch (err) {
      return false;
    }
  }
  return true;
}

// Lee el contenido del certificado de PKI
function readCertCryptogen(org, user) {
  var certPath =
    CRYPTO_CONFIG_PEER_ORGS +
    "/" +
    org +
    ".com/users/" +
    user +
    "@" +
    org +
    ".com/msp/signcerts/" +
    user +
    "@" +
    org +
    ".com-cert.pem";
  const cert = fs.readFileSync(certPath).toString();
  return cert;
}

// Lee el contenido de la llave privada
function readPrivateKeyCryptogen(org, user) {
  var pkFolder =
    CRYPTO_CONFIG_PEER_ORGS +
    "/" +
    org +
    ".com/users/" +
    user +
    "@" +
    org +
    ".com/msp/keystore";
  fs.readdirSync(pkFolder).forEach((file) => {
    pkfile = file;
    return;
  });

  return fs.readFileSync(pkFolder + "/" + pkfile).toString();
}

/************************
 * Funciones de utilidad
 ***********************/

// Crea una etiqueta de identidad para el wallet
function createIdentityLabel(org, user) {
  return user + "@" + org + ".com";
}

// Crea un MSP ID para la organización ucb que será UcbMSP
function createMSPId(org) {
  return org.charAt(0).toUpperCase() + org.slice(1) + "MSP";
}

module.exports = {
  createWallets,
};
