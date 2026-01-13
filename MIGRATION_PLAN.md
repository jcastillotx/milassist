# MilAssist Platform Migration Plan
## Express → Payload CMS 3.0 + GrapesJS + Vercel + Supabase

**Version:** 1.0  
**Date:** 2024-01-09  
**Status:** Planning Phase

---

## 📊 Executive Summary

This document outlines the complete migration strategy for transforming the MilAssist platform from a custom Express.js backend to a modern Payload CMS 3.0 architecture with GrapesJS visual page builder, deployed on Vercel with Supabase PostgreSQL.

### Key Benefits
- **80% less backend code** to maintain
- **Auto-generated REST + GraphQL APIs**
- **Built-in admin panel** (no custom UI needed)
- **TypeScript-first** with auto-generated types
- **Production-ready visual page builder**
- **Zero DevOps** with Vercel + Supabase
- **Better developer experience** and faster feature development

---

## 🏗️ Current Architecture Analysis

### Backend (Express.js)
- **Framework:** Express 5.2.1
- **ORM:** Sequelize 6.37.7
- **Database:** SQLite (dev) / PostgreSQL (production)
- **Auth:** JWT with bcryptjs
- **Routes:** 25+ route files
- **Models:** 23 Sequelize models
- **Services:** 5 external integrations

### Frontend (React)
- **Framework:** React 19.2.0 with Vite 7.3.1
- **Routing:** React Router DOM 7.12.0
- **State:** Local component state (no global state management)
- **UI:** Custom components with Tailwind-like utility classes
- **Pages:** 30+ page components across 3 role dashboards

### Current Models (23 total)
1. **User** - Admin, Client, Assistant roles
2. **Task** - Kanban board with priorities
3. **TaskHandoff** - Transfer tasks between assistants
4. **Invoice** - Billing and payments
5. **Message** - Chat system
6. **Document** - File management
7. **Trip** - Travel planning
8. **TimeEntry** - Time tracking
9. **Meeting** - Video conferencing
10. **CalendarConnection** - Calendar sync
11. **EmailConnection** - Email OAuth
12. **VideoIntegration** - Video platforms
13. **FormTemplate** - Dynamic forms
14. **ServiceRequest** - Client requests
15. **PageTemplate** - Page builder
16. **Resource** - Training materials
17. **Research** - Data research
18. **Call** - Twilio call logs
19. **RoutingRule** - Call routing
20. **PrivacyRequest** - GDPR/CCPA
21. **SystemSetting** - Global settings
22. **Skill** - Assistant skills
23. **Integration** - API integrations

### Current Routes (25+ endpoints)
- `/auth` - Login, register
- `/users` - User management
- `/tasks` - Task CRUD + handoff
- `/messages` - Chat
- `/invoices` - Billing
- `/documents` - File uploads
- `/trips` - Travel management
- `/travel` - Google Flights integration
- `/time` - Time tracking
- `/meetings` - Video conferencing
- `/calendar` - Calendar sync
- `/email` - Email OAuth
- `/video` - Video integrations
- `/forms` - Form builder
- `/pages` - Page builder
- `/resources` - Training materials
- `/research` - Data research
- `/communication` - Twilio calls
- `/twilio` - Twilio webhooks
- `/payments` - Stripe (mocked)
- `/privacy` - Privacy requests
- `/settings` - System settings
- `/integrations` - API management
- `/ai` - AI assistant
- `/setup` - Initial setup wizard

### External Integrations
1. **Twilio** - Voice calls, SMS, voicemail
2. **Stripe** - Payment processing (currently mocked)
3. **OAuth2** - Gmail, Outlook email
4. **Video** - Zoom, Google Meet, Webex, Teams
5. **Calendar** - Google Calendar, Outlook Calendar
6. **Google Flights** - Flight search API

---

## 🎯 Target Architecture

