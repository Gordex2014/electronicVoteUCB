Scripts
=======

Todos los scripts deben ser ejecutados en las carpetas dentro de bcnetwork

Inicializar el entorno
=========================
- Inicializar el orderer
  cd orderer
  ./clean.sh all
  ./init.sh
  <!-- Copiar el cryptomaterial al otro host -->
  ./launch.sh

- Inicializar los peers

  NOTA: Asegúrate de tener Docker ejecutándose

  cd peer
  ./clean.sh
  <!-- UCB -->
  source set-env.sh ucb
  ./create-voting-channel.sh
  ./launch-peer.sh ucb
  ./join-voting-channel.sh ucb
  <!-- AUDIT -->
  ./launch-peer.sh audit
  ./join-voting-channel.sh audit

- Inicializar el chaincode
  <!-- Esto lo hace UCB, copiar el package al otro host  -->
  ./chaincode-package.sh
  <!-- Esto lo hacen ambos  -->
  ./chaincode-install-appr.sh ucb
  ./chaincode-install-appr.sh audit
  <!-- Esto lo hace UCB  -->
  ./chaincode-commit.sh  

- Al momento de iniciar nuevamente es necesario borrar manualmente la carpeta 'user-wallet' en la raíz de Backend y la colección config en la base de datos

- El material criptográfico de user-wallet perteneciente a AUDIT se debe proporcionar para la aplicación donde se ve el cómputo de votos.

Configurar entorno
===================
Configurar variables de entorno de las respectivas organizaciones
source ./set-env.sh  nombre-organizacion <identidad predeterminado=admin>
Ejemplo, configurar el entorno para User1 en ucb
source ./set-env.sh   ucb   User1

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

   * Invoke para registrar votantes a la elección  // Solo debug
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["addNewVoters","7a3ed0760e383246dbc1331439d9a8544937bbd6b430bd623940a26b884cc74b,c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56"]}' -o 192.168.0.120:7050 --waitForEvent --peerAddresses=192.168.0.120:7051

   * Invoke para abrir la elección
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["openElection"]}' -o 192.168.0.120:7050 --waitForEvent --peerAddresses=192.168.0.120:7051

   * Invoke para cerrar la elección
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["closeElection"]}' -o 192.168.0.120:7050 --waitForEvent --peerAddresses=192.168.0.120:7051

   * Invoke para emitir voto // Solo debug
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["voteEmition","c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56","azul"]}' -o 192.168.0.120:7050 --waitForEvent --peerAddresses=192.168.0.120:7051
    peer chaincode invoke -C votingchannel -n evoting  -c '{"Args":["voteEmition","7a3ed0760e383246dbc1331439d9a8544937bbd6b430bd623940a26b884cc74b","rojo"]}' -o 192.168.0.120:7050 --waitForEvent --peerAddresses=192.168.0.120:7051

   * Query para el estado del votante 'c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56'
   // Desactualizado: No incluye el salt
   
    peer chaincode query -C votingchannel -n evoting  -c '{"Args":["voterStatusInspection","c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56"]}'

   * Query para el estado del candidato 'azul' 
    peer chaincode query -C votingchannel -n evoting  -c '{"Args":["candidateInspection","azul"]}'

   * Query para el conteo de votos
    peer chaincode query -C votingchannel -n evoting  -c '{"Args":["voteCounting"]}'