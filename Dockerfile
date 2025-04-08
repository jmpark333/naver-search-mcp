FROM node:18-alpine

WORKDIR /app

# 소스 코드 복사
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# 의존성 설치 및 빌드
RUN npm ci && \
    npm run build && \
    npm prune --production

# 실행
CMD ["node", "dist/src/index.js"] 