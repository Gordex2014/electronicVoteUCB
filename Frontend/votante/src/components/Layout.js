import React, { Component } from "react";
import Footer from "./Footer";
export default class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.children}
        <Footer></Footer>
      </React.Fragment>
    );
  }
}
