FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim@sha256:c57b52b26c6079dc41db14affac59983714cbada72cd87605055cb3541d85875

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
