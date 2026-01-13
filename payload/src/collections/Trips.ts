import type { CollectionConfig } from 'payload';

const Trips: CollectionConfig = {
  slug: 'trips',
  admin: {
    useAsTitle: 'destination',
    group: 'Travel Management',
    defaultColumns: ['destination', 'client', 'start_date', 'end_date', 'status'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Clients can read their own trips, assistants can read assigned trips, admins can read all
      if (user.role === 'admin') return true;
      if (user.role === 'assistant') return true; // Will filter by assignment in query
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
      };
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'assistant', // Only assistants can create trips
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      return ['admin', 'assistant'].includes(user.role);
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'destination',
      type: 'text',
      required: true,
      admin: {
        description: 'Travel destination (city, country)',
      },
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      admin: {
        description: 'Trip start date',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'end_date',
      type: 'date',
      required: true,
      admin: {
        description: 'Trip end date',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: {
          equals: 'client',
        },
      },
      admin: {
        description: 'Client who booked this trip',
      },
    },
    {
      name: 'assignedAssistant',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant assigned to manage this trip',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Booked', value: 'booked' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Current status of the trip',
      },
    },
    {
      name: 'flight_details',
      type: 'group',
      fields: [
        {
          name: 'airline',
          type: 'text',
          admin: {
            description: 'Airline name',
          },
        },
        {
          name: 'flight_number',
          type: 'text',
          admin: {
            description: 'Flight number (e.g., DL123)',
          },
        },
        {
          name: 'departure_airport',
          type: 'text',
          admin: {
            description: 'Departure airport code (e.g., JFK)',
          },
        },
        {
          name: 'arrival_airport',
          type: 'text',
          admin: {
            description: 'Arrival airport code (e.g., LAX)',
          },
        },
        {
          name: 'departure_time',
          type: 'date',
          admin: {
            description: 'Flight departure time',
          },
        },
        {
          name: 'arrival_time',
          type: 'date',
          admin: {
            description: 'Flight arrival time',
          },
        },
        {
          name: 'seat_class',
          type: 'select',
          options: [
            { label: 'Economy', value: 'economy' },
            { label: 'Premium Economy', value: 'premium_economy' },
            { label: 'Business', value: 'business' },
            { label: 'First Class', value: 'first_class' },
          ],
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: {
            description: 'Flight price in USD',
            step: 0.01,
          },
        },
      ],
      admin: {
        description: 'Flight booking details',
      },
    },
    {
      name: 'hotel_details',
      type: 'group',
      fields: [
        {
          name: 'hotel_name',
          type: 'text',
          admin: {
            description: 'Hotel name',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          admin: {
            description: 'Hotel address',
          },
        },
        {
          name: 'check_in_date',
          type: 'date',
          admin: {
            description: 'Check-in date',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'check_out_date',
          type: 'date',
          admin: {
            description: 'Check-out date',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'room_type',
          type: 'text',
          admin: {
            description: 'Room type (e.g., Deluxe King)',
          },
        },
        {
          name: 'price_per_night',
          type: 'number',
          min: 0,
          admin: {
            description: 'Price per night in USD',
            step: 0.01,
          },
        },
        {
          name: 'total_price',
          type: 'number',
          min: 0,
          admin: {
            description: 'Total hotel cost in USD',
            step: 0.01,
          },
        },
      ],
      admin: {
        description: 'Hotel booking details',
      },
    },
    {
      name: 'itinerary',
      type: 'array',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          admin: {
            description: 'Date of this itinerary item',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'time',
          type: 'text',
          admin: {
            description: 'Time (e.g., 14:00)',
          },
        },
        {
          name: 'activity',
          type: 'text',
          required: true,
          admin: {
            description: 'Activity or event description',
          },
        },
        {
          name: 'location',
          type: 'text',
          admin: {
            description: 'Location of the activity',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Additional notes',
          },
        },
      ],
      admin: {
        description: 'Daily itinerary and activities',
      },
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        {
          name: 'document',
          type: 'relationship',
          relationTo: 'documents',
          required: true,
          admin: {
            description: 'Travel document (passport, visa, etc.)',
          },
        },
        {
          name: 'document_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Passport', value: 'passport' },
            { label: 'Visa', value: 'visa' },
            { label: 'Travel Insurance', value: 'insurance' },
            { label: 'Hotel Confirmation', value: 'hotel_confirmation' },
            { label: 'Flight Ticket', value: 'flight_ticket' },
            { label: 'Itinerary', value: 'itinerary' },
            { label: 'Other', value: 'other' },
          ],
        },
      ],
      admin: {
        description: 'Travel documents and confirmations',
      },
    },
    {
      name: 'total_cost',
      type: 'number',
      min: 0,
      admin: {
        description: 'Total trip cost in USD',
        step: 0.01,
        readOnly: true, // Calculated field
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional trip notes and special requests',
      },
    },
    {
      name: 'created_by',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Assistant who created this trip record',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }: any) => {
        // Set created_by if not set
        if (!data.created_by && req.user) {
          data.created_by = req.user.id;
        }

        // Calculate total cost (basic calculation)
        let totalCost = 0;
        if (data.flight_details?.price) {
          totalCost += data.flight_details.price;
        }
        if (data.hotel_details?.total_price) {
          totalCost += data.hotel_details.total_price;
        }
        data.total_cost = totalCost;
      },
    ],
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          // Could trigger notifications or integrations here
          console.log(`Trip ${operation}d:`, doc.destination);
        }
      },
    ],
  },
};

export default Trips;
