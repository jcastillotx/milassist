# MilAssist Scripts

Utility scripts for database management and deployment.

## migrate-production.sh

Automated script to migrate and seed your Supabase production database.

### Usage

```bash
./scripts/migrate-production.sh "postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres"
```

### What It Does

1. ✅ Tests database connection
2. ✅ Checks migration status
3. ✅ Runs all pending migrations
4. ✅ Creates test accounts (optional)
5. ✅ Verifies setup

### Get Your Connection String

1. Go to https://app.supabase.com
2. Select your project
3. **Settings** → **Database**
4. Under **Connection String**, select **URI**
5. Copy and replace `[YOUR-PASSWORD]` with actual password

### Example

```bash
# Navigate to project root
cd /Users/officedesktop/Documents/GitHub/milassist

# Run migration script
./scripts/migrate-production.sh "postgresql://postgres:mySecurePass123@db.abcdefghijklmnop.supabase.co:5432/postgres"
```

### Requirements

- Node.js 18+
- npm packages installed (`npm install` in server directory)
- Valid Supabase connection string

### Troubleshooting

If the script fails:

1. **Check connection string** - Ensure password is correct
2. **Check network** - Supabase must be accessible
3. **Check dependencies** - Run `cd server && npm install`

For detailed troubleshooting, see: `docs/PRODUCTION_DATABASE_SETUP.md`
