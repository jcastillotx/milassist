# MilAssist Platform v1.0.0

**Empowering Military Spouses. Reliable Support for Business.**

MilAssist is a comprehensive virtual assistance and data services platform connecting military spouses with clients. Built with React, Node.js, and SQLite, it provides a complete solution for managing virtual assistant services, client relationships, and business operations.

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
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd iridescent-kepler
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
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRATION=24h
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
   FRONTEND_URL=http://localhost:5174
   APP_URL=http://localhost:3000
   
   # Database (SQLite for dev)
   DB_DIALECT=sqlite
   DB_STORAGE=./database.sqlite
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
iridescent-kepler/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # Sequelize models
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & validation
│   ├── services/          # Business logic (OAuth2, payments, etc.)
│   └── server.js          # Entry point
├── src/                   # Frontend (React + Vite)
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── client/       # Client dashboard pages
│   │   └── assistant/    # Assistant dashboard pages
│   ├── layouts/          # Layout components
│   └── index.css         # Global styles
└── README.md
```

---

## 🔑 Default Users

The platform includes demo users for testing:

| Role      | Email                    | Password  |
|-----------|--------------------------|-----------|
| Admin     | admin@milassist.com      | admin123  |
| Client    | client@example.com       | client123 |
| Assistant | assistant@milassist.com  | assist123 |

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

### Option 1: VPS with PM2
1. Set up production environment variables
2. Build the frontend: `npm run build`
3. Use PM2 to run the backend: `pm2 start server/server.js`
4. Serve frontend with nginx

### Option 2: Docker
1. Create `Dockerfile` for backend and frontend
2. Use `docker-compose` for orchestration
3. Configure environment variables

### Option 3: Cloud Platforms
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: Heroku, Railway, or AWS Elastic Beanstalk
- **Database**: Migrate from SQLite to PostgreSQL for production

See `DEPLOYMENT.md` for detailed deployment instructions.

---

## 🔐 Security Notes

- **JWT Secret**: Change `JWT_SECRET` in production
- **CORS**: Configure `ALLOWED_ORIGINS` for your domain
- **Database**: Use PostgreSQL in production, not SQLite
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit `.env` files

---

## 📝 License

Proprietary - All rights reserved

---

## 🤝 Support

For questions or support, contact your system administrator.

---

## 🎉 Version History

### v1.0.0 (2026-01-09)
- Initial release
- Complete platform with admin, client, and assistant dashboards
- Email, video, and calendar integrations
- Task handoff system
- Time tracking
- Privacy & compliance features
- Payment processing (simulated)
- Multi-provider OAuth2 support
