# Vercel Deployment Guide - MilAssist Modern VA Platform

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - This repo connected to Vercel
3. **PostgreSQL Database** - Supabase, Neon, or Vercel Postgres
4. **AWS S3 Account** - For document storage and audit log archiving
5. **Stripe Account** - For payment processing
6. **AI API Keys** (Optional but recommended) - OpenAI or Anthropic

---

## Step 1: Database Setup

### Option A: Supabase (Recommended)
1. Create project at [supabase.com](https://supabase.com)
2. Copy the connection string from Settings → Database
3. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option B: Vercel Postgres
1. Go to Vercel Dashboard → Storage → Create Database
2. Select Postgres
3. Copy connection string

### Run Migrations
```bash
# Locally first (to test)
cd server
DATABASE_URL="your_postgres_url" npx sequelize-cli db:migrate

# Migrations will auto-run on Vercel deployment
```

---

## Step 2: Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

### Required Variables

#### Authentication & Security
```
JWT_SECRET=<generate-random-64-char-string>
JWT_EXPIRATION=24h
```

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Database
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

#### Stripe (Payment Processing)
```
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

Get from: [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)

#### AWS S3 (Document Storage)
```
S3_BUCKET_NAME=milassist-documents-prod
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=xxxxx

# Audit Log Archiving (SOC2 Compliance)
S3_AUDIT_ARCHIVE_BUCKET=milassist-audit-archive-prod
S3_AUDIT_ARCHIVE_REGION=us-east-1
```

Setup S3:
1. Create two S3 buckets (documents + audit)
2. Create IAM user with S3 full access to these buckets
3. Copy Access Key ID and Secret Access Key

### Optional But Recommended

#### AI Productivity Features
```
OPENAI_API_KEY=sk-xxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Get from:
- OpenAI: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Anthropic: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

#### Email/Calendar Sync (OAuth)
```
GMAIL_CLIENT_ID=xxxxx.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=xxxxx
OUTLOOK_CLIENT_ID=xxxxx
OUTLOOK_CLIENT_SECRET=xxxxx
```

Setup OAuth:
- Google: [console.cloud.google.com](https://console.cloud.google.com)
- Microsoft: [portal.azure.com](https://portal.azure.com)

#### Security Settings
```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MAX_LOGIN_ATTEMPTS=5
ACCOUNT_LOCK_DURATION=30
PASSWORD_MIN_LENGTH=12
ENABLE_ANOMALY_DETECTION=true
```

#### SOC2 Compliance
```
AUDIT_LOG_RETENTION_DAYS=2555
ENABLE_CRITICAL_ALERTS=true
```

---

## Step 3: Deploy to Vercel

### Via GitHub (Recommended)

1. **Connect Repository**
   ```
   Vercel Dashboard → New Project → Import Git Repository
   ```

2. **Configure Build**
   - Framework Preset: Next.js
   - Root Directory: `payload`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from Step 2
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for build

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts to link project
```

---

## Step 4: Post-Deployment Setup

### 1. Verify Deployment
```bash
curl https://your-app.vercel.app/health
# Should return: {"status":"ok","environment":"production"}
```

### 2. Test Database Connection
```bash
curl https://your-app.vercel.app/api/audit-logs/event-types
# Should return list of event types
```

### 3. Test AI Services
```bash
curl https://your-app.vercel.app/api/ai/status
# Should show available providers
```

### 4. Create Admin User

Option A: Via API
```bash
curl -X POST https://your-app.vercel.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

Option B: Directly in database
```sql
INSERT INTO "Users" (id, name, email, password_hash, role, "createdAt", "updatedAt")
VALUES (
  uuid_generate_v4(),
  'Admin User',
  'admin@yourdomain.com',
  '$2a$10$...',  -- bcrypt hash of your password
  'admin',
  NOW(),
  NOW()
);
```

### 5. Configure Stripe Webhooks

1. Go to [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Endpoint URL: `https://your-app.vercel.app/api/payments/webhook`
4. Events to listen:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
5. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

---

## Step 5: Configure Custom Domain (Optional)

1. **Add Domain in Vercel**
   ```
   Project Settings → Domains → Add Domain
   ```

2. **Update DNS Records**
   - Type: A
   - Name: @ (or subdomain)
   - Value: 76.76.21.21 (Vercel IP)

3. **Update CORS**
   - Update `ALLOWED_ORIGINS` env variable
   - Include your custom domain

---

## Step 6: Enable Production Features

### SOC2 Audit Logging
```bash
# Verify audit logs are working
curl https://your-app.vercel.app/api/audit-logs/stats

# Set up automated archiving (cron job via Vercel Cron)
# Add to vercel.json:
{
  "crons": [{
    "path": "/api/audit-logs/archive",
    "schedule": "0 0 * * *"
  }]
}
```

### VA Matching System
```bash
# Test matching algorithm
curl -X POST https://your-app.vercel.app/api/va-matching/find-matches \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "uuid",
    "requiredSkills": ["salesforce", "hubspot"],
    "budget": 50
  }'
```

### AI Productivity
```bash
# Test email drafting
curl -X POST https://your-app.vercel.app/api/ai/draft-email \
  -H "Content-Type: application/json" \
  -d '{
    "recipient": "client@example.com",
    "purpose": "schedule a meeting"
  }'
```

---

## Monitoring & Maintenance

### 1. Vercel Analytics
Enable in: Project Settings → Analytics

### 2. Error Tracking
- View logs: Vercel Dashboard → Deployments → [deployment] → Logs
- Real-time: `vercel logs --follow`

### 3. Database Monitoring
- Supabase: Dashboard → Database → Performance
- Check slow queries and optimize indexes

### 4. Audit Log Archiving
- Runs daily automatically
- Check S3 bucket for archived logs
- Retention: 7 years (SOC2 compliance)

### 5. Security Monitoring
```bash
# Check recent security incidents
curl https://your-app.vercel.app/api/audit-logs/security-incidents
```

---

## Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - Database migration failures
# - Node version mismatch

# Set Node version in package.json:
"engines": {
  "node": ">=18.0.0"
}
```

### Database Connection Issues
```bash
# Test connection locally
DATABASE_URL="your_url" node -e "const { Sequelize } = require('sequelize'); new Sequelize(process.env.DATABASE_URL).authenticate().then(() => console.log('OK')).catch(e => console.error(e))"

# Common fixes:
# - Enable SSL in connection string: ?ssl=true
# - Allow Vercel IPs in database firewall
# - Check connection string format
```

### AI Services Not Working
```bash
# Check API keys are set
curl https://your-app.vercel.app/api/ai/status

# Common issues:
# - API keys not in environment variables
# - API keys expired or invalid
# - Rate limits reached
```

---

## Rollback Procedure

If deployment has issues:

1. **Via Vercel Dashboard**
   ```
   Deployments → [previous working deployment] → Promote to Production
   ```

2. **Via CLI**
   ```bash
   vercel rollback
   ```

3. **Database Rollback**
   ```bash
   # Run down migration
   DATABASE_URL="your_url" npx sequelize-cli db:migrate:undo
   ```

---

## Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database migrated successfully
- [ ] S3 buckets created and accessible
- [ ] Stripe webhooks configured
- [ ] Admin user created
- [ ] Custom domain configured (if applicable)
- [ ] CORS origins updated
- [ ] SSL certificate active (auto via Vercel)
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test payment processing
- [ ] Test VA matching
- [ ] Test AI features
- [ ] Monitor error logs for 24 hours
- [ ] Set up automated backups (database)
- [ ] Configure monitoring/alerts
- [ ] Review security settings
- [ ] SOC2 audit logging verified

---

## Support & Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Stripe Docs**: [stripe.com/docs](https://stripe.com/docs)

---

## Cost Estimates

### Vercel
- **Hobby**: $0/month (limited)
- **Pro**: $20/month (recommended)
- **Enterprise**: Custom pricing

### Database (Supabase)
- **Free**: 500MB, 2 CPU hours
- **Pro**: $25/month, 8GB, unlimited CPU
- **Enterprise**: Custom

### AWS S3
- **Storage**: ~$0.023/GB/month
- **Requests**: ~$0.005/1000 requests
- Estimated: $5-20/month (depends on usage)

### AI Services
- **OpenAI**: Pay-as-you-go (~$0.002/1K tokens)
- **Anthropic**: Pay-as-you-go (~$0.008/1K tokens)
- Estimated: $20-100/month (depends on usage)

**Total Estimated Cost**: $70-165/month for production

---

**Deployment Status**: Ready for production deployment!
