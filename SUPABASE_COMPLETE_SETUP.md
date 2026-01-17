# Complete Supabase Setup Guide for MilAssist

## 🎯 Quick Answer: Can I Use Supabase API Keys?

**For Payload CMS Backend**: ❌ **NO** - You MUST use PostgreSQL connection string  
**For React Frontend**: ✅ **YES** - You SHOULD use Supabase API keys

See `SUPABASE_API_KEYS_EXPLAINED.md` for detailed explanation.

---

## 📋 What You Need from Supabase

### 1. PostgreSQL Connection String (Required for Payload)
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

**Where to find it:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (gear icon) → **Database**
4. Scroll to **"Connection string"** section
5. Select **"URI"** tab
6. Copy the string and replace `[YOUR-PASSWORD]` with your actual database password
7. **IMPORTANT**: Add `?sslmode=require` at the end

### 2. Supabase API Keys (Optional for Frontend)
```
Project URL: https://xxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find them:**
1. Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public** key (safe for frontend)
   - **service_role** key (keep secret, backend only)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign In"**
3. Click **"New Project"**
4. Fill in:
   - **Name**: `milassist`
   - **Database Password**: Generate strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for provisioning

### Step 2: Get PostgreSQL Connection String

1. In Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Select **"URI"** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password from Step 1
6. Add `?sslmode=require` at the end

**Example:**
```
Before: postgresql://postgres:[YOUR-PASSWORD]@db.abcdefg.supabase.co:5432/postgres
After:  postgresql://postgres:MySecurePass123@db.abcdefg.supabase.co:5432/postgres?sslmode=require
```

### Step 3: Configure Payload CMS

#### 3.1 Create `.env` file

```bash
cd /vercel/sandbox/payload
cp .env.example .env
nano .env
```

#### 3.2 Add your credentials

```env
# Supabase PostgreSQL Connection
DATABASE_URI=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require

# Generate secret with: openssl rand -base64 32
PAYLOAD_SECRET=your-generated-secret-here

# Server URL
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

#### 3.3 Generate Payload Secret

```bash
# Option 1: Using openssl
openssl rand -base64 32

# Option 2: Using npm script
npm run generate:secret

# Copy the output and paste it as PAYLOAD_SECRET in .env
```

### Step 4: Test Database Connection

```bash
cd /vercel/sandbox/payload

# Test connection
npm run test:db

# Expected output:
# ✅ Database connection successful!
# Connected to: db.xxxxx.supabase.co
# Database: postgres
```

### Step 5: Build and Start Payload

```bash
# Install dependencies (if not already done)
npm install

# Build the application
npm run build

# Start development server
npm run dev
```

**Expected output:**
```
✓ Connected to database
✓ Payload initialized
✓ Ready on http://localhost:3000
```

### Step 6: Create First Admin User

1. Open browser: `http://localhost:3000/admin`
2. You'll see **"Create First User"** screen
3. Fill in:
   - **Email**: your-email@example.com
   - **Password**: (choose secure password)
4. Click **"Create"**
5. You're now logged in as admin!

### Step 7: Verify Database Tables

1. Go to Supabase Dashboard
2. Click **"Table Editor"** in left sidebar
3. You should see Payload tables:
   - `users`
   - `payload_preferences`
   - `trips`
   - `documents`
   - `assessments`
   - And many more...

---

## 🌐 Deploy to Vercel

### Step 1: Configure Environment Variables in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **milassist** project
3. Navigate to **Settings** → **Environment Variables**
4. Add these three variables:

#### DATABASE_URI
- **Name**: `DATABASE_URI`
- **Value**: `postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### PAYLOAD_SECRET
- **Name**: `PAYLOAD_SECRET`
- **Value**: (generate with `openssl rand -base64 32`)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### PAYLOAD_PUBLIC_SERVER_URL
- **Name**: `PAYLOAD_PUBLIC_SERVER_URL`
- **Value**: `https://your-app.vercel.app` (your actual Vercel URL)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

### Step 2: Deploy

```bash
cd /vercel/sandbox
git add .
git commit -m "Configure Supabase PostgreSQL database"
git push origin main
```

Vercel will automatically deploy.

### Step 3: Verify Deployment

1. Check deployment logs in Vercel dashboard
2. Look for: `✓ Connected to database`
3. Access: `https://your-app.vercel.app/admin`
4. Create first admin user (if not already created)

---

## 🔧 Configuration Files Updated

### 1. `payload/src/payload.config.ts`
✅ Changed from SQLite to PostgreSQL adapter
```typescript
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI,
  },
}),
```

### 2. `payload/.env.example`
✅ Added Supabase connection template
✅ Added all required environment variables

### 3. `payload/package.json`
✅ Already has `@payloadcms/db-postgres` dependency
✅ Already has `pg` for PostgreSQL client
✅ Has utility scripts: `test:db`, `generate:secret`

