/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/********************************************************
 * Componente encargado de mostrar un error en la web app
 ********************************************************/

import React from "react";
import "./styles/PageError.css";

// El error se recibe como props de una respuesta de servidor(diseñada para ser manejada por librería axios)
const PageError = props => {
  return <div className="PageError">{props.error.message}</div>;
};

export default PageError;
