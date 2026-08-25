# Production Dockerfile for Railway / Cloud Container Deployments
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json tsconfig.json vite.config.ts ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/contracts ./contracts
COPY --from=builder /app/scripts ./scripts

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
