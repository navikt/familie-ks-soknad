FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:f966ea1a81ac8a8c7bad5dc32a3f56d580ddd025e1c1d9a78ec11215018bd198

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
