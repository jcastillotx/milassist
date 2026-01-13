# ADR 0002: Migration to Payload CMS 3.0 Architecture

**Status:** Proposed  
**Date:** 2024-01-09  
**Deciders:** Development Team  
**Technical Story:** Platform modernization and scalability

---

## Context and Problem Statement

The current MilAssist platform uses a custom Express.js backend with 25+ route files, 23 Sequelize models, and significant custom code for features that are now available in modern CMS platforms. This creates:

1. **High maintenance burden** - Custom code for admin panels, APIs, authentication
2. **Slow feature development** - Building everything from scratch
3. **Limited scalability** - SQLite in development, manual PostgreSQL setup
4. **No visual page builder** - Custom implementation needed
5. **DevOps complexity** - Manual server management, deployment configuration

We need a modern, scalable architecture that reduces maintenance while improving developer experience and feature velocity.

---

## Decision Drivers

### Technical Requirements
- Auto-generated REST and GraphQL APIs
- Built-in admin panel with role-based access
- Visual page builder for marketing pages
- TypeScript-first development
- Serverless deployment capability
- Managed database with connection pooling
- File upload and storage management

### Business Requirements
- Reduce development time for new features
- Lower operational costs
- Improve system reliability
- Enable faster iteration
- Maintain all existing functionality

### Developer Experience
- Better TypeScript support
- Hot reload in development
- Auto-generated types
- Modern tooling
- Clear documentation

---

## Considered Options

### Option 1: Continue with Express.js (Status Quo)
**Pros:**
- No migration needed
- Team familiar with codebase
- Full control over implementation

**Cons:**
- High maintenance burden
- Slow feature development
- Manual API creation
- Custom admin panel needed
- No visual page builder
- DevOps complexity

### Option 2: Migrate to Strapi
**Pros:**
- Popular open-source CMS
- Good documentation
- Plugin ecosystem
- REST and GraphQL APIs

**Cons:**
- Not TypeScript-first
- Less modern architecture
- Weaker admin UI
- No built-in page builder
- Community plugins quality varies

### Option 3: Migrate to Payload CMS 3.0 ✅ (Selected)
**Pros:**
- TypeScript-first (auto-generated types)
- Built on Next.js 15 (modern, fast)
- Beautiful admin UI out of the box
- Auto REST + GraphQL APIs
- Excellent developer experience
- Active development and support
- Easy Vercel deployment
- Built-in access control
- Hooks and plugins system
- Local API for server-side operations

**Cons:**
- Newer platform (less mature than Strapi)
- Smaller community
- Migration effort required
- Team learning curve

### Option 4: Build Custom Next.js + tRPC
**Pros:**
- Full control
- Modern stack
- Type-safe APIs

**Cons:**
- Most development work
- No admin panel
- No page builder
- Highest maintenance burden

---

## Decision Outcome

**Chosen option:** Option 3 - Migrate to Payload CMS 3.0

### Rationale

1. **80% Code Reduction**
   - Auto-generated APIs eliminate 25+ route files
   - Built-in admin panel eliminates custom UI
   - Built-in auth eliminates custom middleware
   - Result: Focus on business logic, not boilerplate

2. **TypeScript-First**
   - Auto-generated types for all collections
   - Type-safe API calls
   - Better IDE support
   - Fewer runtime errors

3. **Modern Architecture**
   - Built on Next.js 15 (App Router)
   - React Server Components
   - Optimized for Vercel deployment
   - Serverless-ready

4. **Developer Experience**
   - Hot reload in development
   - Clear documentation
   - Intuitive API design
   - Active community support

5. **Feature Velocity**
   - New collections in minutes
   - Automatic API endpoints
   - Built-in validation
   - Hooks for custom logic

6. **GrapesJS Integration**
   - Production-ready visual editor
   - Custom blocks support
   - Responsive design tools
   - No need to build from scratch

7. **Deployment Simplicity**
   - Vercel native support
   - Zero DevOps configuration
   - Automatic scaling
   - Global CDN

