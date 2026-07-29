FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:a07b0d26309c304ec93260a3cc45e6f0fce277e0a43e2c2457aeabb041e2642e

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
