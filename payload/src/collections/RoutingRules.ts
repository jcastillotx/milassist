import type { CollectionConfig } from 'payload';

const RoutingRules: CollectionConfig = {
  slug: 'routing-rules',
  admin: {
    useAsTitle: 'strategy',
    group: 'Communications',
    defaultColumns: ['strategy', 'client', 'assistant', 'is_active', 'business_hours_start', 'business_hours_end'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own routing rules
      // Assistants can read routing rules for their assigned clients
      // Admins can read all routing rules
      if (user.role === 'admin') return true;
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
      };
      if (user.role === 'assistant') return true; // Will filter by client relationships in query
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'admin' || user?.role === 'client', // Admins and clients can create routing rules
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can update their own routing rules
      // Assistants and admins can update any routing rules
      if (user.role === 'admin' || user.role === 'assistant') return true;
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
      };
      return false;
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete routing rules
  },
  fields: [
    {
      name: 'strategy',
      type: 'select',
      required: true,
      defaultValue: 'forward_to_assistant',
      options: [
        { label: 'Forward to Assistant', value: 'forward_to_assistant' },
        { label: 'Voicemail', value: 'voicemail' },
        { label: 'Forward to External Number', value: 'forward_to_external' },
        { label: 'Round Robin', value: 'round_robin' },
        { label: 'Priority Queue', value: 'priority_queue' },
      ],
      admin: {
        description: 'How incoming calls should be routed',
        position: 'sidebar',
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      admin: {
        description: 'Whether this routing rule is currently active',
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
        description: 'Client for whom this routing rule applies',
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
        description: 'Specific assistant to route calls to (if strategy requires it)',
        condition: (data: any) => data.strategy === 'forward_to_assistant',
      },
    },
    {
      name: 'assistants_pool',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Pool of assistants for round-robin or priority routing',
        condition: (data: any) => data.strategy === 'round_robin' || data.strategy === 'priority_queue',
      },
    },
    {
      name: 'forwarding_number',
      type: 'text',
      admin: {
        description: 'External phone number to forward calls to',
        condition: (data: any) => data.strategy === 'forward_to_external',
      },
    },
    {
      name: 'business_hours_start',
      type: 'text',
      required: true,
      defaultValue: '09:00',
      admin: {
        description: 'Business hours start time (HH:MM format)',
        position: 'sidebar',
      },
    },
    {
      name: 'business_hours_end',
      type: 'text',
      required: true,
      defaultValue: '17:00',
      admin: {
        description: 'Business hours end time (HH:MM format)',
        position: 'sidebar',
      },
    },
    {
      name: 'timezone',
      type: 'select',
      defaultValue: 'America/New_York',
      options: [
        { label: 'Eastern Time', value: 'America/New_York' },
        { label: 'Central Time', value: 'America/Chicago' },
        { label: 'Mountain Time', value: 'America/Denver' },
        { label: 'Pacific Time', value: 'America/Los_Angeles' },
        { label: 'UTC', value: 'UTC' },
      ],
      admin: {
        description: 'Timezone for business hours calculation',
        position: 'sidebar',
      },
    },
    {
      name: 'after_hours_strategy',
      type: 'select',
      defaultValue: 'voicemail',
      options: [
        { label: 'Voicemail', value: 'voicemail' },
        { label: 'Forward to External', value: 'forward_to_external' },
        { label: 'Emergency Contact', value: 'emergency_contact' },
      ],
      admin: {
        description: 'How to handle calls outside business hours',
      },
    },
    {
      name: 'emergency_contact',
      type: 'text',
      admin: {
        description: 'Emergency contact number for after-hours calls',
        condition: (data: any) => data.after_hours_strategy === 'emergency_contact',
      },
    },
    {
      name: 'voicemail_message',
      type: 'textarea',
      admin: {
        description: 'Custom voicemail message',
        rows: 3,
        condition: (data: any) => data.strategy === 'voicemail' || data.after_hours_strategy === 'voicemail',
      },
    },
    {
      name: 'priority_rules',
      type: 'array',
      fields: [
        {
          name: 'condition',
          type: 'select',
          options: [
            { label: 'Caller is VIP', value: 'vip_caller' },
            { label: 'Call from specific number', value: 'specific_number' },
            { label: 'Call contains keyword', value: 'keyword' },
            { label: 'Call during specific time', value: 'time_range' },
          ],
          admin: {
            description: 'Condition that triggers this priority rule',
          },
        },
        {
          name: 'value',
          type: 'text',
          admin: {
            description: 'Value for the condition (number, keyword, etc.)',
          },
        },
        {
          name: 'action',
          type: 'select',
          options: [
            { label: 'Route to specific assistant', value: 'route_to_assistant' },
            { label: 'Escalate priority', value: 'escalate_priority' },
            { label: 'Send notification', value: 'send_notification' },
          ],
          admin: {
            description: 'Action to take when condition is met',
          },
        },
        {
          name: 'target_assistant',
          type: 'relationship',
          relationTo: 'users',
          filterOptions: {
            role: {
              equals: 'assistant',
            },
          },
          admin: {
            description: 'Assistant to route to (if action requires it)',
            condition: (data: any) => data.action === 'route_to_assistant',
          },
        },
      ],
      admin: {
        description: 'Special routing rules based on call conditions',
        condition: (data: any) => data.strategy === 'priority_queue',
      },
    },
    {
      name: 'max_wait_time',
      type: 'number',
      min: 0,
      max: 300, // 5 minutes max
      admin: {
        description: 'Maximum time (seconds) caller should wait before fallback action',
        position: 'sidebar',
      },
    },
    {
      name: 'fallback_strategy',
      type: 'select',
      options: [
        { label: 'Voicemail', value: 'voicemail' },
        { label: 'Forward to External', value: 'forward_to_external' },
        { label: 'Next Assistant', value: 'next_assistant' },
        { label: 'Hang Up', value: 'hang_up' },
      ],
      admin: {
        description: 'What to do when max wait time is exceeded',
      },
    },
    {
      name: 'call_recording_enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether calls routed by this rule should be recorded',
        position: 'sidebar',
      },
    },
    {
      name: 'transcription_enabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether calls should be automatically transcribed',
        position: 'sidebar',
      },
    },
    {
      name: 'analytics_enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether to collect analytics for calls using this rule',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes about this routing rule',
        rows: 3,
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Routing rule ${operation}d:`, {
            strategy: doc.strategy,
            client: doc.client,
            assistant: doc.assistant,
            is_active: doc.is_active,
            business_hours: `${doc.business_hours_start}-${doc.business_hours_end}`,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Routing rules should not have drafts
  },
};

export default RoutingRules;
