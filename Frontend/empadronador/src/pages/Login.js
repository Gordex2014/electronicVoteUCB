import React, { Component } from "react";
import axios from 'axios'
import { Redirect } from 'react-router-dom'

import Navbar from "../components/Navbar";
import setAuthorizationToken from "../utils/setAuthorizationToken";

import config from '../utils/config'
import ucbLogo from "../images/ucb_logo.png";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      redirect: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    axios
      .post(`${config.serverUrl}/api/register/login`, {
        username: this.state.username,
        password: this.state.password
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
            pathname: "/dashboard",
            state: { loggedIn: true }
          }}
        />
      );
    }
    return (
      <div>
        <Navbar></Navbar>
        <div className="container">
          <div className="row">
            <div className="col mt-4 pt-4" align="center">
              <h3 className="mb-4">SISTEMA DE EMPADRONAMIENTO</h3>
              <h2>IINTRODUZCA SU NOMBRE DE USUARIO Y CONTRASEÑA</h2>
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
                    <label>NOMBRE DE USUARIO</label>
                    <input
                      type="text"
                      placeholder="Nombre de usuario"
                      className="form-control"
                      value={this.state.username}
                      onChange={this.handleChange}
                    />
                    <label className="mt-2">CONTRASEÑA</label>
                    <input
                      type="password"
                      placeholder="Contraseña"
                      className="form-control"
                      value={this.state.password}
                      onChange={this.handleChangePassword}
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
