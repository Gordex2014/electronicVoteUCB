#############################################
# Script para instalar y aprovar el chaincode
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

WAIT_TIME=2s
CC_LABEL=evoting.1.0-1.0
CC_PACKAGE_FILE=$PWD/../chaincode/packages/$CC_LABEL.tar.gz
CC_PACKAGE_NAME_DIR=$PWD/../chaincode/packages/cc_package_name.txt

#3 Obteniendo el entorno
echo   '1. Obteniendo el entorno de ejecución'
if [ "$1" == "ucb" ]; then
    . ./set-env.sh ucb
elif [ "$1" == "audit" ]; then
    . ./set-env.sh audit
else
    echo "Debe proporcionar el nombre de la organización"
    exit 1
fi

echo "================= Instalando el chaincode ================="

peer lifecycle chaincode install  $CC_PACKAGE_FILE

sleep $WAIT_TIME

echo "================ Verificando la instalación ================"

peer lifecycle chaincode queryinstalled

echo "================ Aprobando el chaincode ================"

# Se obtiene el stout y se obtiene el package id del chaincode

peer lifecycle chaincode queryinstalled | tail -n 1 | cut -c 13-92 >> $CC_PACKAGE_NAME_DIR

read -r CC_PACKAGE_ID_NAME<$CC_PACKAGE_NAME_DIR

peer lifecycle chaincode approveformyorg -n evoting -v 1.0 -C  votingchannel --sequence 1  --init-required --package-id $CC_PACKAGE_ID_NAME

echo "================ Comprobando el estado de aprobación ================"

peer lifecycle chaincode checkcommitreadiness -n evoting -v 1.0 -C votingchannel --sequence 1 --init-required 