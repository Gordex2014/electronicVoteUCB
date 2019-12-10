/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const registerController = require('../../registerSection/controllers/registerController')

// La función de obtener datos e información a partir del CI se la tiene escrita
// en el panel de empadronamiento (profile), así que se la reutiliza
async function authenticateVoter(ci) {
    return await registerController.getVoterPanel(ci)
}

async function getVoterPanel(ci) {
    return await registerController.getVoterPanel(ci)
}

module.exports = {
    authenticateVoter,
    getVoterPanel
}
