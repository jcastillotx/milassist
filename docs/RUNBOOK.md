# MilAssist Operations Runbook

## Quick Start

### How to Run the App Locally

#### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ (or use Docker)
- Redis 6+ (for caching and sessions)

#### Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/your-org/milassist.git
cd milassist

# 2. Install dependencies
npm install
cd server && npm install
cd ../frontend && npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Set up database
cd server
npm run db:migrate
npm run db:seed

# 5. Start development servers
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

#### Docker Development

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Deployment

### How to Deploy to Production

#### Railway Deployment

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and initialize
railway login
railway init

# 3. Add PostgreSQL database
railway add postgresql

# 4. Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your-secure-secret
railway variables set TWILIO_ACCOUNT_SID=your-sid
railway variables set TWILIO_AUTH_TOKEN=your-token
railway variables set TWILIO_PHONE_NUMBER=your-number

# 5. Deploy
railway up

# 6. Monitor deployment
railway logs
```

#### Manual Deployment

```bash
# 1. Build application
npm run build

# 2. Run database migrations
npm run db:migrate:prod

# 3. Start application
npm start
```

## Monitoring

### How to Monitor the System

#### Health Checks

```bash
# Check application health
curl https://api.milassist.com/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2026-01-11T12:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "external_apis": "healthy"
  },
  "version": "1.0.0"
}
```

#### System Metrics Dashboard

Access: `https://admin.milassist.com/health`

**Key Metrics to Monitor:**
- **Response Time**: < 200ms average
- **Error Rate**: < 0.1%
- **Uptime**: > 99.5%
- **Database Connections**: < 80% of pool
- **Memory Usage**: < 80% of allocated
- **CPU Usage**: < 70% average

#### Log Monitoring

```bash
# View application logs
docker-compose logs -f app

# View error logs only
docker-compose logs app | grep ERROR

# View specific service logs
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Monitoring Alerts

#### Critical Alerts (Immediate Response Required)
- **Service Down**: Application not responding
- **Database Connection Failed**: Cannot connect to database
- **High Error Rate**: > 5% error rate for 5 minutes
- **Security Breach**: Suspicious activity detected

#### Warning Alerts (Investigate Within 1 Hour)
- **High Response Time**: > 500ms for 10 minutes
- **Memory Usage**: > 80% for 30 minutes
- **Disk Space**: < 10% free
- **Queue Buildup**: > 1000 pending jobs

## Debugging Failures

### How to Debug Common Issues

#### Application Won't Start

```bash
# 1. Check environment variables
printenv | grep -E "(NODE_ENV|DATABASE_URL|JWT_SECRET)"

# 2. Check database connection
npm run db:check

# 3. Check port availability
lsof -i :3000

# 4. View startup logs
npm start 2>&1 | head -50
```

#### Database Issues

```bash
# 1. Check database connection
npm run db:ping

# 2. Run database health check
npm run db:health

# 3. Check migration status
npm run db:status

# 4. Reset database (development only)
npm run db:reset
```

#### External Service Failures

```bash
# 1. Test Twilio connection
npm run test:twilio

# 2. Test Google Flights integration
npm run test:flights

# 3. Test Stripe connection
npm run test:stripe

# 4. Check external service status
curl -I https://api.twilio.com
curl -I https://api.stripe.com
```

#### Performance Issues

```bash
# 1. Check response times
npm run perf:test

# 2. Profile database queries
npm run db:profile

# 3. Check memory usage
npm run memory:profile

# 4. Analyze bundle size
npm run analyze:bundle
```

## Incident Response

### How to Handle System Failures

#### Service Outage Procedure

1. **Immediate Assessment (0-5 minutes)**
   ```bash
   # Check service status
   curl https://api.milassist.com/health
   
   # Check recent deployments
   railway deployments list
   
   # Check error rates
   railway logs --since 10m
   ```

2. **Communication (5-15 minutes)**
   - Update status page: `https://status.milassist.com`
   - Notify team via Slack
   - Post incident update to users

3. **Investigation (15-60 minutes)**
   ```bash
   # Review error logs
   railway logs --since 1h | grep ERROR
   
   # Check database performance
   npm run db:metrics
   
   # Check external service status
   npm run external:status
   ```

4. **Resolution (60+ minutes)**
   - Implement fix or rollback
   - Test in staging environment
   - Deploy to production
   - Monitor for 30 minutes

5. **Post-Incident (Post-resolution)**
   - Document incident in runbook
   - Create improvement tickets
   - Schedule post-mortem meeting

#### Security Incident Procedure

1. **Immediate Response (0-5 minutes)**
   ```bash
   # Check for suspicious activity
   npm run security:audit
   
   # Review authentication logs
   railway logs --since 1h | grep "auth"
   
   # Check for data access anomalies
   npm run audit:data-access
   ```

2. **Containment (5-30 minutes)**
   - Block suspicious IP addresses
   - Force password reset for affected users
   - Enable additional monitoring
   - Notify security team

3. **Investigation (30+ minutes)**
   - Analyze breach scope
   - Review access logs
   - Check data integrity
   - Document findings

4. **Recovery (Post-investigation)**
   - Patch vulnerabilities
   - Reset compromised credentials
   - Implement additional security measures
   - Notify affected users

