/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/**********************
 * Página de bienvenida
 **********************/

import React, { Component } from "react";
import Navbar from "../components/Navbar";

import cato from "../images/cato.jpg";

import ucbLogo from "../images/ucb_logo.png";

export default class Home extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div className="container">
          <div className="row">
            <div className="col mr-auto mt-4">
              <h4 className="text-center">
                UNIVERSIDAD CAT&Oacute;LICA BOLIVIA "SAN PABLO"
              </h4>
              <h5 className="text-center">
                UNIDAD ACAD&Eacute;MICA REGIONAL LA PAZ
              </h5>
              <div align="center">
                <img
                  src={ucbLogo}
                  height="150px"
                  alt="UCB Logo"
                  className="mt-4 mb-4"
                />
              </div>
              <h1 className="text-center mb-4 mt-4">
                APLICACI&Oacute;N DE VOTANTES
              </h1>
              <div align="center" className="mt-4 pt-4">
                <img src={cato} alt="Cato" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
