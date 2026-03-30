FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:8364585e7b3deac23683c324c89cd9e729c659c6a6a5179876af736de3ea4646

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
