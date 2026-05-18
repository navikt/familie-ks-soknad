FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:c8cf1b7df16c8ff9a5546ef0949f0bda679e306162dcb12de5a263db11ba23c8

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
