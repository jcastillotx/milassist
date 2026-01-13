# MilAssist Migration Implementation Checklist

**Status:** Ready for Review  
**Last Updated:** 2024-01-09

---

## 🎯 Pre-Migration Decisions

### Critical Decisions Needed

#### 1. Deployment Architecture
- [ ] **Decision:** Monorepo vs Separate Repos?
  - **Option A (Recommended):** Monorepo - Single Vercel project
    - ✅ Simpler deployment
    - ✅ Shared environment variables
    - ✅ Single domain
    - ✅ Easier development
  - **Option B:** Separate repos - Two Vercel projects
    - ✅ Independent scaling
    - ✅ Separate teams can work independently
    - ❌ CORS configuration needed
    - ❌ More complex setup

**Recommendation:** Option A (Monorepo)

#### 2. Storage Solution
- [ ] **Decision:** Where to store uploaded files?
  - **Option A:** Vercel Blob Storage
    - ✅ Native Vercel integration
    - ✅ Simple setup
    - ✅ CDN included
    - ❌ Vercel-specific (vendor lock-in)
  - **Option B:** Supabase Storage
    - ✅ Part of Supabase ecosystem
    - ✅ More control
    - ✅ Better for large files
    - ❌ Additional configuration

**Recommendation:** Option A (Vercel Blob) for simplicity

#### 3. Real-time Features
- [ ] **Decision:** How to handle real-time chat/notifications?
  - **Option A:** Polling (simple)
  - **Option B:** Supabase Realtime subscriptions
  - **Option C:** Payload webhooks + WebSockets

**Recommendation:** Start with Option A (polling), upgrade to B if needed

#### 4. Migration Strategy
- [ ] **Decision:** Big bang vs Gradual migration?
  - **Option A:** Big bang - Switch everything at once
    - ✅ Clean break
    - ✅ No dual maintenance
    - ❌ Higher risk
  - **Option B:** Gradual - Run both systems in parallel
    - ✅ Lower risk
    - ✅ Can rollback easily
    - ❌ Complex dual maintenance

**Recommendation:** Option A (Big bang) - Platform is small enough

---

## 📋 Phase-by-Phase Checklist

### Phase 1: Payload CMS Setup ✅ (Days 1-3)

#### Day 1: Project Initialization
- [ ] Create Supabase project
  - [ ] Sign up at supabase.com
  - [ ] Create new project
  - [ ] Note connection string
  - [ ] Enable connection pooling
  - [ ] Configure database settings

- [ ] Initialize Payload project
  ```bash
  npx create-payload-app@latest payload --template blank
  cd payload
  npm install @payloadcms/db-postgres @payloadcms/richtext-lexical
  npm install @payloadcms/plugin-cloud-storage
  npm install grapesjs grapesjs-preset-webpage
  ```

- [ ] Configure Payload
  - [ ] Create `payload.config.ts`
  - [ ] Set up Supabase connection
  - [ ] Configure authentication
  - [ ] Set up TypeScript

- [ ] Test basic setup
  - [ ] Run `npm run dev`
  - [ ] Access admin panel at `/admin`
  - [ ] Verify database connection

#### Day 2: Core Collections (High Priority)
- [ ] **Users Collection**
  - [ ] Create `collections/Users.ts`
  - [ ] Define fields: name, email, password, role, profileData
  - [ ] Set up auth config
  - [ ] Configure access control (admin, client, assistant)
  - [ ] Add password hashing hook
  - [ ] Test user creation in admin panel

- [ ] **Tasks Collection**
  - [ ] Create `collections/Tasks.ts`
  - [ ] Define fields: title, description, status, priority, dueDate
  - [ ] Add relationships: client, assistant
  - [ ] Configure access control
  - [ ] Add status change hooks
  - [ ] Test task CRUD operations

- [ ] **Messages Collection**
  - [ ] Create `collections/Messages.ts`
  - [ ] Define fields: content, readStatus, attachments
  - [ ] Add relationships: sender, receiver
  - [ ] Configure access control
  - [ ] Test message creation

