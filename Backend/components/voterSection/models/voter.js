/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const mongoose = require("mongoose");
const { Schema } = mongoose;

// El modelo consta de los datos del votante
// para poder pintar todo en el frontend
const voterSchema = new Schema({
  name: String,
  lastname: String,
  ci: Number,
  city: String,
  location: String,
  facial: Boolean,
  fingerprint: Boolean,
  emitedvote: Boolean,
  imgLocation: String,
  fingerprintCharacteristics: Array
});

module.exports = mongoose.model("voters", voterSchema);
