FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:201f7e52e67178d18aaa84041b7566966dea675c6092066adccb48870ba5e2c0

WORKDIR /app

# package.json med "type": "module" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import/export.
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
