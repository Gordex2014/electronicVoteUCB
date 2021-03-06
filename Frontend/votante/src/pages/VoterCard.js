/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/*************************************************
 * Página correspondiente al dashboard de usuario
 *************************************************/

import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";

import Navbar from "../components/Navbar";

// Importe de utilidades
import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";

import persona from "../images/incognito.png";
import errorIcon from "../images/error-icon.png";
import checkIcon from "../images/check-icon.png";

export default class voterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ci: null,
      imgUrl: "",
      tokenExpired: isTokenValid(localStorage.jwtToken)
    };
  }

  componentDidMount() {
    // Obtención de información del servidor
    axios
      .post(`${config.serverUrl}/api/voters/voterpanel`, {
        ci: this.checkCi()
      })
      .then(response => {
        if (response.data.body) {
          this.setState(response.data.body);
          // Si por algún motivo no existe una imagen de referencia se pone una imagen por default
          if (this.state.imgLocation === undefined) {
            this.setState({ imgUrl: "" });
          } else {
            const imageUrl = `${config.serverUrl}/static/votersPhotos/${this.state.ci}.jpg`;
            this.setState({ imgUrl: imageUrl });
          }
        }
      })
      .catch(e => {
        alert("No se encuentra el votante");
      });
  }

  // Se obtiene el ci a partir del token
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

  // Si el votante tiene las comprobaciones facial y dactilar está listo para votar
  readytoVote() {
    if (this.state.facial === true) {
      if (this.state.fingerprint === true) {
        return true;
      }
      return false;
    }
    return false;
  }

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    return (
      <div className="">
        <Navbar></Navbar>
        <div className="container">
          <div className="row">
            <div className="col-6 offset-3">
              <div className="card mt-4">
                <img
                  className="card-img-top"
                  src={this.state.imgUrl || persona}
                  width="300px"
                  alt="Foto persona"
                />
                <div className="card-body">
                  <h4 className="card-title">
                    {this.state.name} {this.state.lastname}
                  </h4>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Ciudad: {this.state.city}</li>
                  <li className="list-group-item">
                    Recinto de votaci&oacute;n: {this.state.location}
                  </li>
                  <li className="list-group-item">CI: {this.state.ci}</li>
                  {this.state.facial ? (
                    <li className="list-group-item">
                      Prueba facial realizada:{" "}
                      <img src={checkIcon} alt="check-facial" height="25px" />
                    </li>
                  ) : (
                    <li className="list-group-item">
                      Prueba facial realizada:{" "}
                      <img src={errorIcon} alt="error-facial" height="25px" />
                    </li>
                  )}
                  {this.state.fingerprint ? (
                    <li className="list-group-item">
                      Prueba dactilar realizada :{" "}
                      <img
                        src={checkIcon}
                        alt="check-fingerprint"
                        height="25px"
                      />
                    </li>
                  ) : (
                    <li className="list-group-item">
                      Prueba dactilar realizada :{" "}
                      <img
                        src={errorIcon}
                        alt="error-fingerprint"
                        height="25px"
                      />
                    </li>
                  )}

                  {this.readytoVote() === true &&
                    (this.state.emitedvote ? (
                      <li className="list-group-item">
                        Votaci&oacute;n :{" "}
                        <img
                          src={checkIcon}
                          alt="check-emitedvote"
                          height="25px"
                        />
                      </li>
                    ) : (
                      <div className="">
                        <li className="list-group-item">
                          Votaci&oacute;n :{" "}
                          <img
                            src={errorIcon}
                            alt="error-emitedvote"
                            height="25px"
                          />
                        </li>
                        <li className="list-group-item">
                          <Link to="/vote" className="btn btn-dark btn-block">
                            VOTAR
                          </Link>
                        </li>
                      </div>
                    ))}
                </ul>
                <div className="card-body">
                  {this.state.facial === false && (
                    <Link to="/facialtest" className="btn btn-dark mr-2">
                      Comprobaci&oacute;n facial
                    </Link>
                  )}
                  {this.state.fingerprint === false && (
                    <Link to="/fingerprinttest" className="btn btn-dark ml-2">
                      Comprobaci&oacute;n dactilar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
