FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:82bb92c655692d00f682cd3d08ae09207cdf7b929cb8f47c128d59fbc1240e9f

WORKDIR /app

# package.json med "type": "module" må også kopieres over for å fortelle at Node skal anse .js filer som ES Modules og ikke CommonJS. Muliggjør bruken av import/export.
COPY package.json ./
COPY dist ./dist

CMD ["dist/backend/server.js"]
