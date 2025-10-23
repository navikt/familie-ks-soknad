FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
