#############################################
# Script para la creación del canal principal
# de votos y la firma de las configuraciones
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

CONFIG_FOLDER=$PWD/../orderer
CRYPTO_FOLDER=$CONFIG_FOLDER/crypto-config

function signChannelTxFile {
    FABRIC_CFG_PATH=$PWD/$ORG_NAME
    CORE_PEER_MSPCONFIGPATH=$CRYPTO_FOLDER/peerOrganizations/$ORG_NAME.com/users/Admin@$ORG_NAME.com/msp
    CORE_PEER_FILESYSTEMPATH=$PWD/../ledgers/peer/voting/$ORG_NAME/ledger
    peer channel signconfigtx -f $CONFIG_FOLDER/voting-channel.tx
}

# Firma la transacción de Voting-Channel como ucb
ORG_NAME=ucb
export FABRIC_CFG_PATH=$PWD/$ORG_NAME
signChannelTxFile
echo "Transacción firmada por Ucb"

# Firma la transacción de Voting-Channel como audit
ORG_NAME=audit
export FABRIC_CFG_PATH=$PWD/$ORG_NAME
signChannelTxFile
echo "Transacción firmada por Audit pro"

peer channel create -o 192.168.0.120:7050 -c votingchannel -f $CONFIG_FOLDER/voting-channel.tx