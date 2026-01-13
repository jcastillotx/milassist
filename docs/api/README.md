# MilAssist API Documentation

Welcome to the MilAssist REST API documentation. This API provides access to all platform features including user management, task tracking, travel services, and more.

## 🔑 Authentication

### JWT Token Authentication

All API endpoints (except public ones) require JWT authentication.

```http
Authorization: Bearer <your-jwt-token>
```

### Getting Your Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "yourpassword"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "client"
  }
}
```

## 🌐 Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## 📋 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/logout` | User logout |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get current user profile |
| PUT | `/users/profile` | Update user profile |
| GET | `/users` | List all users (admin only) |
| GET | `/users/:id` | Get user by ID |
| PUT | `/users/:id` | Update user (admin only) |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | List tasks for current user |
| POST | `/tasks` | Create new task |
| GET | `/tasks/:id` | Get task details |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/handoff` | Handoff task to another assistant |

### Travel Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/travel/trips` | List user trips |
| POST | `/travel/trips` | Create new trip |
| GET | `/travel/trips/:id` | Get trip details |
| PUT | `/travel/trips/:id` | Update trip |
| DELETE | `/travel/trips/:id` | Delete trip |
| POST | `/travel/flights/search` | Search flights |
| GET | `/travel/flights/:id` | Get flight details |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messages` | List conversations |
| GET | `/messages/:conversationId` | Get conversation messages |
| POST | `/messages` | Send new message |
| PUT | `/messages/:id/read` | Mark message as read |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/documents` | List user documents |
| POST | `/documents` | Upload document |
| GET | `/documents/:id` | Download document |
| DELETE | `/documents/:id` | Delete document |

### Invoices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | List invoices |
| POST | `/invoices` | Create invoice |
| GET | `/invoices/:id` | Get invoice details |
| PUT | `/invoices/:id` | Update invoice |
| POST | `/invoices/:id/pay` | Process payment |

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `RATE_LIMITED` | Too many requests |
| `SERVER_ERROR` | Internal server error |

## 📝 Request Examples

### Create a Task

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Research flight options",
    "description": "Find flights from NYC to LA for next week",
    "priority": "high",
    "due_date": "2024-01-15T10:00:00Z",
    "category": "travel"
  }'
```

### Search Flights

```bash
curl -X POST http://localhost:3000/api/travel/flights/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "JFK",
    "destination": "LAX",
    "departure_date": "2024-01-15",
    "return_date": "2024-01-20",
    "passengers": 1,
    "class": "economy"
  }'
```

### Upload Document

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/document.pdf" \
  -F "title=Travel Itinerary" \
  -F "category=travel"
```

## 🔄 Pagination

List endpoints support pagination:

```bash
GET /api/tasks?page=1&limit=20&sort=created_at&order=desc
```

Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Field to sort by
- `order`: Sort order (`asc` or `desc`)

Response:
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

## 🚀 Rate Limiting

API requests are rate limited to prevent abuse:

- **Standard Users**: 100 requests per hour
- **Premium Users**: 500 requests per hour
- **Admin Users**: 1000 requests per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🧪 Testing

### Postman Collection

Import the Postman collection from `/docs/api/milassist-postman.json` to test all endpoints.

### Environment Variables

Set up these environment variables in Postman:
- `baseUrl`: `http://localhost:3000/api`
- `token`: Your JWT token

## 📱 SDKs

### JavaScript/Node.js

```bash
npm install @milassist/api-client
```

```javascript
const MilAssist = require('@milassist/api-client');

const client = new MilAssist({
  baseURL: 'http://localhost:3000/api',
  token: 'your-jwt-token'
});

// Get tasks
const tasks = await client.tasks.list();

// Create task
const task = await client.tasks.create({
  title: 'New task',
  description: 'Task description'
});
```

### Python

```bash
pip install milassist-python
```

```python
from milassist import MilAssist

client = MilAssist(
    base_url='http://localhost:3000/api',
    token='your-jwt-token'
)

# Get tasks
tasks = client.tasks.list()

# Create task
task = client.tasks.create(
    title='New task',
    description='Task description'
)
```

## 🔒 Security

### HTTPS Required

All API calls must use HTTPS in production.

### Token Security

- Never expose JWT tokens in client-side code
- Store tokens securely (httpOnly cookies recommended)
- Implement token refresh mechanism
- Use short-lived tokens with refresh capability

### Input Validation

All inputs are validated and sanitized. Invalid requests will return validation errors.

## 📞 Support

For API support and questions:

- **Documentation**: Check this guide first
- **Email**: api-support@milassist.com
- **Status Page**: https://status.milassist.com
- **Issues**: Report via platform admin panel

---

*Last Updated: 2026-01-10*
