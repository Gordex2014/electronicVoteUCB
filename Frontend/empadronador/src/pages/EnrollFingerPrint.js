import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import Navbar from "../components/Navbar";

import isTokenValid from "../utils/isTokenValid";
import config from "../utils/config";
import finger_animation from "../images/finger_animation.gif";

export default class EnrollFingerPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      instructions: "",
      tokenExpired: isTokenValid(localStorage.jwtToken),
      redirect: false
    };
    this.handleNewEnroll = this.handleNewEnroll.bind(this);
  }

  componentDidMount() {
    // Configuración del socket para recibir información del sensor
    const socket = io(`${config.serverUrl}`);
    socket.on("instructions", data =>
      this.setState({ instructions: data.instructions })
    );
    axios
      .post(`${config.serverUrl}/api/register/voterpanel`, {
        ci: this.props.location.state.ci
      })
      .then(response => {
        if (response.data.body) {
          this.setState(response.data.body);
        }
      })
      .catch(e => {
        alert("No se encuentra el votante");
      });
  }

  handleNewEnroll(event) {
    axios
      .put(`${config.serverUrl}/api/register/voterfingerprint`, {
        ci: this.state.ci
      })
    .then(response => {
      if(response.data.body){
        console.log(response.data.body)
        alert(response.data.body)
        this.setState({ redirect: true })
      }
      if(response.data.error){
        console.log(response.data.error)
        alert(response.data.error)
        this.setState({ instructions: "" })
      }
    })
    .catch(e => {
      console.log(e)
      this.setState({ instructions: "" })
    })
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
        <div className="container text-center mt-4">
          <div className="row mt-4">
            <div className="col">
              <h1>REGISTRO DE HUELLA DACTILAR</h1>
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
                <div className="btn btn-primary btn-block mb-2" onClick={this.handleNewEnroll}>Registrar</div>
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
