ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-alpine AS build

USER root
RUN apk add --no-cache \
    build-base \
    pkgconf \
    python3 \
    ca-certificates \
    git

WORKDIR /app
ENV NODE_ENV=production

RUN git clone https://github.com/anarchychat/anarchychat.github.io .

RUN npm ci --include=dev
RUN npm run build
RUN npm prune --omit=dev

RUN set -eu; \
    mkdir -p /rootfs/usr/local/bin /rootfs/lib /rootfs/usr/lib; \
    cp -L /usr/local/bin/node /rootfs/usr/local/bin/node; \
    cp -a /lib/. /rootfs/lib/; \
    cp -a /usr/lib/. /rootfs/usr/lib/; \
    mkdir -p /rootfs/etc/ssl/certs; \
    cp -a /etc/ssl/certs/. /rootfs/etc/ssl/certs/; \
    mkdir -p /rootfs/tmp; \
    chmod 1777 /rootfs/tmp; \
    cp -a /etc/ssl/cert.pem /rootfs/etc/ssl/cert.pem

FROM scratch AS app

COPY --from=build /rootfs/ /
WORKDIR /app
COPY --from=build --chown=10001:10001 /app /app

ENV NODE_ENV=production \
    DOCKER_ENV=true \
    HOSTNAME=0.0.0.0 \
    PORT=3000

USER 10001:10001

ENTRYPOINT ["/usr/local/bin/node", "/app/node_modules/tsx/dist/cli.mjs", "/app/docker-entrypoint.ts"]

EXPOSE 3000 10000 10001 10002 10004