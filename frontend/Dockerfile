# Build stage
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Create a custom group and user with specific UID/GID for security
# GID 3001 for appgroup, UID 1001 for appuser
RUN addgroup -g 3001 appgroup && adduser -D -u 1001 -G appgroup appuser

WORKDIR /usr/share/nginx/html # Nginx serves from here by default

# Copy website files from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Ensure correct permissions for Nginx cache and run directories
# Nginx needs write access to /var/cache/nginx and /var/run/nginx (for PID/sockets)
RUN mkdir -p /var/cache/nginx/client_temp /var/run/nginx && \
    chown -R 1001:3001 /var/cache/nginx && \
    chown -R 1001:3001 /var/run/nginx

# Set user for Nginx process
USER appuser

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
