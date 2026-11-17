# ==========================================
# Cafe Menu & Order Management System
# Frontend Dockerfile (Vite React + Nginx Alpine)
# ==========================================

# Stage 1: Build production assets using Node
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (cached)
COPY package*.json ./
RUN npm ci || npm install

# Copy application source
COPY . .

# Pass API URL at build time for Vite client bundle
ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=${VITE_API_URL}

# Build static bundle into dist/
RUN npm run build

# Stage 2: Serve static files using Nginx Alpine
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check to ensure Nginx is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
