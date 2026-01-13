const express = require('express');
const router = express.Router();
const GoogleFlightsService = require('../services/googleFlightsService');
const authMiddleware = require('../middleware/auth');

const googleFlightsService = new GoogleFlightsService();

/**
 * @route   POST /api/travel/flights/search
 * @desc    Search for flights using Google Flights integration
 * @access  Private
 */
router.post('/flights/search', authMiddleware, async (req, res) => {
  try {
    const {
      origin,
      destination,
      departure_date,
      return_date,
      passengers = 1,
      trip_type = 'roundtrip',
      class: travelClass = 'economy'
    } = req.body;

    // Validate required parameters
    const searchParams = {
      origin: origin?.toUpperCase().trim(),
      destination: destination?.toUpperCase().trim(),
      departure_date,
      return_date,
      passengers: parseInt(passengers),
      trip_type,
      class: travelClass
    };

    googleFlightsService.validateSearchParams(searchParams);

    // Search for flights
    const flights = await googleFlightsService.searchFlights(searchParams);

    res.json({
      success: true,
      data: {
        flights,
        search_params: searchParams,
        total_results: flights.length
      },
      message: `Found ${flights.length} flight options`
    });

  } catch (error) {
    console.error('Flight search error:', error);
    res.status(400).json({
      success: false,
      error: {
        code: 'FLIGHT_SEARCH_ERROR',
        message: error.message || 'Failed to search flights'
      }
    });
  }
});

/**
 * @route   GET /api/travel/flights/airports
 * @desc    Get popular airports for autocomplete
 * @access  Private
 */
router.get('/flights/airports', authMiddleware, async (req, res) => {
  try {
    const airports = await googleFlightsService.getPopularAirports();
    
    res.json({
      success: true,
      data: { airports },
      message: 'Airports retrieved successfully'
    });
  } catch (error) {
    console.error('Airport list error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AIRPORT_LIST_ERROR',
        message: 'Failed to retrieve airport list'
      }
    });
  }
});

/**
 * @route   GET /api/travel/trips
 * @desc    Get user's travel trips
 * @access  Private
 */
router.get('/trips', authMiddleware, async (req, res) => {
  try {
    // This would typically query your database
    // For now, returning mock data
    const trips = [
      {
        id: 1,
        destination: 'New York, NY',
        start_date: '2024-03-15',
        end_date: '2024-03-20',
        status: 'booked',
        flight_info: {
          airline: 'Delta Airlines',
          flight_number: 'DL1234',
          departure_time: '08:30 AM',
          arrival_time: '11:45 AM'
        },
        hotel_info: {
          name: 'Marriott Marquis',
          address: '1535 Broadway, New York, NY',
          check_in: '2024-03-15',
          check_out: '2024-03-20'
        },
        budget: 2000,
        actual_cost: 1850
      }
    ];

    res.json({
      success: true,
      data: { trips },
      message: 'Trips retrieved successfully'
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_TRIPS_ERROR',
        message: 'Failed to retrieve trips'
      }
    });
  }
});

/**
 * @route   POST /api/travel/trips
 * @desc    Create a new travel trip
 * @access  Private
 */
router.post('/trips', authMiddleware, async (req, res) => {
  try {
    const {
      destination,
      start_date,
      end_date,
      flight_preferences,
      hotel_preferences,
      budget
    } = req.body;

    // Validate required fields
    if (!destination || !start_date) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Destination and start date are required'
        }
      });
    }

    // Create trip (this would typically save to database)
    const newTrip = {
      id: Date.now(),
      destination,
      start_date,
      end_date,
      flight_preferences: flight_preferences || '',
      hotel_preferences: hotel_preferences || '',
      budget: budget || null,
      status: 'draft',
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: { trip: newTrip },
      message: 'Trip created successfully'
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CREATE_TRIP_ERROR',
        message: 'Failed to create trip'
      }
    });
  }
});

/**
 * @route   GET /api/travel/trips/:id
 * @desc    Get specific trip details
 * @access  Private
 */
