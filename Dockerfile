FROM gcr.io/distroless/nodejs20-debian12:nonroot

WORKDIR /app

COPY dist ./dist

CMD ["dist/server.cjs"]
