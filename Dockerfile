# syntax=docker/dockerfile:1

ARG NODE_VERSION=current
FROM node:${NODE_VERSION}-alpine AS build

USER root
RUN apk add --no-cache \
    build-base \
    pkgconf \
    python3 \
    ca-certificates

WORKDIR /app
ENV NODE_ENV=production

COPY package-lock.json package.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build
RUN npm prune --omit=dev

RUN set -eu; \
    mkdir -p /rootfs/usr/local/bin /rootfs/lib /rootfs/usr/lib; \
    cp -L /usr/local/bin/node /rootfs/usr/local/bin/node; \
    cp -a /lib/. /rootfs/lib/; \
    cp -a /usr/lib/. /rootfs/usr/lib/; \
    mkdir -p /rootfs/etc/ssl/certs; \
    cp -a /etc/ssl/certs/. /rootfs/etc/ssl/certs/; \
    if [ -e /etc/ssl/cert.pem ]; then \
      cp -a /etc/ssl/cert.pem /rootfs/etc/ssl/cert.pem; \
    fi

FROM scratch AS app

COPY --from=build /rootfs/ /
WORKDIR /app
COPY --from=build --chown=10001:10001 /app /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

USER 10001:10001

ENTRYPOINT ["/usr/local/bin/node", "/app/node_modules/next/dist/bin/next"]
CMD ["start", "-H", "0.0.0.0"]

EXPOSE 3000 5000 5001 5002 5004