- [ ] **Invoices Collection**
  - [ ] Create `collections/Invoices.ts`
  - [ ] Define fields: amount, status, description, dueDate
  - [ ] Add relationships: client, assistant
  - [ ] Configure access control
  - [ ] Add payment hooks
  - [ ] Test invoice creation

- [ ] **Documents Collection**
  - [ ] Create `collections/Documents.ts`
  - [ ] Define fields: title, file (upload), category, status
  - [ ] Add relationship: client
  - [ ] Configure file upload
  - [ ] Set up storage (Vercel Blob or Supabase)
  - [ ] Test file upload

#### Day 3: Enhanced Collections (Medium Priority)
- [ ] **Trips Collection**
  - [ ] Create `collections/Trips.ts`
  - [ ] Define fields: destination, dates, flightDetails, hotelDetails, status
  - [ ] Add relationship: client
  - [ ] Configure JSON fields
  - [ ] Test trip creation

- [ ] **TimeEntries Collection**
  - [ ] Create `collections/TimeEntries.ts`
  - [ ] Define fields: startTime, endTime, duration, description
  - [ ] Add relationships: assistant, client, task
  - [ ] Configure access control
  - [ ] Test time entry creation

- [ ] **Meetings Collection**
  - [ ] Create `collections/Meetings.ts`
  - [ ] Define fields: title, date, videoLink, platform, status
  - [ ] Add relationships: client, assistant
  - [ ] Test meeting creation

- [ ] **FormTemplates Collection**
  - [ ] Create `collections/FormTemplates.ts`
  - [ ] Define fields: name, fields (JSON), category
  - [ ] Configure JSON schema for fields
  - [ ] Test form template creation

- [ ] **ServiceRequests Collection**
  - [ ] Create `collections/ServiceRequests.ts`
  - [ ] Define fields: type, description, status, priority
  - [ ] Add relationships: client, formTemplate
  - [ ] Test service request creation

- [ ] **Access Control Setup**
  - [ ] Create `access/isAdmin.ts`
  - [ ] Create `access/isClient.ts`
  - [ ] Create `access/isAssistant.ts`
  - [ ] Create `access/isOwner.ts`
  - [ ] Test access control for each role

---

### Phase 2: GrapesJS Integration ✅ (Days 4-5)

#### Day 4: GrapesJS Setup
- [ ] Install dependencies
  ```bash
  npm install grapesjs grapesjs-preset-webpage
  npm install --save-dev @types/grapesjs
  ```

- [ ] Create GrapesJS field component
  - [ ] Create `fields/GrapesJS/index.tsx`
  - [ ] Implement editor initialization
  - [ ] Add save/load functionality
  - [ ] Style the editor
  - [ ] Test in isolation

- [ ] Create custom blocks library
  - [ ] Create `fields/GrapesJS/blocks.ts`
  - [ ] Define hero section block
  - [ ] Define feature grid block
  - [ ] Define testimonial block
  - [ ] Define CTA block
  - [ ] Define custom MilAssist blocks

#### Day 5: Pages Collection with GrapesJS
- [ ] **Pages Collection**
  - [ ] Create `collections/Pages.ts`
  - [ ] Add slug field (unique)
  - [ ] Add title field
  - [ ] Add content field (GrapesJS)
  - [ ] Add isPublished field
  - [ ] Configure access control
  - [ ] Test page creation in admin

- [ ] Test GrapesJS integration
  - [ ] Create test page
  - [ ] Add blocks
  - [ ] Save and reload
  - [ ] Verify HTML/CSS output
  - [ ] Test responsive design

- [ ] Create page preview endpoint
  - [ ] Create `endpoints/pages/preview.ts`
  - [ ] Render GrapesJS HTML/CSS
  - [ ] Test preview functionality

---

### Phase 3: Remaining Collections ✅ (Day 6)

