import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./Layout";
import VoterCard from "../pages/VoterCard";
import Login from "../pages/Login";
import Home from "../pages/Home";
import NotFound from '../pages/NotFound'

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/voterpanel" component={VoterCard}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route path="/" component={NotFound}></Route>
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}
