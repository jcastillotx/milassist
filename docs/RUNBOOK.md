# MilAssist Operations Runbook

## Quick Start

### How to Run the App Locally

#### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ (or use Supabase)
- No Redis required (using in-memory caching)

#### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/milassist/milassist.git
cd milassist

# 2. Install dependencies
npm install
cd payload && npm install
cd ..

# 3. Set up environment variables
cp payload/.env.example payload/.env
# Edit .env with your configuration

# 4. Start development server
cd payload
npm run dev

# Frontend: http://localhost:5173 (React app)
# Backend: http://localhost:3000 (Payload CMS admin/API)
```

#### Database Setup

**Option A: Supabase (Recommended)**
1. Create project at [supabase.com](https://supabase.com)
2. Get connection string from Settings → Database
3. Add to `.env`:
   ```env
   DATABASE_URI=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL via Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb milassist

# Add to .env:
DATABASE_URI=postgresql://localhost:5432/milassist
```

## Deployment

### How to Deploy to Vercel

#### Vercel Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Link project
cd milassist
vercel link

# 4. Add environment variables in Vercel dashboard:
# - PAYLOAD_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - DATABASE_URI (Supabase connection string)
# - AWS credentials (S3 bucket)
# - OAuth credentials (Google, Microsoft)
# - AI API keys (optional)

# 5. Deploy
vercel --prod
```

#### Automatic Deployments

Vercel auto-deploys on push to main branch:
- Preview deployments for PRs
- Production deployment on merge to main
- Environment variables managed in Vercel dashboard

### Supabase Database Setup

```bash
# 1. Create Supabase project
# https://supabase.com

# 2. Get connection string from:
# Settings → Database → Connection string

# 3. Enable connection pooling (recommended for serverless)
# Settings → Database → Connection pooling → Create new pooler

# 4. Set environment variable in Vercel:
# DATABASE_URI=postgresql://postgres:[PASSWORD]@pooler.[PROJECT].supabase.co:6543/postgres
```

## Monitoring

### How to Monitor the System

#### Health Checks

```bash
# Check application health
curl https://your-domain.vercel.app/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2026-01-13T12:00:00Z",
  "services": {
    "database": "healthy"
  },
  "version": "1.0.0"
}
```

#### Vercel Dashboard

Access: https://vercel.com/dashboard

**Key Metrics to Monitor:**
- **Response Time**: < 200ms average (check Functions tab)
- **Error Rate**: < 0.1% (check Runtime Errors)
- **Uptime**: > 99.5% (automatic with Vercel)
- **Database Connections**: Check Supabase dashboard
- **Function Invocations**: Monitor Lambda usage

#### Supabase Monitoring

Access: https://supabase.com/dashboard → Your Project → Database

- **Connection Pool**: Monitor active connections
- **Query Performance**: Check slow query log
- **Storage**: Monitor S3 bucket usage
- **Backups**: Verify automatic backups enabled

### Log Monitoring

```bash
# View Vercel function logs
vercel logs [deployment-url]

# View real-time logs
vercel logs --follow [deployment-url]

# Filter by function
vercel logs [deployment-url] --payload /api/ai/chat
```

### Monitoring Alerts

#### Critical Alerts (Immediate Response Required)
- **Function Cold Starts**: > 5s cold start time
- **Database Connection Failed**: Cannot connect to Supabase
- **High Error Rate**: > 5% error rate for 5 minutes
- **Security Breach**: Suspicious activity detected

#### Warning Alerts (Investigate Within 1 Hour)
- **High Response Time**: > 500ms for 10 minutes
- **Function Timeout**: Functions approaching 10s limit
- **Storage Usage**: > 80% of S3 bucket capacity
- **API Rate Limiting**: Approaching Vercel limits

## Debugging Failures

### How to Debug Common Issues

#### Application Won't Start

```bash
# 1. Check environment variables
cd payload && cat .env | grep -E "PAYLOAD_SECRET|DATABASE_URI"

# 2. Check database connection
npm run dev 2>&1 | head -50

# 3. Check port availability
lsof -i :3000

# 4. View build output
npm run build 2>&1
```

