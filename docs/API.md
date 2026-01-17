# MilAssist API Documentation

**Stack:** Payload CMS 3.0 (Auto-generated REST API)  
**Base URL:** `https://your-domain.vercel.app/api`

---

## Overview

MilAssist uses **Payload CMS 3.0**, which provides an auto-generated REST API for all collections. You can access, create, update, and delete records via standard HTTP methods.

### API Features
- **Auto-generated endpoints** for all 27 collections
- **Built-in authentication** with JWT tokens
- **Role-based access control** (Admin, Client, Assistant)
- **File uploads** via AWS S3
- **GraphQL available** at `/api/graphql`

---

## Authentication

### Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "assistant"
  }
}
```

### Using the Token
Include the token in the `Authorization` header:
```http
Authorization: Bearer <token>
```

### Get Current User
```bash
GET /api/users/me
Authorization: Bearer <token>
```

---

## Collections API

All collections are accessible via `/api/<collection-slug>`

### Users Collection
```bash
# List users (Admin only)
GET /api/users
Authorization: Bearer <token>

# Get single user
GET /api/users/<id>
Authorization: Bearer <token>

# Create user
POST /api/users
Content-Type: application/json

{
  "email": "new@example.com",
  "password": "password123",
  "name": "New User",
  "role": "client"
}

# Update user
PATCH /api/users/<id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name"
}

# Delete user
DELETE /api/users/<id>
Authorization: Bearer <token>
```

### Tasks Collection
```bash
# List tasks
GET /api/tasks
Authorization: Bearer <token>

# Create task
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete report",
  "description": "Finish Q4 report",
  "status": "pending",
  "priority": "high",
  "client": "client_id"
}

# Update task status
PATCH /api/tasks/<id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

### Messages Collection
```bash
# List messages (inbox)
GET /api/messages
Authorization: Bearer <token>

# Send message
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "recipient_id",
  "subject": "Hello",
  "content": "Message content here"
}
```

### Invoices Collection
```bash
# List invoices
GET /api/invoices
Authorization: Bearer <token>

# Create invoice
POST /api/invoices
Authorization: Bearer <token>
Content-Type: application/json

{
  "client": "client_id",
  "items": [
    {
      "description": "Service 1",
      "quantity": 5,
      "rate": 25.00
    }
  ],
  "dueDate": "2026-02-01"
}
```

### Documents Collection (File Uploads)
```bash
# Upload file
POST /api/documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary file]
title: "My Document"
category: "report"

# Download file
GET /api/documents/<id>
Authorization: Bearer <token>
```

---

## Query Parameters

### Pagination
```bash
GET /api/tasks?page=1&limit=20
```

### Sorting
```bash
GET /api/tasks?sort=-createdAt  # Descending
GET /api/tasks?sort=createdAt   # Ascending
```

### Filtering
```bash
GET /api/tasks?where[status][equals]=pending
GET /api/tasks?where[priority][equals]=high
GET /api/tasks?where[client][equals]=client_id
```

### Deep Population (Relationships)
```bash
GET /api/tasks?populate=client
GET /api/tasks?populate=client,assignedTo
```

---

## Error Handling

### Error Response Format
```json
{
  "errors": [
    {
      "message": "Validation Error",
      "data": {
        "email": "Email already exists"
      }
    }
  ]
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Error |

---

## API Endpoints Summary

| Collection | Slug | Description |
|------------|------|-------------|
| Users | `/api/users` | Authentication & profiles |
| Tasks | `/api/tasks` | Task management |
| Messages | `/api/messages` | Chat system |
| Invoices | `/api/invoices` | Billing |
| Documents | `/api/documents` | File management |
| Trips | `/api/trips` | Travel planning |
| TimeEntries | `/api/time-entries` | Time tracking |
| Meetings | `/api/meetings` | Video conferencing |
| ServiceRequests | `/api/service-requests` | Client requests |
| FormTemplates | `/api/form-templates` | Dynamic forms |
| Media | `/api/media` | File uploads (S3) |
| Pages | `/api/pages` | CMS pages |
| Resources | `/api/resources` | Training materials |
| Research | `/api/research` | Data research |
| Calls | `/api/calls` | Twilio logs |
| RoutingRules | `/api/routing-rules` | Call routing |
| PrivacyRequests | `/api/privacy-requests` | GDPR/CCPA |
| EmailConnections | `/api/email-connections` | Email OAuth |
| VideoIntegrations | `/api/video-integrations` | Video platforms |
| CalendarConnections | `/api/calendar-connections` | Calendar sync |
| TaskHandoffs | `/api/task-handoffs` | Task transfers |
| Integrations | `/api/integrations` | API integrations |
| LiveChats | `/api/live-chats` | Real-time chat |
| TrainingModules | `/api/training-modules` | Training content |
| Assessments | `/api/assessments` | Skill assessments |
| AssistantOnboarding | `/api/assistant-onboarding` | Onboarding |
| OnCallAssistants | `/api/on-call-assistants` | Scheduling |

---

## Custom API Endpoints

### OAuth
- `GET /api/oauth/google` - Initiate Google OAuth
- `GET /api/oauth/google/callback` - Google OAuth callback
- `GET /api/oauth/microsoft` - Initiate Microsoft OAuth
- `GET /api/oauth/microsoft/callback` - Microsoft OAuth callback

### AI Chat
- `POST /api/ai/chat` - AI chat message
- `POST /api/ai/analyze` - Text analysis

### Chat Service
- `POST /api/chat/start` - Start new chat session
- `POST /api/chat/message` - Send chat message

### Onboarding
- `POST /api/onboarding/start` - Start assistant onboarding
- `POST /api/onboarding/complete-module` - Complete training module

### Health Check
- `GET /api/health` - System health check

---

## Rate Limiting

Vercel provides built-in rate limiting. For custom limits, implement middleware.

---

## GraphQL API

Payload CMS includes GraphQL at `/api/graphql`:

```graphql
query GetTasks {
  tasks(sort: "-createdAt") {
    docs {
      id
      title
      status
      priority
      client {
        name
        email
      }
    }
    totalDocs
  }
}
```

**GraphQL Playground:** `/api/graphql-playground` (development only)

---

## Postman Collection

Import the Postman collection from:
`docs/api/milassist-api.postman_collection.json`

---

*API Version: 1.0*  
*Last Updated: 2026-01-13*  
*Generated by: Payload CMS 3.0*

