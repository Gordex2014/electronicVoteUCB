/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/********************************************************************************
 * Utilidad encargada del manejo de la validez del token enviado por el servidor
 *******************************************************************************/

import jwt from "jsonwebtoken";

export default function tokenExpired(token) {
  let isTokenValid = true;
  if (token && jwt.decode(token)) {
    // Compara el condicionante de tiempo en el token
    const expiry = jwt.decode(token).exp;
    const now = new Date();
    isTokenValid = now.getTime() < expiry * 1000;
    // Si no se cumplen funciones o si el token es inexistente se retorna false
  } else if (token === null) {
    isTokenValid = false;
  } else if (token === undefined) {
    isTokenValid = false;
  } else {
    isTokenValid = true;
  }
  return isTokenValid;
}
