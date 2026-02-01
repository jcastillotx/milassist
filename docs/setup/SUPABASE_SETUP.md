# Supabase Database Setup for MilAssist

## 🎯 Overview

This guide will help you set up Supabase as the PostgreSQL database for your MilAssist Payload CMS application.

## 📋 Prerequisites

- Supabase account (free tier available at [supabase.com](https://supabase.com))
- Vercel account for deployment
- Git repository access

---

## 🚀 Step 1: Create Supabase Project

### 1.1 Sign Up / Log In
1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign In"**
3. Sign in with GitHub (recommended) or email

### 1.2 Create New Project
1. Click **"New Project"**
2. Fill in project details:
   - **Name**: `milassist` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Pricing Plan**: Free tier is sufficient for development

3. Click **"Create new project"**
4. Wait 2-3 minutes for project provisioning

---

## 🔗 Step 2: Get Database Connection String

### 2.1 Navigate to Database Settings
1. In your Supabase project dashboard
2. Click **"Settings"** (gear icon) in left sidebar
3. Click **"Database"**

### 2.2 Copy Connection String
1. Scroll to **"Connection string"** section
2. Select **"URI"** tab
3. Copy the connection string (looks like):

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### 2.3 Replace Password
Replace `[YOUR-PASSWORD]` with the database password you created in Step 1.2

**Example:**
```
postgresql://postgres:MySecurePass123!@db.abcdefghijklmnop.supabase.co:5432/postgres
```

### 2.4 Add SSL Mode (Important!)
Append `?sslmode=require` to the end:

```
postgresql://postgres:MySecurePass123!@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require
```

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 For Local Development

Create `.env` file in the `payload` directory:

```bash
cd /vercel/sandbox/payload
nano .env
```

Add these variables:

```env
# Supabase Database Connection
DATABASE_URI=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require

# Payload CMS Secret (generate with: openssl rand -base64 32)
PAYLOAD_SECRET=your-generated-secret-here

# Server URL (for local development)
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 3.2 For Vercel Deployment

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **milassist** project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

#### DATABASE_URI
- **Name**: `DATABASE_URI`
- **Value**: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### PAYLOAD_SECRET
- **Name**: `PAYLOAD_SECRET`
- **Value**: Generate with `openssl rand -base64 32`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

#### PAYLOAD_PUBLIC_SERVER_URL
- **Name**: `PAYLOAD_PUBLIC_SERVER_URL`
- **Value**: `https://your-app.vercel.app` (your actual Vercel URL)
- **Environments**: ✅ Production, ✅ Preview, ✅ Development

---

## 🗄️ Step 4: Initialize Database Schema

Payload CMS will automatically create the necessary tables on first run. However, you can verify the connection first.

### 4.1 Test Connection Locally

```bash
cd /vercel/sandbox/payload

# Install dependencies if not already installed
npm install

# Build the application
npm run build

# Start development server
npm run dev
```

### 4.2 Verify Database Connection

The server should start without errors. Check the logs for:
```
✓ Connected to database
✓ Payload initialized
```

### 4.3 Access Admin Panel

1. Open browser: `http://localhost:3000/admin`
2. You'll see **"Create First User"** screen
3. Fill in:
   - **Email**: your-email@example.com
   - **Password**: (secure password)
4. Click **"Create"**

Payload will automatically create all necessary database tables and collections.

---

## 📊 Step 5: Verify Database Tables in Supabase

### 5.1 Check Tables
1. Go to Supabase Dashboard
2. Click **"Table Editor"** in left sidebar
3. You should see Payload tables:
   - `payload_preferences`
   - `users`
   - `trips`
   - `documents`
   - `assessments`
   - `chat_sessions`
   - `chat_messages`
   - And more...

### 5.2 View Data
- Click on any table to view data
- Your admin user should appear in the `users` table

---

## 🔒 Security Best Practices

### 1. Database Password
- ✅ Use strong, unique password (min 16 characters)
- ✅ Store securely (password manager)
- ❌ Never commit to Git
- ❌ Never share publicly

### 2. Connection String
- ✅ Always use `?sslmode=require`
- ✅ Store in environment variables only
- ❌ Never hardcode in source code
- ❌ Never commit `.env` files

### 3. Supabase Security
- ✅ Enable Row Level Security (RLS) for sensitive tables
- ✅ Use Supabase API keys for frontend (not database password)
- ✅ Regularly rotate database password
- ✅ Monitor database usage in Supabase dashboard

### 4. Payload Secret
- ✅ Generate cryptographically secure secret
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate every 90 days
- ❌ Never reuse across projects

---

## 🚀 Step 6: Deploy to Vercel

### 6.1 Ensure Environment Variables Are Set
Verify in Vercel Dashboard → Settings → Environment Variables:
- ✅ `DATABASE_URI` (with Supabase connection string)
- ✅ `PAYLOAD_SECRET`
- ✅ `PAYLOAD_PUBLIC_SERVER_URL`

### 6.2 Trigger Deployment
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Configure Supabase database"
   git push origin main
   ```

2. Vercel will automatically deploy

### 6.3 Verify Deployment
1. Check deployment logs in Vercel dashboard
2. Look for successful build and database connection
3. Access: `https://your-app.vercel.app/admin`
4. Create first admin user (if not already created)

---

## 🐛 Troubleshooting

### Error: "Connection refused"
**Cause**: Incorrect connection string or network issue

**Solution**:
1. Verify connection string is correct
2. Check Supabase project is active (not paused)
3. Ensure `?sslmode=require` is appended
4. Test connection with `psql`:
   ```bash
   psql "postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"
   ```

### Error: "Password authentication failed"
**Cause**: Incorrect database password

**Solution**:
1. Go to Supabase Dashboard → Settings → Database
2. Click **"Reset Database Password"**
3. Update `DATABASE_URI` with new password
4. Restart application

### Error: "SSL connection required"
**Cause**: Missing `?sslmode=require` in connection string

**Solution**:
Add `?sslmode=require` to the end of your `DATABASE_URI`:
```
postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?sslmode=require
```

### Error: "Too many connections"
**Cause**: Free tier connection limit reached (60 connections)

**Solution**:
1. Check for connection leaks in code
2. Implement connection pooling
3. Upgrade to Supabase Pro plan
4. Use Supabase connection pooler:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:6543/postgres?sslmode=require
   ```
   (Note: Port 6543 for pooler, not 5432)

### Error: "Database does not exist"
**Cause**: Incorrect database name in connection string

**Solution**:
Ensure connection string ends with `/postgres` (default database name):
```
postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres?sslmode=require
```

### Deployment succeeds but admin panel shows error
**Cause**: Environment variables not set in Vercel

**Solution**:
1. Verify all environment variables in Vercel Dashboard
2. Ensure they're enabled for Production, Preview, and Development
3. Redeploy after adding variables

---

## 📈 Monitoring & Maintenance

### Database Usage
1. Supabase Dashboard → **"Database"** → **"Usage"**
2. Monitor:
   - Database size (500 MB free tier limit)
   - Active connections
   - Query performance

### Backups
1. Supabase Dashboard → **"Database"** → **"Backups"**
2. Free tier: Daily backups (7-day retention)
3. Pro tier: Point-in-time recovery

### Performance
1. Supabase Dashboard → **"Database"** → **"Query Performance"**
2. Identify slow queries
3. Add indexes if needed

---

## 🎓 Additional Resources

### Supabase Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Database Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

### Payload CMS Documentation
- [Payload Database Configuration](https://payloadcms.com/docs/configuration/overview#database)
- [Payload Environment Variables](https://payloadcms.com/docs/configuration/environment-vars)

### PostgreSQL Resources
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [PostgreSQL SSL Modes](https://www.postgresql.org/docs/current/libpq-ssl.html)

---

## ✅ Quick Reference Checklist

- [ ] Create Supabase account and project
- [ ] Copy database connection string
- [ ] Add `?sslmode=require` to connection string
- [ ] Generate `PAYLOAD_SECRET` with `openssl rand -base64 32`
- [ ] Create local `.env` file with `DATABASE_URI` and `PAYLOAD_SECRET`
- [ ] Test local connection: `npm run dev`
- [ ] Create first admin user at `http://localhost:3000/admin`
- [ ] Verify tables created in Supabase Table Editor
- [ ] Add environment variables to Vercel Dashboard
- [ ] Push code and deploy to Vercel
- [ ] Test production deployment at `https://your-app.vercel.app/admin`
- [ ] Set up monitoring and backups in Supabase

---

## 🎯 Connection String Template

```bash
# Format
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require

# Example
postgresql://postgres:MySecurePass123!@db.abcdefghijklmnop.supabase.co:5432/postgres?sslmode=require

# With Connection Pooler (for high traffic)
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?sslmode=require
```

---

## 📞 Support

- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Payload CMS Discord**: [payloadcms.com/community](https://payloadcms.com/community)
- **GitHub Issues**: [github.com/jcastillotx/milassist/issues](https://github.com/jcastillotx/milassist/issues)

---

**Last Updated**: January 13, 2026  
**Status**: Ready for Supabase integration  
**Database**: PostgreSQL via Supabase  
**Deployment**: Vercel
