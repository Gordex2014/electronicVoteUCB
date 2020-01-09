import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/Navbar";
import isTokenValid from "../utils/isTokenValid";

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      tokenExpired: isTokenValid(localStorage.jwtToken)
    };
  }

  componentDidMount() {
    axios
      .post("http://localhost:3000/api/register/dashboard")
      .then(response => {
        if (response.data.body) {
          this.setState(response.data.body.profile);
        }
      });
  }

  render() {
    if (this.state.tokenExpired === false) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <Navbar></Navbar>
        <div className="container mt-4">
          <div className="row">
            <div className="col text-center">
              <h1>Panel de empadronador</h1>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-6">
            <div className="container">
              <div className="col">
                <div className="card mt-4">
                  <div className="card-body">
                    <h4 className="card-title">
                      Nombre: {this.state.name} {this.state.lastname}
                    </h4>
                  </div>
                  <ul className="list-group">
                    <li className="list-group-item">
                      Organizaci&oacute;n: {this.state.organization}
                    </li>
                    <li className="list-group-item">
                      Nombre de usuario: {this.state.username}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="container">
              <div className="col-6 offset-3">
                <Link to="/register" className="btn btn-secondary btn-block mt-5 mb-5">
                  Empadronar votante
                </Link>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <Link to="/registerfingerbyci" className="btn btn-secondary btn-block mt-5 mb-5">
                  Registrar huella dactilar
                </Link>
              </div>
            </div>
            <div className="container">
              <div className="col-6 offset-3">
                <Link to="/findvoter" className="btn btn-secondary btn-block mt-5 mb-5">
                  Depurar votante
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
