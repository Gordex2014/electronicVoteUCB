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
    host: process.env.HOST || 'http://192.168.100.11',
    publicRoute: process.env.PUBLIC_ROUTE || '/app',
    secretKey: process.env.SECRET_KEY || 'Ll4v3Pru3b4',
    azureEndPoint: process.env.AZURE_ENDPOINT,
    azureSubscriptionKey: process.env.AZURE_SUBSCRIPTION_KEY,
    fingerprintHost: process.env.FINGERPRINT_HOST || 'http://192.168.100.151:8081'
}

module.exports = config
