import React, { Component } from "react";

import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

export default class Home extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-5 offset-1 mt-5">
          <img src={logo} height="600px" alt="AUDIT LOGO" />
        </div>
        <div className="col-5 mt-5 mb-5">
          <div className="col mt-5 mb-5">
            <h1>DIVULGACIÓN DE RESULTADOS</h1>
          </div>
          <div className="mt-5 mb-5">
            <br />
          </div>
          <div className="mt-5 mb-5">
            <br />
          </div>
          <div className="col-6 offset-2 mt-5 mb-5">
            <Link className="btn btn-dark btn-block" to="/results">
              ¡QUIERO CONOCER LOS RESULTADOS!
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
