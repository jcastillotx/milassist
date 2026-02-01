# PostgreSQL Deployment Checklist

## ✅ Pre-Deployment Verification

### Code Changes Complete
- [x] **`/server/models/db.js`**: PostgreSQL configuration only, SQLite removed
- [x] **`/server/package.json`**: `sqlite3` dependency removed
- [x] **`/server/config/database.json`**: All environments configured for PostgreSQL
- [x] **`/api/server.js`**: DATABASE_URL validation added
- [x] **`/VERCEL_DEPLOYMENT.md`**: Documentation updated

### Environment Variables
- [x] **Vercel Production**: Has `POSTGRES_URL` or `DATABASE_URL`
- [ ] **Local Development**: PostgreSQL installed and running
- [ ] **Local Development**: Databases created (`milassist_dev`, `milassist_test`)

---

## 🚀 Deployment Steps

### 1. Local Development Setup

#### Install PostgreSQL
```bash
# macOS
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Databases
```bash
psql postgres <<EOF
CREATE DATABASE milassist_dev;
CREATE DATABASE milassist_test;
\q
EOF
```

#### Install Dependencies
```bash
cd /Users/officedesktop/Documents/GitHub/milassist/server
npm install
```

#### Run Migrations
```bash
cd /Users/officedesktop/Documents/GitHub/milassist/server
npx sequelize-cli db:migrate
```

#### Test Local Connection
```bash
# Start dev server
npm run dev

# Check health endpoint
curl http://localhost:3000/api/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "environment": "development",
  "database": "connected",
  "timestamp": "2026-02-01T..."
}
```

### 2. Vercel Production Deployment

#### Verify Environment Variables
```bash
# Check Vercel environment variables
vercel env ls

# Should show:
# DATABASE_URL or POSTGRES_URL (production)
```

#### Deploy to Vercel
```bash
cd /Users/officedesktop/Documents/GitHub/milassist
vercel --prod
```

#### Run Production Migrations
```bash
# Get production DATABASE_URL from Vercel dashboard
# Or use Vercel Postgres POSTGRES_URL

# Run migrations against production database
DATABASE_URL="postgresql://user:pass@host:5432/db" \
  npx sequelize-cli db:migrate --env production
```

#### Verify Production Deployment
```bash
# Check health endpoint
curl https://milassist.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-02-01T..."
}
```

#### Test API Endpoints
```bash
# Test authentication
curl -X POST https://milassist.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test health
curl https://milassist.vercel.app/api/health

# Test protected route (with JWT token)
curl https://milassist.vercel.app/api/users/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 🔍 Verification Checklist

### Local Development
- [ ] PostgreSQL service running: `brew services list`
- [ ] Databases created: `psql postgres -c "\l"`
- [ ] Migrations run successfully: `npx sequelize-cli db:migrate:status`
- [ ] Dev server starts: `npm run dev`
- [ ] Health endpoint responds: `curl http://localhost:3000/api/health`
- [ ] Can create test user via API
- [ ] Can authenticate and get JWT token

### Vercel Production
- [ ] Deployment successful (green checkmark in Vercel dashboard)
- [ ] Environment variable `DATABASE_URL` or `POSTGRES_URL` set
- [ ] Build logs show no errors
- [ ] Function logs show "Database connection established"
- [ ] Health endpoint returns 200 OK
- [ ] Database connection confirmed in health response
- [ ] No CORS errors in browser console
- [ ] API routes respond correctly

### Database
- [ ] Production migrations applied successfully
- [ ] Tables created in production database
- [ ] Connection pooling working (check database connections)
- [ ] SSL/TLS enabled for production connections
- [ ] No "connection refused" errors in logs

---

## 📊 Database Connection Verification

### Check Local PostgreSQL
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Connect to database
psql milassist_dev

# List tables
\dt

# Check Users table
SELECT COUNT(*) FROM "Users";

# Exit
\q
```

### Check Production Database (Supabase)
```bash
# Using Supabase connection string
psql "postgresql://postgres:password@db.project.supabase.co:5432/postgres"

# List tables
\dt

# Check migrations
SELECT * FROM "SequelizeMeta";

# Exit
\q
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'pg'"
```bash
cd server
npm install pg pg-hstore
```

### Issue: "database 'milassist_dev' does not exist"
```bash
psql postgres -c "CREATE DATABASE milassist_dev;"
psql postgres -c "CREATE DATABASE milassist_test;"
```

### Issue: "Connection refused"
```bash
# Start PostgreSQL
brew services start postgresql@14

# Check status
brew services list
```

### Issue: "ECONNREFUSED" in Vercel logs
```bash
# Check DATABASE_URL is set correctly in Vercel
vercel env ls

# Verify connection string format
# Should be: postgresql://user:password@host:5432/database
```

### Issue: "SSL required"
```bash
# Already handled in db.js for production
# If still seeing error, check dialectOptions in db.js:
dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
}
```

### Issue: Migration fails with "relation already exists"
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# If needed, undo and re-run
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

---

## 📝 Post-Deployment Tasks

### Required
- [ ] Run migrations in production
- [ ] Create admin user (if needed)
- [ ] Test all critical API endpoints
- [ ] Verify authentication flow
- [ ] Check error handling

### Recommended
- [ ] Set up database backups (Supabase: Settings → Backups)
- [ ] Configure monitoring (Vercel Analytics)
- [ ] Set up error tracking (optional: Sentry)
- [ ] Document production DATABASE_URL location
- [ ] Add database connection alerts
- [ ] Review connection pool settings under load
- [ ] Create database indexes for frequently queried columns

### Optional
- [ ] Set up read replicas (for high traffic)
- [ ] Configure database connection limits
- [ ] Set up query performance monitoring
- [ ] Create database maintenance schedule
- [ ] Document backup/restore procedures

---

## 🔐 Security Checklist

- [x] SSL/TLS enabled for production database connections
- [ ] Database credentials stored as environment variables (not in code)
- [ ] Connection string not logged or exposed
- [ ] Database user has minimum required permissions
- [ ] Regular backups configured
- [ ] Database access restricted by IP (if applicable)
- [ ] Audit logging enabled
- [ ] Regular security updates scheduled

---

## 📈 Performance Optimization

### Connection Pooling
```javascript
// Already configured in db.js
pool: {
    max: 10,      // Adjust based on Vercel plan
    min: 2,
    acquire: 30000,
    idle: 10000
}
```

### Recommended Indexes
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON "Users"(email);
CREATE INDEX idx_tasks_client_id ON "Tasks"("clientId");
CREATE INDEX idx_tasks_assistant_id ON "Tasks"("assistantId");
CREATE INDEX idx_audit_logs_user_id ON "AuditLogs"("userId");
CREATE INDEX idx_audit_logs_timestamp ON "AuditLogs"("createdAt");
```

### Query Optimization Tips
- Use `.findOne()` instead of `.findAll()` when expecting single result
- Use pagination for large result sets
- Include only needed columns with `attributes: ['id', 'name']`
- Use eager loading to avoid N+1 queries
- Cache frequently accessed data (consider Redis for production)

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## ✅ Final Sign-Off

### Pre-Production Checklist
- [x] All code changes committed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Rollback plan documented

### Production Ready
- [ ] Deployed to Vercel
- [ ] Migrations applied
- [ ] Health check passing
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Performance acceptable

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Production URL**: https://milassist.vercel.app
**Database**: PostgreSQL (Supabase/Vercel Postgres)
**Status**: ⏳ Pending Production Deployment

---

*Update this checklist as you complete each step*
