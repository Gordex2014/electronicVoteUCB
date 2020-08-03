#############################################
# Script para empaquetar el chaincode
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

CC_LABEL=evoting.1.0-1.0
CC_PACKAGE_FILE=$PWD/../chaincode/packages/$CC_LABEL.tar.gz

peer lifecycle chaincode package  $CC_PACKAGE_FILE -p evoting --label $CC_LABEL

echo "Package creado."