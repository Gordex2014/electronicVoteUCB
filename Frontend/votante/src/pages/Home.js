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
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import cato from "../images/ucb_atrio.jpg";

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
            </div>
          </div>
          <div className="row d-flex h-100">
            <div align="center" className="col-8 mt-4 mb-3">
              <img src={cato} height="350px" alt="Cato" />
            </div>
            <div className="col-4 mt-4">
              <div className="container h-100">
                <div className="d-flex h-100">
                  <div className="align-self-center mx-auto">
                    <Link to="/login" className="btn-lg btn-dark">
                      ¡EMITIR VOTO!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
