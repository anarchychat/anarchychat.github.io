# syntax=docker/dockerfile:1

ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-alpine AS build

USER root
RUN apk add --no-cache \
    build-base \
    node-gyp \
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

# Assemble a minimal runtime root: Node, its shared libraries, and CA certificates.
RUN set -eu; \
    mkdir -p /rootfs/usr/local/bin; \
    cp -L /usr/local/bin/node /rootfs/usr/local/bin/node; \
    for binary in /usr/local/bin/node $(find /app -type f -name '*.node'); do \
      ldd "$binary" \
        | awk '{ for (i = 1; i <= NF; i++) if ($i ~ /^\//) print $i }' \
        | sort -u \
        | while IFS= read -r lib; do \
            mkdir -p "/rootfs$(dirname "$lib")"; \
            cp -L "$lib" "/rootfs$lib"; \
          done; \
    done; \
    mkdir -p /rootfs/etc/ssl/certs; \
    cp /etc/ssl/certs/ca-certificates.crt /rootfs/etc/ssl/certs/

FROM scratch AS app

COPY --from=build /rootfs/ /
WORKDIR /app
COPY --from=build --chown=10001:10001 /app /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

USER 10001:10001

# Assumes docker-entrypoint.js forwards its arguments to the command.
ENTRYPOINT ["/usr/local/bin/node", "/app/docker-entrypoint.js"]
CMD ["node_modules/next/dist/bin/next", "start", "-H", "0.0.0.0"]

EXPOSE 3000 5000 5001 5002 5004
