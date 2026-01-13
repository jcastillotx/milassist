const axios = require('axios');
const { JSDOM } = require('jsdom');

class GoogleFlightsService {
  constructor() {
    this.scraperType = process.env.GOOGLE_FLIGHTS_SCRAPER_TYPE || 'free';
    this.oxylabsUsername = process.env.OXYLABS_USERNAME;
    this.oxylabsPassword = process.env.OXYLABS_PASSWORD;
    this.oxylabsEndpoint = process.env.OXYLABS_ENDPOINT || 'https://realtime.oxylabs.io/v1/queries';
  }

  /**
   * Search for flights based on provided parameters
   * @param {Object} searchParams - Flight search parameters
   * @param {string} searchParams.origin - Origin airport code
   * @param {string} searchParams.destination - Destination airport code
   * @param {string} searchParams.departure_date - Departure date (YYYY-MM-DD)
   * @param {string} searchParams.return_date - Return date (YYYY-MM-DD, optional)
   * @param {number} searchParams.passengers - Number of passengers (default: 1)
   * @param {string} searchParams.trip_type - 'oneway' or 'roundtrip' (default: 'roundtrip')
   * @param {string} searchParams.class - 'economy', 'business', or 'first' (default: 'economy')
   * @returns {Promise<Array>} Array of flight options
   */
  async searchFlights(searchParams) {
    try {
      if (this.scraperType === 'oxylabs') {
        return await this.searchWithOxylabs(searchParams);
      } else {
        return await this.searchWithFreeScraper(searchParams);
      }
    } catch (error) {
      console.error('Flight search error:', error);
      throw new Error('Failed to search flights');
    }
  }

  /**
   * Search flights using Oxylabs API
   */
  async searchWithOxylabs(searchParams) {
    if (!this.oxylabsUsername || !this.oxylabsPassword) {
      throw new Error('Oxylabs credentials not configured');
    }

    const googleFlightsUrl = this.generateGoogleFlightsUrl(searchParams);
    
    const payload = {
      source: 'google',
      render: 'html',
      url: googleFlightsUrl,
    };

    try {
      const response = await axios.post(
        this.oxylabsEndpoint,
        payload,
        {
          auth: {
            username: this.oxylabsUsername,
            password: this.oxylabsPassword
          },
          timeout: 30000
        }
      );

      const html = response.data.results[0].content;
      return this.parseFlightData(html);
    } catch (error) {
      console.error('Oxylabs API error:', error);
      throw new Error('Failed to fetch flight data from Oxylabs');
    }
  }

