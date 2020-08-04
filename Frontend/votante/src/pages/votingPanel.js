/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/******************************************
 * Página correspondiente al panel de voto
 *****************************************/

import React, { Component } from "react";

import { Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import axios from "axios";

import Navbar from "../components/Navbar";
import PageLoading from "../components/Loader";
import PageError from "../components/PageError";

// Imágenes de candidatos
import blueCandidateImage from "../images/blue.png";
import redCandidateImage from "../images/red.jpg";
import yellowCandidateImage from "../images/yellow.png";

// Utilidades necesarias
import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";

export default class votingPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: undefined,
      isBlueChecked: false,
      isRedChecked: false,
      isYellowChecked: false,
      tokenExpired: isTokenValid(localStorage.jwtToken),
      redirectSuccess: false,
      redirectError: false,
    };
    this.toggleBlueChange = this.toggleBlueChange.bind(this);
    this.toggleRedChange = this.toggleRedChange.bind(this);
    this.toggleYellowChange = this.toggleYellowChange.bind(this);
  }

  // Recibe la informacion del usuario
  componentDidMount() {
    this.fetchData();
  }

  // Se obtiene información del servidor
  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const data = await axios.post(
        `${config.serverUrl}/api/voters/voterpanel`,
        {
          // Se envía el ci para obtener los datos correspondientes al votante
          ci: this.checkCi(),
        }
      );
      this.setState({ loading: false, data: data.data });
      const imageUrl = `${config.serverUrl}/static/votersPhotos/${this.state.data.body.ci}.jpg`;
      this.setState({ imgUrl: imageUrl });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  // Función encargada de obtener el ci a partir del token de forma SEGURA
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

  //   Manejadores de cambio de checkbox
  toggleBlueChange = () => {
    this.setState({
      isBlueChecked: !this.state.isBlueChecked,
    });
  };
  toggleRedChange = () => {
    this.setState({
      isRedChecked: !this.state.isRedChecked,
    });
  };
  toggleYellowChange = () => {
    this.setState({
      isYellowChecked: !this.state.isYellowChecked,
    });
  };

  handleVoteEmition = async () => {
    this.setState({ loading: true, error: null });
    let voteCounter = 0
    let voteProposal = null
    if (this.state.isBlueChecked === true){
      voteCounter += 1
      voteProposal = "azul"
    }
    if (this.state.isRedChecked === true){
      voteCounter += 1
      voteProposal = "rojo"
    }
    if (this.state.isYellowChecked === true){
      voteCounter += 1
      voteProposal = "amarillo"
    }
    // Si las intenciones de voto son mayores a 0, el voto se considera nulo, de igual
    // manera si las intenciones de voto son iguales a 0, el voto se considera blanco
    if (voteCounter > 1){
      voteProposal = "nulo"
    }
    if (voteCounter === 0) {
      voteProposal = "blanco"
    }

    try {
      await axios.post(
        `${config.serverUrl}/api/voters/voteemition`,
        {
          ci: this.checkCi(),
          voteIntention: voteProposal
        }
      );
      this.setState({ loading: false, error: null });
      alert("Voto emitido correctamente")
      this.handleRedirectSuccess();
    } catch (error) {
      this.setState({ loading: false, error: null });
      alert("Error en el proceso de votación, contáctese con un administrador")
      this.setState({ loading: false, error: error });
      this.handleRedirectError();
    }
  }

  // Manejo de redirecciones
  handleRedirectSuccess() {
    this.setState({ redirectSuccess: true });
  }

  handleRedirectError() {
    this.id = setTimeout(() => {
      this.setState({ redirectError: true });
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    if (this.state.redirectSuccess) {
      return <Redirect to="/voterpanel"></Redirect>;
    }
    if (this.state.redirectError) {
      return <Redirect to="/voterpanel"></Redirect>;
    }
    if (this.state.loading) {
      return (
        <div>
          <Navbar></Navbar>
          <PageLoading />
        </div>
      );
    }
    if (this.state.error) {
      return (
        <div>
          <Navbar></Navbar>
          <PageError error={this.state.error} />
        </div>
      );
    }
    return (
      <div>
        <Navbar></Navbar>
        <div className="container">
          <div className="row">
            <div className="col d-flex justify-content-center mt-5 mb-4">
              <h1>PROCESO DE VOTACI&Oacute;N</h1>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center mt-4 mb-4">
              <h3>SELECCIONE EL CANDIDATO DE SU ELECCI&Oacute;N</h3>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="mt-4 mb-4">
                <img
                  src={blueCandidateImage}
                  height="300px"
                  alt="Blue candidate"
                  className="pl-4"
                  onClick={this.toggleBlueChange}
                />
              </div>
              <div className="mt-4 d-flex justify-content-center">
                <input
                  type="checkbox"
                  checked={this.state.isBlueChecked}
                  onChange={this.toggleBlueChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="mt-4 mb-4">
                <img
                  src={redCandidateImage}
                  height="300px"
                  alt="Red candidate"
                  className="pl-4"
                  onClick={this.toggleRedChange}
                />
              </div>
              <div className="mt-4 d-flex justify-content-center">
                <input
                  type="checkbox"
                  checked={this.state.isRedChecked}
                  onChange={this.toggleRedChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="mt-4 mb-4">
                <img
                  src={yellowCandidateImage}
                  height="300px"
                  alt="Yellow candidate"
                  className="pl-4"
                  onClick = {this.toggleYellowChange}
                />
              </div>
              <div className="mt-4 d-flex justify-content-center">
                <input
                  type="checkbox"
                  checked={this.state.isYellowChecked}
                  onChange={this.toggleYellowChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col mt-4 pt-4">
              <button
                  className="btn btn-success btn-block"
                  onClick={this.handleVoteEmition}
                >
                  VOTAR
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
