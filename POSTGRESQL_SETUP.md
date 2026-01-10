# PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for the MilAssist platform.

## Installation

### macOS
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Or using Postgres.app
# Download from https://postgresapp.com/
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

---

## Database Setup

### 1. Create Database and User

```bash
# Access PostgreSQL
sudo -u postgres psql

# Or on macOS with Homebrew
psql postgres
```

```sql
-- Create database
CREATE DATABASE milassist;

-- Create user
CREATE USER milassist_user WITH ENCRYPTED PASSWORD 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE milassist TO milassist_user;

-- Connect to database
\c milassist

-- Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO milassist_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO milassist_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO milassist_user;

-- Exit
\q
```

### 2. Configure Environment Variables

Update your `server/.env` file:

```env
# Database - PostgreSQL
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=milassist
DB_USER=milassist_user
DB_PASSWORD=your_secure_password
```

### 3. Install Dependencies

The PostgreSQL driver (`pg`) is already installed. If you need to reinstall:

```bash
cd server
npm install pg pg-hstore
```

---

## Migration from SQLite

### Option 1: Fresh Start (Recommended for Development)

1. Update `.env` to use PostgreSQL (see above)
2. Delete old SQLite database: `rm server/database.sqlite`
3. Restart server - Sequelize will auto-create tables
4. Re-seed data if needed

### Option 2: Data Migration (For Production)

If you have existing data in SQLite:

```bash
# Install migration tool
npm install -g pgloader

# Migrate data
pgloader database.sqlite postgresql://milassist_user:password@localhost/milassist
```

---

## Verification

### 1. Test Connection

```bash
cd server
node -e "require('dotenv').config(); const {sequelize} = require('./models/db'); sequelize.authenticate().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e));"
```

### 2. Check Tables

```bash
psql -U milassist_user -d milassist -c "\dt"
```

You should see all your tables listed.

### 3. Start the Server

```bash
npm run dev
```

Check the console for: `✅ Database connection established (postgres)`

---

## Production Deployment

### Cloud PostgreSQL Options

1. **AWS RDS PostgreSQL**
   - Managed service
   - Automatic backups
   - Easy scaling

2. **Heroku Postgres**
   - Free tier available
   - Simple setup
   - Good for small apps

3. **DigitalOcean Managed Databases**
   - Affordable
   - Easy to use
   - Good performance

4. **Supabase**
   - PostgreSQL + extras
   - Free tier
   - Built-in auth

### Connection String Format

For cloud databases, you might receive a connection string:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

Update `db.js` to support connection strings if needed.

---

## Backup & Restore

### Backup

```bash
# Full database backup
pg_dump -U milassist_user milassist > backup.sql

# Compressed backup
pg_dump -U milassist_user milassist | gzip > backup.sql.gz
```

### Restore

```bash
# From SQL file
psql -U milassist_user milassist < backup.sql

# From compressed file
gunzip -c backup.sql.gz | psql -U milassist_user milassist
```

---

## Troubleshooting

### Connection Refused

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # macOS

# Start if not running
sudo systemctl start postgresql  # Linux
brew services start postgresql@15  # macOS
```

### Authentication Failed

1. Check `pg_hba.conf` file
2. Ensure password is correct in `.env`
3. Try resetting password:

```sql
ALTER USER milassist_user WITH PASSWORD 'new_password';
```

### Permission Denied

```sql
-- Reconnect as postgres user and grant permissions
GRANT ALL PRIVILEGES ON DATABASE milassist TO milassist_user;
GRANT ALL ON SCHEMA public TO milassist_user;
```

---

## Performance Tips

1. **Indexes**: Sequelize creates indexes automatically, but you can add custom ones
2. **Connection Pooling**: Already configured in `db.js`
3. **Query Optimization**: Use `.findAll({ raw: true })` when you don't need model instances
4. **Monitoring**: Use `pg_stat_statements` extension for query analysis

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database and user
3. ✅ Update `.env` file
4. ✅ Test connection
5. ✅ Migrate data (if needed)
6. ✅ Start server and verify
7. 🚀 Deploy to production!
