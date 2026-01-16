# Supabase Migration Guide

## Overview
This guide outlines the steps to migrate from SQLite to Supabase PostgreSQL database for the MilAssist Payload CMS project.

## Prerequisites
- Supabase project created and connected via Vercel
- Environment variables configured in Vercel:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Migration Steps

### 1. Install Supabase Database Adapter
```bash
cd payload
npm install @payloadcms/db-postgres
```

### 2. Update Database Configuration
Replace the SQLite adapter with Supabase PostgreSQL adapter in `payload/src/payload.config.ts`:

```typescript
// Remove this import:
import { sqliteAdapter } from '@payloadcms/db-sqlite'

// Add this import:
import { postgresAdapter } from '@payloadcms/db-postgres'

// Replace the db configuration:
db: postgresAdapter({
  pool: {
    connectionString: process.env.SUPABASE_CONNECTION_STRING || '',
  },
}),
```

### 3. Environment Variables Setup
Add these environment variables to your Vercel project:

```env
# Supabase Database Connection
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Construct the connection string from Supabase URL
SUPABASE_CONNECTION_STRING=postgresql://postgres:[SERVICE_ROLE_KEY]@[PROJECT_REF].supabase.co:5432/postgres
```

### 4. Update Package Dependencies
Ensure your `payload/package.json` includes the PostgreSQL adapter:

```json
{
  "dependencies": {
    "@payloadcms/db-postgres": "^1.0.0",
    // ... other dependencies
  }
}
```

### 5. Database Migration Process

#### Option A: Fresh Migration (Recommended for new projects)
1. Delete the existing SQLite database file: `rm payload.db`
2. Start the server: `npm run dev`
3. Payload will automatically create tables in Supabase

#### Option B: Data Migration (For existing data)
1. Export data from SQLite:
```bash
# Use a SQLite browser or command line to export data
sqlite3 payload.db .dump > backup.sql
```

2. Transform and import to Supabase:
```sql
-- Use Supabase SQL editor to run transformed queries
-- Note: Table schemas will be auto-created by Payload
```

### 6. Update Migration Scripts
Create a new migration script for Supabase:

```javascript
// payload/scripts/migrate-to-supabase.js
import payload from '../src/payload.config.js'

async function migrateToSupabase() {
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      // Supabase config will be used automatically
    })

    console.log('✅ Migration to Supabase completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateToSupabase()
```

### 7. Testing the Migration

#### Test Database Connection
```bash
cd payload
npm run dev
# Check console for successful Supabase connection
```

#### Test Admin Authentication
```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@milassist.com","password":"admin"}'
```

#### Test Collection APIs
```bash
# Test Users collection
curl http://localhost:3001/api/users

# Test other collections
curl http://localhost:3001/api/tasks
curl http://localhost:3001/api/messages
```

### 8. Production Deployment

#### Vercel Configuration
Update `vercel.json` or Vercel dashboard with:
- Environment variables for Supabase
- Build commands that include database migration

#### Environment Variables in Vercel
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_CONNECTION_STRING=postgresql://postgres:[SERVICE_ROLE_KEY]@[PROJECT_REF].supabase.co:5432/postgres
```

### 9. Rollback Plan
If migration fails:

1. **Immediate Rollback:**
   - Revert `payload.config.ts` to use SQLite adapter
   - Restore `payload.db` from backup
   - Restart server

2. **Data Recovery:**
   - Use Supabase backups if available
   - Re-import from SQLite backup if needed

### 10. Performance Considerations

#### Connection Pooling
Supabase handles connection pooling automatically, but monitor:
- Connection limits
- Query performance
- Database size limits

#### Indexing Strategy
Ensure proper indexes are created for:
- User authentication fields
- Foreign key relationships
- Frequently queried fields

### 11. Monitoring & Maintenance

#### Health Checks
```javascript
// Add to your monitoring
const { data, error } = await supabase
  .from('users')
  .select('count')
  .single()
```

#### Backup Strategy
- Supabase provides automatic backups
- Configure additional backup schedules if needed
- Test backup restoration regularly

## Troubleshooting

### Common Issues

1. **Connection String Format:**
   ```
   postgresql://postgres:[password]@[host]:5432/postgres
   ```

2. **SSL Requirements:**
   - Supabase requires SSL connections
   - Ensure connection string includes SSL parameters if needed

3. **Migration Timeouts:**
   - Large datasets may timeout
   - Consider batching migrations
   - Increase timeout settings if necessary

4. **Environment Variable Access:**
   - Ensure Vercel environment variables are properly scoped
   - Check variable names match exactly

## Migration Checklist

- [ ] Install @payloadcms/db-postgres
- [ ] Update payload.config.ts
- [ ] Set up Supabase environment variables
- [ ] Test database connection
- [ ] Run initial migration
- [ ] Test all collection APIs
- [ ] Verify admin authentication
- [ ] Test file uploads to S3
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] Set up backup monitoring

## Support

For issues with this migration:
1. Check Supabase dashboard for connection status
2. Review Payload CMS documentation for PostgreSQL adapter
3. Verify environment variables are correctly set
4. Check application logs for detailed error messages
