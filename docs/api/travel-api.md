# Travel API Documentation

This document provides detailed information about the travel services API endpoints in the MilAssist platform.

## 🔗 Base URL

```
http://localhost:3000/api/travel
```

## 🔐 Authentication

All travel API endpoints require JWT authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## ✈️ Flight Search Endpoints

### Search Flights

Search for flights using Google Flights integration.

**Endpoint:** `POST /api/travel/flights/search`

**Request Body:**

```json
{
  "origin": "JFK",
  "destination": "LAX",
  "departure_date": "2024-03-15",
  "return_date": "2024-03-20",
  "passengers": 1,
  "trip_type": "roundtrip",
  "class": "economy"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| origin | string | Yes | Origin airport code (3-4 letters) |
| destination | string | Yes | Destination airport code (3-4 letters) |
| departure_date | string | Yes | Departure date (YYYY-MM-DD) |
| return_date | string | No | Return date (YYYY-MM-DD) |
| passengers | number | No | Number of passengers (default: 1) |
| trip_type | string | No | Trip type: 'oneway' or 'roundtrip' (default: 'roundtrip') |
| class | string | No | Travel class: 'economy', 'business', 'first' (default: 'economy') |

**Response:**

```json
{
  "success": true,
  "data": {
    "flights": [
      {
        "price": "$350.00",
        "departure_time": "08:30 AM",
        "arrival_time": "11:45 AM",
        "airline": "Delta Airlines",
        "flight_number": "DL1234",
        "stops": 0,
        "duration": "3h 15m",
        "origin": "JFK",
        "destination": "LAX",
        "date": "2024-03-15",
        "booking_url": "https://google.com/travel/flights/...",
        "full_detail": "Delta Airlines • DL1234 • Non-stop • 3h 15m"
      }
    ],
    "search_params": {
      "origin": "JFK",
      "destination": "LAX",
      "departure_date": "2024-03-15",
      "return_date": "2024-03-20",
      "passengers": 1,
      "trip_type": "roundtrip",
      "class": "economy"
    },
    "total_results": 1
  },
  "message": "Found 1 flight options"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "FLIGHT_SEARCH_ERROR",
    "message": "Failed to search flights"
  }
}
```

### Get Popular Airports

Retrieve a list of popular airports for autocomplete functionality.

**Endpoint:** `GET /api/travel/flights/airports`

**Response:**

```json
{
  "success": true,
  "data": {
    "airports": [
      {
        "code": "JFK",
        "name": "John F. Kennedy International Airport",
        "city": "New York"
      },
      {
        "code": "LAX",
        "name": "Los Angeles International Airport",
        "city": "Los Angeles"
      }
    ]
  },
  "message": "Airports retrieved successfully"
}
```

## 🏨 Trip Management Endpoints

### Get User Trips

Retrieve all trips for the authenticated user.

**Endpoint:** `GET /api/travel/trips`

**Response:**

```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": 1,
        "destination": "New York, NY",
        "start_date": "2024-03-15",
        "end_date": "2024-03-20",
        "status": "booked",
        "flight_info": {
          "airline": "Delta Airlines",
          "flight_number": "DL1234",
          "departure_time": "08:30 AM",
          "arrival_time": "11:45 AM"
        },
        "hotel_info": {
          "name": "Marriott Marquis",
          "address": "1535 Broadway, New York, NY",
          "check_in": "2024-03-15",
          "check_out": "2024-03-20"
        },
        "budget": 2000,
        "actual_cost": 1850
      }
    ]
  },
  "message": "Trips retrieved successfully"
}
```

### Create New Trip

Create a new travel trip.

**Endpoint:** `POST /api/travel/trips`

**Request Body:**

```json
{
  "destination": "New York, NY",
  "start_date": "2024-03-15",
  "end_date": "2024-03-20",
  "flight_preferences": "Delta, Window Seat, Morning departure",
  "hotel_preferences": "Downtown, 4-star, Gym required",
  "budget": 2000
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| destination | string | Yes | Travel destination |
| start_date | string | Yes | Trip start date (YYYY-MM-DD) |
| end_date | string | No | Trip end date (YYYY-MM-DD) |
| flight_preferences | string | No | Flight preferences and requirements |
| hotel_preferences | string | No | Hotel preferences and requirements |
| budget | number | No | Trip budget amount |

**Response:**

```json
{
  "success": true,
  "data": {
    "trip": {
      "id": 1640995200000,
      "destination": "New York, NY",
      "start_date": "2024-03-15",
      "end_date": "2024-03-20",
      "flight_preferences": "Delta, Window Seat, Morning departure",
      "hotel_preferences": "Downtown, 4-star, Gym required",
      "budget": 2000,
      "status": "draft",
      "created_by": 1,
      "created_at": "2024-01-10T15:30:00.000Z"
    }
  },
  "message": "Trip created successfully"
}
```

### Get Trip Details

Retrieve detailed information for a specific trip.

**Endpoint:** `GET /api/travel/trips/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "trip": {
      "id": 1,
      "destination": "New York, NY",
      "start_date": "2024-03-15",
      "end_date": "2024-03-20",
      "status": "booked",
      "flight_info": {
        "airline": "Delta Airlines",
        "flight_number": "DL1234",
        "departure_time": "08:30 AM",
        "arrival_time": "11:45 AM",
        "price": "$350.00"
      },
      "hotel_info": {
        "name": "Marriott Marquis",
        "address": "1535 Broadway, New York, NY",
        "check_in": "2024-03-15",
        "check_out": "2024-03-20",
        "price": "$200.00/night"
      },
      "itinerary": [
        {
          "date": "2024-03-15",
          "time": "08:30 AM",
          "activity": "Flight departure from JFK",
          "location": "John F. Kennedy Airport"
        }
      ],
      "documents": [
        {
          "id": 1,
          "name": "Flight Confirmation.pdf",
          "type": "flight_confirmation",
          "upload_date": "2024-03-10"
        }
      ],
      "budget": 2000,
      "actual_cost": 1850,
      "expenses": [
        {
          "category": "Flight",
          "amount": 350,
          "date": "2024-03-15"
        }
      ]
    }
  },
  "message": "Trip retrieved successfully"
}
```

### Update Trip

Update details for an existing trip.

**Endpoint:** `PUT /api/travel/trips/:id`

**Request Body:**

```json
{
  "destination": "Los Angeles, CA",
  "start_date": "2024-03-20",
  "end_date": "2024-03-25",
  "budget": 2500,
  "status": "confirmed"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "trip": {
      "id": 1,
      "destination": "Los Angeles, CA",
      "start_date": "2024-03-20",
      "end_date": "2024-03-25",
      "budget": 2500,
      "status": "confirmed",
      "updated_at": "2024-01-10T15:35:00.000Z"
    }
  },
  "message": "Trip updated successfully"
}
```

### Delete Trip

Delete a trip and all associated data.

**Endpoint:** `DELETE /api/travel/trips/:id`

**Response:**

```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

## 💰 Expense Management

### Add Expense

Add an expense to a trip.

**Endpoint:** `POST /api/travel/trips/:id/expenses`

**Request Body:**

```json
{
  "category": "Meals",
  "amount": 75.50,
  "description": "Dinner at Italian restaurant",
  "date": "2024-03-16"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | Yes | Expense category (Flight, Hotel, Meals, Transportation, etc.) |
| amount | number | Yes | Expense amount |
| description | string | No | Expense description |
| date | string | No | Expense date (YYYY-MM-DD, defaults to today) |

**Response:**

```json
{
  "success": true,
  "data": {
    "expense": {
      "id": 1640995200000,
      "trip_id": 1,
      "category": "Meals",
      "amount": 75.50,
      "description": "Dinner at Italian restaurant",
      "date": "2024-03-16",
      "created_by": 1,
      "created_at": "2024-01-10T15:40:00.000Z"
    }
  },
  "message": "Expense added successfully"
}
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `FLIGHT_SEARCH_ERROR` | Failed to search for flights |
| `AIRPORT_LIST_ERROR` | Failed to retrieve airport list |
| `GET_TRIPS_ERROR` | Failed to retrieve user trips |
| `CREATE_TRIP_ERROR` | Failed to create new trip |
| `GET_TRIP_ERROR` | Failed to retrieve trip details |
| `UPDATE_TRIP_ERROR` | Failed to update trip |
| `DELETE_TRIP_ERROR` | Failed to delete trip |
| `ADD_EXPENSE_ERROR` | Failed to add expense |
| `VALIDATION_ERROR` | Invalid request parameters |

## 🔄 Rate Limiting

Flight search endpoints are rate limited to prevent abuse:

- **Free Scraper**: 1 request per 2 seconds per user
- **Oxylabs API**: Follows provider rate limits
- **Trip Management**: 100 requests per minute per user

## 🧪 Testing Examples

### Search for Flights

```bash
curl -X POST http://localhost:3000/api/travel/flights/search \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "JFK",
    "destination": "LAX",
    "departure_date": "2024-03-15",
    "return_date": "2024-03-20",
    "passengers": 1,
    "trip_type": "roundtrip",
    "class": "economy"
  }'
```

### Create a Trip

```bash
curl -X POST http://localhost:3000/api/travel/trips \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "New York, NY",
    "start_date": "2024-03-15",
    "end_date": "2024-03-20",
    "budget": 2000
  }'
