so Production Deployment Guide - MilAssist on Vercel + Supabase

## 🚀 Deployment Status

**Platform:** Vercel  
**Database:** Supabase PostgreSQL (https://ygxifirhukwfxvqyvakq.supabase.co)  
**Repository:** GitHub (auto-deploy enabled)

---

## ✅ Pre-Deployment Checklist

### 1. Environment Variables (Vercel)

Ensure these are set in your Vercel project settings:

```env
# Database
DATABASE_URI=postgresql://postgres.ygxifirhukwfxvqyvakq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Payload CMS
PAYLOAD_SECRET=[GENERATE_SECURE_SECRET]
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.vercel.app

# AWS S3
S3_BUCKET=[YOUR_BUCKET_NAME]
S3_ACCESS_KEY_ID=[YOUR_ACCESS_KEY]
S3_SECRET_ACCESS_KEY=[YOUR_SECRET_KEY]
S3_REGION=us-east-1

# OAuth (if using)
GOOGLE_CLIENT_ID=[YOUR_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_CLIENT_SECRET]
MICROSOFT_CLIENT_ID=[YOUR_CLIENT_ID]
MICROSOFT_CLIENT_SECRET=[YOUR_CLIENT_SECRET]
```

### 2. Security Configuration

**CRITICAL:** Before first deployment:

1. **Generate Secure Payload Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Remove Test Credentials**
   - Delete `payload/scripts/create-test-users.js` (contains hardcoded passwords)
   - Remove any test credentials from documentation

3. **Update CORS Settings**
   - Verify `payload/src/payload.config.ts` has correct production URLs
   - Remove localhost URLs from production

### 3. Database Setup

**Supabase Configuration:**

1. Get connection string from Supabase dashboard
2. Use **Connection Pooling** (port 6543) for serverless
3. Enable SSL mode
4. Set up automatic backups

---

## 📦 Deployment Steps

### Step 1: Install PostgreSQL Adapter

```bash
cd payload
npm install @payloadcms/db-postgres
```

### Step 2: Update Database Configuration

Edit `payload/src/payload.config.ts`:

```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  // ... other config
  
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  
  // ... rest of config
})
```

### Step 3: Commit and Push

```bash
git add .
git commit -m "feat: configure Supabase PostgreSQL for production"
git push origin main
```

Vercel will automatically deploy.

### Step 4: Initialize Database

After first deployment:

1. Visit your Vercel deployment URL
2. Go to `/admin`
3. Create your first admin user (secure password!)
4. Payload will automatically create all 27 collection tables in Supabase

---

## 👥 User Management (Production)

### Creating Admin User (First Time)

1. Visit: `https://your-domain.vercel.app/admin`
2. Click "Create your first user"
3. Use a **strong password** (min 12 characters, mixed case, numbers, symbols)
4. Save credentials securely (use password manager)

### Creating Additional Users

**Via Admin Panel:**
1. Login as admin
2. Navigate to Users collection
3. Create users with appropriate roles:
   - `admin` - Full system access
   - `assistant` - Task management and client support
   - `client` - Personal data and services

**Security Best Practices:**
- ✅ Use unique, strong passwords for each user
- ✅ Enable 2FA (implement in future sprint)
- ✅ Regularly audit user access
- ✅ Remove inactive users
- ✅ Use password expiration policies

---

## 🔒 Security Hardening

### 1. Environment Variables

**Never commit these to Git:**
- Database passwords
- API keys
- OAuth secrets
- Payload secret

**Use Vercel's environment variable management:**
- Production variables
- Preview variables (for testing)
- Development variables (local only)

### 2. CORS Configuration

Update `payload/src/payload.config.ts`:

```typescript
cors: [
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
  // Add your frontend domains
  'https://your-frontend-domain.com',
].filter(Boolean),

csrf: [
  process.env.PAYLOAD_PUBLIC_SERVER_URL,
  'https://your-frontend-domain.com',
].filter(Boolean),
```

### 3. Rate Limiting

Add to `payload/src/payload.config.ts`:

```typescript
rateLimit: {
  max: 100, // requests
  window: 15 * 60 * 1000, // 15 minutes
},
```

### 4. Database Security

**Supabase Settings:**
- Enable Row Level Security (RLS)
- Use service role key only in backend
- Never expose service role key in frontend
- Enable automatic backups
- Set up monitoring alerts

---

## 📊 Monitoring & Maintenance

### Health Checks

Create `payload/src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  try {
    await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    return NextResponse.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'unhealthy',
      error: 'Database connection failed'
    }, { status: 500 })
  }
}
```

### Monitoring Checklist

- [ ] Set up Vercel monitoring
- [ ] Configure Supabase alerts
- [ ] Monitor database size
- [ ] Track API response times
- [ ] Set up error tracking (Sentry)
- [ ] Monitor S3 usage
- [ ] Review access logs weekly

---

## 🔄 Backup Strategy

### Automatic Backups (Supabase)

- **Frequency:** Daily
- **Retention:** 7 days (free tier) / 30 days (pro tier)
- **Location:** Supabase managed

### Manual Backups

```bash
# Export database
pg_dump "postgresql://postgres.ygxifirhukwfxvqyvakq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" > backup-$(date +%Y%m%d).sql

# Restore if needed
psql "postgresql://postgres.ygxifirhukwfxvqyvakq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" < backup-20240113.sql
```

### S3 Backups

- Configure S3 versioning
- Set up lifecycle policies
- Enable cross-region replication (optional)

---

## 🚨 Incident Response

### Database Connection Issues

1. Check Supabase dashboard status
2. Verify environment variables in Vercel
3. Check connection string format
4. Review Supabase connection limits

### Deployment Failures

1. Check Vercel build logs
2. Verify all dependencies installed
3. Check TypeScript compilation
4. Review environment variables

### Data Loss Prevention

1. Verify automatic backups running
2. Test backup restoration monthly
3. Keep local development database separate
4. Use staging environment for testing

---

## 📈 Performance Optimization

### Database Indexes

Monitor slow queries in Supabase and add indexes:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Task queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Message queries
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
```

### Caching Strategy

- Use Vercel Edge caching for static assets
- Implement Redis for session management (future)
- Cache frequently accessed data
- Set appropriate cache headers

### CDN Configuration

- Enable Vercel CDN
- Configure S3 CloudFront (optional)
- Optimize image delivery
- Use lazy loading

---

## 🔐 Compliance & Privacy

### GDPR Compliance

- Implement data export functionality
- Add data deletion workflows
- Maintain audit logs
- Update privacy policy

### Data Retention

- Define retention policies per collection
- Implement automatic data purging
- Archive old records
- Comply with legal requirements

---

## 📝 Post-Deployment Tasks

### Immediate (First 24 Hours)

- [ ] Verify deployment successful
- [ ] Create admin user with strong password
- [ ] Test database connection
- [ ] Verify S3 file uploads work
- [ ] Test authentication flow
- [ ] Check all 27 collections accessible
- [ ] Review error logs

### First Week

- [ ] Create assistant and client test users
- [ ] Test all dashboards
- [ ] Verify access controls
- [ ] Test API endpoints
- [ ] Monitor performance metrics
- [ ] Review security logs
- [ ] Set up monitoring alerts

### Ongoing

- [ ] Weekly security audits
- [ ] Monthly backup tests
- [ ] Quarterly dependency updates
- [ ] Regular performance reviews
- [ ] User access audits
- [ ] Database optimization

---

## 🆘 Support & Resources

### Documentation

- **Payload CMS:** https://payloadcms.com/docs
- **Supabase:** https://supabase.com/docs
- **Vercel:** https://vercel.com/docs
- **Project Docs:** See `/docs` directory

### Emergency Contacts

- Database issues: Supabase support
- Deployment issues: Vercel support
- Application issues: Development team

### Useful Commands

```bash
# View Vercel logs
vercel logs [deployment-url]

# Check database connection
psql [DATABASE_URI] -c "SELECT version();"

# Test health endpoint
curl https://your-domain.vercel.app/api/health
```

---

## ✅ Production Readiness Checklist

### Security
- [ ] All environment variables set in Vercel
- [ ] Secure passwords for all users
- [ ] CORS configured for production domains
- [ ] Rate limiting enabled
- [ ] SSL/TLS enabled (automatic with Vercel)
- [ ] No test credentials in code

### Database
- [ ] Supabase PostgreSQL connected
- [ ] All 27 collections created
- [ ] Indexes optimized
- [ ] Backups configured
- [ ] Connection pooling enabled

### Monitoring
- [ ] Health check endpoint working
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Alerts set up

### Testing
- [ ] Admin dashboard tested
- [ ] Assistant dashboard tested
- [ ] Client dashboard tested
- [ ] API endpoints verified
- [ ] File uploads working
- [ ] Authentication flow tested

---

**Deployment Date:** [To be filled]  
**Deployed By:** [To be filled]  
**Production URL:** https://your-domain.vercel.app  
**Admin Panel:** https://your-domain.vercel.app/admin

**Status:** ✅ Ready for Production Deployment
