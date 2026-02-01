# Production Database Setup Guide
## Migrating and Seeding Supabase Database for Vercel Deployment

This guide explains how to run migrations and seed test accounts on your production Supabase database.

---

## 📋 Prerequisites

- ✅ Vercel project deployed and connected to GitHub
- ✅ Supabase project created at https://supabase.com
- ✅ `POSTGRES_URL` or `DATABASE_URL` configured in Vercel environment variables

---

## 🎯 Quick Start (3 Methods)

### Method 1: From Your Local Machine (RECOMMENDED)

This is the easiest and most reliable method.

#### Step 1: Get Your Supabase Connection String

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **Database**
4. Under **Connection String**, select **URI** (not Transaction or Session)
5. Copy the connection string (format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
6. Replace `[YOUR-PASSWORD]` with your actual database password

**Example:**
```
postgresql://postgres:your-password-here@db.abcdefghijklmnop.supabase.co:5432/postgres
```

#### Step 2: Run Migrations from Your Local Machine

```bash
# Navigate to your project
cd /Users/officedesktop/Documents/GitHub/milassist/server

# Set the DATABASE_URL temporarily for this command
export DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT-REF.supabase.co:5432/postgres"

# Run migrations
npx sequelize-cli db:migrate --env production

# You should see output like:
# Sequelize CLI [Node: 18.x.x, CLI: 6.x.x, ORM: 6.x.x]
# Loaded configuration file "config/database.json"
# Using environment "production"
# == 20260131000000-create-initial-schema: migrating =======
# == 20260131000000-create-initial-schema: migrated (2.345s)
```

#### Step 3: Seed Test Accounts

```bash
# Still in the server directory with DATABASE_URL set
npx sequelize-cli db:seed --seed 20260201000000-test-accounts.js

# You should see:
# Test accounts seeder started...
# ✓ Created 9 user accounts
# ✓ Created 3 client profiles
# ✓ Created 5 VA profiles
# ✓ Test accounts created successfully!
```

#### Step 4: Verify

```bash
# Test the health endpoint
curl https://your-app.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-02-01T..."
}
```

---

### Method 2: Using Vercel CLI

If you prefer to run migrations through Vercel's environment:

#### Step 1: Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

#### Step 2: Link to Your Vercel Project

```bash
cd /Users/officedesktop/Documents/GitHub/milassist
vercel link
# Follow prompts to select your project
```

#### Step 3: Pull Environment Variables

```bash
vercel env pull .env.production.local
```

This creates a `.env.production.local` file with your Vercel environment variables including `POSTGRES_URL`.

#### Step 4: Run Migrations Using Vercel's Environment

```bash
cd server

# Load environment and run migrations
source ../.env.production.local
npx sequelize-cli db:migrate --env production

# Seed test accounts
npx sequelize-cli db:seed --seed 20260201000000-test-accounts.js
```

---

### Method 3: Using Supabase SQL Editor (Manual)

If you prefer a GUI approach:

#### Step 1: Export Migration SQL

```bash
cd server
npx sequelize-cli db:migrate:status

# Note which migrations haven't run
# Generate SQL manually or export from local database
```

#### Step 2: Run SQL in Supabase

1. Go to https://app.supabase.com
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Create a new query
5. Paste your migration SQL
6. Click **Run**

**Note:** This method is more manual and not recommended for complex migrations.

---

## 🔍 Troubleshooting

### Problem: "Connection refused" or "timeout"

**Solution:** Check Supabase connection string is correct and includes password.

```bash
# Test connection with psql
psql "postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT-REF.supabase.co:5432/postgres"

# If this connects, your connection string is correct
```

### Problem: "relation already exists"

**Solution:** Migrations have already been run. Check status:

```bash
npx sequelize-cli db:migrate:status --env production
```

If migrations show as "up", they're already applied. Skip to seeding.

### Problem: "SSL connection required"

**Solution:** Your `database.json` should already have SSL configured for production:

```json
{
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
```

This was already configured in Week 1 fixes.

### Problem: "DATABASE_URL is not set"

**Solution:** Make sure you've exported the environment variable:

```bash
export DATABASE_URL="postgresql://postgres:..."

# Verify it's set
echo $DATABASE_URL
```

### Problem: Seeder fails with "duplicate key error"

**Solution:** Test accounts already exist. To recreate:

```bash
# Undo the seeder first
npx sequelize-cli db:seed:undo --seed 20260201000000-test-accounts.js

# Then run it again
npx sequelize-cli db:seed --seed 20260201000000-test-accounts.js
```

---

## 🎯 One-Line Commands (Copy & Paste)

Replace `YOUR-CONNECTION-STRING` with your actual Supabase connection string:

### Run Migrations:
```bash
cd server && DATABASE_URL="YOUR-CONNECTION-STRING" npx sequelize-cli db:migrate --env production
```

### Seed Test Accounts:
```bash
cd server && DATABASE_URL="YOUR-CONNECTION-STRING" npx sequelize-cli db:seed --seed 20260201000000-test-accounts.js
```

### Check Migration Status:
```bash
cd server && DATABASE_URL="YOUR-CONNECTION-STRING" npx sequelize-cli db:migrate:status --env production
```

---

## 📊 Expected Migration Output

When migrations run successfully, you should see:

```
Sequelize CLI [Node: 18.x.x, CLI: 6.x.x, ORM: 6.x.x]

Loaded configuration file "config/database.json".
Using environment "production".

== 20260131000000-create-initial-schema: migrating =======
== 20260131000000-create-initial-schema: migrated (2.345s)

Migrations complete!
```

When seeding runs successfully:

```
Test accounts seeder started...

Hashing passwords...
Creating users...
Creating client profiles...
Creating VA profiles...

✓ Created 9 user accounts
✓ Created 3 client profiles
✓ Created 5 VA profiles

Test accounts created successfully!

Admin: admin@milassist.com / Admin123!Test
Clients: client1-3@example.com / Client123!
VAs: va1-5@milassist.com / Assistant123!
```

---

## 🔐 Security Best Practices

1. **Never commit `.env.production.local`** - It's in `.gitignore` for security
2. **Use strong Supabase passwords** - Generate with `openssl rand -base64 32`
3. **Rotate credentials regularly** - Supabase allows password resets
4. **Enable 2FA on Supabase** - Protect your database dashboard
5. **Use Supabase's connection pooler** - For better performance (already configured in our setup)

---

## ✅ Verification Checklist

After running migrations and seeders:

- [ ] Health endpoint returns `"database": "connected"`
- [ ] Can login with admin@milassist.com / Admin123!Test
- [ ] Can login with client1@example.com / Client123!
- [ ] Can login with va1@milassist.com / Assistant123!
- [ ] Admin dashboard loads without errors
- [ ] Client dashboard loads without errors
- [ ] Assistant dashboard loads without errors
- [ ] Database has all 32 tables created
- [ ] Test accounts visible in Supabase Table Editor

---

## 📚 Related Documentation

- **Database Migration Guide:** `docs/DATABASE_MIGRATION.md`
- **Test Accounts Reference:** `docs/TEST_ACCOUNTS.md`
- **Vercel Deployment Guide:** `VERCEL_DEPLOYMENT.md`
- **PostgreSQL Quick Start:** `docs/QUICK_START_POSTGRESQL.md`

---

## 🆘 Still Having Issues?

### Check Vercel Logs
```bash
vercel logs --follow
```

### Check Database Tables in Supabase
1. Go to https://app.supabase.com
2. Select your project
3. Click **Table Editor**
4. You should see all 32 tables (Users, Tasks, Forms, etc.)

### Test Database Connection Directly
```bash
psql "postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT-REF.supabase.co:5432/postgres" -c "SELECT version();"
```

If this returns PostgreSQL version info, your connection works.

---

## 📝 Quick Reference

| Command | Purpose |
|---------|---------|
| `db:migrate` | Run all pending migrations |
| `db:migrate:status` | Check which migrations have run |
| `db:migrate:undo` | Rollback last migration |
| `db:seed` | Run a specific seeder |
| `db:seed:all` | Run all seeders |
| `db:seed:undo` | Undo a specific seeder |

**Environment Flag:** Always use `--env production` when working with production database!

---

**Last Updated:** February 1, 2026
**Compatibility:** Sequelize CLI 6.x, PostgreSQL 14+, Supabase
