import React from "react";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

class Navbar extends React.Component {
  render() {
    return (
      <div className="navbar navbar-expand-lg navbar-light bg-light">
        <img src={logo} height="120px" alt="AUDIT Logo" className="pl-4" />
        <Link to="/" className="mr-3 ml-3">
          PÁGINA PRINCIPAL
        </Link>
        <Link to="/results" className="mr-3 ml-3">
          RESULTADOS
        </Link>
      </div>
    );
  }
}

export default Navbar;
