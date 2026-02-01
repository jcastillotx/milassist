# MilAssist Migration Quick Start Guide

**Ready to migrate to Payload CMS 3.0?** Follow these steps to get started.

---

## 🚀 Prerequisites

Before starting, ensure you have:

- [ ] **Node.js 18+** installed
- [ ] **npm** or **yarn** installed
- [ ] **Git** installed
- [ ] **Supabase account** (free tier is fine)
- [ ] **Vercel account** (free tier is fine)
- [ ] **2 weeks** of dedicated development time

---

## 📋 Step-by-Step Guide

### Step 1: Review Documentation (30 minutes)

Read these documents in order:

1. **MIGRATION_PLAN.md** - Complete migration strategy
2. **IMPLEMENTATION_CHECKLIST.md** - Detailed task list
3. **docs/ADR/0002-payload-cms-migration.md** - Architecture decisions

### Step 2: Make Key Decisions (1 hour)

Answer these questions:

#### Architecture Decisions
- [ ] **Monorepo or separate repos?**
  - ✅ Recommended: Monorepo (simpler)
  - Alternative: Separate repos (more complex)

- [ ] **Storage solution?**
  - ✅ Recommended: Vercel Blob Storage
  - Alternative: Supabase Storage

- [ ] **Real-time features?**
  - ✅ Recommended: Start with polling
  - Alternative: Supabase Realtime (add later)

- [ ] **Migration strategy?**
  - ✅ Recommended: Big bang (switch all at once)
  - Alternative: Gradual (run both systems)

### Step 3: Set Up Supabase (15 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name:** milassist-production
   - **Database Password:** (generate strong password)
   - **Region:** (closest to your users)
5. Wait for project to be created (~2 minutes)
6. Go to **Settings** → **Database**
7. Copy **Connection String** (URI format)
8. Save it securely (you'll need it later)

Example connection string:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Step 4: Initialize Payload Project (30 minutes)

```bash
# Navigate to your project
cd /Users/jlaptop/Documents/GitHub/milassist

# Create payload directory
mkdir payload
cd payload

# Initialize Payload project
npx create-payload-app@latest . --template blank

# Install additional dependencies
npm install @payloadcms/db-postgres
npm install @payloadcms/richtext-lexical
npm install @payloadcms/plugin-cloud-storage
npm install grapesjs grapesjs-preset-webpage
npm install twilio stripe axios

# Install dev dependencies
npm install --save-dev @types/grapesjs
```

### Step 5: Configure Payload (15 minutes)

Create `.env` file in `payload/` directory:

```env
# Payload
PAYLOAD_SECRET=your-super-secret-key-change-this-min-32-characters
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Database (from Supabase)
DATABASE_URI=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT
JWT_SECRET=your-jwt-secret-key-change-this

# Development
NODE_ENV=development
```

Update `payload/src/payload.config.ts`:

```typescript
import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  
  editor: lexicalEditor({}),
  
  collections: [
    // We'll add collections here
  ],
  
  typescript: {
    outputFile: './payload-types.ts',
  },
})
```

### Step 6: Test Basic Setup (10 minutes)

```bash
# Start Payload dev server
cd payload
npm run dev
```

Open browser to `http://localhost:3000/admin`

You should see:
- Payload admin login screen
- No errors in terminal
- Database connection successful

### Step 7: Create First Collection (30 minutes)

Create `payload/src/collections/Users.ts`:

```typescript
import { CollectionConfig } from 'payload/types'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Client', value: 'client' },
        { label: 'Assistant', value: 'assistant' },
      ],
      defaultValue: 'client',
    },
    {
      name: 'profileData',
      type: 'json',
    },
  ],
}
```

Update `payload.config.ts`:

```typescript
import { Users } from './collections/Users'

export default buildConfig({
  // ... other config
  collections: [
    Users,
  ],
})
```

Restart server and verify:
- Users collection appears in admin
- Can create a user
- Can log in with created user

### Step 8: Follow Implementation Checklist

Now follow **IMPLEMENTATION_CHECKLIST.md** starting from Phase 1, Day 2.

---

## 🎯 Daily Workflow

### Morning (9 AM - 12 PM)
1. Review checklist for today
2. Pick next task
3. Implement feature
4. Test in admin panel
5. Commit changes

### Afternoon (1 PM - 5 PM)
1. Continue implementation
2. Write tests
3. Update documentation
4. Review progress
5. Plan next day

### End of Day
- [ ] Update checklist (mark completed tasks)
- [ ] Commit all changes
- [ ] Document any blockers
- [ ] Plan tomorrow's tasks

---

## 📊 Progress Tracking

Use this table to track your progress:

| Phase | Tasks | Completed | Status |
|-------|-------|-----------|--------|
| 1. Payload Setup | 15 | 0 | ⏳ Not Started |
| 2. GrapesJS | 8 | 0 | ⏳ Not Started |
| 3. Collections | 12 | 0 | ⏳ Not Started |
| 4. Data Migration | 6 | 0 | ⏳ Not Started |
| 5. Frontend | 30 | 0 | ⏳ Not Started |
| 6. Integrations | 10 | 0 | ⏳ Not Started |
| 7. Deployment | 8 | 0 | ⏳ Not Started |
| 8. Documentation | 5 | 0 | ⏳ Not Started |

---

## 🆘 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Check DATABASE_URI is correct
- Verify Supabase project is running
- Check firewall/network settings
- Try connection pooling URL instead

### Issue: "PAYLOAD_SECRET is required"
**Solution:**
- Ensure `.env` file exists in `payload/` directory
- Check PAYLOAD_SECRET is at least 32 characters
- Restart dev server after adding

### Issue: "Module not found"
**Solution:**
```bash
cd payload
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"
**Solution:**
- Stop old Express server
- Or change Payload port in `package.json`:
```json
"dev": "cross-env PORT=3001 payload dev"
```

### Issue: "TypeScript errors"
**Solution:**
```bash
cd payload
npm run generate:types
```

---

## 📚 Helpful Resources

### Documentation
- [Payload CMS Docs](https://payloadcms.com/docs)
- [Payload Examples](https://github.com/payloadcms/payload/tree/main/examples)
- [GrapesJS Docs](https://grapesjs.com/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

### Community
- [Payload Discord](https://discord.com/invite/payload)
- [Payload GitHub Discussions](https://github.com/payloadcms/payload/discussions)

### Video Tutorials
- [Payload CMS Crash Course](https://www.youtube.com/results?search_query=payload+cms+tutorial)
- [GrapesJS Tutorial](https://www.youtube.com/results?search_query=grapesjs+tutorial)

---

## ✅ Checklist Before Starting

- [ ] Read all documentation
- [ ] Made architecture decisions
- [ ] Supabase project created
- [ ] Payload project initialized
- [ ] Basic setup tested
- [ ] First collection created
- [ ] Team aligned on timeline
- [ ] Backup of current system created

---

## 🎉 Ready to Start?

If you've completed all the steps above, you're ready to begin the migration!

**Next Steps:**
1. Open **IMPLEMENTATION_CHECKLIST.md**
2. Start with **Phase 1, Day 2**
3. Follow the checklist task by task
4. Update progress daily
5. Ask for help when needed

**Good luck! 🚀**

---

## 📞 Need Help?

If you get stuck:
1. Check the **Common Issues** section above
2. Review the documentation
3. Search Payload Discord
4. Create a GitHub discussion
5. Ask your team

---

**Last Updated:** 2024-01-09
