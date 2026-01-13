# Google Flights Integration

This document outlines the technical implementation of Google Flights scraping capabilities integrated into the MilAssist travel services platform.

## 🌐 Overview

The Google Flights integration allows MilAssist to:
- Scrape real-time flight data from Google Flights
- Extract pricing, timing, and airline information
- Provide comprehensive flight search capabilities
- Support both free scraping methods and premium API integration

## 🔧 Implementation Options

### Option 1: Free Scraper (Basic)
Direct web scraping using BeautifulSoup and requests.

**Pros:**
- No additional costs
- Full control over scraping logic
- Immediate implementation

**Cons:**
- May be blocked by Google
- Requires maintenance when Google changes UI
- Limited reliability

### Option 2: Oxylabs API (Recommended)
Professional scraping service with guaranteed reliability.

**Pros:**
- High reliability and uptime
- Handles anti-bot measures
- Professional support
- Consistent data format

**Cons:**
- Additional cost
- Requires API subscription

## 📋 Technical Requirements

### Dependencies

```bash
# For free scraper
npm install cheerio axios

# For Oxylabs API
npm install axios
```

### Environment Variables

```env
# Google Flights Scraping
GOOGLE_FLIGHTS_SCRAPER_TYPE=free  # or 'oxylabs'
OXYLABS_USERNAME=your_username
OXYLABS_PASSWORD=your_password
OXYLABS_ENDPOINT=https://realtime.oxylabs.io/v1/queries
```

## 🚀 API Implementation

### Backend Service Structure

```javascript
// server/services/googleFlightsService.js
class GoogleFlightsService {
  constructor() {
    this.scraperType = process.env.GOOGLE_FLIGHTS_SCRAPER_TYPE || 'free';
  }

  async searchFlights(searchParams) {
    if (this.scraperType === 'oxylabs') {
      return this.searchWithOxylabs(searchParams);
    } else {
      return this.searchWithFreeScraper(searchParams);
    }
  }

  async searchWithOxylabs(searchParams) {
    // Oxylabs API implementation
  }

  async searchWithFreeScraper(searchParams) {
    // Free scraper implementation
  }
}
```

### API Endpoints

```javascript
// server/routes/travel.js
router.post('/api/travel/flights/search', async (req, res) => {
  try {
    const { origin, destination, date, passengers } = req.body;
    const flights = await googleFlightsService.searchFlights({
      origin,
      destination,
      date,
      passengers
    });
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📊 Data Structure

### Flight Data Model

```javascript
{
  "price": "$250.00",
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
```

## 🔄 Integration Flow

### 1. Search Request
Client submits flight search parameters to `/api/travel/flights/search`

### 2. URL Generation
Backend generates Google Flights URL based on search parameters

### 3. Data Scraping
Service scrapes flight data using selected method

### 4. Data Processing
Raw HTML is parsed and structured into flight objects

### 5. Response Return
Processed flight data is returned to client

## 🛡️ Error Handling

### Common Scenarios

```javascript
class FlightSearchError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

// Error codes
const ERROR_CODES = {
  NO_RESULTS: 'NO_RESULTS',
  INVALID_PARAMS: 'INVALID_PARAMS',
  SCRAPER_ERROR: 'SCRAPER_ERROR',
  RATE_LIMITED: 'RATE_LIMITED'
};
```

### Fallback Strategy

1. **Primary Method**: Attempt with configured scraper
2. **Fallback**: Switch to alternative method if primary fails
3. **Cache**: Return cached results if available
4. **Error**: Return appropriate error message to user

## 📈 Performance Considerations

### Caching Strategy

```javascript
// Cache flight results for 1 hour
const CACHE_TTL = 3600000; // 1 hour in milliseconds

const cache = new Map();

function getCachedResult(cacheKey) {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}
```

### Rate Limiting

- **Free Scraper**: 1 request per 2 seconds
- **Oxylabs API**: Follow provider limits
- **User Limits**: 10 searches per minute per user

## 🔒 Security & Compliance

### Data Privacy

- No personal data stored in flight searches
- Search queries logged for analytics only
- Compliance with Google's Terms of Service

### Rate Limiting

- IP-based rate limiting
- User-based throttling
- Request queue management

## 🧪 Testing

### Unit Tests

```javascript
describe('GoogleFlightsService', () => {
  test('should parse flight data correctly', async () => {
    const mockHtml = '<div class="flight-listing">...</div>';
    const result = await service.parseFlightData(mockHtml);
    expect(result).toHaveLength(expectedCount);
  });
});
```

### Integration Tests

```javascript
describe('Flight Search API', () => {
  test('should return flight results', async () => {
    const response = await request(app)
      .post('/api/travel/flights/search')
      .send({
        origin: 'JFK',
        destination: 'LAX',
        date: '2024-03-15'
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('flights');
  });
});
```

## 📚 References

- [Oxylabs Google Flights API](https://oxylabs.io/products/scraper-api/serp/google/flights)
- [Google Flights URL Structure](https://www.google.com/travel/flights)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [Oxylabs GitHub Example](https://github.com/oxylabs/how-to-scrape-google-flights)

## 🚀 Next Steps

1. **Choose Implementation Method**: Decide between free scraper or Oxylabs API
2. **Set Up Environment**: Configure necessary environment variables
3. **Implement Service**: Create the Google Flights service
4. **Add API Endpoints**: Create travel API routes
5. **Update Frontend**: Integrate with travel management interface
6. **Add Tests**: Implement comprehensive testing
7. **Monitor Performance**: Set up monitoring and logging

---

*Last Updated: 2026-01-10*
