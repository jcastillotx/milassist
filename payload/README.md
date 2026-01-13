# MilAssist Payload CMS Backend

This is the Payload CMS 3.0 backend for the MilAssist platform, built with Next.js 15 and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase PostgreSQL database
- AWS S3 bucket
- Google OAuth credentials
- Microsoft OAuth credentials

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run development server
npm run dev
```

The admin panel will be available at `http://localhost:3000/admin`

## 📁 Project Structure

```
payload/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (payload)/
│   │   │   └── admin/           # Payload admin UI
│   │   └── api/
│   │       └── oauth/           # SSO endpoints
│   │           ├── google/      # Google OAuth
│   │           └── microsoft/   # Microsoft OAuth
│   │
│   ├── collections/             # Payload collections
│   │   ├── Users.ts            # User management with SSO
│   │   ├── Tasks.ts            # Task management
│   │   ├── Messages.ts         # Chat system
│   │   ├── Invoices.ts         # Billing
│   │   ├── Documents.ts        # File management
│   │   ├── Trips.ts            # Travel planning
│   │   └── ... (23 total)
│   │
│   ├── globals/                 # Global singletons
│   │   └── Settings.ts         # System settings
│   │
│   ├── access/                  # Access control
│   │   ├── isAdmin.ts
│   │   ├── isClient.ts
│   │   ├── isAssistant.ts
│   │   └── isOwner.ts
│   │
│   ├── hooks/                   # Collection hooks
│   ├── endpoints/               # Custom API endpoints
│   ├── services/                # Business logic
│   └── fields/                  # Custom fields
│
├── payload.config.ts            # Main Payload configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## 🔐 Features

### Authentication
- ✅ Email/Password authentication
- ✅ Google OAuth (SSO)
- ✅ Microsoft OAuth (SSO)
- ✅ JWT tokens
- ✅ Role-based access control (Admin, Client, Assistant)

### Storage
- ✅ AWS S3 integration for file uploads
- ✅ Automatic file management
- ✅ CDN-ready URLs

### Database
- ✅ Supabase PostgreSQL
- ✅ Connection pooling
- ✅ Automatic migrations
- ✅ Type-safe queries

### APIs
- ✅ Auto-generated REST API
- ✅ Auto-generated GraphQL API
- ✅ Local API for server-side operations
- ✅ TypeScript types auto-generated

### Admin Panel
- ✅ Beautiful UI out of the box
- ✅ Role-based access control
- ✅ File uploads
- ✅ Rich text editor
- ✅ Customizable with React components

## 📚 Collections

### Core Collections
1. **Users** - User management with SSO support
2. **Tasks** - Task management with Kanban board
3. **Messages** - Chat system between users
4. **Invoices** - Billing and payments
5. **Documents** - File management with S3 storage

### Enhanced Collections
6. **Trips** - Travel planning and booking
7. **TimeEntries** - Time tracking for assistants
8. **Meetings** - Video conferencing integration
9. **FormTemplates** - Dynamic form builder
10. **ServiceRequests** - Client service requests

### System Collections
11. **Pages** - Visual page builder (GrapesJS)
12. **Resources** - Training materials
13. **Research** - Data research requests
14. **Calls** - Twilio call logs
15. **RoutingRules** - Call routing configuration
16. **PrivacyRequests** - GDPR/CCPA compliance
17. **EmailConnections** - Email OAuth connections
18. **VideoIntegrations** - Video platform integrations
19. **CalendarConnections** - Calendar sync
20. **TaskHandoffs** - Task transfers between assistants
21. **Integrations** - API integrations management
22. **Skills** - Assistant skills (many-to-many with Users)

### Global Singletons
23. **Settings** - System-wide settings

## 🔑 Environment Variables

See `.env.example` for all required environment variables.

### Required
- `PAYLOAD_SECRET` - Secret key for Payload (min 32 characters)
- `DATABASE_URI` - Supabase PostgreSQL connection string
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET` - S3 bucket name
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `MICROSOFT_CLIENT_ID` - Microsoft OAuth client ID
- `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth client secret

### Optional
- Twilio credentials
- Stripe credentials
- Video conferencing credentials
- SMTP credentials

## 🛠️ Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Generate TypeScript Types
```bash
npm run generate:types
```

## 📖 Documentation

- [Setup Instructions](./SETUP_INSTRUCTIONS.md) - Detailed setup guide
- [Migration Plan](../MIGRATION_PLAN.md) - Complete migration strategy
- [Implementation Checklist](../IMPLEMENTATION_CHECKLIST.md) - Task-by-task guide
- [Payload Documentation](https://payloadcms.com/docs) - Official Payload docs

## 🔗 API Endpoints

### Auto-Generated REST API
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

Similar endpoints for all collections.

### Auto-Generated GraphQL API
- `POST /api/graphql` - GraphQL endpoint
- `GET /api/graphql` - GraphQL Playground (dev only)

### Custom OAuth Endpoints
- `GET /api/oauth/google` - Initiate Google OAuth
- `GET /api/oauth/google?action=callback` - Google OAuth callback
- `GET /api/oauth/microsoft` - Initiate Microsoft OAuth
- `GET /api/oauth/microsoft?action=callback` - Microsoft OAuth callback

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Deploy

### Manual Deployment
1. Build the project: `npm run build`
2. Start the server: `npm start`
3. Ensure environment variables are set

## 🐛 Troubleshooting

### Common Issues

**Cannot connect to database**
- Verify DATABASE_URI is correct
- Check Supabase project is running
- Ensure IP is whitelisted

**S3 upload failed**
- Verify AWS credentials
- Check S3 bucket exists and is accessible
- Verify CORS configuration

**OAuth redirect mismatch**
- Verify redirect URIs match in OAuth provider settings
- Check environment variables

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for more troubleshooting tips.

## 📞 Support

- [Payload Discord](https://discord.com/invite/payload)
- [Payload GitHub](https://github.com/payloadcms/payload)
- [Documentation](https://payloadcms.com/docs)

## 📝 License

Proprietary - All rights reserved

---

**Last Updated:** 2024-01-09
