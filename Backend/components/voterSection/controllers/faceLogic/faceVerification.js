const axios = require("axios");
const fs = require('fs')

const faces = require("./obtainFaceId");
const config = require("../../../../config");
const voterStore = require("../../store/store")

// Configuraciones para interacción con Azure Cognitive Services
const detectFaceUrl = `${config.azureEndPoint}face/v1.0/verify`;
const subscriptionKey = `${config.azureSubscriptionKey}`;

async function verification(ci) {
  const options = {
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": subscriptionKey
    }
  };
  const parameters = await faces.faceDetecionId(ci);
  const response = await axios.post(detectFaceUrl, parameters, options);
  fs.unlinkSync(`${process.cwd()}/public/votersPhotos/temp/${ci}.jpg`)
  if(response.data.isIdentical){
    return voterStore.facial(ci)
  }
  return null;
}

module.exports = {
  verification
};
