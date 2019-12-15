/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const express = require("express");
const jwt = require("jsonwebtoken");

const response = require("../../../network/response");
const config = require("../../../config");
const voterController = require("../controllers/voterController");
const faceVerification = require("../controllers/faceLogic/faceVerification");

const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    message: "Puede llegar información del concepto de votación"
  });
});

// Comprueba la existencia del CI para poder obtener el panel de votante
router.post("/ci", (req, res) => {
  const { ci } = req.body;
  voterController
    .authenticateVoter(ci)
    .then(voter => {
      if (voter === null) {
        response.error(
          req,
          res,
          "No existe el CI en la base de datos",
          401,
          "Búsqueda de CI inexistente"
        );
      } else if (voter.message) {
        response.error(req, res, voter.message, voter.status, voter.message);
      } else {
        const sendToken = jwt.sign({ voter }, config.secretKey, {
          expiresIn: "10m"
        });
        response.success(req, res, sendToken, 200);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Obtiene el panel de votante una vez se ha logeado con el CI
router.post("/voterpanel", verifyToken, validateToken, (req, res) => {
  const { ci } = req.body;
  voterController
    .getVoterPanel(ci)
    .then(info => {
      if (info === null) {
        response.error(
          req,
          res,
          "Votante no encontrado",
          400,
          "No se ha encontrado al votante por ci"
        );
      }
      if (!info.ci) {
        response.error(req, res, info.message, info.status, info.message);
      } else {
        response.success(req, res, info, 200);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Obtener la respuesta de verificación de coincidencia de rostros
router.post("/faceverification", (req, res) => { //TODO: verfyToken, addImage
  const { ci, testImg } = req.body;
  faceVerification
    .verification(ci, testImg)
    .then(info => {
      if (info.message){
        response.error(req, res, info.message, info.status, info.message)
      }
      else if(info === true){
        response.success(req, res, "Se ha comprobado correctamente", 200)
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Función de verificación de token, solamente comprueba de que exista un token
// de verificación, no que sea auténtico

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    response.error(req, res, "No autorizado", 403, "Usuario no autorizado");
  }
}

function validateToken(req, res, next) {
  // Si pasa la prueba de comprobar el token, es necesario conocer su validez y
  // su compatibilidad con los datos requeridos
  jwt.verify(req.token, config.secretKey, (err, voterData) => {
    if (err || voterData.voter === undefined) {
      response.error(req, res, "No está autorizado", 403, err);
    } else {
      next();
    }
  });
}

module.exports = router;
