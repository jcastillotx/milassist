import type { CollectionConfig } from 'payload';

const Calls: CollectionConfig = {
  slug: 'calls',
  admin: {
    useAsTitle: 'caller_number',
    group: 'Communications',
    defaultColumns: ['caller_number', 'direction', 'status', 'client', 'assistant', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own call records
      // Assistants can read calls for their assigned clients
      // Admins can read all calls
      if (user.role === 'admin') return true;
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
      };
      if (user.role === 'assistant') return true; // Will filter by client relationships in query
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'admin' || user?.role === 'assistant', // Only admins and assistants can create call records
    update: ({ req: { user } }: any) => user?.role === 'admin' || user?.role === 'assistant', // Only admins and assistants can update call records
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete call records
  },
  fields: [
    {
      name: 'caller_number',
      type: 'text',
      required: true,
      admin: {
        description: 'Phone number of the caller',
      },
    },
    {
      name: 'direction',
      type: 'select',
      required: true,
      defaultValue: 'inbound',
      options: [
        { label: 'Inbound', value: 'inbound' },
        { label: 'Outbound', value: 'outbound' },
      ],
      admin: {
        description: 'Direction of the call',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'ringing',
      options: [
        { label: 'Ringing', value: 'ringing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Missed', value: 'missed' },
        { label: 'Voicemail', value: 'voicemail' },
        { label: 'Forwarded', value: 'forwarded' },
        { label: 'Busy', value: 'busy' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'Current status of the call',
        position: 'sidebar',
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
        description: 'Client associated with this call',
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
        description: 'Assistant who handled this call',
      },
    },
    {
      name: 'duration_seconds',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Duration of the call in seconds',
        position: 'sidebar',
      },
    },
    {
      name: 'duration_formatted',
      type: 'text',
      admin: {
        description: 'Human-readable duration (auto-calculated)',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, data }: any) => {
            // Auto-format duration for display
            const duration = siblingData.duration_seconds || data.duration_seconds || 0;
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
          },
        ],
      },
    },
    {
      name: 'recording_url',
      type: 'text',
      admin: {
        description: 'URL to the call recording (from Twilio)',
      },
    },
    {
      name: 'recording_file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Uploaded call recording file',
        condition: (data: any) => !data.recording_url, // Show if no external URL
      },
    },
    {
      name: 'transcription',
      type: 'textarea',
      admin: {
        description: 'Call transcription text',
        rows: 6,
      },
    },
    {
      name: 'twilio_call_sid',
      type: 'text',
      unique: true,
      admin: {
        description: 'Twilio Call SID for API reference',
        position: 'sidebar',
      },
    },
    {
      name: 'twilio_data',
      type: 'json',
      admin: {
        description: 'Raw Twilio webhook data',
        condition: (data: any) => data.twilio_call_sid, // Only show if Twilio SID exists
      },
    },
    {
      name: 'call_notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about the call',
        rows: 4,
      },
    },
    {
      name: 'follow_up_required',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether follow-up action is required',
        position: 'sidebar',
      },
    },
    {
      name: 'follow_up_notes',
      type: 'textarea',
      admin: {
        description: 'Notes about required follow-up actions',
        condition: (data: any) => data.follow_up_required,
        rows: 3,
      },
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        description: 'Priority level for follow-up',
        condition: (data: any) => data.follow_up_required,
        position: 'sidebar',
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
        description: 'Tags for categorization and search',
        position: 'sidebar',
      },
    },
    {
      name: 'quality_rating',
      type: 'select',
      options: [
        { label: '1 - Poor', value: '1' },
        { label: '2 - Below Average', value: '2' },
        { label: '3 - Average', value: '3' },
        { label: '4 - Good', value: '4' },
        { label: '5 - Excellent', value: '5' },
      ],
      admin: {
        description: 'Call quality rating',
        position: 'sidebar',
      },
    },
    {
      name: 'call_summary',
      type: 'textarea',
      admin: {
        description: 'Brief summary of the call content and outcome',
        rows: 3,
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Call ${operation}d:`, {
            caller: doc.caller_number,
            direction: doc.direction,
            status: doc.status,
            client: doc.client,
            assistant: doc.assistant,
            duration: doc.duration_seconds,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Call records should not have drafts
  },
};

export default Calls;
