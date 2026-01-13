# MilAssist API Documentation

## API Overview

The MilAssist API follows RESTful principles with versioned endpoints, comprehensive error handling, and role-based access control.

### Base URL
```
Production: https://api.milassist.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication
All API endpoints require JWT authentication except for public endpoints.

```http
Authorization: Bearer <jwt_token>
```

## Core API Contracts

### Authentication Endpoints

#### POST /auth/login
Authenticate user and return JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "user_123456",
      "email": "user@example.com",
      "role": "assistant",
      "profile": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  },
  "message": "Authentication successful"
}
```

#### POST /auth/refresh
Refresh JWT token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here"
  },
  "message": "Token refreshed successfully"
}
```

### User Management Endpoints

#### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "email": "user@example.com",
    "role": "assistant",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "address": "123 Main St, City, State 12345",
      "skills": ["administrative", "customer_service", "data_entry"],
      "availability": {
        "monday": "9:00-17:00",
        "tuesday": "9:00-17:00",
        "wednesday": "9:00-17:00",
        "thursday": "9:00-17:00",
        "friday": "9:00-17:00"
      },
      "hourlyRate": 25.00,
      "verificationStatus": "verified"
    }
  }
}
```

#### PUT /users/profile
Update current user profile.

**Request:**
```json
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "skills": ["administrative", "customer_service"],
    "availability": {
      "monday": "9:00-17:00"
    },
    "hourlyRate": 30.00
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "skills": ["administrative", "customer_service"],
      "availability": {
        "monday": "9:00-17:00"
      },
      "hourlyRate": 30.00
    }
  },
  "message": "Profile updated successfully"
}
```

### Service Management Endpoints

