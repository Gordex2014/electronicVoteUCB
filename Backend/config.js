/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const config = {
  dbUrl: process.env.DB_URL || "mongodb://localhost/testBackend:27017",
  port: process.env.PORT || 3000,
  host: process.env.HOST || "http://localhost",
  publicRoute: process.env.PUBLIC_ROUTE || "/app",
  secretKey: process.env.SECRET_KEY || "Ll4v3Pru3b4",
  azureEndPoint: process.env.AZURE_ENDPOINT,
  azureSubscriptionKey: process.env.AZURE_SUBSCRIPTION_KEY,
  fingerprintRegisterHost:
    process.env.FINGERPRINT_REGISTER_HOST || "http://192.168.0.105:8081",
  fingerprintClientHost:
    process.env.FINGERPRINT_CLIENT_HOST || "http://192.168.0.105:8081",
  merkleSalt: process.env.MERKLE_SALT || "merkle_salt_test",
};

module.exports = config;
