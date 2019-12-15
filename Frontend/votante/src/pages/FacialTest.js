import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";

import Navbar from "../components/Navbar";
import PageLoading from "../components/Loader";
import PageError from "../components/PageError";
import PhotoShoot from "../components/PhotoShoot";

import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";

export default class FacialTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: undefined,
      modalIsOpen: false,
      tokenExpired: isTokenValid(localStorage.jwtToken),
      imgUrl: "",
      imgSrc: "",
      redirectSuccess: false,
      redirectError: false
    };
    this.onCapture = this.onCapture.bind(this);
    this.handleFaceVerificationPetition = this.handleFaceVerificationPetition.bind(
      this
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const data = await axios.post(
        `${config.serverUrl}/api/voters/voterpanel`,
        {
          ci: this.checkCi()
        }
      );
      this.setState({ loading: false, data: data.data });
      const imageUrl = `${config.serverUrl}/static/votersPhotos/${this.state.data.body.ci}.jpg`;
      this.setState({ imgUrl: imageUrl });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

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

  onCapture(value) {
    this.setState({
      imgSrc: value
    });
  }

  handleFaceVerificationPetition = async () => {
    console.log(this.state.ci);
    this.setState({ loading: true, error: null });
    try {
      const data = await axios.post(
        `${config.serverUrl}/api/voters/faceverification`,
        {
          ci: this.checkCi(),
          testImg: this.state.imgSrc
        }
      );
      this.setState({ loading: false, data: data.data });
      this.handleRedirectSuccess();
    } catch (error) {
      this.setState({ loading: false, error: error });
      this.handleRedirectError();
    }
  };

  handleRedirectSuccess() {
    this.setState({ redirectSuccess: true });
  }

  handleRedirectError() {
    this.id = setTimeout(() => {
      this.setState({ redirectError: true });
    }, 2000);
  }

  componentWillUnmount() {
      clearTimeout(this.id)
  }
  render() {
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
              <h1>COMPROBACI&Oacute;N FACIAL</h1>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex justify-content-center mt-4 mb-4">
              <h3>
                {this.state.data.body.name} {this.state.data.body.lastname}
              </h3>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-5 ml-4 mr-4 mt-4 mb-4">
              <h5 className="text-center">
                Fotograf&iacute;a del padr&oacute;n
              </h5>
              <img
                src={this.state.imgUrl}
                alt="Foto original Votante"
                width="445px"
              />
            </div>
            <div className="col-5 ml-4 mr-4 mt-4 mb-4">
              <h5 className="text-center">Fotograf&iacute;a a comprobar</h5>
              <PhotoShoot onCapture={this.onCapture}></PhotoShoot>
            </div>
          </div>
        </div>
        {/* Si existe por lo menos una foto tomada, se habilita la opción de enviar las fotos para la comprobación */}
        {this.state.imgSrc !== "" && (
          <div className="container">
            <div className="row">
              <div className="col d-flex justify-content-center mt-4">
                <h4>Enviar fotos para la comprobaci&oacute;n</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-8 offset-2 mt-4 mb-4">
                <button
                  className="btn btn-success btn-block"
                  onClick={this.handleFaceVerificationPetition}
                >
                  Enviar fotos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
