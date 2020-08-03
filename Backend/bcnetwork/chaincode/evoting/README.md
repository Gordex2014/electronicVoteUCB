Launch the environment
======================
Launch Dev Environment:     dev-init.sh -e

Try out v1/token (Fabric version 2.x)
=====================================

# 1 Instalar el chaincode

. set-env.sh acme

- Setup the chaincode environment
set-chain-env.sh   -n  evoting   -p token/evoting    -c '{"Args":["init"]}'  

Option-1
--------
chain.sh package

chain.sh install

chain.sh approveformyorg

(Optional)  chain.sh checkcommitreadiness

chain.sh commit

(Optional)  chain.sh querycommitted

Option-2
--------

chain.sh install -p

chain.sh instantiate

bash cc-logs.sh -f

# 2. Verificar si las salidas son correctas

Query
=====
bash cc-logs.sh -f

* Query para el estado del votante 'c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56'
set-chain-env.sh         -q   '{"Args":["voterStatusInspection","c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56"]}'
chain.sh query
* Query para el estado del candidato 'azul' 
set-chain-env.sh         -q   '{"Args":["candidateInspection","azul"]}'
chain.sh query
* Query para el conteo de votos
set-chain-env.sh         -q   '{"Args":["voteCounting"]}'
chain.sh query

Invoke
======

* Invoke para ingresar votantes a la elección
set-chain-env.sh         -i   '{"Args":["addNewVoters","7a3ed0760e383246dbc1331439d9a8544937bbd6b430bd623940a26b884cc74b,c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56"]}'
chain.sh  invoke
* Invoke para abrir la elección
set-chain-env.sh         -i   '{"Args":["openElection"]}'
chain.sh  invoke
* Invoke para cerrar la elección
set-chain-env.sh         -i   '{"Args":["closeElection"]}'
chain.sh  invoke
* Invoke para emitir voto
set-chain-env.sh         -i   '{"Args":["voteEmition","c95723977547b78302da6328f6ef90070a448dc8f2813d28dfe836bae2fa5d56","azul"]}'
chain.sh  invoke
set-chain-env.sh         -i   '{"Args":["voteEmition","7a3ed0760e383246dbc1331439d9a8544937bbd6b430bd623940a26b884cc74b","rojo"]}'
chain.sh  invoke

# 3. Check out the transactions in the explorer

http://localhost:8080/#/transactions
