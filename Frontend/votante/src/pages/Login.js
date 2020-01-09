import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
// import jwt from "jsonwebtoken";

import config from '../utils/config'
import ucbLogo from "../images/ucb_logo.png";
import setAuthorizationToken from "../utils/setAuthorizationToken";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
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
      .post(`${config.serverUrl}/api/voters/ci`, {
        ci: this.state.ci
      })
      .then(res => {
        alert("Ha ingresado con éxito");
        const token = res.data.body;
        localStorage.setItem("jwtToken", token);
        setAuthorizationToken(token);
        this.setState({ redirect: true });
      }).catch(e  => {
          alert('No se encuentra autorizado')
      });
    event.preventDefault();
  }

  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return (
        <Redirect
          to={{
            pathname: "/voterpanel",
            state: { loggedIn: true }
          }}
        />
      );
    }
    return (
      <div className="">
        <Navbar></Navbar>
        <div className="container">
          <div className="row">
            <div className="col mt-4 pt-4" align="center">
              <h3 className="mb-4">SISTEMA DE VOTO ELECTR&Oacute;NICO</h3>
              <h2>INGRESE SU CI</h2>
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
