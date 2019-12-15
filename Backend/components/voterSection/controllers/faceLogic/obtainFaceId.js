/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const config = require("../../../../config");

// Configuraciones para interacción con Azure Cognitive Services
const detectFaceUrl = `${config.azureEndPoint}face/v1.0/detect`;
const subscriptionKey = `${config.azureSubscriptionKey}`;

// Obtención de los faceId en base a las imágenes almacenadas en el servidor
async function faceDetecionId(ci) {
  // Rutas de las imágenes
  const staticImageLocation = path.join(
    process.cwd(),
    `public/votersPhotos/${ci}.jpg`
  );
  const tempImageLocation = path.join(
    process.cwd(),
    `public/votersPhotos/temp/${ci}.jpg`
  );

  // Binarización de las fotografías
  const staticBinaryImage = fs.readFileSync(staticImageLocation);
  const tempBinaryImage = fs.readFileSync(tempImageLocation);

  //   Obtener faceIds que proporciona Azure Cognitive Services, para la posterior verificación
  const staticFaceId = await faceDetecion(staticBinaryImage);
  const tempFaceId = await faceDetecion(tempBinaryImage);

  const faceIds = {
    faceId1: staticFaceId,
    faceId2: tempFaceId
  };

  return faceIds;
}

// Detección de rostros a partir de binarios
async function faceDetecion(binaryImage) {
  const options = {
    headers: {
      "Content-Type": "application/octet-stream",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };
  const ax = await axios.post(detectFaceUrl, binaryImage, options)
  return ax.data[0].faceId
}

module.exports = {
    faceDetecionId
}