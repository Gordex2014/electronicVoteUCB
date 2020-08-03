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

// voteEmition controla la emisión de votos, donde el votante tiene sólamente un único voto
func voteEmition(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	var err error

	//    	 			  		0         														1
	// 					"ID de votante o Hash", 							"Sigla del candidato a ser votado"
	// "5fd924625f6ab16a19cc9807c7c506ae1813490e4ba675f843d5a10e0baacdb8",			 		 "rojo"

	if len(args) != 2 {
		return errorResponse("Numero de argumentos incorrectos, se esperaban 3", 400)
	}

	// ==== Comprobar parametros no vacios ====

	if len(args[0]) <= 0 {
		return errorResponse("El 1er argumento no debe ser un argumento vacio, debe ser el ID del votante", 400)
	}
	if len(args[1]) <= 0 {
		return errorResponse("El 2do argumento no debe ser un argumento vacio, debe ser la sigla del candidato", 400)
	}

	voterInput := args[0]
	candidateInput := args[1]

	// Declarar variables vacias a ser almacenadas

	candidateJSON := Candidate{}
	voterJSON := Voter{}
	configJSON := Config{}

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

	// La elección ya está abierta?
	if configJSON.ElectionOpen == false {
		return errorResponse("La elección no se encuentra abierta", 400)
	}

	// Transfiriendo la informacion de estado para el votante a la variable votanteJSON

	// El votante esta registrado en la mesa?

	voterData, err := stub.GetState(voterInput)
	if err != nil {
		return errorResponse("Error en el proceso interno", 500)
	} else if voterData == nil {
		return errorResponse("El votante no esta registrado en esta base de datos", 400)
	}

	err = json.Unmarshal(voterData, &voterJSON)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}

	// Transfiriendo la informacion de estado para el candidato a la variable candidatoJSON

	// Existe el partido?

	candidateData, err := stub.GetState(candidateInput)
	if err != nil {
		return errorResponse("Error en el proceso interno", 500)
	} else if candidateData == nil {
		return errorResponse("El candidato no esta registrado en esta base de datos", 400)
	}

	err = json.Unmarshal(candidateData, &candidateJSON)
	if err != nil {
		return errorResponse("Error en el proceso de datos", 500)
	}

	// El votante ya ha emitido su voto?

	if voterJSON.HasVoted == true {
		return errorResponse("El votante ya ha emitido su voto", 403)
	}

	// Si todo estuvo bien, se debe actualizar el estado del votante a true para que no pueda votar nuevamente

	voterJSON.HasVoted = true

	// Se debe actualizar el conteo de votos de cada partido

	candidateJSON.VoteCounter = candidateJSON.VoteCounter + 1

	/************************************
	*Actualizar los estados en el ledger
	************************************/

	// Ingresar los datos del votante

	voterByte, err := json.Marshal(voterJSON)
	if err != nil {
		return errorResponse("Error en el proceso interno", 500)
	}
	err = stub.PutState(voterInput, voterByte)
	if err != nil {
		return errorResponse("Error en el interno al anexar datos, revise la configuracion", 500)
	}

	// Ingresar los datos del candidato

	candidateByte, err := json.Marshal(candidateJSON)
	if err != nil {
		return errorResponse("Error en el proceso interno", 500)
	}
	err = stub.PutState(candidateInput, candidateByte)
	if err != nil {
		return errorResponse("Error en el interno al anexar datos, revise la configuracion", 500)
	}

	return successResponse("Voto registrado correctamente")

}
