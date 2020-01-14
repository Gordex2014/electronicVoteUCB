import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import jwt from "jsonwebtoken";
import io from "socket.io-client";

import Navbar from "../components/Navbar";

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

  componentDidMount() {
    const socket = io(`${config.serverUrl}`);
    socket.on("instructions", data =>
      this.setState({ instructions: data.instructions })
    );
    this.fetchData();
  }

  fetchData = async () => {
    try {
      const data = await axios.post(
        `${config.serverUrl}/api/voters/voterpanel`,
        {
          ci: this.checkCi()
        }
      );
      this.setState({ data: data.data });
    } catch (error) {
      console.log(error);
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
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
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
                <div className="btn btn-primary btn-block mb-2" onClick={this.handleFingerVerificationPetition}>Comprobar</div>
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
