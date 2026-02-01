# Docker Setup Guide

## Quick Start

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Services

### 1. PostgreSQL Database
- **Container**: `milassist-db`
- **Port**: 5432
- **Image**: postgres:15-alpine
- **Volume**: `postgres_data`

### 2. Backend API
- **Container**: `milassist-backend`
- **Port**: 3000
- **Build**: From Dockerfile

### 3. Payload CMS
- **Container**: `milassist-payload`
- **Port**: 3002

### 4. Nginx (Optional)
- **Container**: `milassist-nginx`
- **Ports**: 80, 443
- **Purpose**: Reverse proxy and load balancer

## Environment Configuration

Create `.env` file in project root:

```bash
# Database
DB_NAME=milassist
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
DB_PORT=5432

# Backend
PORT=3000
JWT_SECRET=your_jwt_secret_here

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET=your_bucket_name

# Payload CMS
PAYLOAD_PORT=3002
PAYLOAD_SECRET=your_payload_secret
```

## Building Images

### Production Build
```bash
docker build -t milassist:latest .
```

### Multi-stage Build Verification
```bash
# Check image size
docker images milassist:latest

# Verify layers
docker history milassist:latest
```

## Development with Docker

### Hot Reload (Development Mode)

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./server
    volumes:
      - ./server:/app/server
      - /app/server/node_modules
    command: npm run dev
    environment:
      NODE_ENV: development
```

Run development environment:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Database Management

### Run Migrations
```bash
docker-compose exec backend npm run migrate
```

### Access Database
```bash
docker-compose exec database psql -U postgres -d milassist
```

### Backup Database
```bash
docker-compose exec database pg_dump -U postgres milassist > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker-compose exec -T database psql -U postgres milassist
```

## Troubleshooting

### Port Already in Use
```bash
# Stop conflicting services
lsof -ti:3000 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "3001:3000"
```

### Database Connection Failed
```bash
# Check database health
docker-compose ps database

# View database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Rebuild without cache
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Out of Disk Space
```bash
# Clean up unused images
docker system prune -a

# Remove old volumes
docker volume prune
```

## Production Deployment

### Using Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml milassist

# Scale services
docker service scale milassist_backend=3
```

### Using Kubernetes

See `k8s/` directory for Kubernetes manifests:
- Deployments
- Services
- ConfigMaps
- Secrets
- Ingress

## Security Best Practices

1. **Use secrets management**
   ```bash
   # Create secrets
   echo "my_secret" | docker secret create jwt_secret -
   ```

2. **Run as non-root user** (already configured in Dockerfile)

3. **Scan images for vulnerabilities**
   ```bash
   docker scan milassist:latest
   ```

4. **Use multi-stage builds** (implemented)

5. **Keep base images updated**
   ```bash
   docker-compose pull
   docker-compose up -d --build
   ```

## Health Checks

### Manual Health Check
```bash
curl http://localhost:3000/health
```

### Automated Health Monitoring
```bash
# View health status
docker-compose ps

# Check specific service
docker inspect --format='{{.State.Health.Status}}' milassist-backend
```

## Logs

### View All Logs
```bash
docker-compose logs -f
```

### Service-Specific Logs
```bash
docker-compose logs -f backend
docker-compose logs -f database
```

### Export Logs
```bash
docker-compose logs > logs.txt
```

## Performance Optimization

### Resource Limits

Add to `docker-compose.yml`:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Network Optimization
```bash
# Use host network for better performance (Linux only)
network_mode: host
```

## Useful Commands

```bash
# Stop and remove all containers
docker-compose down

# Remove volumes too
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build

# View resource usage
docker stats

# Execute command in container
docker-compose exec backend sh

# Copy files from container
docker cp milassist-backend:/app/logs ./local-logs
```
