import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";

import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";
import persona from "../images/incognito.png";

export default class ModifyVoter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenExpired: isTokenValid(localStorage.jwtToken),
      imgUrl: ""
    };
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangeCi = this.handleChangeCi.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeLocation = this.handleChangeLocation.bind(this);
  }

  componentDidMount() {
    axios
      .post(`${config.serverUrl}/api/register/voterpanel`, {
        ci: this.props.location.state.ci
      })
      .then(response => {
        if (response.data.body) {
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

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
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
                  <div class="form-group container">
                    <label className="mt-2 ml-2">Ciudad: </label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Ciudad"
                      value={this.state.city}
                      onChange={this.handleChangeCity}
                    />
                  </div>
                  <div class="form-group container">
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
                      <div className="col-8 offset-2">
                        <div className="btn btn-light">Modificar</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="col-10 offset-1">
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
