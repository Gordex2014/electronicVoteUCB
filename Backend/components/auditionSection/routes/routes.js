/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

const response = require("../../../network/response");
const authController = require("../controllers/authenticateUser");

const router = express.Router();

router.post("/", (req, res) => {
  response.success(req, res, "Motivo de votacion", 200);
});

router.post("/dashboard", verifyToken, validateToken, function(req, res) {
  const decodedAuditor = jwt.verify(req.token, config.secretKey);
  let auditorToSend = {};
  Object.assign(auditorToSend, decodedAuditor);
  auditorToSend.auditor.password = "";
  response.success(req, res, auditorToSend, 200);
});

router.post("/signup", (req, res) => {
  const { username, password, organization } = req.body;
  const addAuditor = { username, password, organization };

  authController
    .addAuditor(addAuditor)
    .then(auditorRegistered => {
      if (!auditorRegistered.message) {
        response.success(req, res, "Auditor registrado correctamente", 201);
      } else {
        response.success(
          req,
          res,
          auditorRegistered.message,
          auditorRegistered.status
        );
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  authController
    .authenticateAuditor(username, password)
    .then(auditor => {
      if (auditor === null) {
        response.error(
          req,
          res,
          "Usuario o contraseña incorrectas",
          401,
          "Usuario no autorizado"
        );
      }
      if (auditor.message) {
        response.error(
          req,
          res,
          auditor.message,
          auditor.status,
          auditor.message
        );
      } else {
        const sendToken = jwt.sign({ auditor }, config.secretKey, {
          expiresIn: "1m"
        });
        response.success(req, res, sendToken, 200);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

function verifyToken(req, res, next) {
  // Se verifica que exista un token en el header
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    response.error(req, res, "No autorizado", 401, "Usuario no autorizado");
  }
}

function validateToken(req, res, next) {
  // Si pasa la prueba de comprobar el token, es necesario conocer su validez y
  // su compatibilidad con los datos requeridos
  jwt.verify(req.token, config.secretKey, (err, auditorData) => {
    if (err || auditorData.auditor === undefined) {
      response.error(req, res, "No está autorizado", 403, err);
    } else {
      next();
    }
  });
}

module.exports = router;
