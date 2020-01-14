/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/**********************************************************
 * Componente encargado de mostrar el layout de la web app
 **********************************************************/

import React, { Component } from "react";
import Footer from "./Footer";
export default class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        {/* El children viene a ser el switch o el navbar (el cual se lo incluye aparte por mmostrar incompatibilidades) */}
        {this.props.children}
        <Footer></Footer>
      </React.Fragment>
    );
  }
}
