#############################################
# Script para inicializar el peer
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

CRYPTO_CONFIG_DIRECTORY=`pwd`/../orderer/crypto-config
if [ -z $1 ]
then
    echo 'Por favor provee el nombre de la organización    Uso: ./launch-peer.sh  nombre-organización'
    exit 1
else 
    ORG_NAME=$1
fi

# source ./unsetcore.sh

echo "Inicializando peer para: $ORG_NAME "

cd $ORG_NAME

export FABRIC_CFG_PATH=`pwd`
echo $FABRIC_CFG_PATH
export CORE_PEER_MSPCONFIGPATH=$CRYPTO_CONFIG_DIRECTORY/peerOrganizations/$ORG_NAME.com/peers/devpeer/msp
export CORE_PEER_FILESYSTEMPATH=$PWD/../ledgers/peer/voting/$ORG_NAME/ledger

peer node start 2> peer.log &