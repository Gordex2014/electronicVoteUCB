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

const response = require("../../../network/response");

const router = express.Router();

// La petición llega con la esperanza de que sea devuelto el array que contiene las características
// biométricas de la parsona
router.post("/enroll", (req, res) => {
  let petitionResponse = axios
    .get(`${config.fingerprintRegisterHost}/enroll`)
    .then((data) => {
      petitionResponse = data.data;
      if (petitionResponse.error) {
        response.error(
          req,
          res,
          petitionResponse.error,
          206,
          petitionResponse.error
        );
      }
      if (petitionResponse.value) {
        response.success(req, res, `${petitionResponse.value}`); //TODO: respuesta.value a la base de datos
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

router.post("/search", (req, res) => {
  const { characteristicsData } = req.body;
  const params = {
    characteristicsData: characteristicsData,
  };
  let petitionResponse = axios
    .post(`${config.fingerprintClientHost}/search`, params)
    .then((data) => {
      petitionResponse = data.data;
      if (petitionResponse.error) {
        response.error(
          req,
          res,
          petitionResponse.error,
          206,
          petitionResponse.error
        );
      }
      if (petitionResponse.value) {
        response.success(req, res, petitionResponse.value);
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

// Imprimir instrucciones para interactuar con el sensor

router.post("/printinstructions", (req, res) => {
  const instructions = req.body.instructions;
  socket.io.emit("instructions", req.body);
  res.sendStatus(200);
});

module.exports = router;
