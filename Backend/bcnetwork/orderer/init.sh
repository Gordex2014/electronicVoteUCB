#############################################
# Script para la inicialización del orderer
# y generación del bloque génesis
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

BASE_CONFIG_DIR=$PWD/../config

export FABRIC_LOGGING_SPEC=INFO
export FABRIC_CFG_PATH=$PWD

#1. Eliminar archivos anteriores
echo   '======= Eliminando artifactos del sistema ====='
rm *.tx &> /dev/null
rm *.block &> /dev/null
rmdir -rf ./temp  &> /dev/null
rm -rf $PWD/ledgers/orderer/voting/ledger  &> /dev/null

#2. Generar material criptográfico
echo    '================ Generando la carpeta crypto-config ================'
rm -rf ./crypto-config 2> /dev/null
cryptogen generate --config=$BASE_CONFIG_DIR/crypto-config.yaml

configtxgen -profile VotingOrdererGenesis -outputBlock ./voting-genesis.block -channelID ordererchannel

#3. Crear la transacción para el votingchannel
echo    '================ Escribiendo el votingchannel ================'
configtxgen -profile VotingChannel -outputCreateChannelTx ./voting-channel.tx -channelID votingchannel

echo    '======= Todo listo. Inicie el orderer ejecutando ./launch.sh ======'