### New Stack
- **CMS:** Payload CMS 3.0 (Next.js 15 App Router)
- **Database:** Supabase PostgreSQL (managed)
- **Page Builder:** GrapesJS (integrated with Payload)
- **Deployment:** Vercel (serverless)
- **Storage:** Vercel Blob Storage or Supabase Storage
- **Frontend:** React 19 (existing, minimal changes)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     VERCEL DEPLOYMENT                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   React Frontend     │      │   Payload CMS 3.0    │    │
│  │   (Vite SPA)         │◄────►│   (Next.js 15)       │    │
│  │   - Client UI        │      │   - Admin Panel      │    │
│  │   - Assistant UI     │      │   - REST API         │    │
│  │   - Admin UI         │      │   - GraphQL API      │    │
│  │   - Public Pages     │      │   - GrapesJS Editor  │    │
│  └──────────────────────┘      └──────────┬───────────┘    │
│                                            │                 │
└────────────────────────────────────────────┼─────────────────┘
                                             │
                    ┌────────────────────────┼────────────────┐
                    │                        │                │
                    ▼                        ▼                ▼
         ┌──────────────────┐    ┌──────────────┐  ┌─────────────┐
         │ Supabase         │    │ Vercel Blob  │  │ External    │
         │ PostgreSQL       │    │ Storage      │  │ APIs        │
         │ - All collections│    │ - Files      │  │ - Twilio    │
         │ - Relationships  │    │ - Images     │  │ - Stripe    │
         │ - Connection     │    │ - Documents  │  │ - OAuth2    │
         │   pooling        │    └──────────────┘  │ - Video     │
         └──────────────────┘                      │ - Calendar  │
                                                    └─────────────┘
```

---

## 📋 Migration Phases

### Phase 1: Payload CMS Setup (Days 1-3)
**Goal:** Create Payload project with all collections

#### 1.1 Initialize Payload Project
```bash
npx create-payload-app@latest payload --template blank
cd payload
npm install @payloadcms/db-postgres @payloadcms/richtext-lexical
```

#### 1.2 Configure Supabase Connection
```typescript
// payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
})
```

#### 1.3 Create Collections (Priority Order)

**High Priority (Core Features):**
1. ✅ **Users** - Authentication foundation
   - Fields: name, email, password, role, profile_data
   - Auth: email/password
   - Access: role-based permissions
   - Hooks: password hashing

2. ✅ **Tasks** - Primary workflow
   - Fields: title, description, status, priority, due_date
   - Relations: client (User), assistant (User)
   - Hooks: status change notifications

3. ✅ **Messages** - Communication
   - Fields: content, read_status, attachments
   - Relations: sender (User), receiver (User)
   - Real-time: optional Supabase subscriptions

4. ✅ **Invoices** - Billing
   - Fields: amount, status, description, due_date
   - Relations: client (User), assistant (User)
   - Hooks: payment webhooks

5. ✅ **Documents** - File management
   - Fields: title, file (upload), category, status
   - Relations: client (User)
   - Upload: Vercel Blob or Supabase Storage

**Medium Priority (Enhanced Features):**
6. ✅ **Trips** - Travel management
   - Fields: destination, dates, flight_details, hotel_details, status
   - Relations: client (User)
   - JSON fields: flight_details, hotel_details

7. ✅ **TimeEntries** - Time tracking
   - Fields: start_time, end_time, duration, description
   - Relations: assistant (User), client (User), task (Task)

8. ✅ **Meetings** - Video conferencing
   - Fields: title, date, video_link, platform, status
   - Relations: client (User), assistant (User)

9. ✅ **FormTemplates** - Dynamic forms
   - Fields: name, fields (JSON), category
   - JSON: field definitions

10. ✅ **ServiceRequests** - Client requests
    - Fields: type, description, status, priority
    - Relations: client (User), form_template (FormTemplate)

**Low Priority (Admin/System):**
11. ✅ **Pages** - Visual page builder (with GrapesJS)
    - Fields: slug, title, content (GrapesJS), is_published
    - Custom field: GrapesJS editor component

12. ✅ **Resources** - Training materials
    - Fields: title, content, category, access_level
    - Upload: file attachments

13. ✅ **Research** - Data research
    - Fields: topic, description, findings, status
    - Relations: client (User)

14. ✅ **Calls** - Twilio call logs
    - Fields: caller_number, direction, status, duration, recording_url
    - Relations: client (User)

15. ✅ **RoutingRules** - Call routing
    - Fields: strategy, business_hours, assistant_phone
    - Relations: client (User)

16. ✅ **PrivacyRequests** - GDPR/CCPA
    - Fields: type, status, data_export_url
    - Relations: user (User)

17. ✅ **EmailConnections** - Email OAuth
    - Fields: provider, access_token, refresh_token, email_address
    - Relations: user (User)
    - Encrypted: tokens

18. ✅ **VideoIntegrations** - Video platforms
    - Fields: platform, access_token, refresh_token
    - Relations: user (User)
    - Encrypted: tokens

19. ✅ **CalendarConnections** - Calendar sync
    - Fields: provider, access_token, refresh_token
    - Relations: user (User)
    - Encrypted: tokens

20. ✅ **TaskHandoffs** - Task transfers
    - Fields: reason, internal_notes, status
    - Relations: task (Task), from_assistant (User), to_assistant (User)

21. ✅ **Integrations** - API management
    - Fields: name, type, config (JSON), is_active

22. ✅ **Skills** - Assistant skills
    - Fields: name, description, category
    - Relations: Many-to-many with Users

**Global Singletons:**
23. ✅ **Settings** - System settings
    - Fields: nda_content, smtp_config, oauth_credentials
    - Type: Global (singleton)

#### 1.4 Set Up Access Control
```typescript
// access/isAdmin.ts
export const isAdmin = ({ req: { user } }) => {
  return user?.role === 'admin'
}

