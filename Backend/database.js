/**********************************************************
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 *********************************************************/

const mongoose = require('mongoose')
const chalk = require('chalk')
const config = require('./config')

mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(db => console.log(`${chalk.green(`[Base de datos]`)} ahora conectada`))
.catch(err => console.error(`${chalk.red('[Base de datos]')} ${err}`))

