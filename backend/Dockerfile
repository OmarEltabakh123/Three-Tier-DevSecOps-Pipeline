FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --production
RUN npm cache clean --force

COPY . .

FROM node:18-alpine

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app .
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]