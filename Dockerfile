FROM gcr.io/distroless/nodejs:18
USER root
USER apprunner

WORKDIR /var/server

COPY build ./build
COPY dist ./dist

# Må kopiere package.json og node_modules for at backend skal fungere. Backend henter avhengigheter runtime fra node_modules, og package.json trengs for at 'import' statements skal fungere.
COPY node_modules ./node_modules
COPY package.json .

CMD ["--es-module-specifier-resolution=node", "build/backend/server.js"]