```

### Add Expense

```bash
curl -X POST http://localhost:3000/api/travel/trips/1/expenses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Meals",
    "amount": 75.50,
    "description": "Dinner at restaurant"
  }'
```

## 🔧 Configuration

### Environment Variables

```env
# Google Flights Configuration
GOOGLE_FLIGHTS_SCRAPER_TYPE=free  # or 'oxylabs'

# Oxylabs Configuration (if using Oxylabs)
OXYLABS_USERNAME=your_username
OXYLABS_PASSWORD=your_password
OXYLABS_ENDPOINT=https://realtime.oxylabs.io/v1/queries
```

## 📱 SDK Usage

### JavaScript

```javascript
// Search flights
const flightsResponse = await fetch('/api/travel/flights/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    origin: 'JFK',
    destination: 'LAX',
    departure_date: '2024-03-15',
    return_date: '2024-03-20'
  })
});

const flightsData = await flightsResponse.json();
```

### Python

```python
import requests

# Search flights
response = requests.post(
    'http://localhost:3000/api/travel/flights/search',
    headers={
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    },
    json={
        'origin': 'JFK',
        'destination': 'LAX',
        'departure_date': '2024-03-15',
        'return_date': '2024-03-20'
    }
)

flights_data = response.json()
```

---

*Last Updated: 2026-01-10*
