#############################################
# Script para limpiar archivos de ejecución
# en procesos previos
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

killall peer  2> /dev/null

rm *.block   2> /dev/null
rm ./ucb/*.block   2> /dev/null
rm ./audit/*.block  2> /dev/null

rm ./ucb/*.log  2> /dev/null
rm ./audit/*.log  2> /dev/null

rm -rf $PWD/ledgers/peer/voting/ucb/*   2> /dev/null
rm -rf $PWD/ledgers/peer/voting/audit/*  2> /dev/null

rm -rf $PWD/../chaincode/packages/*  2> /dev/null

echo "Elementos de ejecuciones previas eliminados."