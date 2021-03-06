/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

/*********************
 * Sección de votantes
 * Rutas
 ********************/

const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const response = require("../../../network/response");
const config = require("../../../config");
const voterController = require("../controllers/voterController");
const faceVerification = require("../controllers/faceLogic/faceVerification");
const registerController = require("../../registerSection/controllers/registerController");
const voter = require("../models/voter");

const router = express.Router();

// Comprueba la existencia del CI para poder obtener el panel de votante
router.post("/ci", votationPeriodChecker, (req, res) => {
  const { ci } = req.body;
  voterController
    .authenticateVoter(ci)
    .then((voter) => {
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
          expiresIn: "10m",
        });
        response.success(req, res, sendToken, 200);
      }
    })
    .catch((e) => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Obtiene el panel de votante una vez se ha logeado con el CI
router.post(
  "/voterpanel",
  verifyToken,
  validateToken,
  votationPeriodChecker,
  (req, res) => {
    const { ci } = req.body;
    voterController
      .getVoterPanel(ci)
      .then((info) => {
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
      .catch((e) => {
        response.error(req, res, "Error inesperado", 500, e);
      });
  }
);

// Obtener la respuesta de verificación de coincidencia de rostros
router.post(
  "/faceverification",
  verifyToken,
  validateToken,
  votationPeriodChecker,
  (req, res) => {
    const { ci, testImg } = req.body;
    faceVerification
      .verification(ci, testImg)
      .then((info) => {
        if (info.message) {
          response.error(req, res, info.message, info.status, info.message);
        } else if (info === true) {
          response.success(req, res, "Se ha comprobado correctamente", 200);
        }
      })
      .catch((e) => {
        response.error(req, res, "Error inesperado", 500, e);
      });
  }
);

// Obtener la respuesta de verificación ded verificación de conincidencia de huellas dactilares

router.post(
  "/fingerverification",
  verifyToken,
  validateToken,
  votationPeriodChecker,
  async (req, res) => {
    let errorStatus = {};
    const { ci } = req.body;
    const characteristicsData = await voterController.getFingerprint(ci);
    if (characteristicsData.message) {
      errorStatus.message = characteristicsData.message;
      errorStatus.status = characteristicsData.status;
    }
    // Se comprueba que no exista error de la anterior petición
    if (!errorStatus.message) {
      const responseData = await axios.post(
        `${config.host}:${config.port}/api/fingerprint/search`,
        {
          characteristicsData: characteristicsData,
        }
      );
      // Se actualiza el estado de error
      if (responseData.data.error) {
        errorStatus.message = responseData.data.error;
        errorStatus.status = 206;
      } else {
        // Como se hizo la comprobación solo hace literalmente milisegundos, no se espera estado de error
        await voterController.updateFingerprintInfo(ci);
      }
    }
    // Nuevamente se comprueba de que no exista error
    if (!errorStatus.message) {
      response.success(req, res, "Se ha comprobado correctamente", 200);
    } else {
      response.error(
        req,
        res,
        errorStatus.message,
        errorStatus.status,
        errorStatus.message
      );
    }
  }
);

// Emisión de voto
router.post("/voteemition", verifyToken, validateToken, votationPeriodChecker, async (req, res) => {
  let bcConfirmation = undefined
  const { ci, voteIntention } = req.body;
  const voterData = await voterController.getVoterPanel(ci);
  if (
    voterData.facial == true &&
    voterData.fingerprint == true &&
    voterData.emitedvote == false
  ) {
    const simpleHash = await registerController.merkleTreesStructuring(
      voterData
    );
    bcConfirmation = await registerController.voteEmition(
      simpleHash,
      voteIntention,
      ci
    );
  }
  if (bcConfirmation === undefined) {
    response.error(
      req,
      res,
      "Primero se debe confirmar su identidad",
      401,
      "Primero se debe confirmar su identidad"
    );
  } else if (bcConfirmation.status == 200) {
    response.success(req, res, bcConfirmation.message, 200);
  } else {
    response.error(req, res, bcConfirmation.status, 500, bcConfirmation.status);
  }
});

// Obtener informacion de candidatos
router.get("/candidatesdata", async (req, res) => {
  const candidatesData = await registerController.retrieveCandidatesData();
  if (candidatesData.status == 400) {
    response.error(req, res, [candidatesData.message], 400, [
      candidatesData.message,
    ]);
  } else {
    response.success(req, res, candidatesData.message, 200);
  }
});

// Función que obtiene las características de todas las huellas almacenadas en la base de datos, para verificar que no
// existan duplicadas

router.get("/fingercharacteristics", async (req, res) => {
  const characteristics = await voterController.getFingerCharacteristics();
  res.send(characteristics);
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

// Verificar si la temporada de voto sigue abierta, true para abierta
async function votationPeriodChecker(req, res, next) {
  try {
    const evaluationVar = await registerController.votationPeriodChecker();
    if (evaluationVar == true) {
      next();
    } else if (evaluationVar == null) {
      response.error(
        req,
        res,
        "No se ha inicializado la votación",
        403,
        "No se ha inicializado la votación"
      );
    } else {
      response.error(
        req,
        res,
        "El periodo de votación ya terminó",
        403,
        "El periodo de votación ya terminó"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
