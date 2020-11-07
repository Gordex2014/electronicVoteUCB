/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***********************************************************/

/******************************************
 * Aplicación de publicación de resultados
 *****************************************/

import React from 'react';
import ReactDOM from 'react-dom';

import "./components/styles/bootstrap.min.css";

import App from './components/App';

const container = document.getElementById('app');

ReactDOM.render(<App />, container);
