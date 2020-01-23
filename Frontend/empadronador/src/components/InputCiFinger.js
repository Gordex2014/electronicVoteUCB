/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 * App de empadronador
 ***********************************************************/

/*****************************************************************************************************
 * Componente que se utiliza para la búsqueda por CI, en específico para registrar la huella dactilar
 *****************************************************************************************************/
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios'

import ucbLogo from "../images/ucb-imt-logo-two.png";

// Utilidades
import config from "../utils/config";
import isTokenValid from "../utils/isTokenValid";


// El componente es muy similar a la búsqueda normal por CI, solo que se vió conveniente incluir distintas
// descripciones dentro de las etiquetas h3

export default class InputCiFinger extends Component {
  constructor() {
    super();
    this.state = {
      tokenExpired: isTokenValid(localStorage.jwtToken),
      ci: "",
      redirect: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ ci: event.target.value });
  }

  handleSubmit(event) {
    axios
      .post(`${config.serverUrl}/api/register/voterpanel`, {
        ci: this.state.ci
      })
      .then(response => {
        if (response.data.body) {
          this.setState(response.data.body);
          this.setState({ redirect: true });
        }
      })
      .catch(e => {
        alert("No se encuentra el votante");
      });
    event.preventDefault();
  }

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    if(this.state.redirect){
        return (<Redirect to={{
          pathname: '/enrollfingerprint',
            state: { ci: this.state.ci }
        }}></Redirect>)
    }
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col mt-4 pt-4" align="center">
              <h3 className="mb-4">SISTEMA DE REGISTRO DE HUELLAS</h3>
              <h2>INGRESE EL CI DEL VOTANTE</h2>
            </div>
          </div>
          <div className="row">
            <div className="col mt-4 mb-4 pb-4" align="center">
              <img src={ucbLogo} alt="UCB Logo" height="350" />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="card">
                <div className="card-body" align="center">
                  <form onSubmit={this.handleSubmit}>
                    <label>CI DEL VOTANTE</label>
                    <input
                      type="password"
                      placeholder="CI"
                      className="form-control"
                      value={this.state.ci}
                      onChange={this.handleChange}
                    />
                    <button type="submit" className="btn btn-primary mt-4">
                      INGRESAR
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
