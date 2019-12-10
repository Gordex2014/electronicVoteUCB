import React from "react";
import ReactDOM from "react-dom";

import "./components/styles/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.css";

import setAuthorizationToken from './utils/setAuthorizationToken'
import App from './components/App'

const container = document.getElementById("app");

setAuthorizationToken(localStorage.jwtToken)

ReactDOM.render(<App/>,container);