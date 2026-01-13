import type { CollectionConfig } from 'payload';

const CalendarConnections: CollectionConfig = {
  slug: 'calendar-connections',
  admin: {
    useAsTitle: 'provider',
    group: 'Integrations',
    defaultColumns: ['provider', 'user', 'calendar_name', 'status', 'last_sync', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own calendar connections
      // Admins can read all calendar connections
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    create: ({ req: { user } }: any) => !!user, // Any authenticated user can create calendar connections
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can update their own calendar connections
      // Admins can update any calendar connections
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can delete their own calendar connections
      // Admins can delete any calendar connections
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who owns this calendar connection',
      },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Google Calendar', value: 'google' },
        { label: 'Outlook Calendar', value: 'outlook' },
        { label: 'Apple Calendar', value: 'apple' },
        { label: 'Exchange Server', value: 'exchange' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Calendar provider',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Disconnected', value: 'disconnected' },
        { label: 'Error', value: 'error' },
        { label: 'Expired', value: 'expired' },
        { label: 'Suspended', value: 'suspended' },
      ],
      admin: {
        description: 'Connection status',
        position: 'sidebar',
      },
    },
    {
      name: 'calendar_id',
      type: 'text',
      admin: {
        description: 'Provider calendar ID',
      },
    },
    {
      name: 'calendar_name',
      type: 'text',
      admin: {
        description: 'Display name of the calendar',
      },
    },
    {
      name: 'calendar_description',
      type: 'textarea',
      admin: {
        description: 'Description of the calendar',
        rows: 2,
      },
    },
    {
      name: 'access_token',
      type: 'text',
      required: true,
      admin: {
        description: 'OAuth access token',
        condition: (data: any) => false, // Hidden in admin UI for security
      },
    },
    {
      name: 'refresh_token',
      type: 'text',
      admin: {
        description: 'OAuth refresh token',
        condition: (data: any) => false, // Hidden in admin UI for security
      },
    },
    {
      name: 'token_expiry',
      type: 'date',
      admin: {
        description: 'When the access token expires',
        position: 'sidebar',
      },
    },
    {
      name: 'sync_settings',
      type: 'group',
      fields: [
        {
          name: 'auto_sync',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically sync calendar events',
          },
        },
        {
          name: 'sync_frequency',
          type: 'select',
          defaultValue: '15',
          options: [
            { label: 'Every 5 minutes', value: '5' },
            { label: 'Every 15 minutes', value: '15' },
            { label: 'Every 30 minutes', value: '30' },
            { label: 'Every hour', value: '60' },
            { label: 'Every 4 hours', value: '240' },
            { label: 'Daily', value: '1440' },
          ],
          admin: {
            description: 'How often to sync calendar events',
          },
        },
        {
          name: 'sync_direction',
          type: 'select',
          defaultValue: 'both',
          options: [
            { label: 'Import only (read from calendar)', value: 'import' },
            { label: 'Export only (write to calendar)', value: 'export' },
            { label: 'Bidirectional (read and write)', value: 'both' },
          ],
          admin: {
            description: 'Direction of synchronization',
          },
        },
        {
          name: 'sync_past_days',
          type: 'number',
          min: 0,
          max: 365,
          defaultValue: 30,
          admin: {
            description: 'Number of past days to sync',
          },
        },
        {
          name: 'sync_future_days',
          type: 'number',
          min: 1,
          max: 365,
          defaultValue: 90,
          admin: {
            description: 'Number of future days to sync',
          },
        },
      ],
      admin: {
        description: 'Synchronization settings',
      },
    },
    {
      name: 'event_filters',
      type: 'group',
      fields: [
        {
          name: 'include_private_events',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Include private calendar events',
          },
        },
        {
          name: 'include_all_day_events',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Include all-day events',
          },
        },
        {
          name: 'include_recurring_events',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Include recurring events',
          },
        },
        {
          name: 'exclude_cancelled_events',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Exclude cancelled events',
          },
        },
        {
          name: 'event_title_filter',
          type: 'text',
          admin: {
            description: 'Only sync events with titles containing this text (leave empty for all)',
          },
        },
      ],
      admin: {
        description: 'Event filtering options',
      },
    },
    {
      name: 'last_sync',
      type: 'date',
      admin: {
        description: 'Last successful synchronization',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'sync_stats',
      type: 'group',
      fields: [
        {
          name: 'events_synced',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Total events synchronized',
          },
        },
        {
          name: 'last_event_date',
          type: 'date',
          admin: {
            description: 'Date of the most recent event synced',
          },
        },
        {
          name: 'sync_errors',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Number of sync errors',
          },
        },
      ],
      admin: {
        description: 'Synchronization statistics',
        position: 'sidebar',
      },
    },
    {
      name: 'webhook_url',
      type: 'text',
      admin: {
        description: 'Webhook URL for real-time notifications',
        condition: (data: any) => data.provider === 'google' || data.provider === 'outlook',
      },
    },
    {
      name: 'notification_settings',
      type: 'group',
      fields: [
        {
          name: 'notify_on_new_events',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send notifications for new calendar events',
          },
        },
        {
          name: 'notify_on_conflicts',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send notifications when scheduling conflicts occur',
          },
        },
        {
          name: 'notify_on_sync_errors',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send notifications when sync errors occur',
          },
        },
        {
          name: 'quiet_hours_start',
          type: 'text',
          admin: {
            description: 'Start of quiet hours (HH:MM)',
          },
        },
        {
          name: 'quiet_hours_end',
          type: 'text',
          admin: {
            description: 'End of quiet hours (HH:MM)',
          },
        },
      ],
      admin: {
        description: 'Notification preferences',
      },
    },
    {
      name: 'error_message',
      type: 'textarea',
      admin: {
        description: 'Last error message',
        condition: (data: any) => data.status === 'error',
        rows: 3,
      },
    },
    {
      name: 'custom_settings',
      type: 'json',
      admin: {
        description: 'Additional provider-specific settings',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Calendar connection ${operation}d:`, {
            provider: doc.provider,
            calendar_name: doc.calendar_name,
            status: doc.status,
            user: doc.user,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Calendar connections should not have drafts
  },
};

export default CalendarConnections;
