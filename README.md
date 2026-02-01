# MilAssist Platform v2.0.1

**Empowering Military Spouses. Reliable Support for Business.**

MilAssist is a comprehensive virtual assistance and data services platform connecting military spouses with clients. Built with React 19, Node.js, and PostgreSQL, it provides a complete solution for managing virtual assistant services, client relationships, and business operations.

## 🚀 Production Status

**✅ LIVE**: Deployed on Vercel with Supabase PostgreSQL
**📊 Production Ready**: 95% (all critical systems operational)
**🔐 Database**: 32 tables migrated, 9 test accounts seeded
**🌐 Platform**: [https://milassist.vercel.app](https://milassist.vercel.app)

---

## 🌟 Features

### Core Platform
- **Multi-Role Dashboard System**: Separate interfaces for Admins, Clients, and Assistants
- **Task Management**: Kanban-style task board with priority levels and status tracking
- **Real-time Messaging**: Direct chat between clients and assistants
- **Document Management**: Upload, review, and collaborate on documents
- **Travel Management**: Comprehensive travel planning and booking
  - **Google Flights Integration**: Real-time flight search and pricing
  - **Trip Planning**: Comprehensive itinerary builder and management
  - **Expense Tracking**: Budget monitoring and expense categorization
  - **Document Storage**: Travel documents and booking confirmations
- **Data & Research**: Research requests and data collection tools

### Advanced Capabilities
- **Email Integration (OAuth2)**: Connect Gmail/Outlook for inbox management
- **Video Conferencing**: Zoom, Google Meet, Webex, and Microsoft Teams integration
- **Calendar Sync**: Google Calendar and Outlook Calendar integration
- **Meeting Scheduler**: Automatic video link generation and calendar events
- **Task Handoff System**: Transfer tasks between assistants with internal notes
- **Time Tracking**: Global timer widget and time logs for assistants

### Business Features
- **Invoice Management**: Create, track, and pay invoices
- **Simulated Stripe Integration**: Payment processing workflow
- **Service Request Forms**: Customizable intake forms with 10+ task types
- **Visual Page Builder**: Drag-and-drop page creation
- **Form Builder**: Dynamic form creation and management

### Compliance & Security
- **NDA Management**: Digital signature workflow for assistants
- **Privacy Center**: GDPR/CCPA data export and deletion requests
- **Dynamic NDA Editor**: Admin-configurable legal agreements
- **Assistant Onboarding**: SheerID military verification simulation
- **Role-Based Access Control**: Secure authentication with JWT

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** 14+ (local development) or Supabase account (production)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jcastillotx/milassist.git
   cd milassist
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ..
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cd server
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters-change-this
   JWT_EXPIRATION=24h
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
   FRONTEND_URL=http://localhost:5173
   APP_URL=http://localhost:5000

   # Database (PostgreSQL - production-ready)
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/milassist_dev
   ```

4. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

6. **Initialize the Platform**
   Go to `http://localhost:5173/setup` to run the Installation Setup Wizard. This will create your primary admin account and initialize platform settings.

---

## 📁 Project Structure

```
milassist/
├── api/                   # Vercel serverless functions
│   └── server.cjs        # Express app wrapper (CommonJS)
├── server/               # Backend (Node.js + Express)
│   ├── models/          # Sequelize models (32 models)
│   ├── routes/          # API endpoints (40+ routes)
│   ├── middleware/      # Auth & validation
│   ├── services/        # Business logic (OAuth2, payments, etc.)
│   ├── migrations/      # Database migrations
│   └── seeders/         # Test data seeders
├── src/                 # Frontend (React 19 + Vite)
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   │   ├── admin/      # Admin dashboard pages
│   │   ├── client/     # Client dashboard pages
│   │   └── assistant/  # Assistant dashboard pages
│   ├── layouts/        # Layout components
│   └── config/         # API configuration
├── docs/               # Documentation (70+ markdown files)
├── scripts/            # Automation scripts
├── vercel.json         # Vercel deployment config
└── README.md
```

---

## 🔑 Test Accounts

The platform includes 9 test accounts for testing all roles:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@milassist.com | Admin123!Test |
| **Client 1** | client1@example.com | Client123! |
| **Client 2** | client2@example.com | Client123! |
| **Client 3** | client3@example.com | Client123! |
| **VA Entry** | va1@milassist.com | Assistant123! |
| **VA Mid** | va2@milassist.com | Assistant123! |
| **VA Senior** | va3@milassist.com | Assistant123! |
| **VA Lead** | va4@milassist.com | Assistant123! |
| **VA Expert** | va5@milassist.com | Assistant123! |

**Complete test account details**: See `docs/TEST_ACCOUNTS.md` for full profiles, skills, and rates.

---

## 🎯 Key Integrations

### Email Management
- **Providers**: Gmail, Outlook
- **OAuth2 Flow**: Secure token-based authentication
- **Features**: Read emails, send replies, manage inbox

### Video Conferencing
- **Platforms**: Zoom, Google Meet, Webex, Microsoft Teams
- **Auto-Link Generation**: Create meetings with one click
- **Calendar Integration**: Automatic event creation

### Calendar Sync
- **Providers**: Google Calendar, Outlook Calendar
- **Features**: View events, create meetings, sync schedules

---

## 📋 Available Routes

### Public Routes
- `/` - Landing page
- `/login` - Authentication

### Admin Routes
- `/admin` - Overview dashboard
- `/admin/users` - User management
- `/admin/invoices` - Invoice management
- `/admin/integrations` - API integrations
- `/admin/forms` - Form builder
- `/admin/pages` - Page builder
- `/admin/settings/nda` - NDA editor
- `/admin/privacy` - Privacy requests

### Client Routes
- `/client` - Overview
- `/client/tasks` - Task board
- `/client/travel` - Travel management
- `/client/documents` - Document review
- `/client/research` - Data & research
- `/client/communication` - Call logs & routing
- `/client/messages` - Chat with assistant
- `/client/requests` - New service request
- `/client/invoices` - View invoices
- `/client/calendar` - Calendar view
- `/client/email` - Email settings
- `/client/privacy` - Privacy center

### Assistant Routes
- `/assistant` - Overview
- `/assistant/tasks` - Task board with handoff
- `/assistant/time` - Time logs
- `/assistant/inbox` - Client inbox manager
- `/assistant/resources` - Training resources
- `/assistant/onboarding` - Onboarding & verification
- `/assistant/privacy` - Privacy center

---

## 🛠️ Development

### Build for Production
```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

### Environment Variables
See `server/.env.example` for all available configuration options.

---

## 📦 Deployment

### Production Stack (Current)
- **Platform**: Vercel (serverless frontend + backend)
- **Database**: Supabase PostgreSQL (32 tables, production-ready)
- **Storage**: AWS S3 (configured for documents and uploads)
- **Authentication**: JWT with bcrypt password hashing
- **Environment**: Fully configured and operational

### Deployment Guides
- **Vercel Deployment**: See `VERCEL_DEPLOYMENT.md`
- **Database Setup**: See `docs/PRODUCTION_DATABASE_SETUP.md`
- **Environment Variables**: See `docs/setup/VERCEL_ENV_MAPPING.md`

### Quick Deploy
```bash
# One-line deployment
vercel --prod

# Database migration (one-time)
./scripts/migrate-production.sh "YOUR_SUPABASE_CONNECTION_STRING"
```

---

## 🔐 Security Features

- **JWT Authentication**: Bcrypt password hashing with 32+ character secrets
- **Role-Based Access Control**: 60+ granular permissions across 3 user roles
- **SOC2 Compliance**: Audit logging with 7-year retention requirement
- **CORS Protection**: Configured for production domains with Vercel preview support
- **PostgreSQL**: Production database with SSL/TLS encryption
- **Environment Variables**: Secure variable management through Vercel
- **Input Validation**: Express-validator on all protected endpoints

---

## 📝 License

Proprietary - All rights reserved

---

## 🤝 Support

For questions or support, contact your system administrator.

---

## 🎉 Version History

### v2.0.1 (2026-02-01)
**Production Deployment & Bug Fixes:**
- ✅ **Deployed to Production**: Vercel + Supabase PostgreSQL
- 🗄️ **Database**: Migrated 32 tables, seeded 9 test accounts
- 🐛 **Fixed API Routing**: Removed double /api prefix causing 404 errors
- 🔧 **Fixed ES Module Error**: Renamed server.js to server.cjs for CommonJS compatibility
- 🔐 **JWT Configuration**: Added SUPABASE_JWT_SECRET fallback support
- 🌐 **CORS**: Improved CORS handling for Vercel preview URLs
- 📝 **Environment Variables**: Added VITE_API_URL to build configuration
- ⚡ **Error Handling**: Replaced process.exit() with throw Error() for serverless
- 📊 **Health Endpoint**: Enhanced with JWT and database status checks

**Documentation:**
- Updated README with production deployment information
- Added comprehensive test account documentation
- Created automated migration scripts for Supabase

### v2.0.0 (2026-01-31)
**Breaking Changes:**
- Removed Docker deployment configuration (Vercel-only deployment)
- Removed Railway deployment support
- Streamlined deployment to Vercel + Supabase stack only

**Improvements:**
- Cleaned up repository structure (45+ docs organized)
- Fixed all build errors and template literal syntax issues
- Added comprehensive testing infrastructure (27 tests, Jest configured)
- Implemented CI/CD pipeline (6-job GitHub Actions workflow)
- Added error tracking with Sentry
- Improved production readiness from 75% to 95%+
- Single main branch (removed stale feature branches)

**Infrastructure:**
- Platform: Vercel (serverless frontend + backend)
- Database: Supabase PostgreSQL
- Storage: AWS S3 or Vercel Blob

### v1.0.0 (2026-01-09)
- Initial release
- Complete platform with admin, client, and assistant dashboards
- Email, video, and calendar integrations
- Task handoff system
- Time tracking
- Privacy & compliance features
- Payment processing (simulated)
- Multi-provider OAuth2 support
