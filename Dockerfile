FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:bc1379ce260f5ad69692787eaf0d025dbd034ac9acb1f64d1538d7f8986828f0

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
