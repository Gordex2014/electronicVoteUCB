Scripts
=======

Todos los scripts deben ser ejecutados en las carpetas dentro de bcnetwork

Inicializar el entorno
=========================
- Inicializar el orderer
  cd orderer
  ./clean.sh all
  ./init.sh
  ./launch.sh

- Inicializar los peers

  cd peer
  ./clean.sh
  . set-env.sh ucb
  ./create-voting-channel.sh
  ./launch-peer.sh ucb
  ./join-voting-channel.sh ucb
  ./launch-peer.sh audit
  ./join-voting-channel.sh audit

- Inicializar el chaincode

  ./chaincode-package.sh
  ./chaincode-install-appr.sh ucb
  ./chaincode-install-appr.sh audit
  ./chaincode-commit.sh

Configurar entorno
===================
Configurar variables de entorno de las respectivas organizaciones
. ./set-env.sh  nombre-organizacion <identidad predeterminado=admin>
Ejemplo, configurar el entorno para User1 en ucb
. ./set-env.sh   ucb   User1

Kill ALL Peers without cleaning
===============================
killall peer

Inspeccionar organizacion activa
================================
echo $ORG_NAME
echo $FABRIC_CFG_PATH

Test de chaincode
==================
Start the environment per the instructions above

1. Ejecutar querys e invokes para testear

   .  ./set-env.sh ucb

   * Invoke para registrar votantes a la elección
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["addNewVoters","7a3ed0760e383246dbc1331439d9a8544937bbd6b430bd623940a26b884cc74b,c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56"]}' -o localhost:7050 --waitForEvent --peerAddresses=localhost:7051

   * Invoke para abrir la elección
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["openElection"]}' -o localhost:7050 --waitForEvent --peerAddresses=localhost:7051

   * Invoke para cerrar la elección
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["closeElection"]}' -o localhost:7050 --waitForEvent --peerAddresses=localhost:7051

   * Invoke para emitir voto
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["voteEmition","c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56","azul"]}' -o localhost:7050 --waitForEvent --peerAddresses=localhost:7051
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["voteEmition","7a3ed0760e383246dbc1331439d9a8544937bbd6b430bd623940a26b884cc74b","rojo"]}' -o localhost:7050 --waitForEvent --peerAddresses=localhost:7051

   * Query para el estado del votante 'c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56'
    peer chaincode query -C votingchannel -n evoting  -c '{"Args":["voterStatusInspection","c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56"]}'

   * Query para el estado del candidato 'azul' 
    peer chaincode query -C votingchannel -n evoting  -c '{"Args":["candidateInspection","azul"]}'

   * Query para el conteo de votos
    peer chaincode query -C votingchannel -n evoting  -c '{"Args":["voteCounting"]}'