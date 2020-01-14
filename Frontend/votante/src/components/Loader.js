/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/*****************************************************
 * Componente encargado de mostrar un efecto de carga
 *****************************************************/

import React, { Component } from "react";

import "./styles/Loader.css";

export default class Loader extends Component {
  render() {
    return (
      <div className="row" id="loadingHeight">
        <div className="col d-flex justify-content-center">
          <div className="lds-grid mb-auto mt-auto">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    );
  }
}
