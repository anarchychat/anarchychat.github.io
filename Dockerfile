# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.21.1
ARG NODE_IMAGE=cgr.dev/chainguard/node

FROM ${NODE_IMAGE}:${NODE_VERSION}-dev AS build

LABEL fly_launch_runtime="Next.js"

USER root
RUN apk add --no-cache build-base node-gyp pkgconf python3

WORKDIR /app
ENV NODE_ENV="production"

COPY package-lock.json package.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM ${NODE_IMAGE}:${NODE_VERSION} AS app

WORKDIR /app
ENV NODE_ENV="production"

COPY --from=build --chown=node:node /app /app

ENTRYPOINT ["/usr/bin/node", "/app/docker-entrypoint.js"]

EXPOSE 3000 5000 5001 5002 5004
CMD ["npm", "run", "start"]
