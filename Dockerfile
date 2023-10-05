FROM gcr.io/distroless/nodejs:18
USER root
USER apprunner

WORKDIR /var/server

COPY src/backend/dist ./dist
COPY dist ./dist

# Må kopiere package.json og node_modules for at backend skal fungere. Backend henter avhengigheter runtime fra node_modules, og package.json trengs for at 'import' statements skal fungere.
COPY src/backend/node_modules ./node_modules
COPY src/backend/package.json .

CMD ["--es-module-specifier-resolution=node", "dist/server.js"]
