import React, { Component } from "react";

import "./styles/Loader.css";

export default class Loader extends Component {
  render() {
    return (

        <div className="row" id="loadingHeight">
          <div className="col d-flex justify-content-center">
            <div className="lds-grid mb-auto mt-auto">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
    );
  }
}
