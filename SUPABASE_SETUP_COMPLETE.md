# Supabase Setup Guide - MilAssist

**Supabase Project URL:** https://ygxifirhukwfxvqyvakq.supabase.co

## Quick Setup Steps

### 1. Install PostgreSQL Adapter

```bash
cd payload
npm install @payloadcms/db-postgres
```

### 2. Get Your Supabase Connection Details

From your Supabase dashboard (https://ygxifirhukwfxvqyvakq.supabase.co):

1. Go to **Settings** → **Database**
2. Find **Connection String** section
3. Copy the **Connection pooling** string (recommended for serverless)

The format will be:
```
postgresql://postgres.ygxifirhukwfxvqyvakq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 3. Update Environment Variables

Create or update `payload/.env`:

```env
# Supabase Database
DATABASE_URI=postgresql://postgres.ygxifirhukwfxvqyvakq:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Payload CMS
PAYLOAD_SECRET=your-secret-key-here

# AWS S3 (if using)
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=us-east-1

# Server
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
```

### 4. Update payload.config.ts

Replace the database adapter:

```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  // ... other config
  
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  
  // ... rest of config
})
```

### 5. Initialize Database

```bash
cd payload
npm run dev
```

Payload will automatically:
- Create all 27 collection tables
- Set up relationships
- Create indexes
- Initialize the schema

### 6. Create Admin User

```bash
cd payload
node scripts/create-admin.js
```

Or manually through the API:

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@milassist.com",
    "password": "your-secure-password",
    "role": "admin",
    "name": "Admin User"
  }'
```

### 7. Verify Setup

Test the connection:

```bash
# Test admin login
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@milassist.com","password":"your-password"}'

# Test collections
curl http://localhost:3001/api/users
curl http://localhost:3001/api/tasks
```

## Supabase Dashboard Access

**Project URL:** https://ygxifirhukwfxvqyvakq.supabase.co

### Useful Dashboard Sections:

1. **Table Editor** - View and edit data directly
2. **SQL Editor** - Run custom queries
3. **Database** → **Backups** - Manage backups
4. **Database** → **Roles** - Manage database users
5. **Auth** - If using Supabase Auth (optional)
6. **Storage** - Alternative to S3 (optional)

## Database Schema

After initialization, you'll have these tables in Supabase:

### Core Tables (6)
- `users` - User accounts and authentication
- `assistant_onboarding` - Training workflow
- `training_modules` - Training content
- `assessments` - Evaluation tests
- `live_chats` - Real-time chat sessions
- `on_call_assistants` - Scheduling

### Business Tables (11)
- `tasks` - Task management
- `messages` - Messaging system
- `invoices` - Billing
- `documents` - File management
- `trips` - Travel planning
- `time_entries` - Time tracking
- `meetings` - Video conferencing
- `form_templates` - Dynamic forms
- `service_requests` - Client requests
- `research` - Data research
- `media` - File uploads

### Integration Tables (10)
- `calls` - Twilio integration
- `routing_rules` - Call routing
- `privacy_requests` - GDPR/CCPA
- `email_connections` - Email OAuth
- `calendar_connections` - Calendar sync
- `task_handoffs` - Task handoff
- `integrations` - Third-party
- `video_integrations` - Video platforms
- `resources` - Knowledge base
- `pages` - CMS pages

### System Tables (Auto-created by Payload)
- `payload_preferences` - User preferences
- `payload_migrations` - Migration tracking
- `*_rels` - Relationship tables
- `*_versions` - Version history (if enabled)

## Performance Optimization

### Recommended Indexes

Payload creates basic indexes, but you may want to add custom ones:

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Task queries
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Message queries
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Time entries
CREATE INDEX idx_time_entries_user ON time_entries(user_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);
```

### Connection Pooling

Supabase provides connection pooling by default:
- **Transaction mode** (port 6543) - Recommended for serverless
- **Session mode** (port 5432) - For long-running connections

Use transaction mode for Vercel/serverless deployments.

## Backup Strategy

### Automatic Backups
Supabase provides automatic daily backups:
- **Free tier:** 7 days retention
- **Pro tier:** 30 days retention
- **Enterprise:** Custom retention

### Manual Backups

```bash
# Using pg_dump (requires PostgreSQL client)
pg_dump "postgresql://postgres.ygxifirhukwfxvqyvakq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" > backup.sql

# Restore
psql "postgresql://postgres.ygxifirhukwfxvqyvakq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" < backup.sql
```

## Monitoring

### Database Metrics
Monitor in Supabase dashboard:
- Connection count
- Query performance
- Database size
- Active queries

### Query Performance

```sql
-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## Security Best Practices

### 1. Row Level Security (RLS)
Supabase supports RLS for additional security:

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);
```

### 2. Database Roles
- Use service role key only in backend
- Never expose service role key in frontend
- Use anon key for public access (if needed)

### 3. Connection Security
- Always use SSL connections
- Rotate passwords regularly
- Use environment variables for credentials

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql "postgresql://postgres.ygxifirhukwfxvqyvakq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -c "SELECT version();"
```

### Common Errors

1. **"too many connections"**
   - Use connection pooling (port 6543)
   - Reduce max connections in config

2. **"SSL required"**
   - Add `?sslmode=require` to connection string

3. **"permission denied"**
   - Check database user permissions
   - Verify service role key is correct

### Migration Issues

If tables aren't created:
1. Check Payload logs for errors
2. Verify connection string is correct
3. Ensure database user has CREATE permissions
4. Check Supabase dashboard for error logs

## Production Deployment

### Vercel Environment Variables

Add to Vercel project settings:

```
DATABASE_URI=postgresql://postgres.ygxifirhukwfxvqyvakq:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
PAYLOAD_SECRET=your-production-secret
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_REGION=us-east-1
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.vercel.app
```

### Health Check Endpoint

Create `payload/src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  try {
    // Test database connection
    await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    return NextResponse.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'unhealthy',
      error: error.message 
    }, { status: 500 })
  }
}
```

## Next Steps

1. ✅ Install PostgreSQL adapter
2. ✅ Configure environment variables
3. ✅ Update payload.config.ts
4. ⏳ Run `npm run dev` to initialize database
5. ⏳ Create admin user
6. ⏳ Test all API endpoints
7. ⏳ Deploy to production
8. ⏳ Set up monitoring

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Payload CMS Docs:** https://payloadcms.com/docs
- **PostgreSQL Adapter:** https://payloadcms.com/docs/database/postgres
- **Your Project:** https://ygxifirhukwfxvqyvakq.supabase.co

---

**Project:** MilAssist  
**Database:** Supabase PostgreSQL  
**Collections:** 27 configured  
**Status:** Ready for initialization
