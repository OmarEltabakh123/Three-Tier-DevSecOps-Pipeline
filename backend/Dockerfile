# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# Copy the rest of the application
COPY . .

# Stage 2: Runtime
FROM node:18-alpine

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app /app

# Use non-root user
USER appuser

EXPOSE 3000

# Healthcheck endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --quiet --spider http://localhost:3000/health || exit 1

# Start the app
CMD ["node", "start"]

