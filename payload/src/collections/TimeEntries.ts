import type { CollectionConfig } from 'payload';

const TimeEntries: CollectionConfig = {
  slug: 'time-entries',
  admin: {
    useAsTitle: 'description',
    group: 'Time Tracking',
    defaultColumns: ['assistant', 'client', 'task', 'startTime', 'duration_seconds'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Assistants can read their own time entries, clients can read time entries for their tasks, admins can read all
      if (user.role === 'admin') return true;
      if (user.role === 'assistant') return true; // Will filter by assistant in query
      if (user.role === 'client') return true; // Will filter by client in query
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'assistant', // Only assistants can create time entries
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Assistants can update their own entries, admins can update any
      if (user.role === 'admin') return true;
      return {
        assistant: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Description of the work performed',
      },
    },
    {
      name: 'startTime',
      type: 'date',
      required: true,
      admin: {
        description: 'When the work started',
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
        },
      },
    },
    {
      name: 'endTime',
      type: 'date',
      admin: {
        description: 'When the work ended (leave empty if still in progress)',
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
        },
      },
    },
    {
      name: 'duration_seconds',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Duration in seconds (calculated automatically)',
        readOnly: true,
      },
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      admin: {
        description: 'Associated task (optional)',
      },
    },
    {
      name: 'assistant',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant who performed the work',
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'client',
        },
      },
      admin: {
        description: 'Client associated with this time entry',
      },
    },
    {
      name: 'billable',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this time is billable to the client',
      },
    },
    {
      name: 'hourly_rate',
      type: 'number',
      min: 0,
      admin: {
        description: 'Hourly rate for billing (USD)',
        step: 0.01,
      },
    },
    {
      name: 'total_cost',
      type: 'number',
      min: 0,
      admin: {
        description: 'Total cost (calculated automatically)',
        readOnly: true,
        step: 0.01,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about the work',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for categorization (e.g., development, support, meeting)',
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
          data.duration_seconds = Math.max(0, Math.floor(durationMs / 1000));
        }

        // Calculate total cost if billable and hourly rate provided
        if (data.billable && data.hourly_rate && data.duration_seconds) {
          const hours = data.duration_seconds / 3600;
          data.total_cost = Math.round((hours * data.hourly_rate) * 100) / 100; // Round to 2 decimal places
        } else {
          data.total_cost = 0;
        }
      },
    ],
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Time entry ${operation}d:`, {
            assistant: doc.assistant,
            duration: doc.duration_seconds,
            billable: doc.billable,
          });
        }
      },
    ],
  },
};

export default TimeEntries;
