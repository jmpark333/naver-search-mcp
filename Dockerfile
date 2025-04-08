FROM node:22.12-alpine AS builder

WORKDIR /app

# Copy source files
COPY . /app
COPY tsconfig.json /tsconfig.json

# Install dependencies with cache
RUN --mount=type=cache,target=/root/.npm npm install

# Install production dependencies
RUN --mount=type=cache,target=/root/.npm-production npm ci --ignore-scripts --omit-dev

FROM node:22-alpine AS release

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

ENV NODE_ENV=production

RUN npm ci --ignore-scripts --omit-dev

ENTRYPOINT ["node", "/app/dist/src/index.js"] 