/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 * App de empadronador
 ***********************************************************/

/******************************************************
 * Página para registrar la huella dactilar del votante
 ******************************************************/

import React, { Component } from "react";

import Navbar from "../components/Navbar";
import InputCiFinger from "../components/InputCiFinger";

export default class RegisterFingerByCi extends Component {
  render() {
    return (
      <div>
        <Navbar></Navbar>
        <InputCiFinger></InputCiFinger>
      </div>
    );
  }
}