#### GET /services
Get list of available services.

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "service_123",
        "name": "Administrative Support",
        "description": "General administrative tasks and support",
        "category": "administrative",
        "baseRate": 25.00,
        "estimatedTime": "2-4 hours",
        "skills": ["administrative", "organization", "communication"]
      },
      {
        "id": "service_456",
        "name": "Customer Service",
        "description": "Customer communication and support",
        "category": "customer_service",
        "baseRate": 20.00,
        "estimatedTime": "1-3 hours",
        "skills": ["customer_service", "communication", "problem_solving"]
      }
    ]
  }
}
```

#### POST /services/request
Create a new service request.

**Request:**
```json
{
  "serviceId": "service_123",
  "title": "Document Organization",
  "description": "Need help organizing and categorizing business documents",
  "priority": "medium",
  "deadline": "2026-01-20T17:00:00Z",
  "budget": 150.00,
  "requirements": {
    "documentTypes": ["invoices", "contracts", "correspondence"],
    "organizationMethod": "chronological",
    "deliverables": ["organized_files", "index_document"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "requestId": "req_789012",
    "status": "pending_assignment",
    "estimatedCost": 125.00,
    "estimatedDuration": "3 hours",
    "assignedAssistant": null,
    "createdAt": "2026-01-11T12:00:00Z"
  },
  "message": "Service request created successfully"
}
```

### Task Management Endpoints

#### GET /tasks
Get user's tasks (assigned or created).

**Query Parameters:**
- `status`: `pending`, `in_progress`, `completed`, `cancelled`
- `priority`: `low`, `medium`, `high`, `urgent`
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_123456",
        "title": "Document Organization",
        "description": "Organize business documents",
        "status": "in_progress",
        "priority": "medium",
        "serviceRequest": {
          "id": "req_789012",
          "clientId": "client_123",
          "deadline": "2026-01-20T17:00:00Z"
        },
        "assignedTo": {
          "id": "assistant_456",
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "progress": 65,
        "timeTracking": {
          "estimatedHours": 3,
          "actualHours": 1.5,
          "currentSession": {
            "startedAt": "2026-01-11T10:00:00Z",
            "duration": 90
          }
        },
        "createdAt": "2026-01-10T09:00:00Z",
        "updatedAt": "2026-01-11T11:30:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### PUT /tasks/:taskId/status
Update task status.

**Request:**
```json
{
  "status": "completed",
  "notes": "All documents organized and indexed",
  "deliverables": [
    {
      "type": "file",
      "name": "organized_documents.zip",
      "url": "https://files.milassist.com/doc_123.zip"
    },
    {
      "type": "document",
      "name": "document_index.pdf",
      "url": "https://files.milassist.com/index_123.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_123456",
    "status": "completed",
    "completedAt": "2026-01-11T12:00:00Z",
    "totalHours": 2.5,
    "deliverables": [
      {
        "type": "file",
        "name": "organized_documents.zip",
        "url": "https://files.milassist.com/doc_123.zip"
      }
    ]
  },
  "message": "Task completed successfully"
}
```

### Communication Endpoints

#### GET /messages
Get user's messages.

**Query Parameters:**
- `type`: `all`, `sent`, `received`
- `status`: `read`, `unread`
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123456",
        "from": {
          "id": "user_789",
          "name": "John Client",
          "email": "john@example.com"
        },
        "to": {
          "id": "user_456",
          "name": "Jane Assistant",
          "email": "jane@example.com"
        },
        "subject": "Document Organization Question",
        "content": "I have a question about the document organization method...",
        "status": "unread",
        "priority": "normal",
        "attachments": [
          {
            "name": "sample_document.pdf",
            "url": "https://files.milassist.com/sample_123.pdf",
            "size": 1024000
          }
        ],
        "createdAt": "2026-01-11T11:30:00Z",
        "readAt": null
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### POST /messages
Send a new message.

**Request:**
```json
{
  "to": "user_456",
  "subject": "Task Update",
  "content": "I've completed the first phase of document organization...",
  "priority": "normal",
  "attachments": [
    {
      "name": "progress_report.pdf",
      "url": "https://files.milassist.com/progress_123.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg_789012",
    "from": {
      "id": "user_123",
      "name": "John Client",
      "email": "john@example.com"
    },
    "to": {
      "id": "user_456",
      "name": "Jane Assistant",
      "email": "jane@example.com"
    },
    "subject": "Task Update",
    "content": "I've completed the first phase of document organization...",
    "status": "sent",
    "createdAt": "2026-01-11T12:00:00Z"
  },
  "message": "Message sent successfully"
}
```

### Payment Endpoints

#### GET /invoices
Get user's invoices.

**Query Parameters:**
- `status`: `pending`, `paid`, `overdue`, `cancelled`
- `type`: `sent`, `received`
- `limit`: Number of results (default: 20)
- `offset`: Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "inv_123456",
        "number": "INV-2026-001",
        "from": {
          "id": "assistant_456",
          "name": "Jane Assistant",
          "email": "jane@example.com"
        },
        "to": {
          "id": "client_123",
          "name": "John Client",
          "email": "john@example.com"
        },
        "items": [
          {
            "description": "Document Organization",
            "quantity": 3,
            "rate": 25.00,
            "amount": 75.00
          }
        ],
        "subtotal": 75.00,
        "tax": 6.00,
        "total": 81.00,
        "status": "pending",
        "dueDate": "2026-01-25T00:00:00Z",
        "createdAt": "2026-01-11T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### POST /invoices/:invoiceId/pay
Process payment for invoice.

**Request:**
```json
{
  "paymentMethod": "card",
  "cardToken": "pm_stripe_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "pay_789012",
    "status": "processing",
    "amount": 81.00,
    "currency": "USD",
    "processedAt": "2026-01-11T12:05:00Z"
  },
  "message": "Payment processing initiated"
}
```

### Travel Service Endpoints

#### POST /travel/flights/search
Search for flights using Google Flights integration.

**Request:**
```json
{
  "origin": "JFK",
  "destination": "LAX",
  "departureDate": "2026-02-01",
  "returnDate": "2026-02-08",
  "passengers": 1,
  "class": "economy",
  "directOnly": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "searchId": "search_123456",
    "flights": [
      {
        "id": "flight_789",
        "airline": "Delta Airlines",
        "flightNumber": "DL123",
        "origin": {
          "airport": "JFK",
          "city": "New York",
          "country": "US"
        },
        "destination": {
          "airport": "LAX",
          "city": "Los Angeles",
          "country": "US"
        },
        "departure": {
          "time": "2026-02-01T08:00:00Z",
          "terminal": "4"
        },
        "arrival": {
          "time": "2026-02-01T11:30:00Z",
          "terminal": "2"
        },
        "duration": "5h 30m",
        "price": {
          "total": 342.50,
          "currency": "USD",
          "breakdown": {
            "base": 298.00,
            "taxes": 44.50
          }
        },
        "stops": 0,
        "bookingUrl": "https://www.google.com/travel/flights/..."
      }
    ],
    "searchCompletedAt": "2026-01-11T12:00:00Z"
  },
  "message": "Flight search completed successfully"
}
```

### Twilio Integration Endpoints

#### POST /twilio/make-call
Initiate outbound call.

**Request:**
```json
{
  "to": "+1234567890",
  "clientId": "client_123",
  "assistantId": "assistant_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "callSid": "CA1234567890abcdef",
    "status": "queued",
    "to": "+1234567890",
    "from": "+0987654321"
  },
  "message": "Call initiated successfully"
}
```

#### POST /twilio/send-sms
Send SMS message.

**Request:**
```json
{
  "to": "+1234567890",
  "message": "Your task has been completed successfully.",
  "clientId": "client_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sid": "SM1234567890abcdef",
    "status": "queued",
    "to": "+1234567890",
    "from": "+0987654321"
  },
  "message": "SMS sent successfully"
}
```

## Error Handling

### Standard Error Format

All API errors follow this consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "field_name",
      "reason": "Specific error reason"
    },
    "timestamp": "2026-01-11T12:00:00Z",
    "requestId": "req_123456789",
    "path": "/api/v1/endpoint"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict or duplicate |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `EXTERNAL_SERVICE_ERROR` | 502 | Third-party service error |

## Rate Limiting

### Rate Limits by Endpoint

| Endpoint | Limit | Window |
|----------|-------|--------|
| Authentication | 5 requests | 15 minutes |
| Profile Updates | 10 requests | 1 hour |
| Message Sending | 100 requests | 1 hour |
| File Upload | 50 requests | 1 hour |
| General API | 1000 requests | 1 hour |

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641892800
```

## API Versioning

### Version Strategy

- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Semantic Versioning**: Major.Minor.Patch
- **Backward Compatibility**: Previous major version supported for 12 months
- **Deprecation Notice**: 6-month notice before version removal

### Version Headers

```http
API-Version: 1.0
Supported-Versions: 1.0, 1.1
Deprecated-Versions: 0.9
```

## Webhooks

### Webhook Events

| Event | Description | Payload |
|-------|-------------|---------|
| `task.created` | New task created | Task object |
| `task.completed` | Task completed | Task object |
| `message.received` | New message received | Message object |
| `payment.processed` | Payment completed | Payment object |
| `invoice.created` | New invoice created | Invoice object |

### Webhook Configuration

```json
{
  "url": "https://your-app.com/webhooks",
  "events": ["task.created", "task.completed"],
  "secret": "webhook_secret_here"
}
```

---

*API Version: 1.0*
*Last Updated: 2026-01-11*
*Owner: Architecture Agent*
