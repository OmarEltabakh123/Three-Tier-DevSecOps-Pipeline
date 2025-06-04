# Build stage
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# --- هنا هنضيف السطرين دول عشان ندي صلاحيات لـ appuser على مجلد الـ cache ---
# ده هيضمن إن appuser يقدر يكتب في مجلدات Nginx اللي بتحتاج صلاحيات كتابة
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R appuser:appgroup /var/cache/nginx
# --- نهاية إضافة السطرين ---
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
USER appuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
