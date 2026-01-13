import type { CollectionConfig } from 'payload';

const Meetings: CollectionConfig = {
  slug: 'meetings',
  admin: {
    useAsTitle: 'title',
    group: 'Communication',
    defaultColumns: ['title', 'client', 'assistant', 'startTime', 'status', 'provider'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read meetings they're involved in, admins can read all
      if (user.role === 'admin') return true;
      if (user.role === 'assistant' || user.role === 'client') return true; // Will filter by relationships in query
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'admin' || user?.role === 'assistant', // Admins and assistants can create meetings
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can update meetings they're involved in, admins can update any
      if (user.role === 'admin') return true;
      return true; // Will filter by relationships in query
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Meeting title or subject',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Meeting agenda or notes',
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
        description: 'Client attending the meeting',
      },
    },
    {
      name: 'assistant',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant hosting/facilitating the meeting',
      },
    },
    {
      name: 'startTime',
      type: 'date',
      required: true,
      admin: {
        description: 'Meeting start time',
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
        },
      },
    },
    {
      name: 'endTime',
      type: 'date',
      required: true,
      admin: {
        description: 'Meeting end time',
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
        },
      },
    },
    {
      name: 'duration_minutes',
      type: 'number',
      min: 0,
      admin: {
        description: 'Meeting duration in minutes (calculated automatically)',
        readOnly: true,
      },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Zoom', value: 'zoom' },
        { label: 'Google Meet', value: 'meet' },
        { label: 'Webex', value: 'webex' },
        { label: 'Microsoft Teams', value: 'teams' },
      ],
      admin: {
        description: 'Video conferencing platform',
      },
    },
    {
      name: 'meetingUrl',
      type: 'text',
      admin: {
        description: 'Full URL to join the meeting',
      },
    },
    {
      name: 'meetingId',
      type: 'text',
      admin: {
        description: 'Meeting ID (for Zoom, Webex, etc.)',
      },
    },
    {
      name: 'passcode',
      type: 'text',
      admin: {
        description: 'Meeting passcode or password',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Current status of the meeting',
      },
    },
    {
      name: 'recordingUrl',
      type: 'text',
      admin: {
        description: 'URL to meeting recording (if available)',
        condition: (data: any) => data.status === 'completed',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Meeting notes or summary',
        condition: (data: any) => data.status === 'completed',
      },
    },
    {
      name: 'attendees',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'attended',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this person attended the meeting',
          },
        },
      ],
      admin: {
        description: 'List of attendees and their attendance status',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: any) => {
        // Calculate duration if both start and end times are provided
        if (data.startTime && data.endTime) {
          const start = new Date(data.startTime);
          const end = new Date(data.endTime);
          const durationMs = end.getTime() - start.getTime();
          data.duration_minutes = Math.max(0, Math.floor(durationMs / (1000 * 60)));
        }
      },
    ],
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Meeting ${operation}d:`, {
            title: doc.title,
            client: doc.client,
            assistant: doc.assistant,
            startTime: doc.startTime,
            status: doc.status,
          });
        }
      },
    ],
  },
};

export default Meetings;
