/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/
const fs = require('fs')

const Voter = require("../models/voter");

async function addVoter(voter) {
  const newVoter = new Voter();
  Object.assign(newVoter, voter)
  return newVoter.save();
}

async function findVoter(ci) {
  const voter = await Voter.findOne({ ci });
  if (!voter) {
    return null;
  }
  return voter;
}

async function modifyVoter(modifiedVoter){
  const voter = await Voter.findOne({ ci: modifiedVoter.oldCi })
  if (!voter) {
    return null;
  } else{
    voter.ci = modifiedVoter.ci
    voter.name = modifiedVoter.name
    voter.lastname = modifiedVoter.lastname
    voter.city = modifiedVoter.city
    voter.location = modifiedVoter.location
    return voter.save();
  }
}

async function deleteVoter(oldVoter) {
  // Se elimina La foto de la persona
  fs.unlinkSync(`${process.cwd()}/public/votersPhotos/${oldVoter.oldCi}.jpg`)
  return await Voter.deleteOne({ ci: oldVoter.oldCi })
}

async function addFingerprintCharacteristics(fingerMemoryVoter) {
  const voter = await Voter.findOne({ ci: fingerMemoryVoter.ci })
  if (!voter) {
    return null;
  } else{
    voter.fingerprintCharacteristics = fingerMemoryVoter.fingerprintCharacteristics
    return voter.save();
  }
  
}

async function modifyFacialParams(ci) {
  const voter = await Voter.findOne({ ci: ci })
  if (!voter) {
    return null;
  } else{
    voter.facial = true
    voter.save();
    return true
  }
}

async function modifyFingerParams(ci) {
  const voter = await Voter.findOne({ ci: ci })
  if (!voter) {
    return null;
  } else{
    voter.fingerprint = true
    voter.save();
    return true
  }
}

// Se usará para entregar toda la información de los usuarios con huellas registradas TODO: Cambiar name a info de huella
async function fingerCharacteristics() {
  const voters = await Voter.find({});
  const names = voters.map((names) => {
    return names.fingerprintCharacteristics
  })
  if (!voters) {
    return null;
  }
  return names;
}

async function fingerUniqueChar(ci) {
  const voter = await Voter.findOne({ ci })
  if (!voter){
    return null
  }
  if (voter.fingerprintCharacteristics.length == 0){
    message = "El votante aún no tiene la huella dactilar registrada";
    status = 206;
    retObject = { message, status };
    return (retObject);
  }
  return voter.fingerprintCharacteristics
}

module.exports = {
  add: addVoter,
  find: findVoter,
  modify: modifyVoter,
  delete: deleteVoter,
  facial: modifyFacialParams,
  finger: modifyFingerParams,
  addFingerprintCharacteristics: addFingerprintCharacteristics,
  fingerChar: fingerCharacteristics,
  fingerUniqueChar: fingerUniqueChar
};
