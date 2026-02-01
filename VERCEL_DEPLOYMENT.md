# Vercel Deployment Guide - MilAssist v2.0.0

## 📋 Overview

MilAssist is now configured for **full-stack deployment on Vercel** with:
- **Frontend**: React + Vite (builds to `/dist`)
- **Backend**: Express.js as serverless functions (in `/api`)
- **Database**: Supabase PostgreSQL

## 🚀 Quick Deploy

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jcastillotx/milassist)

### Manual Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## ⚙️ Required Environment Variables

Configure these in **Vercel Project Settings → Environment Variables**:

### Database (Supabase)
```bash
DATABASE_URL=postgresql://user:password@host.supabase.co:5432/postgres
```

### Authentication
```bash
JWT_SECRET=your-secure-random-string-min-32-characters
```

### Stripe Payments
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### AWS S3 Storage
```bash
S3_BUCKET_NAME=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

### OAuth (Optional)
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### Twilio (Optional)
```bash
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Frontend Environment Variables
```bash
VITE_API_URL=/api
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_DOCUMENTS=true
VITE_ENABLE_EMAIL_INTEGRATION=true
VITE_ENABLE_VIDEO_INTEGRATION=true
VITE_ENABLE_CALENDAR_INTEGRATION=true
VITE_ENABLE_TRAVEL=true
```

## 📁 Project Structure

```
milassist/
├── api/
│   └── server.js          # Serverless function wrapper
├── server/                # Express.js backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   └── services/         # Business logic
├── src/                  # React frontend
│   ├── pages/
│   ├── components/
│   └── config/
├── dist/                 # Build output (auto-generated)
├── vercel.json          # Vercel configuration
├── .env.production      # Production environment template
└── package.json         # Root dependencies
```

## 🔧 How It Works

### Frontend (Vite + React)
1. Vite builds React app to `/dist`
2. Vercel serves static files from `/dist`
3. SPA routing handled with fallback to `index.html`

### Backend (Express.js → Serverless)
1. `/api/server.js` wraps Express app
2. All routes prefixed with `/api/*`
3. Database initialized on first request (connection pooling)
4. Each request handled independently (stateless)

### Routing
```
/               → Frontend (index.html)
/login          → Frontend (SPA routing)
/api/auth       → Backend serverless function
/api/tasks      → Backend serverless function
/api/health     → Backend health check
```

## 🗄️ Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Copy connection string from Settings → Database

2. **Run Migrations**
   ```bash
   cd server
   npx sequelize-cli db:migrate
   ```

3. **Connection String Format**
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

## 📦 Deployment Process

### Automatic (GitHub Integration)
1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Environment variables from Vercel dashboard

### Manual CLI Deployment
```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

### Build Commands
Vercel will run:
```bash
# Install dependencies
npm install && cd server && npm install

# Build frontend
npm run build

# API functions automatically deployed from /api directory
```

## ✅ Post-Deployment Checklist

### 1. Verify Deployment
```bash
# Check health endpoint
curl https://your-domain.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-01-31T..."
}
```

### 2. Test Frontend
- Visit https://your-domain.vercel.app
- Try logging in with test credentials
- Verify API calls work

### 3. Database Verification
- Run migrations if needed
- Create admin user
- Test database connections

### 4. Configure Domain (Optional)
1. Go to Vercel Project Settings → Domains
2. Add custom domain
3. Update DNS records
4. Wait for SSL certificate

## 🐛 Troubleshooting

### Build Failures

**Issue**: "Module not found"
```bash
# Solution: Ensure all dependencies in both package.json files
npm install
cd server && npm install
```

**Issue**: "Build exceeded time limit"
```bash
# Solution: Optimize build in vercel.json
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max_old_space_size=4096"
    }
  }
}
```

### Runtime Errors

**Issue**: "Database connection failed"
- Check `DATABASE_URL` environment variable
- Verify Supabase IP whitelist (should allow 0.0.0.0/0 for Vercel)
- Test connection string locally

**Issue**: "CORS errors"
- Update `ALLOWED_ORIGINS` in Vercel environment variables
- Include your Vercel domain: `https://your-app.vercel.app`

**Issue**: "Function timeout"
- Vercel serverless functions timeout after 10s (Hobby) or 60s (Pro)
- Optimize long-running operations
- Consider background jobs for heavy tasks

### API Endpoints Not Working

**Issue**: 404 on `/api/` routes
```bash
# Check vercel.json rewrites configuration
# Verify /api/server.js exists and exports app
```

**Issue**: 500 errors on API calls
```bash
# Check Vercel function logs:
vercel logs [deployment-url]
```

## 📊 Performance Optimization

### Frontend
- Static assets cached automatically by Vercel CDN
- Vite builds optimized production bundle
- Code splitting enabled by default

### Backend
- Serverless functions scale automatically
- Database connection pooling configured
- Response compression enabled

### Database (Supabase)
- Connection pooling with max 10 connections
- Query optimization with indexes
- Read replicas for scaling (Pro plan)

## 💰 Cost Estimation

### Vercel
- **Hobby**: Free (includes SSL, CDN, analytics)
- **Pro**: $20/month (includes:
  - Unlimited team members
  - Advanced analytics
  - 60s function timeout
  - More bandwidth)

### Supabase
- **Free Tier**: $0 (includes:
  - 500MB database
  - 1GB file storage
  - 50,000 monthly active users)
- **Pro**: $25/month (includes:
  - 8GB database
  - 100GB file storage
  - 100,000 monthly active users)

### AWS S3
- **Storage**: ~$0.023/GB/month
- **Requests**: ~$0.0004/1000 requests
- **Estimate**: $5-10/month for moderate usage

**Total Estimated Cost**: $25-55/month

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use Vercel's environment variable encryption
- ✅ Rotate secrets regularly
- ✅ Use different keys for staging/production

### Database
- ✅ Use SSL connections (Supabase enforces this)
- ✅ Enable row-level security (RLS)
- ✅ Regular backups (Supabase Pro includes daily)
- ✅ Monitor query performance

### API Security
- ✅ JWT authentication on all protected routes
- ✅ Rate limiting configured
- ✅ CORS properly configured
- ✅ Input validation on all endpoints

## 📖 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Vite Production Guide](https://vitejs.dev/guide/build.html)

## 🆘 Support

If you encounter issues:
1. Check Vercel function logs: `vercel logs`
2. Review build logs in Vercel dashboard
3. Test locally with `vercel dev`
4. Check GitHub Issues for known problems

---

**Version**: 2.0.0
**Last Updated**: January 31, 2026
**Deployment**: Vercel + Supabase
