/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/*******************************
 * Componente principal de rutas
 *******************************/

import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./Layout";
import VoterCard from "../pages/VoterCard";
import Login from "../pages/Login";
import Home from "../pages/Home";
import FacialTest from "../pages/FacialTest";
import NotFound from "../pages/NotFound";
import FingerprintTest from "../pages/FingerprintTest";

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        {/* Se incluye el layout en el router, ya que toda la app lo utiliza */}
        <Layout>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/voterpanel" component={VoterCard}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/facialtest" component={FacialTest}></Route>
            <Route
              exact
              path="/fingerprinttest"
              component={FingerprintTest}
            ></Route>
            <Route component={NotFound}></Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}
