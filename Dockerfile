FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:c39e1fd11cedcee713e9fb847b48c5182a85fd26be2510a5e4ebdb286538e75b

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
