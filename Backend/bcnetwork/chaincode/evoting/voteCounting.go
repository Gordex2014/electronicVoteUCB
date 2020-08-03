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

func voteCounting(stub shim.ChaincodeStubInterface) peer.Response {
	var err error

	// Obtener el estado actual de la apertura de mesa

	configJSON := Config{}

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

	// La elección está cerrada?
	if configJSON.ElectionOpen == true {
		return errorResponse("Primero se debe cerrar la elección", 400)
	}

	/*****************************
	*Obtener votos de candidatos
	******************************/

	finalResult := Count{}

	// Objetos iniciales
	auxiliarVariableForCounting := Candidate{}

	// Datos de azul. Nótese el hardcode
	azulBytes, err := stub.GetState("azul")
	if err != nil {
		return errorResponse(err.Error(), 500)
	}
	err = json.Unmarshal(azulBytes, &auxiliarVariableForCounting)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}
	finalResult.Azul = auxiliarVariableForCounting.VoteCounter

	// Datos de rojo. Nótese el hardcode
	rojoBytes, err := stub.GetState("rojo")
	if err != nil {
		return errorResponse(err.Error(), 500)
	}
	err = json.Unmarshal(rojoBytes, &auxiliarVariableForCounting)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}
	finalResult.Rojo = auxiliarVariableForCounting.VoteCounter

	// Datos de amarillo. Nótese el hardcode
	amarilloBytes, err := stub.GetState("amarillo")
	if err != nil {
		return errorResponse(err.Error(), 500)
	}
	err = json.Unmarshal(amarilloBytes, &auxiliarVariableForCounting)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}
	finalResult.Amarillo = auxiliarVariableForCounting.VoteCounter

	// Datos de blanco. Nótese el hardcode
	blancoBytes, err := stub.GetState("blanco")
	if err != nil {
		return errorResponse(err.Error(), 500)
	}
	err = json.Unmarshal(blancoBytes, &auxiliarVariableForCounting)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}
	finalResult.Blanco = auxiliarVariableForCounting.VoteCounter

	// Datos de nulo. Nótese el hardcode
	nuloBytes, err := stub.GetState("nulo")
	if err != nil {
		return errorResponse(err.Error(), 500)
	}
	err = json.Unmarshal(nuloBytes, &auxiliarVariableForCounting)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}
	finalResult.Nulo = auxiliarVariableForCounting.VoteCounter

	// Entregar el resultado final del conteo

	finalResultJSON, err := json.Marshal(finalResult)
	if err != nil {
		errorResponse("Error en el proceso de datos", 500)
	}

	return successResponse(string(finalResultJSON))

}
