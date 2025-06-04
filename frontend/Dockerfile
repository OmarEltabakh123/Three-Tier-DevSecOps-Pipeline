# ===== Build stage =====
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===== Production stage =====
FROM nginx:alpine

# نرجع نشتغل كـ root عشان نقدر نعدل على ملفات السيستم
USER root

# نضيف يوزر عادي
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# نعدل صلاحيات فولدر nginx (للتجربة فقط)
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod -R 777 /var/cache/nginx

# ننسخ ملفات الـ build من المرحلة الأولى
COPY --from=builder /app/build /usr/share/nginx/html

# ننسخ ملف الإعدادات الخاص بـ nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# نرجع نشتغل بيوزر محدود
USER appuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