## Rollback Procedures

### How to Roll Back Changes

#### Application Rollback

```bash
# 1. Identify last good deployment
railway deployments list

# 2. Rollback to previous version
railway rollback <deployment-id>

# 3. Verify rollback
curl https://api.milassist.com/health

# 4. Monitor for 15 minutes
railway logs --follow
```

#### Database Rollback

```bash
# 1. Check migration history
npm run db:history

# 2. Rollback to specific migration
npm run db:rollback <migration-version>

# 3. Verify database integrity
npm run db:verify

# 4. Check data consistency
npm run db:check-consistency
```

#### Emergency Rollback (Critical Issues)

```bash
# 1. Immediate service stop
railway stop

# 2. Switch to maintenance mode
npm run maintenance:on

# 3. Restore from backup (if needed)
npm run backup:restore <backup-id>

# 4. Start previous version
npm run start:previous
```

## Maintenance Procedures

### Scheduled Maintenance

#### Database Maintenance

```bash
# 1. Put application in maintenance mode
npm run maintenance:on

# 2. Backup database
npm run backup:create

# 3. Run maintenance tasks
npm run db:vacuum
npm run db:analyze
npm run db:reindex

# 4. Update statistics
npm run db:update-stats

# 5. Take application out of maintenance mode
npm run maintenance:off
```

#### System Updates

```bash
# 1. Update dependencies
npm update

# 2. Run security audit
npm audit fix

# 3. Run tests
npm test

# 4. Deploy updates
npm run deploy
```

## Troubleshooting Guide

### Common Issues and Solutions

#### High Memory Usage

**Symptoms:**
- Slow response times
- Out of memory errors
- System crashes

**Solutions:**
```bash
# 1. Check memory usage
npm run memory:check

# 2. Identify memory leaks
npm run memory:profile

# 3. Restart services
docker-compose restart

# 4. Scale resources
railway scale memory=1024
```

#### Database Connection Issues

**Symptoms:**
- Database connection timeouts
- "Too many connections" errors
- Slow database queries

**Solutions:**
```bash
# 1. Check connection pool
npm run db:pool-status

# 2. Increase pool size
# Update DATABASE_POOL_SIZE in .env

# 3. Check slow queries
npm run db:slow-queries

# 4. Restart database
docker-compose restart postgres
```

#### External Service Failures

**Symptoms:**
- Twilio calls not working
- Google Flights API errors
- Stripe payment failures

**Solutions:**
```bash
# 1. Check service status
npm run external:status

# 2. Test connectivity
npm run test:external

# 3. Check API keys
npm run check:api-keys

# 4. Enable fallback mode
npm run fallback:on
```

## Performance Optimization

### How to Optimize System Performance

#### Database Optimization

```bash
# 1. Analyze query performance
npm run db:analyze-queries

# 2. Add missing indexes
npm run db:add-indexes

# 3. Optimize slow queries
npm run db:optimize-queries

# 4. Update statistics
npm run db:update-stats
```

#### Application Optimization

```bash
# 1. Profile application performance
npm run profile:app

# 2. Optimize bundle size
npm run optimize:bundle

# 3. Enable caching
npm run cache:warm

# 4. Optimize images
npm run optimize:images
```

## Backup and Recovery

### Data Backup Procedures

#### Automated Backups

```bash
# 1. Create database backup
npm run backup:create

# 2. Verify backup integrity
npm run backup:verify

# 3. Test backup restore
npm run backup:test-restore

# 4. Clean old backups
npm run backup:cleanup
```

#### Manual Backup

```bash
# 1. Export database
pg_dump milassist_prod > backup_$(date +%Y%m%d).sql

# 2. Backup files
tar -czf files_backup_$(date +%Y%m%d).tar.gz uploads/

# 3. Backup configuration
cp .env .env.backup.$(date +%Y%m%d)
```

### Disaster Recovery

#### Complete System Recovery

```bash
# 1. Provision new infrastructure
railway up

# 2. Restore database
npm run backup:restore <backup-id>

# 3. Restore files
npm run files:restore <backup-id>

# 4. Update DNS
npm run dns:update

# 5. Verify system
npm run health:check
```

## Security Operations

### Security Monitoring

```bash
# 1. Run security audit
npm run security:audit

# 2. Check for vulnerabilities
npm audit

# 3. Scan dependencies
npm run security:scan

# 4. Review access logs
npm run audit:access
```

### Security Updates

```bash
# 1. Update security patches
npm update

# 2. Apply security fixes
npm audit fix

# 3. Restart services
npm run restart

# 4. Verify security
npm run security:verify
```

## Contact Information

### Emergency Contacts

- **On-call Engineer**: +1-555-0123
- **System Administrator**: admin@milassist.com
- **Security Team**: security@milassist.com
- **DevOps Team**: devops@milassist.com

### Service Providers

- **Railway Support**: support@railway.app
- **Twilio Support**: support@twilio.com
- **Stripe Support**: support@stripe.com
- **Database Support**: dba@milassist.com

---

*Runbook Version: 1.0*
*Last Updated: 2026-01-11*
*Owner: Documentation & Runbook Agent*
