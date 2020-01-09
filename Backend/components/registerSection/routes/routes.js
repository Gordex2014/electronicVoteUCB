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
const registerController = require("../controllers/registerController");
const config = require("../../../config");

const router = express.Router();

// Se registra al empadronador
router.post("/registerprofile", (req, res) => {
  let newProfile = {};
  Object.assign(newProfile, req.body);

  registerController
    .addProfile(newProfile)
    .then(info => {
      if (!info.message) {
        response.success(
          req,
          res,
          "Empadronador registrado correctamente",
          201
        );
      } else {
        response.success(req, res, info.message, info.status);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

router.post("/dashboard", verifyToken, validateToken, (req, res) => {
  const decodedProfile = jwt.verify(req.token, config.secretKey);
  let profileToSend = {};
  Object.assign(profileToSend, decodedProfile);
  profileToSend.profile.password = "";
  response.success(req, res, profileToSend, 200);
});

router.post("/", (req, res) => {
  res.json({
    message: "holaxd"
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const profileLogin = { username, password };
  registerController
    .authenticateProfile(profileLogin)
    .then(profile => {
      if (profile === null) {
        response.error(
          req,
          res,
          "Usuario o contraseña incorrectas",
          401,
          "Usuario no autorizado"
        );
      } else if (profile.message) {
        response.error(
          req,
          res,
          profile.message,
          profile.status,
          profile.message
        );
      } else {
        const sendToken = jwt.sign({ profile }, config.secretKey, {
          expiresIn: "10m"
        });
        response.success(req, res, sendToken, 200);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

/************************************************************************************
 * Acá empieza la administración del votante, sea registro, cambio de nombre, y demás
 ***********************************************************************************/

router.post("/registervoter", verifyToken, validateToken, (req, res) => {
  const { name, lastname, ci, city, location, dataUri } = req.body; //TODO: add photo and fingerprint
  const newVoter = { name, lastname, ci, city, location, dataUri };
  registerController
    .addVoter(newVoter)
    .then(info => {
      if (!info.message) {
        response.success(req, res, "Votante registrado correctamente", 201);
      } else {
        response.success(req, res, info.message, info.status);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Modificar votante de la base de datos
router.patch("/registervoter", verifyToken, validateToken, (req, res) => {
  const { name, lastname, ci, city, location, oldCi } = req.body; //TODO: add fingerprint
  const modifiedVoter = { name, lastname, ci, city, location, oldCi };
  registerController
    .modifyVoter(modifiedVoter)
    .then(info => {
      if (!info.message) {
        response.success(req, res, "Votante modificado correctamente", 204);
      } else {
        response.success(req, res, info.message, info.status);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Borrar votante de la base de datos
router.put("/registervoter", verifyToken, validateToken, (req, res) => {
  const { oldCi } = req.body; //TODO: add fingerprint
  const oldVoter = { oldCi };
  registerController
    .deleteVoter(oldVoter)
    .then(info => {
      if (!info.message) {
        response.success(req, res, "Votante eliminado correctamente", 204);
      } else {
        response.success(req, res, info.message, info.status);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Se encuentra al votante en la base de datos
router.post("/voterpanel", verifyToken, validateToken, (req, res) => {
  const { ci } = req.body;
  registerController
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
      } else if (!info.ci) {
        response.error(req, res, info.message, info.status, info.message);
      } else {
        response.success(req, res, info, 200);
      }
    })
    .catch(e => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});
/**
 * FALTA IMPLEMENTAR
 */
// Se agrega el espacio en memoria de la huella dactilar del votante
router.put("/voterfingerprint", verifyToken, validateToken, (req, res) => {
  const { ci, fingerprintMemoryLocation } = req.body;
  registerController
    .saveFingerprint(ci, fingerprintMemoryLocation)
    .then(info => {
      if (info === null) {
        response.error(
          req,
          res,
          "Votante no encontrado",
          400,
          "No se ha encontrado al votante por ci"
        );
      } else if (!info.ci) {
        response.error(req, res, info.message, info.status, info.message);
      } else {
        response.success(req, res, info, 200);
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
  jwt.verify(req.token, config.secretKey, (err, profileData) => {
    if (err || profileData.profile === undefined) {
      response.error(req, res, "No está autorizado", 403, err);
    } else {
      next();
    }
  });
}

module.exports = router;