#### System & Admin Collections
- [ ] **Resources Collection**
  - [ ] Create `collections/Resources.ts`
  - [ ] Define fields: title, content, category, accessLevel
  - [ ] Add file upload support
  - [ ] Configure access control
  - [ ] Test resource creation

- [ ] **Research Collection**
  - [ ] Create `collections/Research.ts`
  - [ ] Define fields: topic, description, findings, status
  - [ ] Add relationship: client
  - [ ] Test research creation

- [ ] **Calls Collection**
  - [ ] Create `collections/Calls.ts`
  - [ ] Define fields: callerNumber, direction, status, duration, recordingUrl
  - [ ] Add relationship: client
  - [ ] Test call log creation

- [ ] **RoutingRules Collection**
  - [ ] Create `collections/RoutingRules.ts`
  - [ ] Define fields: strategy, businessHours, assistantPhone
  - [ ] Add relationship: client
  - [ ] Test routing rule creation

- [ ] **PrivacyRequests Collection**
  - [ ] Create `collections/PrivacyRequests.ts`
  - [ ] Define fields: type, status, dataExportUrl
  - [ ] Add relationship: user
  - [ ] Test privacy request creation

- [ ] **EmailConnections Collection**
  - [ ] Create `collections/EmailConnections.ts`
  - [ ] Define fields: provider, accessToken, refreshToken, emailAddress
  - [ ] Add relationship: user
  - [ ] Configure token encryption
  - [ ] Test email connection creation

- [ ] **VideoIntegrations Collection**
  - [ ] Create `collections/VideoIntegrations.ts`
  - [ ] Define fields: platform, accessToken, refreshToken
  - [ ] Add relationship: user
  - [ ] Configure token encryption
  - [ ] Test video integration creation

- [ ] **CalendarConnections Collection**
  - [ ] Create `collections/CalendarConnections.ts`
  - [ ] Define fields: provider, accessToken, refreshToken
  - [ ] Add relationship: user
  - [ ] Configure token encryption
  - [ ] Test calendar connection creation

- [ ] **TaskHandoffs Collection**
  - [ ] Create `collections/TaskHandoffs.ts`
  - [ ] Define fields: reason, internalNotes, status
  - [ ] Add relationships: task, fromAssistant, toAssistant
  - [ ] Test task handoff creation

- [ ] **Integrations Collection**
  - [ ] Create `collections/Integrations.ts`
  - [ ] Define fields: name, type, config (JSON), isActive
  - [ ] Test integration creation

- [ ] **Skills Collection**
  - [ ] Create `collections/Skills.ts`
  - [ ] Define fields: name, description, category
  - [ ] Configure many-to-many with Users
  - [ ] Test skill creation and assignment

#### Global Settings
- [ ] **Settings Global**
  - [ ] Create `globals/Settings.ts`
  - [ ] Define fields: ndaContent, smtpConfig, oauthCredentials
  - [ ] Configure as singleton
  - [ ] Test settings update

---

### Phase 4: Data Migration ✅ (Day 7)

#### Export Current Data
- [ ] Create export script
  - [ ] Create `scripts/export-data.js`
  - [ ] Export Users
  - [ ] Export Tasks
  - [ ] Export Messages
  - [ ] Export Invoices
  - [ ] Export Documents (metadata only)
  - [ ] Export Trips
  - [ ] Export all other collections
  - [ ] Save to `data-export.json`

- [ ] Run export
  ```bash
  cd server
  node scripts/export-data.js
  ```

#### Transform Data
- [ ] Create transform script
  - [ ] Create `scripts/transform-data.js`
  - [ ] Transform Users (password_hash → password)
  - [ ] Transform Tasks (maintain relationships)
  - [ ] Transform Messages
  - [ ] Transform Invoices
  - [ ] Transform all collections
  - [ ] Validate transformed data
  - [ ] Save to `data-transformed.json`

- [ ] Run transform
  ```bash
  node scripts/transform-data.js
  ```

