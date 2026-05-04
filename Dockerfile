FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:296362fb8b41132b6b5644701e42774f8608a8137a6112664d72f73ab400e30b

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
