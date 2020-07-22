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
const configSchema = new Schema({
  role: String,
  registrationOpen: Boolean,
  votationPeriod: Boolean,
  dataOnBlockchain: Boolean
});

module.exports = mongoose.model("config", configSchema);
