# ==========================================
# Cafe Menu & Order Management System
# Backend Dockerfile (Node.js + Express)
# ==========================================

FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Set default production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies before copying source for Docker cache efficiency
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy application source code
COPY . .

# Expose backend service port
EXPOSE 5000

# Health check to ensure service readiness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start production server
CMD ["npm", "start"]
