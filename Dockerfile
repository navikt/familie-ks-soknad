FROM gcr.io/distroless/nodejs:18
USER root
USER apprunner

WORKDIR /var/server

COPY src/backend/dist ./dist
COPY dist ./dist

CMD ["dist/server.js"]
