/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/**********************************************************
 * Componente encargado de mostrar la imagen de la web cam
 **********************************************************/

import React, { Component } from "react";
import Webcam from "react-webcam";

export default class PhotoShoot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: "",
      photoTooked: false
    };
    this.onRetakePhoto = this.onRetakePhoto.bind(this);
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  // Maneja la captura de la webcam
  onCapture = async () => {
    // Ejecuta el método que captura el screenshot y almacena la información en una constante
    const imgSrc = await this.webcam.getScreenshot();
    // Guarda la información en el estado y establece que se ha tomado la foto
    this.setState({
      imgSrc,
      photoTooked: true
    });
    this.props.onCapture(this.state.imgSrc);
  };

  // Vuelve a establecer la condición para tomar captura de fotografía
  onRetakePhoto() {
    this.setState({ photoTooked: false });
  }

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };

    if (this.state.photoTooked) {
      return (
        <div value={this.state.imgSrc}>
          <img
            src={this.state.imgSrc}
            alt="Imagen votante"
            width="445px"
            className="mb-2"
          />
          <div className="row">
            <div className="col-6 offset-3">
              <button
                className="btn btn-dark btn-block"
                onClick={this.onRetakePhoto}
              >
                Repetir Foto
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div value={this.state.imgSrc}>
        <Webcam
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={445}
          videoConstraints={videoConstraints}
        />
        <div className="row">
          <div className="col-6 offset-3">
            <button className="btn btn-dark btn-block" onClick={this.onCapture}>
              Capturar Foto
            </button>
          </div>
        </div>
      </div>
    );
  }
}
