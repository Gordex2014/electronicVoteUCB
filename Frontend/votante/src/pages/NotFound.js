/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/**********************
 * Página no encontrada
 **********************/

import React, { Component } from "react";

import Navbar from "../components/Navbar";

import sadFace from "../images/sad_face.png";

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <div className="container">
          <div className="row mt-4 mb-4 ml-auto mr-auto">
            <div className="col-6 offset-3">
              <h1>P&aacute;gina no encontrada</h1>
            </div>
          </div>
          <div className="col-6 offset-3 mb-4 mt-4">
            <img src={sadFace} alt="SadFace" height="500px" />
          </div>
        </div>
      </div>
    );
  }
}
