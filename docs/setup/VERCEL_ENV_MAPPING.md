# Vercel Environment Variables Mapping

## ✅ Already Configured (You Have These)

### Database (Postgres/Supabase)
| Your Variable | App Uses As | Purpose |
|--------------|-------------|---------|
| `POSTGRES_URL` | `DATABASE_URL` | Sequelize database connection |
| `POSTGRES_URL_NON_POOLING` | - | Direct connection (not needed) |
| `POSTGRES_PRISMA_URL` | - | Prisma connection (not needed) |
| `POSTGRES_HOST` | - | Individual component (not needed) |
| `POSTGRES_USER` | - | Individual component (not needed) |
| `POSTGRES_PASSWORD` | - | Individual component (not needed) |
| `POSTGRES_DATABASE` | - | Individual component (not needed) |

**✅ Action**: None needed - `POSTGRES_URL` automatically maps to `DATABASE_URL`

### Authentication
| Your Variable | App Uses As | Purpose |
|--------------|-------------|---------|
| `SUPABASE_JWT_SECRET` | `JWT_SECRET` | JWT token signing |
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE_SERVICE_ROLE_KEY` | Admin operations |

**✅ Action**: None needed - already correctly named

### Frontend (Supabase)
| Your Variable | Purpose |
|--------------|---------|
| `VITE_PUBLIC_SUPABASE_URL` | Supabase API URL for frontend |
| `VITE_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key for frontend |
| `VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key for frontend |

**✅ Action**: None needed - frontend will use these automatically

---

## ❌ Missing Variables (You Need to Add These)

### Stripe Payment Processing
Add these in **Vercel Project Settings → Environment Variables**:

```bash
STRIPE_SECRET_KEY=sk_live_...  # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Where to get**:
1. Go to https://dashboard.stripe.com/apikeys
2. Copy "Secret key" → `STRIPE_SECRET_KEY`
3. Go to https://dashboard.stripe.com/webhooks
4. Create webhook pointing to `https://your-domain.vercel.app/api/payments/webhook`
5. Copy "Signing secret" → `STRIPE_WEBHOOK_SECRET`

### AWS S3 File Storage
Add these in **Vercel Project Settings → Environment Variables**:

```bash
S3_BUCKET_NAME=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=AKIA...
S3_SECRET_ACCESS_KEY=...
```

**Where to get**:
1. Go to https://console.aws.amazon.com/s3/
2. Create bucket → Copy name to `S3_BUCKET_NAME`
3. Note region → Copy to `S3_REGION`
4. Go to https://console.aws.amazon.com/iam/
5. Create user with S3 access
6. Generate access keys → Copy to `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY`

### Optional: OAuth Providers
Only add if you want Google/Microsoft login:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret
```

### Optional: Twilio SMS/Voice
Only add if you want SMS/voice features:

```bash
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🔧 Current vercel.json Configuration

Your `vercel.json` automatically maps your existing variables:

```json
{
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "$POSTGRES_URL",                    // ✅ You have this
    "JWT_SECRET": "$SUPABASE_JWT_SECRET",               // ✅ You have this
    "SUPABASE_URL": "$SUPABASE_URL",                    // ✅ You have this
    "SUPABASE_SERVICE_ROLE_KEY": "$SUPABASE_SERVICE_ROLE_KEY",  // ✅ You have this

    "STRIPE_SECRET_KEY": "$STRIPE_SECRET_KEY",          // ❌ Need to add
    "STRIPE_WEBHOOK_SECRET": "$STRIPE_WEBHOOK_SECRET",  // ❌ Need to add
    "S3_BUCKET_NAME": "$S3_BUCKET_NAME",                // ❌ Need to add
    "S3_REGION": "$S3_REGION",                          // ❌ Need to add
    "S3_ACCESS_KEY_ID": "$S3_ACCESS_KEY_ID",            // ❌ Need to add
    "S3_SECRET_ACCESS_KEY": "$S3_SECRET_ACCESS_KEY",    // ❌ Need to add

    "ALLOWED_ORIGINS": "https://milassist.vercel.app,https://www.milassist.com",
    "FRONTEND_URL": "https://milassist.vercel.app",
    "APP_URL": "https://milassist.vercel.app"
  }
}
```

---

## 🚀 Deployment Checklist

### Minimum Required (Database + Auth Working)
- [x] `POSTGRES_URL` - ✅ You have this
- [x] `SUPABASE_JWT_SECRET` - ✅ You have this
- [x] `SUPABASE_URL` - ✅ You have this
- [x] `SUPABASE_SERVICE_ROLE_KEY` - ✅ You have this
- [x] All `VITE_PUBLIC_SUPABASE_*` variables - ✅ You have these

**You can deploy NOW with just database and auth working!**

### Add Later for Full Features
- [ ] Stripe keys (for payment processing)
- [ ] S3 credentials (for file uploads)
- [ ] OAuth credentials (for Google/Microsoft login)
- [ ] Twilio credentials (for SMS/voice features)

---

## 📝 How to Add Missing Variables

### In Vercel Dashboard:
1. Go to your project: https://vercel.com/dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - **Name**: `STRIPE_SECRET_KEY`
   - **Value**: `sk_live_...` or `sk_test_...`
   - **Environment**: Production, Preview, Development
4. Click "Save"
5. Redeploy to apply new variables

### Via Vercel CLI:
```bash
vercel env add STRIPE_SECRET_KEY production
# Paste your key when prompted

vercel env add S3_BUCKET_NAME production
# Enter your bucket name
```

---

## 🔍 Verify Configuration

After deployment, check which features work:

```bash
# Test database connection
curl https://your-domain.vercel.app/api/health

# Response should show:
{
  "status": "ok",
  "database": "connected",  // ✅ If you see this, database works!
  "timestamp": "..."
}
```

### What Works NOW:
- ✅ Database (Postgres/Supabase)
- ✅ Authentication (JWT)
- ✅ User management
- ✅ Tasks, forms, resources
- ✅ All features NOT requiring Stripe/S3

### What Needs Stripe/S3:
- ❌ Payment processing (needs Stripe)
- ❌ Document uploads (needs S3)
- ❌ Invoice generation with attachments (needs S3)

---

## 🎯 Recommended Deployment Strategy

### Phase 1: Deploy with Database Only (NOW)
```bash
# You already have all required variables
vercel --prod

# Test:
# - User registration/login ✅
# - Task management ✅
# - Forms/pages ✅
# - Time tracking ✅
```

### Phase 2: Add Stripe (When Ready for Payments)
```bash
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel --prod

# Test:
# - Create invoices ✅
# - Process payments ✅
# - Subscription billing ✅
```

### Phase 3: Add S3 (When Ready for File Uploads)
```bash
vercel env add S3_BUCKET_NAME production
vercel env add S3_REGION production
vercel env add S3_ACCESS_KEY_ID production
vercel env add S3_SECRET_ACCESS_KEY production
vercel --prod

# Test:
# - Document uploads ✅
# - Profile pictures ✅
# - Invoice attachments ✅
```

---

## Summary

**✅ Ready to deploy**: You have all database and authentication variables
**❌ Add later**: Stripe (payments) and S3 (file storage) when you're ready to enable those features

The app will deploy and work with current features - you can add Stripe/S3 incrementally!
