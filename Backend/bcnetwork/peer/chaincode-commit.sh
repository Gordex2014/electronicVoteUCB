#############################################
# Script para hacer commit del chaincode
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

echo "================= Obteniendo estado de aprobación ================="

peer lifecycle chaincode checkcommitreadiness -n evoting -v 1.0 -C votingchannel --sequence 1 --init-required

echo "================= Haciendo commit al chaincode ================="

peer lifecycle chaincode commit -n evoting -v 1.0 -C votingchannel --sequence 1 --init-required

echo "================= Obteniendo estado de commit ================="

peer lifecycle chaincode querycommitted -n evoting  -C votingchannel

echo "=================== Inicializando el chaincode ==================="

peer chaincode invoke --isInit  -n evoting -C votingchannel -c '{"Args":["init"]}' -o localhost:7050 --waitForEvent --peerAddresses=localhost:7051 #TODO: Arreglar puerto