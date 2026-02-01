# Supabase API Keys vs PostgreSQL Connection String

## ❓ Can I Use Supabase API Keys Instead of Connection String?

### Short Answer
**For Payload CMS Backend**: ❌ **NO** - You must use the PostgreSQL connection string  
**For Frontend/Client Operations**: ✅ **YES** - You can use Supabase API keys

---

## 🔍 Understanding the Difference

### 1. PostgreSQL Connection String (Backend)
**What it is:**
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

**Used by:**
- Payload CMS database adapter
- Server-side database operations
- Direct PostgreSQL protocol connections
- ORM tools (Sequelize, Prisma, TypeORM)

**Why Payload needs it:**
- Payload CMS uses `@payloadcms/db-postgres` adapter
- This adapter connects directly to PostgreSQL using the native protocol
- It needs full database access to create tables, run migrations, and manage schema
- Cannot work through REST API

### 2. Supabase API Keys (Frontend)
**What they are:**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Used by:**
- Frontend applications (React, Vue, Angular)
- Client-side Supabase SDK (`@supabase/supabase-js`)
- REST API calls to Supabase
- Real-time subscriptions
- Authentication
- Storage operations

**Why they're different:**
- API keys use Supabase's REST API layer
- They provide Row Level Security (RLS)
- They're safe to expose in frontend code (anon key)
- They don't provide direct PostgreSQL access

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   Payload CMS    │         │  React Frontend  │         │
│  │    (Backend)     │         │   (Client-side)  │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                             │                    │
│           │ PostgreSQL                  │ REST API           │
│           │ Connection String           │ + API Keys         │
│           │                             │                    │
└───────────┼─────────────────────────────┼────────────────────┘
            │                             │
            ▼                             ▼
┌───────────────────────────────────────────────────────────┐
│                    Supabase Cloud                          │
├───────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐         ┌──────────────────┐       │
│  │   PostgreSQL     │◄────────┤   REST API       │       │
│  │    Database      │         │   (with RLS)     │       │
│  │   (Port 5432)    │         │                  │       │
│  └──────────────────┘         └──────────────────┘       │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

---

## ✅ Correct Setup for Your Project

### For Payload CMS (Backend)

**File: `/vercel/sandbox/payload/.env`**
```env
# PostgreSQL Connection String (REQUIRED)
DATABASE_URI=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require

# Payload Secret
PAYLOAD_SECRET=your-generated-secret

# Server URL
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

**File: `/vercel/sandbox/payload/src/payload.config.ts`**
```typescript
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  // ... rest of config
})
```

### For Frontend (Client-side)

**File: `/vercel/sandbox/.env` (React frontend)**
```env
# Supabase API Configuration (for client-side operations)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service role key (NEVER expose in frontend!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Usage in React:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Now you can use Supabase features
const { data, error } = await supabase
  .from('your_table')
  .select('*')
```

---

## 🔐 Where to Find Supabase Credentials

### PostgreSQL Connection String
1. Supabase Dashboard → **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Select **"URI"** tab
4. Copy and replace `[YOUR-PASSWORD]`
5. Add `?sslmode=require` at the end

### API Keys
1. Supabase Dashboard → **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: Safe for frontend
   - **service_role**: Secret, backend only

---

## 🎯 When to Use Each

| Use Case | Use Connection String | Use API Keys |
|----------|----------------------|--------------|
| Payload CMS database | ✅ Required | ❌ Won't work |
| Server-side queries | ✅ Recommended | ⚠️ Possible but not ideal |
| React/Vue frontend | ❌ Security risk | ✅ Required |
| Authentication | ❌ No | ✅ Yes |
| Real-time subscriptions | ❌ No | ✅ Yes |
| File storage | ❌ No | ✅ Yes |
| Direct SQL queries | ✅ Yes | ❌ Limited |
| Database migrations | ✅ Required | ❌ Won't work |

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Using API keys for Payload
```typescript
// THIS WON'T WORK!
export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.SUPABASE_URL, // ❌ Wrong!
    },
  }),
})
```

### ✅ Correct:
```typescript
export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI, // ✅ Correct!
    },
  }),
})
```

### ❌ Mistake 2: Exposing connection string in frontend
```typescript
// THIS IS A SECURITY RISK!
const connectionString = "postgresql://postgres:password@..." // ❌ Never!
```

### ✅ Correct:
```typescript
// Use API keys in frontend
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

## 📦 Required Dependencies

### For Payload CMS (Backend)
```bash
cd /vercel/sandbox/payload
npm install @payloadcms/db-postgres pg
```

### For Frontend (Client-side)
```bash
cd /vercel/sandbox
npm install @supabase/supabase-js
```

---

## 🔄 Migration Path

If you want to use Supabase API keys for **additional features** (not replacing Payload's database connection):

### Step 1: Keep PostgreSQL connection for Payload
```env
# payload/.env
DATABASE_URI=postgresql://postgres:...
```

### Step 2: Add Supabase client for frontend features
```env
# .env (root)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Step 3: Use both in your application
```typescript
// Backend: Payload uses PostgreSQL connection
// Frontend: React uses Supabase client

// Example: Real-time chat with Supabase
const supabase = createClient(...)
supabase
  .channel('chat')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'messages' 
  }, (payload) => {
    console.log('New message:', payload)
  })
  .subscribe()
```

---

## 🎓 Summary

| Component | Credentials Needed | Why |
|-----------|-------------------|-----|
| **Payload CMS** | PostgreSQL connection string | Direct database access required |
| **React Frontend** | Supabase API keys | REST API, auth, real-time, storage |
| **Server API** | PostgreSQL connection string | Direct queries, migrations |
| **Mobile App** | Supabase API keys | Client-side SDK |

**Bottom Line:**
- **Backend (Payload)**: Must use PostgreSQL connection string
- **Frontend (React)**: Should use Supabase API keys
- **Both can coexist**: Use connection string for Payload, API keys for client features

---

## 📞 Next Steps

1. ✅ Use PostgreSQL connection string for Payload CMS
2. ✅ Get API keys from Supabase dashboard
3. ✅ Configure frontend to use Supabase client SDK
4. ✅ Keep connection string secret (never commit to Git)
5. ✅ Use API keys for real-time, auth, and storage features

**Need help?** See:
- `SUPABASE_SETUP.md` - Complete PostgreSQL setup guide
- `QUICK_START_SUPABASE.md` - 5-minute quick start
- `README_SUPABASE.md` - Full documentation

---

**Last Updated**: January 13, 2026  
**Status**: Clarification document  
**Recommendation**: Use PostgreSQL connection string for Payload, API keys for frontend