router.get('/trips/:id', authMiddleware, async (req, res) => {
  try {
    const tripId = req.params.id;
    
    // This would typically query your database
    // For now, returning mock data
    const trip = {
      id: parseInt(tripId),
      destination: 'New York, NY',
      start_date: '2024-03-15',
      end_date: '2024-03-20',
      status: 'booked',
      flight_info: {
        airline: 'Delta Airlines',
        flight_number: 'DL1234',
        departure_time: '08:30 AM',
        arrival_time: '11:45 AM',
        price: '$350.00'
      },
      hotel_info: {
        name: 'Marriott Marquis',
        address: '1535 Broadway, New York, NY',
        check_in: '2024-03-15',
        check_out: '2024-03-20',
        price: '$200.00/night'
      },
      itinerary: [
        {
          date: '2024-03-15',
          time: '08:30 AM',
          activity: 'Flight departure from JFK',
          location: 'John F. Kennedy Airport'
        },
        {
          date: '2024-03-15',
          time: '11:45 AM',
          activity: 'Arrival at LAX',
          location: 'Los Angeles International Airport'
        },
        {
          date: '2024-03-15',
          time: '02:00 PM',
          activity: 'Hotel check-in',
          location: 'Marriott Marquis'
        }
      ],
      documents: [
        {
          id: 1,
          name: 'Flight Confirmation.pdf',
          type: 'flight_confirmation',
          upload_date: '2024-03-10'
        },
        {
          id: 2,
          name: 'Hotel Booking.pdf',
          type: 'hotel_booking',
          upload_date: '2024-03-10'
        }
      ],
      budget: 2000,
      actual_cost: 1850,
      expenses: [
        { category: 'Flight', amount: 350, date: '2024-03-15' },
        { category: 'Hotel', amount: 1000, date: '2024-03-15' },
        { category: 'Meals', amount: 300, date: '2024-03-16' },
        { category: 'Transportation', amount: 200, date: '2024-03-17' }
      ]
    };

    res.json({
      success: true,
      data: { trip },
      message: 'Trip retrieved successfully'
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_TRIP_ERROR',
        message: 'Failed to retrieve trip'
      }
    });
  }
});

/**
 * @route   PUT /api/travel/trips/:id
 * @desc    Update trip details
 * @access  Private
 */
router.put('/trips/:id', authMiddleware, async (req, res) => {
  try {
    const tripId = req.params.id;
    const updates = req.body;

    // Update trip (this would typically update database)
    const updatedTrip = {
      id: parseInt(tripId),
      ...updates,
      updated_at: new Date().toISOString()
    };

    res.json({
      success: true,
      data: { trip: updatedTrip },
      message: 'Trip updated successfully'
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_TRIP_ERROR',
        message: 'Failed to update trip'
      }
    });
  }
});

/**
 * @route   DELETE /api/travel/trips/:id
 * @desc    Delete a trip
 * @access  Private
 */
router.delete('/trips/:id', authMiddleware, async (req, res) => {
  try {
    const tripId = req.params.id;
    
    // Delete trip (this would typically delete from database)
    
    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_TRIP_ERROR',
        message: 'Failed to delete trip'
      }
    });
  }
});

/**
 * @route   POST /api/travel/trips/:id/expenses
 * @desc    Add expense to trip
 * @access  Private
 */
router.post('/trips/:id/expenses', authMiddleware, async (req, res) => {
  try {
    const tripId = req.params.id;
    const { category, amount, description, date } = req.body;

    // Validate required fields
    if (!category || !amount) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Category and amount are required'
        }
      });
    }

    // Add expense (this would typically save to database)
    const newExpense = {
      id: Date.now(),
      trip_id: parseInt(tripId),
      category,
      amount: parseFloat(amount),
      description: description || '',
      date: date || new Date().toISOString().split('T')[0],
      created_by: req.user.id,
      created_at: new Date().toISOString()
    };

    res.status(201).json({
      success: true,
      data: { expense: newExpense },
      message: 'Expense added successfully'
    });
  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'ADD_EXPENSE_ERROR',
        message: 'Failed to add expense'
      }
    });
  }
});

module.exports = router;
