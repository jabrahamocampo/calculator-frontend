# Etapa 1: build de la app con Node
FROM node:20-alpine AS build
WORKDIR /app

# Copiar dependencias y hacer instalación
COPY package*.json ./
RUN npm install

# Copiar el código fuente y construir
COPY . .
RUN npm run build

# Etapa 2: servir la app con Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Borrar archivos por defecto de Nginx
RUN rm -rf ./*

# Copiar el build de React al directorio de Nginx
COPY --from=build /app/dist .

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
