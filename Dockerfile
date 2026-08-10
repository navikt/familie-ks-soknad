FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:d1f4d7df35b62dbdd424ea7e198b03f347e83434e39b01abb74c6161b6bffee9

WORKDIR /app

# package.json med "type": "module" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import/export.
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
