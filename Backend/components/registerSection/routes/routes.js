/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

/****************************
 * Sección de empadronadores
 * Rutas
 ***************************/

const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");

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
    .then((info) => {
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
    .catch((e) => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

router.post("/dashboard", verifyToken, validateToken, (req, res) => {
  const decodedProfile = jwt.verify(req.token, config.secretKey);
  let profileToSend = {};
  Object.assign(profileToSend, decodedProfile);
  // No se envía el password al frontend
  profileToSend.profile.password = "";
  response.success(req, res, profileToSend, 200);
});

router.post("/", (req, res) => {
  res.json({
    message: "holaxd",
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const profileLogin = { username, password };
  registerController
    .authenticateProfile(profileLogin)
    .then((profile) => {
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
          expiresIn: "10m",
        });
        response.success(req, res, sendToken, 200);
      }
    })
    .catch((e) => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

/************************************************************************************
 * Empieza la administración del votante, sea registro, cambio de nombre, y demás
 ***********************************************************************************/

router.post("/registervoter", verifyToken, validateToken, (req, res) => {
  const { name, lastname, ci, city, location, dataUri } = req.body; //TODO: add photo and fingerprint
  const newVoter = { name, lastname, ci, city, location, dataUri };
  registerController
    .addVoter(newVoter)
    .then((info) => {
      if (!info.message) {
        response.success(req, res, "Votante registrado correctamente", 201);
      } else {
        response.success(req, res, info.message, info.status);
      }
    })
    .catch((e) => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Modificar votante de la base de datos
router.patch("/registervoter", verifyToken, validateToken, (req, res) => {
  const { name, lastname, ci, city, location, oldCi } = req.body; //TODO: add fingerprint
  const modifiedVoter = { name, lastname, ci, city, location, oldCi };
  registerController
    .modifyVoter(modifiedVoter)
    .then((info) => {
      if (!info.message) {
        response.success(req, res, "Votante modificado correctamente", 200);
      } else {
        response.success(req, res, info.message, info.status);
      }
    })
    .catch((e) => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Borrar votante de la base de datos
router.put("/registervoter", verifyToken, validateToken, (req, res) => {
  const { oldCi } = req.body; //TODO: add fingerprint
  const oldVoter = { oldCi };
  registerController
    .deleteVoter(oldVoter)
    .then((info) => {
      if (!info.message) {
        response.success(req, res, "Votante eliminado correctamente", 204);
      } else {
        response.success(req, res, info.message, info.status);
      }
    })
    .catch((e) => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Se encuentra al votante en la base de datos
router.post("/voterpanel", verifyToken, validateToken, (req, res) => {
  const { ci } = req.body;
  registerController
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
      } else if (!info.ci) {
        response.error(req, res, info.message, info.status, info.message);
      } else {
        response.success(req, res, info, 200);
      }
    })
    .catch((e) => {
      response.error(req, res, "Error inesperado", 500, e);
    });
});

// Se agrega las características de la huella dactilar del votante a la base de datos
router.put(
  "/voterfingerprint",
  verifyToken,
  validateToken,
  async (req, res) => {
    const { ci } = req.body;
    let characteristicsArray = undefined;
    // Respuesta obtenida de la petición que se hace al API que se expone para interactuar con el sensor
    let fingerResponse = await axios.post(
      `${config.host}:${config.port}/api/fingerprint/enroll`
    );
    if (fingerResponse.data.body) {
      // Se convierte el string que llega a un array para guardarse en la Base de datos
      characteristicsArray = JSON.parse("[" + fingerResponse.data.body + "]");
    }
    registerController
      .saveFingerprint(ci, characteristicsArray)
      .then((info) => {
        if (info === "No characteristics") {
          response.error(
            req,
            res,
            fingerResponse.data.error,
            206,
            fingerResponse.data.error
          );
        } else if (info === null) {
          response.error(
            req,
            res,
            "Error de sintaxis",
            400,
            "Error de sintaxis"
          );
        } else if (!info.ci) {
          response.error(req, res, info.message, info.status, info.message);
        } else {
          response.success(req, res, "Huella registrada con éxito", 200);
        }
      })
      .catch((e) => {
        response.error(req, res, "Error inesperado", 500, e);
      });
  }
);

// Enviar los datos de los votantes al procesador de árboles de Merkle para luego ser
// enviados a la base de datos descentralizada
router.post("/retrieveallmerkletreesdata", async (req, res) => {
  // Una vez se ha finalizado el periodo de registro, el administrador deberá llamar una función
  // para terminar enviando un hash por votante, esto para proteger su información en la base de
  // datos distribuída
  let info;
  try {
    // Info contiene el array con los identificadores de los votantes
    info = await registerController.processAllDataMerkleTrees();
    // Se comprueba que el array de hashes no sea cero
    if (info.length == 0) {
      response.error(
        req,
        res,
        "Error al procesar la información de los votantes",
        503,
        "Error al procesar la información de los votantes"
      );
    } else {
      response.success(req, res, info, 200);
    }
  } catch (error) {
    console.log(error);
  }
});

// Inicializa los parámetros del proceso electoral
router.post("/init", verifyToken, validateToken, async (req, res) => {
  serverResponse = await registerController.configInit();
  if (serverResponse.status === 200) {
    response.success(req, res, serverResponse.message, serverResponse.status);
  } else {
    response.error(
      req,
      res,
      serverResponse.message,
      serverResponse.status,
      serverResponse.message
    );
  }
});

// Cierra el periodo de empadronamiento
router.put("/closeregistration", verifyToken, validateToken, registrationPeriodChecker, async (req, res) => {
  serverResponse = await registerController.closeRegistration();
  if (serverResponse.status === 200) {
    response.success(req, res, serverResponse.message, serverResponse.status);
  } else {
    response.error(
      req,
      res,
      serverResponse.message,
      serverResponse.status,
      serverResponse.message
    );
  }
});

// Abre el periodo de votación
router.put("/openvotingperiod", verifyToken, validateToken, async (req, res) => {
  serverResponse = await registerController.openElections();
  if (serverResponse.status === 200) {
    response.success(req, res, serverResponse.message, serverResponse.status);
  } else {
    response.error(
      req,
      res,
      serverResponse.message,
      serverResponse.status,
      serverResponse.message
    );
  }
});

// Cierra el periodo de votación
router.put("/closevotingperiod", verifyToken, validateToken, votationPeriodChecker, async (req, res) => {
  serverResponse = await registerController.closeElections();
  if (serverResponse.status === 200) {
    response.success(req, res, serverResponse.message, serverResponse.status);
  } else {
    response.error(
      req,
      res,
      serverResponse.message,
      serverResponse.status,
      serverResponse.message
    );
  }
});

/*************************
 * Funciones intermedias
 *************************/

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

// Verificar si la temporada de registro sigue abierta
async function registrationPeriodChecker(req, res, next) {
  try {
    const evaluationVar = await registerController.registrationPeriodChecker();
    if (evaluationVar == true) {
      console.log(evaluationVar)
      next();
    } else {
      response.error(
        req,
        res,
        "El periodo de empadronamiento ya terminó",
        403,
        "El periodo de empadronamiento ya terminó"
      );
    }
  } catch (error) {
    console.log(error);
  }
}

// Verificar si la temporada de registro sigue abierta
async function votationPeriodChecker(req, res, next) {
  try {
    const evaluationVar = await registerController.votationPeriodChecker();
    if (evaluationVar == true) {
      next();
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
