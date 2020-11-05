#############################################
# Script para unir el peer al canal
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

echo "El script no funcionará si el peer para $ORG_NAME no está activo."
GENESIS_BLOCK=./votingchannel.block

CRYPTO_FOLDER=$PWD/../orderer/crypto-config
if [ -z $1 ]
then
    echo 'Por favor provea el nombre de la organización    Uso: ./join-channel.sh  nombre-organización'
    exit 1
else 
    ORG_NAME=$1
fi

cd $ORG_NAME


FABRIC_CFG_PATH=$PWD
CORE_PEER_FILESYSTEMPATH=$PWD/../ledgers/peer/voting/$ORG_NAME/ledger
CORE_PEER_MSPCONFIGPATH=$CRYPTO_FOLDER/peerOrganizations/$ORG_NAME.com/users/Admin@$ORG_NAME.com/msp

if [ -f "$GENESIS_BLOCK" ]
then
	echo "Archivo del bloque génesis encontrado."
else
	echo "Obteniendo el archivo del bloque génesis."
    peer channel fetch 0  $GENESIS_BLOCK -o 192.168.0.120:7050 -c votingchannel
fi


# Uniéndose al canal
peer channel join -o 192.168.0.120:7050 -b $GENESIS_BLOCK
