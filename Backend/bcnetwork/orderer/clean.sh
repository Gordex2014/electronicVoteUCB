#############################################
# Script para limpieza de archivos generados
# por el orderer
# Álvaro Miguel Salinas Dockar
# Universidad Católica Boliviana "San Pablo"
# La Paz - Bolivia, 2020
#############################################

rm -rf ledger 2> /dev/null
rm -rf $PWD/ledgers/orderer/voting/ledger 2> /dev/null
rm ./trace/*  2> /dev/null
rm ./temp/* 2> /dev/null


if [ -z $1 ];
then
    echo 'Se ha eliminado solamente la información del ledger.'
    echo 'Para eliminar todos los artifactor ejecute:  ./clean.sh  all'
    exit 0;
fi

if [ $1 = 'all' ] 
then
    rm *.block 2> /dev/null
    rm *.tx 2> /dev/null
    rm -rf crypto-config 2> /dev/null
    rm -rf ./temp

    echo 'Eliminados todos los artifactos.'
else
    echo 'Se ha eliminado solamente la información del ledger.'
    echo 'Para eliminar todos los artifactor ejecute:  ./clean.sh  all'
fi
