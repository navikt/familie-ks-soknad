# syntax=docker/dockerfile:1.3

FROM ghcr.io/navikt/baseimages/node-express:16-alpine as builder-base
USER apprunner

COPY --chown=apprunner:apprunner ./.npmrc ./.yarnrc ./yarn.lock ./package.json /var/server/

FROM builder-base as runtime-deps-builder
ARG NPM_TOKEN
RUN yarn install --prod
RUN rm -rf .cache

FROM builder-base as webpack-express-deps-builder
ARG NPM_TOKEN
RUN yarn
COPY --chown=apprunner:apprunner ./src /var/server/src
COPY --chown=apprunner:apprunner ./tsconfig* babel.config.cjs /var/server/


# Gjør faktisk bygg i eget steg slik at vi slipper å kjøre det i lokal stack
FROM webpack-express-deps-builder as webpack-express-builder
# Trenger å vite BASE_PATH før vi kjører webpack, siden webpack bruker DefinePlugin for å videresende basepath til frontend
ARG base_path
ARG sentry_release
ENV BASE_PATH=$base_path \
    SENTRY_RELEASE=$sentry_release

RUN --mount=type=secret,id=sentry_token,mode=0444 SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_token) yarn build


FROM ghcr.io/navikt/baseimages/node-express:16-alpine as prod-runner
USER apprunner

COPY --from=runtime-deps-builder /var/server/ /var/server
COPY --from=webpack-express-builder /var/server/build /var/server/build
COPY --from=webpack-express-builder /var/server/dist /var/server/dist
RUN rm -f .npmrc
RUN rm -f .yarnrc

EXPOSE 9000
CMD ["yarn", "start"]
