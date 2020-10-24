/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const axios = require("axios");
const fs = require("fs");
const path = require("path");
const imageDataURI = require("image-data-uri");

const faces = require("./obtainFaceId");
const config = require("../../../../config");
const voterStore = require("../../store/store");

// Configuraciones para interacción con Azure Cognitive Services
const detectFaceUrl = `${config.azureEndPoint}face/v1.0/verify`;
const subscriptionKey = `${config.azureSubscriptionKey}`;

async function verification(ci, testImg) {
  let message, status;
  let retObject = { message, status };
  if (!ci) {
    message = "No Ha llegado ningún CI al servidor";
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
  if (!testImg) {
    message = "No se adjuntó ninguna imagen";
    status = 400;
    retObject = { message, status };
    return Promise.resolve(retObject);
  }
  // Ingresar la imagen como archivo al servidor
  imageRoute = path.join(process.cwd(), `/public/votersPhotos/temp/${ci}.jpg`);
  await imageDataURI.outputFile(testImg, imageRoute);
  // Conexión con Azure Cognitive Services
  const options = {
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey,
    },
  };
  const parameters = await faces.faceDetecionId(ci);
  const response = await axios.post(detectFaceUrl, parameters, options);
  fs.unlinkSync(`${process.cwd()}/public/votersPhotos/temp/${ci}.jpg`);
  if (response.data.isIdentical) {
    return voterStore.facial(ci);
  }
  return { message: "No es la misma persona", status: 401 };
}

module.exports = {
  verification,
};
