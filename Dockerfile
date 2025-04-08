FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript code
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Run the server
CMD ["node", "dist/src/index.js"] 