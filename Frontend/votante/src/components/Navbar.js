/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/**********************************************************************
 * Componente encargado de mostrar la barra de navegación de la web app
 **********************************************************************/

import React from "react";
import { Link } from "react-router-dom";

// Utilidades
import isTokenValid from "../utils/isTokenValid";

import imtLogo from "../images/ucb_imt_logo.png";

// import "./styles/bootstrap.min.css";

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: isTokenValid(localStorage.jwtToken)
    };
  }

  // Se encarga de eliminar toda información del localstorage del navegador
  manageLogout() {
    alert("Usted ha salido de su sesión");
    localStorage.clear();
  }

  render() {
    return (
      <div className="">
        <nav className="navbar navbar-expand-lg navbar-light bg-light ml-auto">
          <img src={imtLogo} height="70px" alt="OEP Logo" className="pl-4" />
          <Link className="navbar-brand pl-4" to="/">
            INICIO
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navNavigation"
            aria-controls="navNavigation"
            aria-expanded="true"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navNavigation">
            {/* Si el votante está logeado se muestra el panel de votante, todo en base a la validez del token en localstorage */}
            {this.state.loggedIn ? (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/voterpanel">Panel de votante</Link>
                </li>
                <li className="nav-item">
                  <Link onClick={this.manageLogout} to="/">
                    Salir del panel <span className="sr-only">(current)</span>
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to="/login">
                    Ingreso de votante{" "}
                    <span className="sr-only">(current)</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