  /**
   * Search flights using free web scraping
   */
  async searchWithFreeScraper(searchParams) {
    const googleFlightsUrl = this.generateGoogleFlightsUrl(searchParams);
    
    try {
      const response = await axios.get(googleFlightsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 15000
      });

      return this.parseFlightData(response.data);
    } catch (error) {
      console.error('Free scraper error:', error);
      throw new Error('Failed to scrape flight data');
    }
  }

  /**
   * Generate Google Flights URL from search parameters
   */
  generateGoogleFlightsUrl(params) {
    const baseUrl = 'https://www.google.com/travel/flights/search';
    const tfsParams = this.buildTfsParameters(params);
    
    return `${baseUrl}?tfs=${tfsParams}&hl=en-US&curr=USD`;
  }

  /**
   * Build TFS (Travel Flight Search) parameters for Google Flights URL
   */
  buildTfsParameters(params) {
    // This is a simplified version - in production, you'd want to build
    // the actual TFS parameter that Google uses
    const encodedParams = Buffer.from(JSON.stringify({
      from: params.origin,
      to: params.destination,
      departure_date: params.departure_date,
      return_date: params.return_date,
      passengers: params.passengers || 1,
      trip_type: params.trip_type || 'roundtrip',
      class: params.class || 'economy'
    })).toString('base64');
    
    return encodedParams;
  }

  /**
   * Parse flight data from HTML content
   */
  parseFlightData(html) {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    const flights = [];
    
    // Look for flight listings - this selector may need to be updated
    // based on Google's current HTML structure
    const flightListings = document.querySelectorAll('.pIav2d, .flight-result, [data-testid*="flight"]');
    
    for (const listing of flightListings) {
      try {
        const flight = this.extractFlightInfo(listing);
        if (flight && flight.price) {
          flights.push(flight);
        }
      } catch (error) {
        console.error('Error parsing flight listing:', error);
        // Continue processing other flights
      }
    }
    
    return flights;
  }

  /**
   * Extract flight information from a single listing element
   */
  extractFlightInfo(listing) {
    const flight = {
      price: null,
      departure_time: null,
      arrival_time: null,
      airline: null,
      flight_number: null,
      stops: 0,
      duration: null,
      origin: null,
      destination: null,
      date: null,
      booking_url: null,
      full_detail: null
    };

    // Extract price
    const priceElement = listing.querySelector('.YMlIz, .price, [data-testid*="price"]');
    if (priceElement) {
      flight.price = priceElement.textContent.trim();
    }

    // Extract times
    const timeElements = listing.querySelectorAll('.eoY5cb, .time, [data-testid*="time"]');
    if (timeElements.length >= 2) {
      flight.departure_time = timeElements[0].textContent.trim();
      flight.arrival_time = timeElements[1].textContent.trim();
    }

    // Extract airline
    const airlineElement = listing.querySelector('.sSHqwe, .airline, [data-testid*="airline"]');
    if (airlineElement) {
      flight.airline = airlineElement.textContent.trim();
    }

    // Extract stops information
    const stopsElement = listing.querySelector('.BbVUQ, .stops, [data-testid*="stop"]');
    if (stopsElement) {
      const stopsText = stopsElement.textContent.toLowerCase();
      if (stopsText.includes('non-stop') || stopsText.includes('direct')) {
        flight.stops = 0;
      } else {
        const match = stopsText.match(/(\d+)/);
        flight.stops = match ? parseInt(match[1]) : 1;
      }
    }

    // Extract duration
    const durationElement = listing.querySelector('.mvVWf, .duration, [data-testid*="duration"]');
    if (durationElement) {
      flight.duration = durationElement.textContent.trim();
    }

    // Create full detail string
    const parts = [];
    if (flight.airline) parts.push(flight.airline);
    if (flight.duration) parts.push(flight.duration);
    if (flight.stops === 0) parts.push('Non-stop');
    else parts.push(`${flight.stops} stop${flight.stops > 1 ? 's' : ''}`);
    
    flight.full_detail = parts.join(' • ');

    return flight;
  }

  /**
   * Validate search parameters
   */
  validateSearchParams(params) {
    const required = ['origin', 'destination', 'departure_date'];
    const missing = required.filter(field => !params[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }

    // Validate airport codes (basic check)
    if (!/^[A-Z]{3,4}$/.test(params.origin.toUpperCase())) {
      throw new Error('Invalid origin airport code');
    }
    
    if (!/^[A-Z]{3,4}$/.test(params.destination.toUpperCase())) {
      throw new Error('Invalid destination airport code');
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(params.departure_date)) {
      throw new Error('Invalid departure date format. Use YYYY-MM-DD');
    }

    if (params.return_date && !/^\d{4}-\d{2}-\d{2}$/.test(params.return_date)) {
      throw new Error('Invalid return date format. Use YYYY-MM-DD');
    }

    return true;
  }

  /**
   * Get popular airport codes for autocomplete
   */
  async getPopularAirports() {
    // Return a list of popular airports for autocomplete functionality
    return [
      { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
      { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles' },
      { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago' },
      { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas' },
      { code: 'DEN', name: 'Denver International Airport', city: 'Denver' },
      { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco' },
      { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle' },
      { code: 'LAS', name: 'McCarran International Airport', city: 'Las Vegas' },
      { code: 'BOS', name: 'Logan International Airport', city: 'Boston' },
      { code: 'MIA', name: 'Miami International Airport', city: 'Miami' }
    ];
  }
}

module.exports = GoogleFlightsService;