#### Database Issues

```bash
# 1. Test database connection
curl https://your-domain.vercel.app/api/health

# 2. Check Supabase status
# https://status.supabase.com

# 3. Verify connection string format
# postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# 4. Check connection pooling
# Use port 6543 for pooled connections
```

#### External Service Failures

```bash
# 1. Test S3 connection
# Check Vercel logs for S3 errors

# 2. Test OAuth providers
# Check Google Cloud Console / Azure Portal

# 3. Test AI providers
curl https://your-domain.vercel.app/api/ai/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

#### Performance Issues

```bash
# 1. Check Vercel function execution time
vercel logs [url] | grep -i duration

# 2. Profile database queries
# Use Supabase Query Performance tab

# 3. Check bundle size
npm run build -- --analyze
```

## Incident Response

### How to Handle System Failures

#### Service Outage Procedure

1. **Immediate Assessment (0-5 minutes)**
   ```bash
   # Check service status
   curl https://your-domain.vercel.app/api/health
   
   # Check Vercel deployments
   vercel list
   
   # Check recent logs
   vercel logs --since 10m [url]
   ```

2. **Communication (5-15 minutes)**
   - Check Vercel Status: https://status.vercel.com
   - Check Supabase Status: https://status.supabase.com
   - Update team in Slack/discord

3. **Investigation (15-60 minutes)**
   ```bash
   # Review error logs
   vercel logs --since 1h [url] | grep ERROR
   
   # Check database performance
   # Review Supabase dashboard
   
   # Check function invocations
   # Review Vercel Functions tab
   ```

4. **Resolution (60+ minutes)**
   - Implement fix or rollback to previous deployment
   - Test in preview environment
   - Deploy fix to production
   - Monitor for 30 minutes

5. **Post-Incident (Post-resolution)**
   - Document incident
   - Create improvement tickets
   - Schedule post-mortem meeting

#### Security Incident Procedure

1. **Immediate Response (0-5 minutes)**
   ```bash
   # Check for suspicious activity
   vercel logs --since 1h | grep "auth"
   
   # Review recent deployments
   vercel list --all
   ```

2. **Containment (5-30 minutes)**
   - Rollback to previous deployment if needed
   - Revoke suspicious API keys
   - Enable additional monitoring

3. **Investigation (30+ minutes)**
   - Analyze breach scope
   - Review access logs
   - Check data integrity

4. **Recovery (Post-investigation)**
   - Patch vulnerabilities
   - Reset compromised credentials
   - Notify affected users if needed

## Rollback Procedures

### How to Roll Back Changes

#### Vercel Rollback

```bash
# 1. List previous deployments
vercel list --all

# 2. Rollback to previous version
vercel rollback [deployment-url]

# 3. Verify rollback
curl https://your-domain.vercel.app/api/health

# 4. Monitor for 15 minutes
vercel logs --follow [url]
```

#### Database Rollback

Note: Vercel doesn't manage database - use Supabase:

```bash
# 1. Supabase automatic backups
# Settings → Database → Backups

# 2. Restore from backup
# Contact Supabase support for restoration

# 3. Point application to restored database
# Update DATABASE_URI in Vercel
```

#### Emergency Rollback (Critical Issues)

```bash
# 1. Immediate rollback via Vercel
vercel rollback [deployment-url]

# 2. If that fails, redeploy previous commit
git checkout [previous-commit-sha]
vercel --prod
git checkout main
```

## Maintenance Procedures

### Scheduled Maintenance

#### Database Maintenance

```bash
# 1. Enable maintenance mode (if supported)
# Not needed for Supabase - managed service

# 2. Supabase handles:
# - Vacuum
# - Reindex
# - Updates

# 3. Monitor from Supabase dashboard
```

#### Vercel Function Updates

```bash
# 1. Update dependencies
cd payload
npm update

# 2. Run tests
npm test

