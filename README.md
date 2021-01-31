# Sistema de voto electrónico

## Backend:

- Uso de Express.js para exponer un API, de esta manera la GUI se puede implementar utilizando cualquier framework de SPA (Angular, Vue, React).
- Control de acceso con JWT para establecer sesiones más seguras.
- Uso de MongoDB para la base de datos correspondiente al padrón.
- Uso de Azure Cognitive Services para la comprobación facial de los votantes.
- Uso de sensor biométrico para una segunda autenticación de los votantes.
- Uso de Hyperledger Fabric para una base de datos basado en Blockchain para el almacenamiento de los votos, previamente hechos arreglos cripográficos y no compartir la identidad del votante.

## Frontent

- Uso de ReactJS para la aplicación de usuario.

## Topología básica de la red

Para poner en marcha el prototipo se deben configurar los ordenadores, sean físicos o virtualizados siguiendo la siguiente topología de red.

<img src="https://i.imgur.com/2Jvcprb.png" title="Topología de red" width=700px/>

> Nota: Se pueden tener dos distintos anfitriones para el sensor de huellas dactilares, tanto para el administrador y el cliente con distintas direcciones IP, sea utilizando un Raspberry Pi o cualquier dispositivo basado en SO Unix.

## Instalación de dependencias

### Anfitrión UCB

En el ordenador que cumple el rol de servidor central, se deben instalar las siguientes dependencias para las funciones de administración de votantes:

- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Node JS](https://nodejs.org/es/) v.12
- [Go](https://golang.org/)

Luego se deben instalar las dependencias de Hyperledger Fabric
- [Dependencias Hyperledger](https://hyperledger-fabric.readthedocs.io/en/release-2.2/prereqs.html)

Estas incluyen git, curL, Docker y Docker Compose, es necesario asegurarse de que estas estén incluídas tal como detalla la documentación de Hyperledger Fabric.

Luego se cambia de directorio al lugar donde se desean alojar los binarios e infraestructura necesaria para Hyperledger fabric, si se trabaja en sistemas Unix:

```console
cd /path/where/you/wanna/save/dependencies/and/binaries
```
Y se descarga Hyperledger Fabric en el ordenador.
```console
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.2.1 1.4.9
```
Después se agregan al los binarios al PATH, para que estos puedan ser ejecutados desde cualquier lugar en consola. Para esto se agregan las siguientes líneas con el editor de preferencia(vim, nano, vi, etc) al archivo ~./profile(Puede variar, esto dependerá de los niveles de accesibilidad que se le desea dar a los usuarios en el sistema, de igual manera variará si se usa un SO que no sea una distribución de linux basada en Debian)

Ej:

```console
nano ~./profile
```
Se agregan las siguientes líneas al final:

```console
# extra path
EXPORT PATH=$PATH:/usr/local/go/bin
EXPORT PATH=$PATH:/path/where/you/wanna/save/dependencies/and/binaries/hyperledger/fabric-samples/bin
```

Posteriormente se debe reiniciar el ordenador y comprobar que los binarios se pueden ejecutar desde cualquier lugar y al ejecutar peer, se debería mostrar lo siguiente:

```console
your-host@host:~$ peer
Usage:
  peer [command]

Available Commands:
  chaincode   Operate a chaincode: install|instantiate|invoke|package|query|signpackage|upgrade|list.
  channel     Operate a channel: create|fetch|join|list|update|signconfigtx|getinfo.
  help        Help about any command
  lifecycle   Perform _lifecycle operations
  node        Operate a peer node: start|reset|rollback|pause|resume|rebuild-dbs|upgrade-dbs.
  version     Print fabric peer version.

Flags:
  -h, --help   help for peer

Use "peer [command] --help" for more information about a command.
your-host@host:~$
```
Finalmente se deben instalar las dependencias que requiere el lenguaje Go, para que el sistema funcione se deben instalar las siguientes:

- [fabric-chaincode-go](https://github.com/hyperledger/fabric-chaincode-go)
```console
go get https://github.com/hyperledger/fabric-chaincode-go
```
- [fabric-protos-go](https://github.com/hyperledger/fabric-protos-go)
```console
go get https://github.com/hyperledger/fabric-protos-go
```
- [grpc](https://github.com/grpc/grpc-go)
```console
go get -u google.golang.org/grpc
```
- [protobuf](https://github.com/protocolbuffers/protobuf-go)
```console
go get -u google.golang.org/protobuf
```

>Nota: Los comandos para obtener los paquetes en go pueden cambiar con el tiempo.

### Anfitrión AUDIT PRO

Los pasos son los mismos que para UCB, exceptuando con la instalación de MongoDB

### Anfitrión Raspberry Pi

Si bien no es estríctamente necesario utilizar un un Raspberry Pi para utilizar el sensor de huellas dactilares, se debe utilizar un PC con SO basado en Unix. Con esto, se deben instalar las siguientes librerías:

- [Pyfingerprint](https://github.com/bastianraschke/pyfingerprint)
- [Flask](https://flask.palletsprojects.com/en/1.1.x/)

Si se utiliza un segundo anfitrión para tener dos sensores de huellas dactilares funcionando, se debe modificar en el código fuente del archivo config.js o agregar una variable de entorno dentro de la carpeta Backend.

```javascript
fingerprintRegisterHost:
    process.env.FINGERPRINT_REGISTER_HOST || "http://192.168.0.105:8081",
```
Agregando un nuevo sensor en un host con dirección IP 192.168.0.106:
```javascript
fingerprintClientHost:
    process.env.FINGERPRINT_CLIENT_HOST || "http://192.168.0.106:8081",
```
O bien se puede agregar una variable de entorno en un archivo .env a crear:

```console
FINGERPRINT_REGISTER_HOST=http://192.168.0.105:8081
FINGERPRINT_CLIENT_HOST=http://192.168.0.106:8081
```
## Distribución del código(Opcional)

El código se debe distribuir de la siguiente manera:

```seq
Backend->Host UCB
Frontend/Empadronador->Host UCB
Frontend/Auditor->Host UCB
Frontend/Votante->Host AUDIT PRO
Backend/bcnetwork->Host AUDIT PRO
FingerprintServer->Host Raspberry Pi
```

>Nota: Si solamente se tiene la intención de probar el sistema, se puede tener el código fuente en todos los hosts

## Instalación de paquetes necesarios

Para la instalación de los paquetes necesarios, tanto en el afitrión UCB como en el anfitrión AUDIT PRO se deben instalar las dependencias de Node, dentro de las raíces de las carpetas Backend, Frontend/auditor, Frontend/empadronador. Frontend/votante con el siguiente comando:

```console
npm install
```

Además se debe instalar pm2 para el monitoreo de procesos de forma global, esto en cualquier ruta:

```console
npm install -g pm2
```

## Acondicionamiento

Una vez se ha instalado todo lo necesario para el proyecto, se debe proveer de algunas variables al sistema. Por esto, dentro de la carpeta Backend, se crea un archivo .env que contenga lo siguiente:

```console
AZURE_ENDPOINT=https://your.azure.cognitive.services.route.com/
AZURE_SUBSCRIPTION_KEY=a8f5f167f44f4964e6c998dee827110c
```
>Nota: Las keys de Azure son solo valores referenciales para ejemplo de formato. Además puede agregarse cualquier configuración que se desee cambiar de la configuración predeterminada en config.js

Posteriormente, en la carpeta Frontent/empadronador en UCB se debe crear un archivo .env que contenga lo siguiente:

```console
PORT=3002
REACT_APP_MASTER_SERVER_URL=http://192.168.0.120:3000
```
Después, en la carpeta Frontent/votante en AUDIT PRO se debe crear un archivo .env que contenga lo siguiente:

```console
PORT=3001
REACT_APP_MASTER_SERVER_URL=http://192.168.0.120:3000
```

Luego, en la carpeta Frontent/auditor en UCB se debe crear un archivo .env que contenga lo siguiente:

```console
PORT=3003
REACT_APP_MASTER_SERVER_URL=http://192.168.0.120:3000
```

Además, es necesario copiar el contenido de la carpeta Backend/bcnetwork/chaincode/evoting al $GOPATH/src, que usualmente se encuentra en /home/$USER/go/src en el anfitrión UCB.

## Puesta en marcha

Para la puesta en marcha primero se deben seguir las instrucciones detalladas en el archivo instrucciones.md que se ubica en la ruta Backend/bcnetwork/peer, donde se listan los scripts de utilidad que se deben ejecutar de forma secuencial para levantar los nodos de la red blockchain.

Una vez se ha levantado la red, se debe iniciar el sistema, primero el servidor. En el host UCB, dentro de la carpeta Backend, se ejecuta el siguiente comando:

```console
npm run dev
```

>Nota: Si se desea obtener métricas se puede ejecutar npm run deploy. (Véase el archivo package.json y la documentación de pm2)

Si es la primera vez que se utiliza el programa, se debe registrar a un usuario administrador, para esto se debe hacer una petición POST, desde el host UCB a la ruta: http://localhost:3000/api/register/registerprofile con algún software para interactuar con APIs, como POSTMAN o INSOMNIA. Se deben proveer los siguientes datos en forma de JSON: 
```console
{
    "organization": "foo",
    "name": "Juan Perez",
    "lastname": "John Doe",
    "username": "juanperezjohndoe",
    "password": "foofoofoo"
}
```
>Nota: Datos solo de ejemplo. El usuario y contraseña servirán para ingresar como empadronadores.

Luego, se debe inicializar el servidor de servicios de huellas dactilares, o los servidores, en caso de que existan. para esto se ingresa al Raspberry Pi por SSH o como se desee, una vez dentro de este se utiliza screen, con esto se puede hacer salir sin cortar con el proceso.

```console
cd repository-route/FingerprintServer
screen
flask run
```
Para salir de la terminal que corre el servicio de huellas dactilares se presiona Ctrl+a+d y posteriormente se cierra la sesión por SSH.

Después se debe iniciar la aplicación de empadronador, para esto en el host UCB:

```console
cd Frontend/empadronador
npm run start
```

Con esto ya se puede interactuar con la aplicación de empadronador, para esto es necesario ingresar con el combo de usuario y contraseña que se ha registrado anteriormente:

<img src="https://i.imgur.com/GB5pstB.png" title="login_app_empadronador" width=700px/>

Una vez dentro del panel de administrador, primero se deben inicializar los parámetros de votación con el botón azul.

<img src="https://i.imgur.com/Z3LLf0l.png" title="panel_administrador" width=700px/>

Para empadronar al votante se le debe de tomar una fotografía y se le debe de registrar con los datos personales, como se ve en la siguiente imagen.

<img src="https://i.imgur.com/kjQk00B.png" title="empadronamiento_fase_uno" width=700px/>

En la segunda parte del registro del votante, este debe registrar su huella dactilar, para esto se debe asegurar que el Raspberry Pi tiene al servidor de huellas dactilares corriendo o en su defecto al servidor de empadronamiento para huellas dactilares.

<img src="https://i.imgur.com/XsBoXBx.png" title="empadronamiento_fase_dos" width=700px/>

Cuando ya se han registrado a todos los votantes, se deben cerrar el periodo de empadronamiento y luego iniciar el periodo de votación desde el panel de administrador. Luego, debe iniciar la aplicación de votantes en el host AUDIT PRO, para esto se debe estar posicionado, en consola, en la ruta Frontend/votante y ejecutar el siguiente comando:

```console
cd Frontend/votante
npm run start
```

Con esto se abre la aplicación de votantes y ya se puede emitir el voto comprobando la identidad con los factores biométricos.

<img src="https://i.imgur.com/Td5i5tH.png" title="app_voto_main" width=700px/>

Ya dentro el votante debe tomarse una foto y comprobar su identidad, además de usar el sensor de huellas dactilares para verificar su identidad como segunda autenticación biométrica.

<img src="https://i.imgur.com/eXrkvSF.png" title="voter_panel" width=700px/>

Para la autenticación facial, el votante debe tomar una foto en la aplicación, esta es comparada con la fotografía del padrón electoral y se utiliza el SaaS de Microsoft, Azure Cognitive Services para hacer esta comparación.

<img src="https://i.imgur.com/Lc3C2eM.png" title="facial_test" width=700px/>

Junto con esta comprobación, se debe hacer una comprobación dactilar para demostrar la identidad, para esto el votante debe interactuar con el sensor de huellas dactilares.

<img src="https://i.imgur.com/XHZIoIR.png" title="fingerprint_test" width=700px/>

Finalmente al votante se le habilita la opción de emitir su voto, este debe elegir para esta prueba entre los colores primarios favoritos.

<img src="https://i.imgur.com/s9aehrr.png" title="vote_emition" width=700px/>

Ahora, el votante sale de su panel.

Una vez todos los votantes han emitido sus votos o se cumplen las condiciones para el cierre de elecciones, el administrador cierra el periodo de votación desde el panel de administrador. Y por último en el host UCB se inicia la aplicación de publicación de resultados, esto porque los credenciales están alojados junto con el servidor central, en aplicaciones para producción, cada organización deberá preparar su propia infraestructura.

```console
cd Frontend/auditor
npm run start
```

La aplicación tiene el único fin de mostrar resultados.

<img src="https://i.imgur.com/urMkv21.png" title="results" width=700px/>

Este procedimiento se mostró con el fin de poder conocer el flujo normal.

Para poder repetir el proceso se deben seguir los pasos en instrucciones.md dentro de Backend/bcnetwork/peer.

# Arquitectura del sistema

## Esquema general del proyecto

<img src ="https://i.imgur.com/Koa0cav.png" title="general_scheme" width="700px">

## Servidor central

<img src ="https://i.imgur.com/PbcgL97.png" title="monolithic_server" width="700px">

## Servicio de identificación dactilar

<img src ="https://i.imgur.com/VM39bs7.png" title="fingerprint_service" width="700px">

## Servicio de identificación facial

<img src ="https://i.imgur.com/eke3CoS.png" title="facial_service" width="400px">

## Servicio de emisión de votos

<img src ="https://i.imgur.com/d3zvIpT.png" title="vote_emition_service" width="700px">

## Estructuración de datos

<img src ="https://i.imgur.com/Q7W05do.png" title="hash_tree_data_structure" width="400px">

## Arquitectura de la red Hyperledger Fabric

<img src ="https://i.imgur.com/GsceedJ.png" title="hyperledger_architecture" width="700px">

## Funcionamiento del proyecto

[![SISTEMA DE VOTO ELECTRÓNICO](https://img.youtube.com/vi/cHNeHumQQCQ/0.jpg)](https://www.youtube.com/watch?v=cHNeHumQQCQ)