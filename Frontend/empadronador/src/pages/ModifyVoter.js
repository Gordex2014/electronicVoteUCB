/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 * App de empadronador
 ***********************************************************/

/***************************************
 * Página para la depuración del votante
 ***************************************/

import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";

import persona from "../images/incognito.png";

import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";

export default class ModifyVoter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenExpired: isTokenValid(localStorage.jwtToken),
      imgUrl: "",
      redirect: false
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangeCi = this.handleChangeCi.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleSubmitModify = this.handleSubmitModify.bind(this);
    this.handleSubmitDelete = this.handleSubmitDelete.bind(this);
  }

  componentDidMount() {
    axios
    // Una vez se ha encontrado al votante, se obtienen los datos del votante
      .post(`${config.serverUrl}/api/register/voterpanel`, {
        ci: this.props.location.state.ci
      })
      .then(response => {
        if (response.data.body) {
          // Por si no existiera imagen del votante, se pone una imagen estandar(Etapa de pruebas)
          this.setState(response.data.body);
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

  handleSubmitModify(event) {
    // Modificar valores del votante
    axios
      .patch(`${config.serverUrl}/api/register/registervoter`, {
        name: this.state.name,
        lastname: this.state.lastname,
        ci: this.state.ci,
        city: this.state.city,
        location: this.state.location,
        oldCi: this.props.location.state.ci
      })
      .then(res => {
        const info = res.data.body;
        alert(info);
        this.setState({ redirect: true });
      })
      .catch(e => {
        // Por si es que ingresan valores incoherentes
        alert("Error de sintaxis");
      });
    event.preventDefault();
  }

  handleSubmitDelete(event) {
    // Eliminar al votante
    axios
      .put(`${config.serverUrl}/api/register/registervoter`, {
        oldCi: this.props.location.state.ci
      })
      .then(res => {
        alert("Eliminado correctamente");
        this.setState({ redirect: true });
      })
      .catch(e => {
        alert("Error de sintaxis");
      });
    event.preventDefault();
  }

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    if (this.state.redirect === true) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div>
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
                <div className="form-row">
                  <div class="form-group container">
                    <label className="mt-2 ml-2">Nombres: </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Nombre"
                      value={this.state.name}
                      onChange={this.handleChangeName}
                    />
                  </div>
                  <div class="form-group container">
                    <label className="mt-2 ml-2">Apellidos: </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Apellido"
                      value={this.state.lastname}
                      onChange={this.handleChangeLastname}
                    />
                  </div>
                  <div class="form-group container">
                    <label className="mt-2 ml-2">
                      Carn&eacute; de identidad:{" "}
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="CI"
                      value={this.state.ci}
                      onChange={this.handleChangeCi}
                    />
                  </div>
                  <div className="form-group container">
                    <label className="mt-2 ml-2">Ciudad: </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Ciudad"
                      value={this.state.city}
                      onChange={this.handleChangeCity}
                    />
                  </div>
                  <div className="form-group container">
                    <label className="mt-2 ml-2">
                      Recinto de votaci&oacute;n:{" "}
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Recinto"
                      value={this.state.location}
                      onChange={this.handleChangeLocation}
                    />
                  </div>
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <div
                        className="col-8 offset-2"
                        onClick={this.handleSubmitModify}
                      >
                        <div className="btn btn-light">Modificar</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="col-10 offset-1"
                        onClick={this.handleSubmitDelete}
                      >
                        <div className="btn btn-danger">Eliminar votante</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
