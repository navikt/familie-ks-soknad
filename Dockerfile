FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:631c77e06eadb23aa24f4aec1f548c8ddc8fa6ffe67db8e3d56897c7e725951a

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