// access/isClient.ts
export const isClient = ({ req: { user } }) => {
  return user?.role === 'client'
}

// access/isAssistant.ts
export const isAssistant = ({ req: { user } }) => {
  return user?.role === 'assistant'
}

// access/isOwner.ts
export const isOwner = ({ req: { user } }) => {
  return {
    or: [
      { 'client.id': { equals: user?.id } },
      { 'assistant.id': { equals: user?.id } },
    ]
  }
}
```

---

### Phase 2: GrapesJS Integration (Days 4-5)
**Goal:** Add visual page builder to Payload

#### 2.1 Install GrapesJS
```bash
npm install grapesjs grapesjs-preset-webpage
```

#### 2.2 Create Custom Field Component
```typescript
// fields/GrapesJS/index.tsx
import React, { useEffect, useRef } from 'react'
import grapesjs from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'

export const GrapesJSField: React.FC = ({ value, onChange }) => {
  const editorRef = useRef(null)
  const editor = useRef(null)

  useEffect(() => {
    if (!editor.current && editorRef.current) {
      editor.current = grapesjs.init({
        container: editorRef.current,
        fromElement: false,
        height: '600px',
        storageManager: false,
        plugins: ['gjs-preset-webpage'],
        pluginsOpts: {
          'gjs-preset-webpage': {},
        },
      })

      // Load existing content
      if (value) {
        editor.current.setComponents(value.html || '')
        editor.current.setStyle(value.css || '')
      }

      // Save on change
      editor.current.on('change', () => {
        onChange({
          html: editor.current.getHtml(),
          css: editor.current.getCss(),
          components: editor.current.getComponents(),
        })
      })
    }

    return () => {
      if (editor.current) {
        editor.current.destroy()
      }
    }
  }, [])

  return <div ref={editorRef} />
}
```

#### 2.3 Add to Pages Collection
```typescript
// collections/Pages.ts
{
  name: 'pages',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'json',
      admin: {
        components: {
          Field: GrapesJSField,
        },
      },
    },
    {
      name: 'is_published',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
```

#### 2.4 Create Custom Blocks Library
```typescript
// components/GrapesJSBlocks.ts
export const customBlocks = [
  {
    id: 'hero-section',
    label: 'Hero Section',
    content: `<section class="hero">...</section>`,
  },
  {
    id: 'feature-grid',
    label: 'Feature Grid',
    content: `<div class="features">...</div>`,
  },
  // Add more custom blocks
]
```

---

### Phase 3: Data Migration (Day 6)
**Goal:** Migrate existing data from SQLite to Supabase

#### 3.1 Export Current Data
```javascript
// scripts/export-data.js
const { sequelize, User, Task, Invoice, /* ... */ } = require('./server/models')

async function exportData() {
  const data = {
    users: await User.findAll({ raw: true }),
    tasks: await Task.findAll({ raw: true }),
    invoices: await Invoice.findAll({ raw: true }),
    // ... export all models
  }
  
  fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2))
}
```

#### 3.2 Transform Data Format
```javascript
// scripts/transform-data.js
function transformUsers(users) {
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password_hash, // Payload will handle hashing
    role: user.role,
    profileData: user.profile_data,
  }))
}
```

#### 3.3 Import to Payload
```javascript
// scripts/import-to-payload.js
const payload = require('payload')