---

## Implementation Strategy

### Phase 1: Payload Setup (3 days)
- Initialize Payload project
- Configure Supabase PostgreSQL
- Create all 23 collections
- Set up authentication and access control
- Test basic CRUD operations

### Phase 2: GrapesJS Integration (2 days)
- Install and configure GrapesJS
- Create custom field component
- Build custom blocks library
- Integrate with Pages collection
- Test page builder functionality

### Phase 3: Data Migration (1 day)
- Export data from current SQLite/PostgreSQL
- Transform data to Payload format
- Import to Supabase
- Verify data integrity
- Migrate uploaded files

### Phase 4: Frontend Updates (2 days)
- Create Payload API client
- Update authentication flow
- Update all API calls in components
- Test all user flows
- Fix any breaking changes

### Phase 5: External Integrations (2 days)
- Migrate Twilio integration
- Migrate OAuth2 (Gmail/Outlook)
- Migrate Stripe webhooks
- Migrate video conferencing
- Migrate calendar sync
- Migrate Google Flights API

### Phase 6: Deployment (2 days)
- Set up Vercel project
- Configure environment variables
- Deploy to production
- Verify all features
- Performance testing

### Phase 7: Documentation (1 day)
- Update README
- Create deployment guide
- Document API changes
- Create admin panel guide
- Training materials

**Total Timeline:** 13-14 days

---

## Architecture Decisions

### 1. Monorepo Structure ✅
**Decision:** Single repository with Payload backend and React frontend

**Rationale:**
- Simpler deployment (single Vercel project)
- Shared environment variables
- Single domain (no CORS issues)
- Easier local development
- Better for small team

**Alternative Considered:** Separate repositories
- More complex setup
- CORS configuration needed
- Two Vercel projects to manage

### 2. Vercel Blob Storage ✅
**Decision:** Use Vercel Blob for file uploads

**Rationale:**
- Native Vercel integration
- Simple setup
- CDN included
- Good for small-medium files
- Pay-as-you-go pricing

**Alternative Considered:** Supabase Storage
- More configuration needed
- Better for very large files
- Adds complexity

### 3. Supabase PostgreSQL ✅
**Decision:** Use Supabase for database

**Rationale:**
- Managed PostgreSQL
- Connection pooling (critical for serverless)
- Automatic backups
- Good free tier
- Real-time subscriptions available
- Easy to scale

**Alternative Considered:** Vercel Postgres
- More expensive
- Less features
- Newer service

### 4. Polling for Real-time (Initial) ✅
**Decision:** Start with polling, upgrade to Supabase Realtime if needed

**Rationale:**
- Simpler implementation
- Good enough for MVP
- Easy to upgrade later
- No WebSocket complexity

**Alternative Considered:** Supabase Realtime
- More complex setup
- Overkill for current needs
- Can add later if needed

### 5. Big Bang Migration ✅
**Decision:** Switch everything at once

**Rationale:**
- Platform is small enough
- Clean break
- No dual maintenance
- Faster overall

**Alternative Considered:** Gradual migration
- Lower risk but higher complexity
- Dual maintenance burden
- Longer timeline

---

## Technical Architecture

### New Stack
```
Frontend:
- React 19.2.0 (existing)
- Vite 7.3.1 (existing)
- React Router DOM 7.12.0 (existing)

Backend:
- Payload CMS 3.0
- Next.js 15 (App Router)
- TypeScript 5.x

Database:
- Supabase PostgreSQL
- Connection pooling

Storage:
- Vercel Blob Storage

Deployment:
- Vercel (serverless)
- Automatic scaling
- Global CDN

Integrations:
- Twilio (voice, SMS)
- Stripe (payments)
- OAuth2 (Gmail, Outlook)
- Video (Zoom, Meet, Webex, Teams)
- Calendar (Google, Outlook)
- Google Flights API
```