---

## 🎨 Optional: Add Supabase Client for Frontend

If you want to use Supabase features in your React frontend (real-time, auth, storage):

### Install Supabase Client

```bash
cd /vercel/sandbox
npm install @supabase/supabase-js
```

### Create `.env` for Frontend

```bash
# Root .env (for React frontend)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Use in React Components

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

```typescript
// src/components/RealtimeChat.tsx
import { supabase } from '../lib/supabase'

// Subscribe to real-time changes
supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    console.log('New message:', payload.new)
  })
  .subscribe()
```

---

## 🐛 Troubleshooting

### Error: "Connection refused"
**Solution:**
1. Verify connection string is correct
2. Check Supabase project is active (not paused)
3. Ensure `?sslmode=require` is appended
4. Test with: `npm run test:db`

### Error: "Password authentication failed"
**Solution:**
1. Go to Supabase Dashboard → Settings → Database
2. Click **"Reset Database Password"**
3. Update `DATABASE_URI` in `.env` and Vercel
4. Restart application

### Error: "SSL connection required"
**Solution:**
Add `?sslmode=require` to the end of your `DATABASE_URI`:
```
postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?sslmode=require
```

### Error: "Module not found: @payloadcms/db-postgres"
**Solution:**
```bash
cd /vercel/sandbox/payload
npm install @payloadcms/db-postgres pg
npm run build
```

### Build succeeds but admin panel shows error
**Solution:**
1. Verify all environment variables are set
2. Check Vercel logs for database connection errors
3. Ensure `DATABASE_URI` is correct
4. Redeploy after fixing environment variables

---

## 📊 Database Management

### View Tables
Supabase Dashboard → **Table Editor**

### Run SQL Queries
Supabase Dashboard → **SQL Editor**

### Monitor Performance
Supabase Dashboard → **Database** → **Query Performance**

### Backups
Supabase Dashboard → **Database** → **Backups**
- Free tier: Daily backups (7-day retention)
- Pro tier: Point-in-time recovery

---

## 🔐 Security Checklist

- [ ] Use strong database password (16+ characters)
- [ ] Add `?sslmode=require` to connection string
- [ ] Never commit `.env` files to Git
- [ ] Use different `PAYLOAD_SECRET` for dev/prod
- [ ] Store credentials in password manager
- [ ] Enable Row Level Security (RLS) in Supabase for sensitive tables
- [ ] Rotate database password every 90 days
- [ ] Monitor database access logs
- [ ] Use Supabase API keys (not connection string) in frontend
- [ ] Keep `service_role` key secret (never expose in frontend)

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] PostgreSQL connection string obtained
- [ ] `?sslmode=require` added to connection string
- [ ] `.env` file created in `payload/` directory
- [ ] `DATABASE_URI` set in `.env`
- [ ] `PAYLOAD_SECRET` generated and set
- [ ] Database connection tested: `npm run test:db`
- [ ] Application builds successfully: `npm run build`
- [ ] Dev server starts: `npm run dev`
- [ ] Admin panel accessible: `http://localhost:3000/admin`
- [ ] First admin user created
- [ ] Tables visible in Supabase Table Editor
- [ ] Environment variables added to Vercel
- [ ] Deployed to Vercel successfully
- [ ] Production admin panel accessible

---

## 📚 Related Documentation

- `SUPABASE_API_KEYS_EXPLAINED.md` - API keys vs connection string
- `SUPABASE_SETUP.md` - Original setup guide
- `QUICK_START_SUPABASE.md` - 5-minute quick start
- `README_SUPABASE.md` - Full database documentation
- `ADMIN_LOGIN_GUIDE.md` - Admin user creation guide
- `VERCEL_ENV_SETUP.md` - Vercel environment variables

---

## 🎯 Summary

**What you need:**
1. ✅ PostgreSQL connection string from Supabase (for Payload CMS)
2. ✅ `PAYLOAD_SECRET` (generate with `openssl rand -base64 32`)
3. ✅ `PAYLOAD_PUBLIC_SERVER_URL` (your app URL)

**What you DON'T need:**
- ❌ Supabase API keys (for Payload CMS backend)
- ❌ Supabase anon key (for Payload CMS backend)

**Optional (for frontend features):**
- ⚠️ Supabase API keys (if using Supabase client SDK in React)

**Configuration updated:**
- ✅ `payload/src/payload.config.ts` - Now uses PostgreSQL adapter
- ✅ `payload/.env.example` - Template with Supabase connection
- ✅ Ready for local development and Vercel deployment

---

**Last Updated**: January 13, 2026  
**Status**: Complete setup guide  
**Database**: Supabase PostgreSQL  
**Deployment**: Vercel  
**Backend**: Payload CMS with PostgreSQL adapter
