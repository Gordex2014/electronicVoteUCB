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

async function addMissingFingerInfo(fingerMemoryVoter) {
  const voter = await Voter.findOne({ ci: fingerMemoryVoter.ci })
  if (!voter) {
    return null;
  } else{
    voter.fingerprintMemoryLocation = fingerMemoryVoter.fingerprintMemoryLocation
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

module.exports = {
  add: addVoter,
  find: findVoter,
  modify: modifyVoter,
  delete: deleteVoter,
  facial: modifyFacialParams,
  addMissing: addMissingFingerInfo,
  finger: modifyFingerParams
};
