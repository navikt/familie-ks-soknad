FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:efb8eca0267617f0e982afc07de4b81f6a96951f622994b4e504f60c51ae95c9

WORKDIR /app

# package.json med "type": "module" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import/export.
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
