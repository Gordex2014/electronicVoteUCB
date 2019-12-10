/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

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

module.exports = {
  add: addVoter,
  find: findVoter,
};
