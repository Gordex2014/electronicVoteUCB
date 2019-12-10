/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

// Dependencias
const express = require('express')
const chalk = require('chalk')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

// Delegaciones
const config = require('./config')
const router = require('./network/routes')

// Inicializaciones
const app = express()
require('./database')

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Enrutador
router(app)

// Inicialización del servidor
app.listen(config.port, function () {
    console.log(`${chalk.blue('Servidor en puerto: ')} ${config.port}`)
})