#### Import to Payload
- [ ] Create import script
  - [ ] Create `scripts/import-to-payload.js`
  - [ ] Initialize Payload
  - [ ] Import Users first (no dependencies)
  - [ ] Import Skills
  - [ ] Import Tasks (depends on Users)
  - [ ] Import Messages (depends on Users)
  - [ ] Import Invoices (depends on Users)
  - [ ] Import all other collections in dependency order
  - [ ] Handle errors gracefully
  - [ ] Log progress

- [ ] Run import
  ```bash
  cd payload
  node scripts/import-to-payload.js
  ```

- [ ] Verify imported data
  - [ ] Check user count
  - [ ] Check task count
  - [ ] Verify relationships
  - [ ] Test queries in admin panel

#### Migrate Files
- [ ] Export files from current storage
- [ ] Upload to Vercel Blob or Supabase Storage
- [ ] Update Document records with new URLs
- [ ] Verify file access

---

### Phase 5: Frontend Updates ✅ (Days 8-9)

#### Day 8: API Client & Auth
- [ ] Create Payload API client
  - [ ] Create `src/lib/payloadClient.ts`
  - [ ] Implement request method
  - [ ] Implement auth methods (login, logout)
  - [ ] Implement collection methods (CRUD)
  - [ ] Add error handling
  - [ ] Add TypeScript types

- [ ] Update authentication
  - [ ] Create `src/hooks/useAuth.ts`
  - [ ] Implement login flow
  - [ ] Implement logout flow
  - [ ] Implement token refresh
  - [ ] Update `src/pages/Login.jsx`
  - [ ] Test authentication

- [ ] Update protected routes
  - [ ] Update `src/App.jsx`
  - [ ] Add auth guards
  - [ ] Test route protection

#### Day 9: Update Components
- [ ] **Admin Pages**
  - [ ] Update `src/pages/admin/Overview.jsx`
  - [ ] Update `src/pages/admin/Users.jsx`
  - [ ] Update `src/pages/admin/Invoices.jsx`
  - [ ] Update `src/pages/admin/Integrations.jsx`
  - [ ] Update `src/pages/admin/FormBuilder.jsx`
  - [ ] Update `src/pages/admin/FormManager.jsx`
  - [ ] Update `src/pages/admin/PageBuilder.jsx` (use Payload admin)
  - [ ] Update `src/pages/admin/NDAEditor.jsx`

- [ ] **Client Pages**
  - [ ] Update `src/pages/client/Overview.jsx`
  - [ ] Update `src/pages/client/TravelManagement.jsx`
  - [ ] Update `src/pages/client/DocumentReview.jsx`
  - [ ] Update `src/pages/client/DataResearch.jsx`
  - [ ] Update `src/pages/client/CommunicationCenter.jsx`
  - [ ] Update `src/pages/client/Chat.jsx`
  - [ ] Update `src/pages/client/Invoices.jsx`
  - [ ] Update `src/pages/client/Payment.jsx`
  - [ ] Update `src/pages/client/ServiceRequest.jsx`
  - [ ] Update `src/pages/client/EmailSettings.jsx`
  - [ ] Update `src/pages/client/CalendarView.jsx`
  - [ ] Update `src/pages/client/MeetingScheduler.jsx`

- [ ] **Assistant Pages**
  - [ ] Update `src/pages/assistant/Overview.jsx`
  - [ ] Update `src/pages/assistant/Resources.jsx`
  - [ ] Update `src/pages/assistant/TimeLogs.jsx`
  - [ ] Update `src/pages/assistant/Onboarding.jsx`
  - [ ] Update `src/pages/assistant/InboxManager.jsx`

- [ ] **Shared Components**
  - [ ] Update `src/components/TaskBoard.jsx`
  - [ ] Update `src/components/TaskHandoffModal.jsx`
  - [ ] Update `src/components/Timer.jsx`
  - [ ] Update `src/components/AIAssistant.jsx`
  - [ ] Update `src/pages/PrivacyCenter.jsx`
  - [ ] Update `src/pages/SetupWizard.jsx`

