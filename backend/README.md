# Backend (NestJS)

Este proyecto es un backend construido con [NestJS](https://nestjs.com/).

## Requisitos previos

* Tener instalado [Node.js](https://nodejs.org/) (v16 o superior)
* Inicializar la máquina virtual (Solo la primera vez)
```zsh
podman machine init
```
* Arrancar el servicio (Necesario si se reinicia el Mac)
```zsh
podman machine start
```
* Desplegar el contenedor
```zsh
podman run -d \
  --name devicelinkDB \
  -p 27017:27017 \
  docker.io/mongodb/mongodb-community-server:latest
```
* Comandos útiles
Parar la BD: ```podman stop devicelinkDB```
Arrancar la BD: ```podman start devicelinkDB```
Ver logs: ```podman logs -f devicelinkDB```
Borrar contenedor: ```podman rm devicelinkDB```

# Ejecutar en desarrollo

1. Clonar el repositorio y entrar en el directorio del backend:
```zsh
git clone https://github.com/yes-lonso/DeviceLink.git
cd DeviceLink/backend
```

2. Instalar las dependencias:
```zsh
npm install
```

3. Instala Nest CLI globalmente (si no está instalado):
```zsh
npm i -g @nestjs/cli
```

4. Levanta la base de datos (se requiere tener Podman instalado):
```zsh
podman-compose up -d
```

5. Ejecutar el siguiente comando para iniciar el servidor en modo de desarrollo:
```zsh
npm run start:dev
```


## Stack usado
* MongoDB
* Nest

* ### Video del proyecto
* [Click para ver el video] (https://github.com/yes-lonso/DeviceLink/blob/sprint-0/media/Video%20avance%20Iteracion%201%20480.mov)
* 
