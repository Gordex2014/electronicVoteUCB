import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./Layout";
import Home from '../pages/Home';
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'

import '../pages/styles/global.css'

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/dashboard" component={Dashboard}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route path="/" component={Home}></Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}
