/************************************************************
 * Código de aplicación correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 * App de empadronador
 ***********************************************************/

/*****************************************
 * Página para encontrar al votante por CI
 *****************************************/

import React, { Component } from 'react'

import Navbar from '../components/Navbar'
import InputCi from '../components/InputCi'

export default class ModifyVoter extends Component {
    render() {
        return (
            <div>
                <Navbar></Navbar>
                <InputCi></InputCi>
            </div>
        )
    }
}
