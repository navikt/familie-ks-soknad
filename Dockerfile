FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /var/server

COPY dist ./dist

CMD ["dist/server.cjs"]
