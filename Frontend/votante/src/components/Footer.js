import React, { Component } from "react";

import './styles/footer.css'

export default class Footer extends Component {
  render() {
    return (
      <div className="mt-2 mb-2">
        <footer className="page-footer font-small">
          <div className="footer-copyright text-center py-3">
            © 2020 Derechos reservados:{" "}
            <a href="http://www.ucb.edu.bo/Nacional/Forms/Index.aspx">
              Universidad Cat&oacute;lica Bolivia "San Pablo"
            </a>
          </div>
        </footer>
      </div>
    );
  }
}
