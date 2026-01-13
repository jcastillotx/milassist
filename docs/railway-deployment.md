# Railway Deployment Guide

This guide covers deploying the MilAssist platform to Railway.

## 🚀 Quick Start

### 1. Prepare Your Repository

Make sure your repository includes:
- ✅ `railway.toml` configuration file
- ✅ `.railway/start.sh` startup script
- ✅ All dependencies in `package.json`
- ✅ Environment variables configured

### 2. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link your project
railway link

# Deploy
railway up
```

### 3. Set Up Database

1. **Add PostgreSQL Service:**
   ```bash
   railway add postgresql
   ```

2. **Get Database URL:**
   ```bash
   railway variables get DATABASE_URL
   ```

3. **Update Environment Variables** in Railway dashboard

## 🔧 Configuration

### Required Environment Variables

Set these in your Railway dashboard:

#### Core Configuration
- `NODE_ENV=production`
- `JWT_SECRET` - Generate a strong secret key
- `PORT=3000`

#### Database (Railway PostgreSQL)
- `DB_DIALECT=postgres`
- `DB_HOST=${{RAILWAY_PRIVATE_DOMAIN}}`
- `DB_PORT=5432`
- `DB_NAME=${{RAILWAY_DATABASE_NAME}}`
- `DB_USER=${{RAILWAY_DATABASE_USERNAME}}`
- `DB_PASSWORD=${{RAILWAY_DATABASE_PASSWORD}}`

#### CORS & URLs
- `ALLOWED_ORIGINS=${{RAILWAY_PUBLIC_DOMAIN}}`
- `FRONTEND_URL=${{RAILWAY_PUBLIC_DOMAIN}}`
- `APP_URL=${{RAILWAY_PUBLIC_DOMAIN}}`

#### Google Flights Integration
- `GOOGLE_FLIGHTS_SCRAPER_TYPE=free` (or `oxylabs`)
- `OXYLABS_USERNAME` (if using Oxylabs)
- `OXYLABS_PASSWORD` (if using Oxylabs)

#### Optional: Email & OAuth
- `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`

## 📋 Deployment Steps

### Step 1: Initialize Railway

```bash
# Clone your repository
git clone <your-repo-url>
cd milassist

# Install Railway CLI
npm install -g @railway/cli

# Login and initialize
railway login
railway init
```

### Step 2: Configure Database

```bash
# Add PostgreSQL database
railway add postgresql

# Wait for database to be ready
railway status
```

### Step 3: Set Environment Variables

```bash
# Set JWT secret (generate a secure one)
railway variables set JWT_SECRET="your-super-secure-jwt-secret-here"

# Set Google Flights configuration
railway variables set GOOGLE_FLIGHTS_SCRAPER_TYPE="free"

# Set other required variables
railway variables set NODE_ENV="production"
```

### Step 4: Deploy

```bash
# Deploy your application
railway up

# Monitor deployment
railway logs
```

### Step 5: Verify Deployment

1. **Check Health Endpoint:**
   ```
   https://your-app.railway.app/health
   ```

2. **Test API:**
   ```
   https://your-app.railway.app/api/auth/login
   ```

3. **Access Frontend:**
   ```
   https://your-app.railway.app
   ```

## 🔄 Continuous Deployment

### Automatic Deployments

Railway automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### Custom Domain

1. **Add Custom Domain:**
   ```bash
   railway domains add yourdomain.com
   ```

2. **Configure DNS:**
   - CNAME record pointing to `railway.app`
   - Wait for SSL certificate

## 📊 Monitoring & Logs

### View Logs

```bash
# Real-time logs
railway logs

# Historical logs
railway logs --since 1h
```

### Monitor Performance

- **Railway Dashboard**: CPU, memory, and network metrics
- **Health Checks**: Automatic health monitoring
- **Error Tracking**: Built-in error logging

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
railway status

# Verify environment variables
railway variables list
```

#### 2. Build Failed
```bash
# Check build logs
railway logs --build

# Verify package.json dependencies
cat package.json
```

#### 3. Application Not Starting
```bash
# Check application logs
railway logs

# Verify start script
cat .railway/start.sh
```

### Debug Mode

Enable debug logging:
```bash
railway variables set DEBUG="milassist:*"
```

## 📈 Scaling

### Vertical Scaling

```bash
# Upgrade to larger instance
railway scale
```

### Horizontal Scaling

```bash
# Add more instances
railway scale --instances 3
```

## 🔒 Security

### Best Practices

1. **Use Environment Variables** for all secrets
2. **Enable HTTPS** (automatic on Railway)
3. **Regular Updates** for dependencies
4. **Monitor Logs** for suspicious activity
5. **Backup Database** regularly

### Security Headers

The application includes security middleware for:
- CORS protection
- Rate limiting
- Input validation
- JWT token security

## 💰 Cost Management

### Free Tier Limits

- **$5/month** credit included
- **500 hours** of compute time
- **1GB** storage
- **100GB** bandwidth

### Production Costs

- **Basic**: ~$5-10/month
- **Standard**: ~$20-50/month
- **Premium**: ~$100+/month

### Cost Optimization

1. **Monitor usage** regularly
2. **Optimize database queries**
3. **Use caching** where appropriate
4. **Scale horizontally** when needed

## 🚀 Production Checklist

Before going live:

- [ ] **Database migrated** from SQLite to PostgreSQL
- [ ] **Environment variables** configured
- [ ] **Custom domain** set up
- [ ] **SSL certificate** active
- [ ] **Health checks** passing
- [ ] **Monitoring** configured
- [ ] **Backup strategy** in place
- [ ] **Error tracking** enabled
- [ ] **Performance testing** completed
- [ ] **Security review** done

## 📞 Support

### Railway Resources
- **Documentation**: https://docs.railway.app
- **Status Page**: https://status.railway.app
- **Support**: support@railway.app

### MilAssist Support
- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issue
- **Email**: support@milassist.com

---

*Last Updated: 2026-01-10*
