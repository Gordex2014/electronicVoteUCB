/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')
const { Schema } = mongoose

// El modelo consta de un nombre de organización
// para poder pintar el logo en el frontend
const auditorSchema = new Schema({
    organization: String,
    username: String,
    password: String
})

// Funciones que se exponen dentro del modelo para encriptar
// y comprobar las contraseñas
auditorSchema.methods.encrypthPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

auditorSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('auditors', auditorSchema)
