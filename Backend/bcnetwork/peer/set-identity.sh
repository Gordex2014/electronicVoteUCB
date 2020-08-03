#############################################
# Script para contextualizar usuario e
# identidad
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

function usage {
    echo 'Configuración de identidad - ejecutar en la carpeta de la organización'
    echo '../set-identity.sh  nombre-organización [User? | admin | peer <nombre-peer>]'
}

echo "Identidad actual: $CORE_PEER_MSPCONFIGPATH"

if [ -z $1 ];
then
    usage
    echo "Por favor provee el nombre de la organización."
    exit 1
else
    ORG_NAME=$1
    echo "Cambiando la identidad para la organización = $ORG_NAME"
fi

if [ -z $2 ];
then
    usage
    echo  'Configurando la identidad por defecto'
    IDENTITY='admin'
else
    IDENTITY=$2
fi

# Creando ruta al folde de crypto-config
CRYPTO_FOLDER=`pwd`/../orderer/crypto-config

PEER_NAME='devpeer'

case $IDENTITY in 
    "peer")
        CORE_PEER_MSPCONFIGPATH=$CRYPTO_FOLDER/peerOrganizations/$ORG_NAME.com/peers/$PEER_NAME/msp
        ;;
    "admin")
        CORE_PEER_MSPCONFIGPATH=$CRYPTO_FOLDER/peerOrganizations/$ORG_NAME.com/users/Admin@$ORG_NAME.com/msp
        ;;
    *)
        CORE_PEER_MSPCONFIGPATH=$CRYPTO_FOLDER/peerOrganizations/$ORG_NAME.com/users/$IDENTITY@$ORG_NAME.com/msp
        ;;
esac

export CORE_PEER_MSPCONFIGPATH

echo "Cambiando identidad: $IDENTITY"
echo $CORE_PEER_MSPCONFIGPATH