### Project Structure
```
milassist/
├── payload/                    # Payload CMS (Next.js)
│   ├── src/
│   │   ├── collections/       # 23 collections
│   │   ├── globals/           # Settings singleton
│   │   ├── fields/            # GrapesJS custom field
│   │   ├── access/            # Access control
│   │   ├── hooks/             # Collection hooks
│   │   ├── endpoints/         # Custom API routes
│   │   ├── services/          # Business logic
│   │   └── payload.config.ts
│   ├── public/
│   └── package.json
│
├── src/                        # React frontend (existing)
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   └── lib/
│       └── payloadClient.ts   # New API client
│
├── vercel.json                 # Deployment config
├── MIGRATION_PLAN.md
└── IMPLEMENTATION_CHECKLIST.md
```

---

## Consequences

### Positive
- **80% less backend code** to maintain
- **Auto-generated APIs** (REST + GraphQL)
- **Built-in admin panel** (no custom UI needed)
- **TypeScript types** auto-generated
- **Faster feature development**
- **Better developer experience**
- **Zero DevOps** with Vercel
- **Automatic scaling**
- **Production-ready page builder**

### Negative
- **Migration effort** (~2 weeks)
- **Team learning curve** (1-2 weeks)
- **Platform dependency** (vendor lock-in to Payload)
- **Smaller community** than Strapi
- **Newer platform** (less battle-tested)

### Neutral
- **Different admin UI** (users need to adapt)
- **New API patterns** (frontend changes needed)
- **TypeScript required** (good for quality, learning curve for some)

---

## Risks and Mitigation

### Risk 1: Data Loss During Migration
**Likelihood:** Medium  
**Impact:** Critical  
**Mitigation:**
- Multiple backups before migration
- Test import on staging first
- Verify data integrity after import
- Keep old system running (read-only) for 1 week

### Risk 2: Users Locked Out
**Likelihood:** Low  
**Impact:** High  
**Mitigation:**
- Test authentication thoroughly
- Have admin override capability
- Document password reset process
- Communicate migration to users

### Risk 3: Integration Breakage
**Likelihood:** Medium  
**Impact:** Medium  
**Mitigation:**
- Test each integration individually
- Have fallback options
- Monitor error logs closely
- Gradual rollout of integrations

### Risk 4: Performance Degradation
**Likelihood:** Low  
**Impact:** Medium  
**Mitigation:**
- Performance testing before launch
- Monitor response times
- Optimize database queries
- Use Vercel analytics

### Risk 5: Learning Curve
**Likelihood:** High  
**Impact:** Low  
**Mitigation:**
- Comprehensive documentation
- Training sessions
- Pair programming
- Gradual feature rollout

---

## Validation

### Success Metrics
- [ ] All data migrated successfully (100%)
- [ ] All features working (100%)
- [ ] API response time < 200ms (p95)
- [ ] Zero data loss
- [ ] Admin panel accessible
- [ ] All integrations functional
- [ ] User satisfaction maintained

### Testing Strategy
- Unit tests for custom hooks
- Integration tests for API endpoints
- End-to-end tests for critical flows
- Load testing for performance
- Security audit before launch

### Rollback Plan
1. Keep old Express server running (read-only)
2. Maintain database backup
3. Document rollback steps
4. Test rollback procedure
5. Can revert within 1 hour if needed

---

## References

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Payload CMS GitHub](https://github.com/payloadcms/payload)
- [GrapesJS Documentation](https://grapesjs.com/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)

---

## Approval

**Proposed by:** Development Team  
**Date:** 2024-01-09  
**Status:** Awaiting approval

**Approvers:**
- [ ] Technical Lead
- [ ] Product Owner
- [ ] DevOps Lead

---

## Notes

- This ADR supersedes ADR-0001 (Initial Architecture)
- Migration can be paused/resumed at phase boundaries
- Timeline assumes full-time work (8 hours/day)
- Buffer time included for unexpected issues
- Can parallelize some tasks with multiple developers

---

**Last Updated:** 2024-01-09
