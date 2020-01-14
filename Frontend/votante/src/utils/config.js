/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/*******************************************************************
 * Utilidad encargada de las configuraciones que utiliza el servidor
 *******************************************************************/

const config = {
  serverUrl: process.env.SERVER_URL || "http://localhost:3000"
};

export default config;
