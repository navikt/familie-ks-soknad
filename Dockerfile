FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:8e5f0ecd9f0b0942a1a82dbcecf07bc8f63bdd205cc656530ece6fab976ba216

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
