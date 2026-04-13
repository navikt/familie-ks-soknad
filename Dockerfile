FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:ebd2a106cd8a20da79b7e779040f725f2ddb62ede5beac78bcc7bc065146840f

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
