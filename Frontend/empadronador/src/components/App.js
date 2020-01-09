import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./Layout";
import Home from '../pages/Home';
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Register from '../pages/Register'
import ModifyVoter from "../pages/ModifyVoter"
import FindVoter from '../pages/FindVoter'
import EnrollFingerprint from '../pages/EnrollFingerPrint'
import RegisterFingerByCi from '../pages/RegisterFingerByCi'

import '../pages/styles/global.css'


export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/dashboard" component={Dashboard}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/findvoter" component={FindVoter}></Route>
            <Route exact path="/modifyvotervalues" component={ModifyVoter}></Route>
            <Route exact path="/enrollfingerprint" component={EnrollFingerprint}></Route>
            <Route exact path="/registerfingerbyci" component={RegisterFingerByCi}></Route>
            <Route path="/" component={Home}></Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}
