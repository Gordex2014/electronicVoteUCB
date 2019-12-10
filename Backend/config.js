/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const config = {
    dbUrl: process.env.DB_URL || 'mongodb://localhost/testBackend:27017',
    port : process.env.PORT || 3000,
    host: process.env.HOST || 'http://localhost',
    publicRoute: process.env.PUBLIC_ROUTE || '/app',
    secretKey: process.env.SECRET_KEY || 'Ll4v3Pru3b4'
}

module.exports = config