# 3. Deploy updates
vercel --prod
```

## Troubleshooting Guide

### Common Issues and Solutions

#### High Function Cold Starts

**Symptoms:**
- First request after idle is slow (>3s)
- Timeouts on initial requests

**Solutions:**
- Keep functions warm with cron job
- Reduce bundle size
- Use smaller dependencies

```bash
# Add cron to keep functions warm
# vercel cron setup
```

#### Database Connection Timeouts

**Symptoms:**
- "Connection refused" errors
- Slow database queries

**Solutions:**
- Use connection pooling (port 6543)
- Increase connection pool size
- Optimize queries

```env
# In .env, use pooled connection
DATABASE_URI=postgresql://postgres:pwd@pooler.xx.supabase.co:6543/postgres
```

#### S3 Upload Failures

**Symptoms:**
- File upload errors
- 403 Forbidden errors

**Solutions:**
- Verify AWS credentials
- Check S3 bucket permissions
- Verify CORS configuration

```json
// S3 CORS configuration
[{
  "AllowedHeaders": ["*"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedOrigins": ["https://your-domain.vercel.app"],
  "ExposeHeaders": ["ETag"]
}]
```

#### OAuth Redirect Errors

**Symptoms:**
- OAuth flow fails at callback
- "redirect_uri_mismatch" error

**Solutions:**
- Verify redirect URIs in OAuth provider
- Match exactly between config and provider

```env
# Google OAuth - must match exactly
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/oauth/google/callback

# Microsoft OAuth - must match exactly
MICROSOFT_REDIRECT_URI=https://your-domain.vercel.app/api/oauth/microsoft/callback
```

## Performance Optimization

### How to Optimize System Performance

#### Vercel Function Optimization

```bash
# 1. Analyze bundle size
npm run build -- --analyze

# 2. Reduce bundle size
# - Use dynamic imports
# - Remove unused dependencies
# - Enable compression

# 3. Configure caching
# Add cache headers to static assets
```

#### Database Optimization

```bash
# 1. Check slow queries
# Supabase Dashboard → Database → Query Performance

# 2. Add indexes for frequently queried columns
# Use Supabase SQL Editor

# 3. Use connection pooling
# Already configured via port 6543
```

## Backup and Recovery

### Data Backup Procedures

#### Supabase Automatic Backups

```bash
# Supabase provides:
# - Daily automatic backups (free tier)
# - Point-in-time recovery (pro tier)
# - 7-day retention (free) / 30-day (pro)

# Check backup status:
# Supabase Dashboard → Settings → Database → Backups
```

#### Manual Backup (Optional)

```bash
# Export data using pg_dump
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" > backup.sql

# Backup S3 files
# Use AWS CLI to sync bucket
aws s3 sync s3://milassist-uploads ./backup/
```

### Disaster Recovery

```bash
# 1. Deploy to Vercel
vercel --prod

# 2. If database issue:
# - Restore from Supabase backup
# - Update DATABASE_URI if needed

# 3. Verify system health
curl https://your-domain.vercel.app/api/health
```

## Security Operations

### Security Best Practices

```bash
# 1. Rotate API keys regularly
# - PAYLOAD_SECRET (every 90 days)
# - AWS credentials (every 90 days)
# - OAuth credentials (every 180 days)

# 2. Monitor usage
# - Vercel dashboard for function invocations
# - Supabase dashboard for database usage
# - AWS for S3 usage

# 3. Enable logging
# Vercel provides built-in logging
```

### Security Checklist

- [ ] PAYLOAD_SECRET is 32+ characters
- [ ] All API keys in environment variables
- [ ] OAuth redirect URIs match production
- [ ] S3 bucket has proper CORS
- [ ] Rate limiting implemented
- [ ] HTTPS enabled (automatic with Vercel)

## Contact Information

### Emergency Contacts

- **On-call Engineer:** Check Slack #on-call
- **DevOps Team:** devops@milassist.com
- **Support:** support@milassist.com

### Service Providers

- **Vercel Support:** https://vercel.com/help
- **Supabase Support:** https://supabase.com/support
- **AWS Support:** https://aws.amazon.com/contact-us

---

*Runbook Version: 2.0*  
*Last Updated: 2026-01-13*  
*Stack: Vercel + Supabase + Payload CMS 3.0*

