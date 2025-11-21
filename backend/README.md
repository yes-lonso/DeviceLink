# Backend (NestJS)

Este proyecto es un backend construido con [NestJS](https://nestjs.com/).

## Requisitos previos

* Tener instalado [Node.js](https://nodejs.org/) (v16 o superior)


# Ejecutar en desarrollo

1. Clonar el repositorio y entra en el directorio del backend:
```zsh
git clone https://github.com/yes-lonso/DeviceLink.git
cd DeviceLink/backend
```

2. Instala las dependencias:
```zsh
npm install
```

3. Instala Nest CLI globalmente (si no está instalado):
```zsh
npm i -g @nestjs/cli
```

4. Levanta la base de datos (se requiere tener Podman instalado):
```zsh
# Inicializar la máquina virtual (Solo la primera vez)
podman machine init

# Arrancar el servicio (Necesario si reinicias el Mac)
podman machine start

podman-compose up -d
```

5. Ejecuta el siguiente comando para iniciar el servidor en modo de desarrollo:
```zsh
npm run start:dev
```


## Stack usado
* MongoDB
* Nest
