FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:a952eef359464486576dae8661a59c2adc33e807aad111d3c391433208b4fb68

WORKDIR /app

# package.json med "type": "module" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import/export.
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
