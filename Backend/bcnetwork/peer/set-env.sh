#############################################
# Script para contextualizar usuario y hacer
# ejecuciones en distintos peers
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################


# Set del logging level
export FABRIC_LOGGING_SPEC=INFO

source ./unsetcore.sh

function usage {
    echo 'Configuración del contexto'
    echo 'Uso:  ./set-env.sh  nombre-organización <identidad>'
}

if [ -z $1 ];
then
    usage
    echo "Por favor provee el nombre de la organización."
    exit 1
else
    ORG_NAME=$1
    echo "Cambiando la identidad para la organización = $ORG_NAME"
fi

export FABRIC_CFG_PATH=`pwd`/$ORG_NAME

# Configurar identidad
. ./set-identity.sh $ORG_NAME $2