# Project Identity

**Status:** Defined  
**Last Updated:** 2026-01-13

## Project Metadata

| Field | Value |
|-------|-------|
| **Application Name** | MilAssist |
| **Company Name** | MilAssist Platform |
| **Author Name** | Development Team |
| **License Type** | Proprietary |
| **Copyright Year** | 2026 |
| **Contact Email** | support@milassist.com |
| **Repository** | https://github.com/milassist/milassist |
| **Production URL** | https://milassist.vercel.app |
| **Admin Panel** | https://milassist.vercel.app/admin |

## Project Description

MilAssist is a comprehensive platform designed to provide administrative support services, with a focus on serving military spouses and their unique needs. The platform connects clients with virtual assistants for tasks such as travel planning, document management, scheduling, and more.

## Technology Stack

| Category | Technology |
|----------|------------|
| **Backend/CMS** | Payload CMS 3.0 (Next.js 15 App Router) |
| **Database** | Supabase PostgreSQL |
| **File Storage** | AWS S3 |
| **Deployment** | Vercel |
| **Frontend** | React 19 with Vite |
| **Authentication** | JWT + Google/Microsoft OAuth (SSO) |
| **AI Integration** | Multi-provider (OpenRouter, Claude, OpenAI, Gemini) |

## User Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **Admin** | System administrators | Full system access, user management |
| **Assistant** | Virtual assistants | Task management, client support |
| **Client** | End customers | Personal data, service requests |

## Collections (27 Total)

### Core Business
1. Users - Authentication and profiles
2. Tasks - Task management
3. Messages - Chat system
4. Invoices - Billing
5. Documents - File management

### Enhanced Features
6. Trips - Travel planning
7. TimeEntries - Time tracking
8. Meetings - Video conferencing
9. FormTemplates - Dynamic forms
10. ServiceRequests - Client requests

### System & Integration
11. Pages - CMS pages (GrapesJS)
12. Resources - Training materials
13. Research - Data research
14. Calls - Twilio integration
15. RoutingRules - Call routing
16. PrivacyRequests - GDPR/CCPA
17. EmailConnections - Email OAuth
18. VideoIntegrations - Video platforms
19. CalendarConnections - Calendar sync
20. TaskHandoffs - Task transfers
21. Integrations - API integrations
22. Media - File uploads (S3)
23. Skills - Assistant skills

### Onboarding & Training
24. AssistantOnboarding - Onboarding workflow
25. TrainingModules - Training content
26. Assessments - Skill assessments
27. LiveChats - Real-time chat

---

## Security & Compliance

- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Authentication:** JWT with 15-min access token expiration
- **Authorization:** Role-based access control (RBAC)
- **Compliance:** GDPR, CCPA ready
- **Data Location:** US-based (Supabase)

## Support & Resources

- **Documentation:** `/docs/` directory
- **API Docs:** `/docs/API.md`
- **Setup Guide:** `payload/SETUP_INSTRUCTIONS.md`
- **Migration Plan:** `MIGRATION_PLAN.md`
- **Production Guide:** `PRODUCTION_DEPLOYMENT_GUIDE.md`

---

*This file is auto-generated and should be kept in sync with project configuration.*

