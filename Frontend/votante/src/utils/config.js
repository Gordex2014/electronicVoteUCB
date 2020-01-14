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
  serverUrl: process.env.REACT_APP_MASTER_SERVER_URL || "http://localhost:3000" //localhost para desarrollo
};

export default config;
