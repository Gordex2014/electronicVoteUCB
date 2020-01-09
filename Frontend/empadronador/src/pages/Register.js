import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

import config from '../utils/config'
import Navbar from "../components/Navbar";
import isTokenValid from "../utils/isTokenValid";
import ImagePreview from "../utils/ImagePreview";

export default class Register extends Component {
  constructor() {
    super();
    this.state = {
      tokenExpired: isTokenValid(localStorage.jwtToken),
      name: "",
      lastname: "",
      ci: "",
      city: "",
      location: "",
      redirect: false,
      dataUri: "",
      isFullscreen: false,
      fingerprintScannerInfo: ""
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangeCi = this.handleChangeCi.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTakePhotoAnimationDone = this.handleTakePhotoAnimationDone.bind(
      this
    );
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeLastname(event) {
    this.setState({ lastname: event.target.value });
  }
  handleChangeCi(event) {
    this.setState({ ci: event.target.value });
  }
  handleChangeCity(event) {
    this.setState({ city: event.target.value });
  }
  handleChangeLocation(event) {
    this.setState({ location: event.target.value });
  }

  handleSubmit(event) {
    axios
      .post(`${config.serverUrl}/api/register/registervoter`, {
        name: this.state.name,
        lastname: this.state.lastname,
        ci: this.state.ci,
        city: this.state.city,
        location: this.state.location,
        dataUri: this.state.dataUri
      })
      .then(res => {
        const info = res.data.body;
        alert(info);
        this.setState({ redirect: true });
      })
      .catch(e => {
        alert("Error de sintaxis");
      });
    event.preventDefault();
  }

  handleTakePhotoAnimationDone(dataUri) {
    this.setState({ dataUri });
  }

  sendForm() {}

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    if (this.state.redirect === true) {
      return <Redirect to="dashboard" />;
    }
    return (
      <div>
        <Navbar></Navbar>
        <div className="row mt-4">
          <div className="col-6 offset-3">
            <form onSubmit={this.handleSubmit}>
              <div className="form-row">
                <div className="form-group col-6">
                  <label>Nombres</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombres"
                    value={this.state.name}
                    onChange={this.handleChangeName}
                  />
                </div>
                <div className="form-group col-6">
                  <label>Apellidos</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Apellidos"
                    value={this.state.lastname}
                    onChange={this.handleChangeLastname}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-4">
                  <label>Carn&eacute; de identidad</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="CI"
                    value={this.state.ci}
                    onChange={this.handleChangeCi}
                  />
                </div>
                <div className="form-group col-4">
                  <label>Ciudad</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ciudad"
                    value={this.state.city}
                    onChange={this.handleChangeCity}
                  />
                </div>
                <div className="form-group col-4">
                  <label>Recinto de votaci&oacute;n</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Recinto"
                    value={this.state.location}
                    onChange={this.handleChangeLocation}
                  />
                </div>
                <div className="form-group col mt-4">
                  <h2 className="text-center mb-4">
                    Fotograf&iacute;a del votante
                  </h2>
                  {this.state.dataUri ? (
                    <ImagePreview
                      dataUri={this.state.dataUri}
                      isFullscreen={this.state.isFullscreen}
                    />
                  ) : (
                    <Camera
                      onTakePhotoAnimationDone={
                        this.handleTakePhotoAnimationDone
                      }
                      isFullscreen={this.state.isFullscreen}
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary btn-block mt-5"
                >
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
