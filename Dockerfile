FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:3fd059434c4e4ddad6b1885103c89247f64a819e98bdc7dbc538f31e17494313

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