- [ ] Test all pages
  - [ ] Test as admin
  - [ ] Test as client
  - [ ] Test as assistant
  - [ ] Verify all CRUD operations
  - [ ] Check error handling

---

### Phase 6: External Integrations ✅ (Days 10-11)

#### Day 10: Core Integrations
- [ ] **Twilio Integration**
  - [ ] Copy `server/services/twilioService.js` to `payload/src/services/TwilioService.ts`
  - [ ] Convert to TypeScript
  - [ ] Create `endpoints/twilio/incoming-call.ts`
  - [ ] Create `endpoints/twilio/voicemail.ts`
  - [ ] Create `endpoints/twilio/webhook.ts`
  - [ ] Test incoming calls
  - [ ] Test voicemail
  - [ ] Test call routing

- [ ] **OAuth2 Integration**
  - [ ] Copy `server/services/oauth2.js` to `payload/src/services/OAuth2Service.ts`
  - [ ] Convert to TypeScript
  - [ ] Create `endpoints/oauth/gmail.ts`
  - [ ] Create `endpoints/oauth/outlook.ts`
  - [ ] Test Gmail OAuth flow
  - [ ] Test Outlook OAuth flow
  - [ ] Test token refresh

- [ ] **Stripe Integration**
  - [ ] Copy `server/services/stripe.js` to `payload/src/services/StripeService.ts`
  - [ ] Convert to TypeScript
  - [ ] Create `endpoints/stripe/webhook.ts`
  - [ ] Create `endpoints/stripe/create-payment-intent.ts`
  - [ ] Test payment creation
  - [ ] Test webhook handling
  - [ ] Test invoice updates

#### Day 11: Additional Integrations
- [ ] **Video Conferencing**
  - [ ] Copy `server/services/video.js` to `payload/src/services/VideoService.ts`
  - [ ] Convert to TypeScript
  - [ ] Create `endpoints/video/create-meeting.ts`
  - [ ] Test Zoom integration
  - [ ] Test Google Meet integration
  - [ ] Test Webex integration
  - [ ] Test Teams integration

- [ ] **Calendar Sync**
  - [ ] Copy `server/services/calendar.js` to `payload/src/services/CalendarService.ts`
  - [ ] Convert to TypeScript
  - [ ] Create `endpoints/calendar/sync.ts`
  - [ ] Create `endpoints/calendar/create-event.ts`
  - [ ] Test Google Calendar sync
  - [ ] Test Outlook Calendar sync

- [ ] **Google Flights**
  - [ ] Copy `server/services/googleFlightsService.js` to `payload/src/services/GoogleFlightsService.ts`
  - [ ] Convert to TypeScript
  - [ ] Create `endpoints/travel/search-flights.ts`
  - [ ] Test flight search
  - [ ] Test price tracking

---

### Phase 7: Deployment ✅ (Days 12-13)

#### Day 12: Vercel Setup
- [ ] Create Vercel account (if needed)
- [ ] Install Vercel CLI
  ```bash
  npm i -g vercel
  ```

- [ ] Configure project
  - [ ] Create `vercel.json`
  - [ ] Configure build settings
  - [ ] Configure routes
  - [ ] Set up environment variables

- [ ] Link project to Vercel
  ```bash
  vercel link
  ```

- [ ] Configure environment variables in Vercel
  - [ ] PAYLOAD_SECRET
  - [ ] DATABASE_URI
  - [ ] PAYLOAD_PUBLIC_SERVER_URL
  - [ ] BLOB_READ_WRITE_TOKEN
  - [ ] All OAuth credentials
  - [ ] Twilio credentials
  - [ ] Stripe credentials
  - [ ] JWT_SECRET

- [ ] Test deployment
  ```bash
  vercel --prod
  ```

#### Day 13: Production Verification
- [ ] Verify deployment
  - [ ] Check Payload admin panel
  - [ ] Check frontend
  - [ ] Test authentication
  - [ ] Test API endpoints

