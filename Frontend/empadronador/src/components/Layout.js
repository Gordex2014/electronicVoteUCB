/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 * App de empadronador
 ***********************************************************/

/*******************
 * Componente layout
 *******************/

import React, { Component } from "react";
import Footer from "./Footer";
export default class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.children}
        <Footer></Footer>
      </React.Fragment>
    );
  }
}
