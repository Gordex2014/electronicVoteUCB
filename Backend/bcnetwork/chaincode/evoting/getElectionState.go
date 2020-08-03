/****************************************************************
 * Código de smart contract correspondiente al proyecto de grado
 * Álvaro Miguel Salinas Dockar
 * Universidad Católica Boliviana "San Pablo"
 * Ingeniería Mecatrónica
 * La Paz - Bolivia, 2020
 ***************************************************************/
package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric-chaincode-go/shim"

	peer "github.com/hyperledger/fabric-protos-go/peer"
)

func getElectionState(stub shim.ChaincodeStubInterface) peer.Response {
	var err error
	configJSON := Config{}
	var returnparam string

	// Obtener el estado actual de la apertura de mesa
	config, err := stub.GetState("config")
	if err != nil {
		return errorResponse("Error en el proceso interno", 500)
	} else if config == nil {
		return errorResponse("Primero se debe inicializar el proceso", 400)
	}

	err = json.Unmarshal(config, &configJSON)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}

	// Parámetro a pasar
	if configJSON.ElectionOpen == false {
		returnparam = "false"
	} else {
		returnparam = "true"
	}

	// Retornar el estado actual
	return shim.Success([]byte(returnparam))

}
