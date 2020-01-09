import React, { Component } from 'react'

import Navbar from '../components/Navbar'
import InputCiFinger from '../components/InputCiFinger'

export default class RegisterFingerByCi extends Component {
    render() {
        return (
            <div>
                <Navbar></Navbar>
                <InputCiFinger></InputCiFinger>
            </div>
        )
    }
}
