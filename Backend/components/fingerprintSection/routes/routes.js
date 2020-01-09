/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const express = require("express");
const config = require("../../../config");
const axios = require("axios");

// Emisión de instrucciones por sockets
const socket = require("../../../socket").socket;
const voterController = require('../../voterSection/controllers/voterController')

const response = require("../../../network/response");

const router = express.Router();

router.post("/enroll", (req, res) => {
  let respuesta = axios
    .get(`${config.fingerprintHost}/enroll`)
    .then(data => {
      respuesta = data.data;
      if (respuesta.error) {
        response.error(req, res, respuesta.error, 206, respuesta.error);
      }
      if (respuesta.value) {
        response.success(req, res, `${respuesta.value - 1}`); //TODO: respuesta.value a la base de datos
      }
    })
    .catch(e => {
      console.log(e);
    });
});

router.post("/delete", (req, res) => {
  const { positionToDelete } = req.body;
  const params = {
    positionToDelete: positionToDelete
  };
  respuesta = axios
    .post(`${config.fingerprintHost}/delete`, params)
    .then(data => {
      respuesta = data.data;
      if (respuesta.error) {
        response.error(req, res, respuesta.error, 403, respuesta.error);
      }
      if (respuesta.value) {
        response.success(req, res, respuesta.value);
      }
    })
    .catch(e => {
      console.log(e);
    });
});

router.post("/search", (req, res) => {
  const { positionToSearch, ci } = req.body;
  const params = {
    positionToSearch: positionToSearch
  };
  let respuesta = axios
    .post(`${config.fingerprintHost}/search`, params)
    .then(data => {
      respuesta = data.data;
      if (respuesta.error) {
        response.error(req, res, respuesta.error, 206, respuesta.error);
      }
      if (respuesta.value) {
        voterController.updateFingerprintInfo(ci)
        response.success(req, res, respuesta.value);
      }
    })
    .catch(e => {
      console.log(e);
    });
});

// Imprimir instrucciones para interactuar con el sensor

router.post("/printinstructions", (req, res) => {
  const instructions = req.body.instructions;
  console.log(instructions);
  socket.io.emit("instructions", req.body);
  res.sendStatus(200);
});

module.exports = router;
