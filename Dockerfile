# Multi-stage Dockerfile for MilAssist Platform

# Stage 1: Backend
FROM node:18-alpine AS backend
WORKDIR /app/server

# Install dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy server files
COPY server/ ./

# Stage 2: Frontend Build
FROM node:18-alpine AS frontend-build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.js ./

# Build frontend
RUN npm run build

# Stage 3: Payload CMS
FROM node:18-alpine AS payload
WORKDIR /app/payload

# Install dependencies
COPY payload/package*.json ./
RUN npm ci --only=production

# Copy payload files
COPY payload/ ./

# Stage 4: Production
FROM node:18-alpine
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache \
    postgresql-client \
    curl

# Copy backend
COPY --from=backend /app/server ./server

# Copy frontend build
COPY --from=frontend-build /app/dist ./dist

# Copy payload
COPY --from=payload /app/payload ./payload

# Create logs directory
RUN mkdir -p /app/server/logs && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Expose ports
EXPOSE 3000 3001 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start script
CMD ["sh", "-c", "cd server && npm start"]