- [ ] Test all features
  - [ ] User registration/login
  - [ ] Task creation/management
  - [ ] Message sending
  - [ ] Invoice creation/payment
  - [ ] Document upload
  - [ ] Trip planning
  - [ ] Time tracking
  - [ ] Meeting scheduling
  - [ ] Email integration
  - [ ] Calendar sync
  - [ ] Video conferencing
  - [ ] Twilio calls
  - [ ] Privacy requests

- [ ] Performance testing
  - [ ] Check page load times
  - [ ] Check API response times
  - [ ] Check database query performance
  - [ ] Optimize if needed

- [ ] Security audit
  - [ ] Verify HTTPS
  - [ ] Check CORS configuration
  - [ ] Verify authentication
  - [ ] Check access control
  - [ ] Review environment variables

---

### Phase 8: Documentation & Handoff ✅ (Day 14)

- [ ] Update documentation
  - [ ] Update README.md
  - [ ] Create DEPLOYMENT.md for new stack
  - [ ] Document API changes
  - [ ] Document new admin panel usage
  - [ ] Create troubleshooting guide

- [ ] Create migration notes
  - [ ] Document breaking changes
  - [ ] List deprecated features
  - [ ] Provide upgrade path

- [ ] Training materials
  - [ ] Admin panel walkthrough
  - [ ] GrapesJS page builder guide
  - [ ] API documentation
  - [ ] Video tutorials (optional)

- [ ] Backup old system
  - [ ] Export all data
  - [ ] Archive old codebase
  - [ ] Document rollback procedure

---

## 🚨 Risk Mitigation

### High-Risk Areas
1. **Data Migration**
   - Risk: Data loss or corruption
   - Mitigation: Multiple backups, test import on staging first

2. **Authentication**
   - Risk: Users locked out
   - Mitigation: Test thoroughly, have admin override

3. **File Uploads**
   - Risk: Files not accessible
   - Mitigation: Test upload/download, keep old storage temporarily

4. **External Integrations**
   - Risk: OAuth flows broken
   - Mitigation: Test each integration, have fallback options

### Rollback Plan
- [ ] Keep old Express server running (read-only)
- [ ] Maintain database backup
- [ ] Document rollback steps
- [ ] Test rollback procedure

---

## ✅ Success Criteria

### Must Have
- [ ] All users can log in
- [ ] All data migrated successfully
- [ ] Core features working (tasks, messages, invoices)
- [ ] File uploads working
- [ ] Admin panel accessible
- [ ] No data loss

### Should Have
- [ ] All integrations working (Twilio, OAuth, Stripe)
- [ ] GrapesJS page builder functional
- [ ] Performance equal or better than old system
- [ ] All tests passing

### Nice to Have
- [ ] Improved admin UI
- [ ] Better TypeScript types
- [ ] GraphQL API available
- [ ] Real-time features

---

## 📊 Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| 1. Payload Setup | 3 days | ⏳ Pending |
| 2. GrapesJS Integration | 2 days | ⏳ Pending |
| 3. Remaining Collections | 1 day | ⏳ Pending |
| 4. Data Migration | 1 day | ⏳ Pending |
| 5. Frontend Updates | 2 days | ⏳ Pending |
| 6. External Integrations | 2 days | ⏳ Pending |
| 7. Deployment | 2 days | ⏳ Pending |
| 8. Documentation | 1 day | ⏳ Pending |
| **Total** | **14 days** | |

---

## 📝 Notes

- This checklist assumes full-time work (8 hours/day)
- Adjust timeline based on team size and availability
- Some tasks can be parallelized
- Buffer time included for unexpected issues
- Testing is integrated into each phase

---

## 🎯 Next Steps

1. **Review this checklist** with the team
2. **Make architecture decisions** (monorepo, storage, etc.)
3. **Set up Supabase project**
4. **Begin Phase 1** - Payload CMS setup
5. **Daily standups** to track progress
6. **Weekly demos** to stakeholders

---

**Ready to begin? Let's start with Phase 1!**
