#############################################
# Script para mostrar configuración actual
# del peer
# Álvaro Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

echo "================ Configuración actual del peer ================"

env | grep CORE_PEER
echo "FABRIC_CFG_PATH=$FABRIC_CFG_PATH"
echo "FABRIC_LOGGING_SPEC=$FABRIC_LOGGING_SPEC"
echo "CONFIG_DIRECTORY=$CONFIG_DIRECTORY"