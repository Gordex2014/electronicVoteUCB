/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const Profile = require("../models/profile");

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

module.exports = {
  add: addProfile,
  find: findProfile
};
