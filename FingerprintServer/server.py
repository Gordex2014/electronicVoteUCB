#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
===========================================================
 * Código de servidor correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020

 * Créditos a Bastian Raschke <bastian.raschke@posteo.de>
 * por la creación la de librería para el uso del sensor de
 * huellas dactilares

===========================================================
 """

import hashlib
import config_master_server as config
import requests
import time
from flask import Flask, jsonify, request
from pyfingerprint.pyfingerprint import PyFingerprint



## Agrega una nueva huella dactilar
##

app = Flask(__name__)

@app.route('/enroll')
def enroll_user():

    ## Intenta inicializar el sensor

    try:
        f = PyFingerprint('/dev/ttyUSB0', 57600, 0xFFFFFFFF, 0x00000000)

        if ( f.verifyPassword() == False ):
            raise ValueError('La contraseña proporcionada para el sensor es erronea!')

    except Exception as e:
        print('El sensor de huellas dactilares no se pudo inicializar!')
        print('Mensaje de excepcion: ' + str(e))
        exit(1)

    ## Intenta ingresar nuevos datos al sensor
    try:
        send_instructions('Ponga el dedo en el sensor')

        ## Espera a que la imagen sea leída
        while ( f.readImage() == False ):
            pass

        ## Convierte la imagen leída a características y la almacena en el buffer 1
        f.convertImage(0x01)

        ## Se obtienen las características de la base de datos
        characteristics_data = retrieve_characteristics()
        for characteristic in characteristics_data:
            ## Si la lista llega vacía, quiere decir que la información que llegó corresponde al votante que no tiene la
            ## huella registrada, así que se omite esta prueba 
            if len(characteristic) == 0:
                pass
            else:
                ## Se sube una por una las listas con las características al buffer 2 para luego
                ## compararlas con la imagen adquirida
                f.uploadCharacteristics(0x02, characteristic)

                compare_characteristics_payload = f.compareCharacteristics()

                if compare_characteristics_payload > 20:
                    send_instructions('La huella ya se encuentra registrada en la base de datos')
                    return jsonify(
                        value='',
                        error='La huella ya se encuentra registrada en la base de datos'
                    )

        send_instructions('Quite el dedo del sensor')
        time.sleep(2)

        send_instructions('Ponga el dedo en el sensor nuevamente')

        ## Espera a que la imagen del dedo sea leída nuevamente
        while ( f.readImage() == False ):
            pass

        ## Convierte la imagen leída a características y la almacena en el buffer 2
        f.convertImage(0x02)

        ## Compara los buffers 1 y 2
        if ( f.compareCharacteristics() == 0 ):
            # Si las huellas no son iguales se retorna un error
            send_instructions('Las huellas no corresponden')
            return jsonify(
                value='',
                error='Las huellas no corresponden'
            )

        ## Se crea la plantilla comparando la informacion almacenada en los buffers 1 y 2
        f.createTemplate()

        ## Descarga las características almacenadas en el buffer 1, correspondientes a la plantilla recíen creada
        characteristics = f.downloadCharacteristics(0x01)

        send_instructions('Huella registrada correctamente!')
        return jsonify(
            value=characteristics, ## Se La lista(vector) que contiene las características de la huella
            error=''
        )
        

    except Exception as e:
        print('Operacion fallida!')
        print('Mensaje de excepción: ' + str(e))
        exit(1)


## Buscar una huella en el sensor
##

@app.route('/search', methods = ['POST'])
def search_fingerprint():

    ## Se obtiene el número identificador a ser buscado

    data = request.json
    characteristics_to_compare = data.get('characteristicsData', '')

    ## Inicialización del sensor

    try:
        f = PyFingerprint('/dev/ttyUSB0', 57600, 0xFFFFFFFF, 0x00000000)

        if ( f.verifyPassword() == False ):
            raise ValueError('La contraseña proporcionada para el sensor es erronea!')

    except Exception as e:
        print('El sensor de huellas dactilares no se pudo inicializar!')
        print('Mensaje de excepción: ' + str(e))
        exit(1)

    # Se busca la huella proporcionada

    try:
        send_instructions('Ponga su dedo en el sensor')

        ## Se espera a que el dedo sea posicionado

        while ( f.readImage() == False ):
            pass

        ## Convierte la imagen leída a características y la almacena en el buffer 1

        f.convertImage(0x01)

        ## Se sube una por una las listas con las características al buffer 2 para luego
        ## compararlas con la imagen adquirida
        f.uploadCharacteristics(0x02, characteristics_to_compare)

        compare_characteristics_payload = f.compareCharacteristics()
                
        if compare_characteristics_payload > 50:
            send_instructions('Identificado correctamente')
            return jsonify(
                value='Identificado correctamente',
                error=''
            )
        else:
            send_instructions('Las huellas no coinciden')
            return jsonify(
                value='',
                error='Las huellas no coinciden'
            )

    except Exception as e:
        print('Error al manejar la petición')
        print('Mensaje de excepción: ' + str(e))
        exit(1)


# Se envían las instrucciones para luego interactuar en el frontend

def send_instructions(message):
    requests.post(config.server_url+'/api/fingerprint/printinstructions', data = {
        'instructions': message,
    })

## Función que se encarga de pedir datos de la base de datos relacionadas a las huellas
## dactilares de todas las personas empadronadas, para se comprobadas

def retrieve_characteristics():
    data = requests.get(config.server_url+'/api/voters/fingercharacteristics')
    data_list = data.json()
    return data_list