/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/****************************************************
 * Página correspondiente al test de huella dactilar
 ****************************************************/

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";
import io from "socket.io-client";

import Navbar from "../components/Navbar";

// Utilidades importantes
import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";

import finger_animation from "../images/finger_animation.gif";

export default class FingerprintTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      tokenExpired: isTokenValid(localStorage.jwtToken),
      redirectSuccess: false,
      instructions: ""
    };
    this.handleFingerVerificationPetition = this.handleFingerVerificationPetition.bind(
      this
    );
  }

  // Se configuran los sockets para obtener la información enviada del sensor con las instrucciones
  componentDidMount() {
    this.fetchData();
    const socket = io(`${config.serverUrl}`);
    socket.on("instructions", data =>
      this.setState({ instructions: data.instructions })
    );
  }

  // Se obtiene la información del servidor
  fetchData = async () => {
    try {
      const data = await axios.post(
        `${config.serverUrl}/api/voters/voterpanel`,
        {
          ci: this.checkCi()
        }
      );
      this.setState({ data: data.data });
      // Si ya se ha realizado la comprobación facial, entonces se redirige
      if (this.state.data.body.fingerprint === true) {
        this.setState({ redirectSuccess: true });
      }
    } catch (error) {
      alert("500: Internal error");
    }
  };

  // Se obtiene el ci a partir del token de forma segura
  checkCi() {
    let ci;
    if (this.state.tokenExpired) {
      const decodedJWT = jwt.decode(localStorage.jwtToken);
      if (decodedJWT) {
        ci = decodedJWT.voter.ci;
      }
    }
    return ci;
  }

  // Se envia el ci al servidor, mientras se mantiene la conexión para verificar la huella dactilar
  handleFingerVerificationPetition(event) {
    axios
      .post(`${config.serverUrl}/api/voters/fingerverification`, {
        ci: this.state.data.body.ci
      })
      .then(response => {
        if (response.data.body) {
          alert("Huella verificada correctamente");
          this.setState({ redirectSuccess: true });
        }
        if (response.data.error) {
          alert(response.data.error);
          this.setState({ instructions: "" });
        }
      })
      .catch(e => {
        console.log(e);
        this.setState({ instructions: "" });
      });
    event.preventDefault();
  }

  render() {
    // Si el token está caducato se redirige al votante al inicio de página
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    // Si la prueba ya se ha realizado se redirige al votante al panel
    if (this.state.redirectSuccess === true) {
      return <Redirect to="/voterpanel" />;
    }
    return (
      <div>
        <Navbar></Navbar>
        <div className="container text-center mt-4">
          <div className="row mt-4">
            <div className="col">
              <h1>COMPROBACIÓN DE HUELLA DACTILAR</h1>
            </div>
          </div>
        </div>
        <div className="container mt-4">
          <div className="offset-4 col-4">
            <div className="card">
              <img
                className="card-img-top"
                src={finger_animation}
                alt="persona"
              />
              <div className="card-body">
                <h5 className="card-title mb-4 text-center">
                  {this.state.name} {this.state.lastname}
                </h5>
                <div
                  className="btn btn-primary btn-block mb-2"
                  onClick={this.handleFingerVerificationPetition}
                >
                  Comprobar
                </div>
                <div className="form-group">
                  <label>Instrucciones:</label>
                  <p>{this.state.instructions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
