# PostgreSQL Quick Start Guide

## 🚀 5-Minute Setup

### 1. Install PostgreSQL

```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Databases

```bash
psql postgres
```
```sql
CREATE DATABASE milassist_dev;
CREATE DATABASE milassist_test;
\q
```

### 3. Install Dependencies

```bash
cd server
npm install
```

### 4. Run Migrations

```bash
npx sequelize-cli db:migrate
```

### 5. Start Development

```bash
npm run dev
```

---

## 🔧 Essential Commands

### PostgreSQL Service
```bash
# Start
brew services start postgresql@14

# Stop
brew services stop postgresql@14

# Restart
brew services restart postgresql@14

# Status
brew services list
```

### Database Operations
```bash
# Connect to database
psql milassist_dev

# List databases
psql postgres -c "\l"

# List tables
psql milassist_dev -c "\dt"

# Drop database (careful!)
psql postgres -c "DROP DATABASE milassist_dev;"
```

### Migrations
```bash
# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Check migration status
npx sequelize-cli db:migrate:status

# Create new migration
npx sequelize-cli migration:generate --name add-new-feature
```

---

## 🌍 Environment Variables

### Development (Default)
```bash
# No configuration needed - uses defaults:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/milassist_dev
```

### Custom Configuration
```bash
# Create .env in /server directory
DATABASE_URL=postgresql://user:password@localhost:5432/milassist_dev
```

### Production (Vercel)
```bash
# Set in Vercel dashboard
DATABASE_URL=postgresql://user:password@db.project.supabase.co:5432/postgres

# Or use Vercel Postgres (automatic)
POSTGRES_URL=<provided-by-vercel>
```

---

## 🧪 Testing

```bash
# Run tests with test database
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- path/to/test.js
```

---

## 🔍 Quick Checks

### Is PostgreSQL Running?
```bash
brew services list | grep postgresql
# Should show: postgresql@14 started
```

### Can I Connect?
```bash
psql postgres -c "SELECT version();"
# Should show PostgreSQL version
```

### Are Tables Created?
```bash
psql milassist_dev -c "\dt"
# Should list all tables
```

### Is Server Working?
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","database":"connected",...}
```

---

## ⚠️ Common Issues

### "psql: command not found"
```bash
# Add to PATH (macOS)
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "database does not exist"
```bash
psql postgres -c "CREATE DATABASE milassist_dev;"
```

### "connection refused"
```bash
brew services start postgresql@14
```

### "MODULE_NOT_FOUND: pg"
```bash
cd server
npm install pg pg-hstore
```

---

## 📚 Useful Queries

### Check User Count
```sql
SELECT COUNT(*) FROM "Users";
```

### View Recent Audit Logs
```sql
SELECT * FROM "AuditLogs" ORDER BY "createdAt" DESC LIMIT 10;
```

### Find Active Tasks
```sql
SELECT * FROM "Tasks" WHERE status = 'in-progress';
```

### Check Migration History
```sql
SELECT * FROM "SequelizeMeta" ORDER BY name;
```

---

## 🔐 Production Deployment

### Deploy to Vercel
```bash
vercel --prod
```

### Run Production Migrations
```bash
DATABASE_URL="your-production-url" npx sequelize-cli db:migrate --env production
```

### Verify Deployment
```bash
curl https://milassist.vercel.app/api/health
```

---

## 📖 Documentation

- **Full Migration Guide**: `/docs/DATABASE_MIGRATION.md`
- **Deployment Checklist**: `/docs/POSTGRESQL_DEPLOYMENT_CHECKLIST.md`
- **Vercel Guide**: `/VERCEL_DEPLOYMENT.md`

---

## 🆘 Need Help?

1. Check `/docs/DATABASE_MIGRATION.md` for detailed troubleshooting
2. Review PostgreSQL logs: `tail -f /opt/homebrew/var/log/postgresql@14.log`
3. Check Vercel function logs: `vercel logs`
4. Verify environment variables: `vercel env ls`

---

**Quick Reference Updated**: February 1, 2026
