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
	"strings"

	"github.com/hyperledger/fabric-chaincode-go/shim"

	peer "github.com/hyperledger/fabric-protos-go/peer"
)

func addNewVoters(stub shim.ChaincodeStubInterface, args []string) peer.Response {

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

	// La fueron los votantes registrados?
	if configJSON.VotersRegistered == true {
		return errorResponse("La Los votantes ya se han registrado", 400)
	}

	/*****************************
	*Ingreso de datos de votantes
	******************************/

	// Se revisa si el número de argumentos es válido
	if len(args) != 1 {
		return shim.Error("Número de parámetros incorrectos")
	}
	votersHashes := args[0]

	// Crear un array con cada uno de los identificadores de los votantes
	hashesArray := strings.Split(votersHashes, ",")

	for _, simpleVoterHash := range hashesArray {
		var err error
		// Se espera que el key de los votantes sea de longitud 64 en forma de string, si no cumple, se salta el loop
		if len(simpleVoterHash) != 64 {
			continue
		}
		// Estructuracion de los datos de los votantes
		voterData := &Voter{"votante", simpleVoterHash, false}
		voterDataJSON, err := json.Marshal(voterData)
		if err != nil {
			return errorResponse("No se pudieron estructurar los datos", 500)
		}
		// Se crea el estado en el blockchain, donde el key debe ser el mismo a la información registrada
		err = stub.PutState(simpleVoterHash, voterDataJSON)
		if err != nil {
			return errorResponse("No se pudo ingresar la información", 500)
		}
	}

	configJSON.VotersRegistered = true

	// Ingresar los datos de configuración

	configByte, err := json.Marshal(configJSON)
	if err != nil {
		return errorResponse("Error en el proceso interno", 500)
	}
	err = stub.PutState("config", configByte)
	if err != nil {
		return errorResponse("Error en el interno de actualizar configuraciones, revise la configuracion", 500)
	}

	return successResponse("Informacion de votantes ingresada correctamente")
}