async function importData(data) {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    local: true,
  })

  // Import users first (no dependencies)
  for (const user of data.users) {
    await payload.create({
      collection: 'users',
      data: user,
    })
  }

  // Import tasks (depends on users)
  for (const task of data.tasks) {
    await payload.create({
      collection: 'tasks',
      data: task,
    })
  }

  // Continue for all collections...
}
```

---

### Phase 4: Frontend Updates (Days 7-8)
**Goal:** Update React app to use Payload APIs

#### 4.1 Create Payload API Client
```typescript
// src/lib/payloadClient.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export class PayloadClient {
  private token: string | null = null

  setToken(token: string) {
    this.token = token
    localStorage.setItem('token', token)
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `JWT ${this.token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(data.token)
    return data
  }

  // Collections
  async getTasks(query = {}) {
    return this.request('/tasks', {
      method: 'GET',
    })
  }

  async createTask(data: any) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Add methods for all collections...
}

export const payloadClient = new PayloadClient()
```

#### 4.2 Update Authentication
```typescript
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { payloadClient } from '../lib/payloadClient'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      payloadClient.setToken(token)
      // Verify token and get user
      payloadClient.request('/users/me')
        .then(setUser)
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const data = await payloadClient.login(email, password)
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return { user, loading, login, logout }
}
```

#### 4.3 Update API Calls in Components
**Before (Express):**
```javascript
// Old API call
const response = await fetch('http://localhost:3000/tasks', {
  headers: { Authorization: `Bearer ${token}` }
})
```

**After (Payload):**
```javascript
// New API call
const tasks = await payloadClient.getTasks()
```

#### 4.4 Files to Update
- `src/pages/Login.jsx` - Update auth logic
- `src/pages/client/Overview.jsx` - Update API calls
- `src/components/TaskBoard.jsx` - Update task CRUD
- `src/pages/client/TravelManagement.jsx` - Update trip API
- `src/pages/client/Chat.jsx` - Update messages API
- `src/pages/admin/Users.jsx` - Update user management
- `src/pages/admin/Invoices.jsx` - Update invoice API
- All other pages with API calls (~25 files)

---

### Phase 5: External Integrations (Days 9-10)
**Goal:** Migrate external service integrations

#### 5.1 Twilio Integration
```typescript
// payload/endpoints/twilio/incoming-call.ts
import { Endpoint } from 'payload/config'
import TwilioService from '../../services/TwilioService'

export const incomingCallHandler: Endpoint = {
  path: '/twilio/incoming-call',
  method: 'post',
  handler: async (req, res) => {
    const { From, To, CallSid } = req.body
    const twilioService = new TwilioService()
    const twiml = await twilioService.handleIncomingCall(From, To, CallSid)
    res.type('text/xml')
    res.send(twiml)
  },
}
```

#### 5.2 OAuth2 (Gmail/Outlook)
```typescript
// payload/endpoints/oauth/gmail.ts
export const gmailAuthEndpoint: Endpoint = {
  path: '/oauth/gmail/callback',
  method: 'get',
  handler: async (req, res) => {
    const { code } = req.query
    const oauth2Service = new OAuth2Service()
    const tokens = await oauth2Service.getGmailTokens(code)
    
    // Save to EmailConnections collection
    await req.payload.create({
      collection: 'email-connections',
      data: {
        user: req.user.id,
        provider: 'gmail',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    })
    
    res.redirect('/client/email')
  },
}
```

#### 5.3 Stripe Webhooks
```typescript
// payload/endpoints/stripe/webhook.ts
export const stripeWebhookEndpoint: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
  handler: async (req, res) => {
    const sig = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object
      
      // Update invoice status
      await req.payload.update({
        collection: 'invoices',
        where: {
          stripe_payment_intent_id: { equals: paymentIntent.id },
        },
        data: {
          status: 'paid',
        },
      })
    }
    
    res.json({ received: true })
  },
}
```

#### 5.4 Video Conferencing
```typescript
// payload/endpoints/video/create-meeting.ts
export const createMeetingEndpoint: Endpoint = {
  path: '/video/create-meeting',
  method: 'post',
  handler: async (req, res) => {
    const { platform, title, date } = req.body
    const videoService = new VideoService()
    
    const meetingLink = await videoService.createMeeting(platform, {
      title,
      start_time: date,
    })
    
    // Create meeting record
    const meeting = await req.payload.create({
      collection: 'meetings',
      data: {
        title,
        date,
        video_link: meetingLink,
        platform,
        client: req.user.id,
      },
    })
    
    res.json(meeting)
  },
}
```

#### 5.5 Google Flights Integration
```typescript
// payload/endpoints/travel/search-flights.ts
export const searchFlightsEndpoint: Endpoint = {
  path: '/travel/search-flights',
  method: 'post',
  handler: async (req, res) => {
    const { origin, destination, date } = req.body
    const flightsService = new GoogleFlightsService()
    
    const flights = await flightsService.searchFlights({
      origin,
      destination,
      departureDate: date,
    })
    
    res.json(flights)
  },
}
```

---

### Phase 6: Deployment Configuration (Day 11)
**Goal:** Set up Vercel and Supabase for production

#### 6.1 Supabase Setup
1. Create new Supabase project
2. Get connection string
3. Configure connection pooling
4. Set up database backups
5. Enable Row Level Security (optional)

```env
# Supabase connection string
DATABASE_URI=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

#### 6.2 Vercel Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "payload/package.json",
      "use": "@vercel/next"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/payload/$1"
    },
    {
      "src": "/admin(.*)",
      "dest": "/payload/admin$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "PAYLOAD_SECRET": "@payload-secret",
    "DATABASE_URI": "@database-uri",
    "PAYLOAD_PUBLIC_SERVER_URL": "https://milassist.vercel.app"
  }
}
```

#### 6.3 Environment Variables
```env
# Payload
PAYLOAD_SECRET=your-super-secret-key-min-32-chars
PAYLOAD_PUBLIC_SERVER_URL=https://milassist.vercel.app

# Database
DATABASE_URI=postgresql://postgres:password@host:5432/db

# Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_token

# OAuth
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
OUTLOOK_CLIENT_ID=xxx
OUTLOOK_CLIENT_SECRET=xxx

# Twilio
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Video
ZOOM_CLIENT_ID=xxx
ZOOM_CLIENT_SECRET=xxx

# JWT
JWT_SECRET=your-jwt-secret-key
```

#### 6.4 Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 📁 New Project Structure

```
milassist/
├── payload/                          # Payload CMS Backend
│   ├── src/
│   │   ├── collections/             # Payload collections
│   │   │   ├── Users.ts
│   │   │   ├── Tasks.ts
│   │   │   ├── Messages.ts
│   │   │   ├── Invoices.ts
│   │   │   ├── Documents.ts
│   │   │   ├── Trips.ts
│   │   │   ├── TimeEntries.ts
│   │   │   ├── Meetings.ts
│   │   │   ├── FormTemplates.ts
│   │   │   ├── ServiceRequests.ts
│   │   │   ├── Pages.ts             # With GrapesJS
│   │   │   ├── Resources.ts
│   │   │   ├── Research.ts
│   │   │   ├── Calls.ts
│   │   │   ├── RoutingRules.ts
│   │   │   ├── PrivacyRequests.ts
│   │   │   ├── EmailConnections.ts
│   │   │   ├── VideoIntegrations.ts
│   │   │   ├── CalendarConnections.ts
│   │   │   ├── TaskHandoffs.ts
│   │   │   ├── Integrations.ts
│   │   │   └── Skills.ts
│   │   │
│   │   ├── globals/                 # Global singletons
│   │   │   └── Settings.ts
│   │   │
│   │   ├── fields/                  # Custom fields
│   │   │   └── GrapesJS/
│   │   │       ├── index.tsx
│   │   │       └── blocks.ts
│   │   │
│   │   ├── components/              # Custom admin components
│   │   │   ├── GrapesJSEditor.tsx
│   │   │   └── CustomDashboard.tsx
│   │   │
│   │   ├── access/                  # Access control
│   │   │   ├── isAdmin.ts
│   │   │   ├── isClient.ts
│   │   │   ├── isAssistant.ts
│   │   │   └── isOwner.ts
│   │   │
│   │   ├── hooks/                   # Collection hooks
│   │   │   ├── tasks/
│   │   │   │   ├── beforeChange.ts
│   │   │   │   └── afterChange.ts
│   │   │   ├── invoices/
│   │   │   └── users/
│   │   │
│   │   ├── endpoints/               # Custom API endpoints
│   │   │   ├── oauth/
│   │   │   │   ├── gmail.ts
│   │   │   │   └── outlook.ts
│   │   │   ├── twilio/
│   │   │   │   ├── incoming-call.ts
│   │   │   │   ├── voicemail.ts
│   │   │   │   └── webhook.ts
│   │   │   ├── stripe/
│   │   │   │   └── webhook.ts
│   │   │   ├── video/
│   │   │   │   └── create-meeting.ts
│   │   │   ├── travel/
│   │   │   │   └── search-flights.ts
│   │   │   └── calendar/
│   │   │       └── sync.ts
│   │   │
│   │   ├── services/                # Business logic
│   │   │   ├── TwilioService.ts
│   │   │   ├── OAuth2Service.ts
│   │   │   ├── StripeService.ts
│   │   │   ├── VideoService.ts
│   │   │   ├── CalendarService.ts
│   │   │   └── GoogleFlightsService.ts
│   │   │
│   │   ├── app/                     # Next.js App Router
│   │   │   ├── (payload)/
│   │   │   │   ├── admin/[[...segments]]/page.tsx
│   │   │
