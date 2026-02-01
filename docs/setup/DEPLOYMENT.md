# MilAssist Deployment Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL or MySQL (for production) or SQLite (for development)
- Domain name with SSL certificate
- Reverse proxy (nginx recommended)

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd iridescent-kepler
```

### 2. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### 3. Configure Environment Variables
```bash
cd server
cp .env.example .env
# Edit .env with your production values
```

**Critical Variables:**
- `JWT_SECRET`: Generate a strong secret (min 32 characters)
- `NODE_ENV`: Set to `production`
- `ALLOWED_ORIGINS`: Your frontend domain(s)
- Database credentials (if using PostgreSQL/MySQL)

### 4. Database Setup
```bash
# The app will auto-sync tables on first run
# For production, consider using migrations instead
node server.js
```

### 5. Build Frontend
```bash
npm run build
# This creates a /dist folder with optimized assets
```

## Production Deployment

### Option 1: Traditional Server (VPS)

#### Install PM2
```bash
npm install -g pm2
```

#### Start Backend
```bash
cd server
pm2 start server.js --name milassist-api
pm2 save
pm2 startup
```

#### Serve Frontend with nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend
    location / {
        root /path/to/iridescent-kepler/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Cloud Platforms (Recommended)

#### Vercel (Full Stack)
```bash
vercel --prod
```

**Backend Deployment:**
- Deploy Node.js backend to Vercel as serverless functions
- Connect Supabase PostgreSQL database
- Set environment variables in Vercel dashboard
- Deploy automatically on push to main branch

## Post-Deployment

### 1. Verify Health
```bash
curl https://yourdomain.com/api/health
```

### 2. Monitor Logs
```bash
pm2 logs milassist-api
```

### 3. Set Up Monitoring
- Use services like Sentry for error tracking
- Set up uptime monitoring (UptimeRobot, Pingdom)

## Maintenance

### Update Application
```bash
git pull origin main
cd server && npm install
cd .. && npm install && npm run build
pm2 restart milassist-api
```

### Database Backups
```bash
# SQLite
cp server/database.sqlite backups/db-$(date +%Y%m%d).sqlite

# PostgreSQL
pg_dump dbname > backup.sql
```

## Security Checklist
- [ ] SSL/TLS enabled
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] CORS properly configured
- [ ] Rate limiting enabled (consider express-rate-limit)
- [ ] Security headers (consider helmet.js)
- [ ] Regular dependency updates
