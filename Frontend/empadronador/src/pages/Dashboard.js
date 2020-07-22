/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 * App de empadronador
 ***********************************************************/

/*********************************************************************
 * Página del dashboard, una vez el empadronador ha logeado con éxito
 ********************************************************************/

import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";

// Utilidades
import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      tokenExpired: isTokenValid(localStorage.jwtToken),
    };
  }

  // Se obtiene información del servidor
  componentDidMount() {
    axios
      .post(`${config.serverUrl}/api/register/dashboard`)
      .then((response) => {
        if (response.data.body) {
          this.setState(response.data.body.profile);
        }
      });
  }

  // Inicialización de parámetros de configuración para la elección
  handleParamInit(event) {
    axios
      .post(`${config.serverUrl}/api/register/init`)
      .then((response) => {
        if (response.data.body) {
          alert(response.data.body);
        } else {
          alert(response.data.error);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    event.preventDefault();
  }

  // Cierre del periodo de empadronamiento
  handleRegisterCloser(event) {
    axios
      .put(`${config.serverUrl}/api/register/closeregistration`)
      .then((response) => {
        if (response.data.body) {
          alert(response.data.body);
        } else {
          alert(response.data.error);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    event.preventDefault();
  }

  // Apertura del periodo de votación
  handleVotingOpen(event) {
    axios
      .put(`${config.serverUrl}/api/register/openvotingperiod`)
      .then((response) => {
        if (response.data.body) {
          alert(response.data.body);
        } else {
          alert(response.data.error);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    event.preventDefault();
  }

  // Cierre del periodo de votación
  handleVotingClose(event) {
    axios
      .put(`${config.serverUrl}/api/register/closevotingperiod`)
      .then((response) => {
        if (response.data.body) {
          alert(response.data.body);
        } else {
          alert(response.data.error);
        }
      })
      .catch((e) => {
        console.log(e);
      });
    event.preventDefault();
  }

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Navbar></Navbar>
        <div className="container mt-4">
          <div className="row">
            <div className="col text-center">
              <h1>Panel de empadronador</h1>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-6">
            <div className="container">
              <div className="col">
                <div className="card mt-4">
                  <div className="card-body">
                    <h4 className="card-title">
                      Nombre: {this.state.name} {this.state.lastname}
                    </h4>
                  </div>
                  <ul className="list-group">
                    <li className="list-group-item">
                      Organizaci&oacute;n: {this.state.organization}
                    </li>
                    <li className="list-group-item">
                      Nombre de usuario: {this.state.username}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="container">
              <div className="col-6 offset-3">
                <div
                  onClick={this.handleParamInit}
                  className="btn btn-info btn-block mt-5 mb-5"
                >
                  INICIALIZAR PARÁMETROS DE VOTACIÓN
                </div>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <Link
                  to="/register"
                  className="btn btn-secondary btn-block mt-5 mb-5"
                >
                  Empadronar votante
                </Link>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <Link
                  to="/registerfingerbyci"
                  className="btn btn-secondary btn-block mt-5 mb-5"
                >
                  Registrar huella dactilar
                </Link>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <Link
                  to="/findvoter"
                  className="btn btn-secondary btn-block mt-5 mb-5"
                >
                  Depurar votante
                </Link>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <div
                  onClick={this.handleRegisterCloser}
                  className="btn btn-warning btn-block mt-5 mb-5"
                >
                  CERRAR PERIODO DE EMPADRONAMIENTO
                </div>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <div
                  onClick={this.handleVotingOpen}
                  className="btn btn-success btn-block mt-5 mb-5"
                >
                  ABRIR PERIODO DE VOTACIÓN
                </div>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <div
                  onClick={this.handleVotingClose}
                  className="btn btn-warning btn-block mt-5 mb-5"
                >
                  CERRAR PERIODO DE VOTACIÓN
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
