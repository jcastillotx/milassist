import type { CollectionConfig } from 'payload';

const VideoIntegrations: CollectionConfig = {
  slug: 'video-integrations',
  admin: {
    useAsTitle: 'provider',
    group: 'Integrations',
    defaultColumns: ['provider', 'user', 'status', 'last_meeting', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own video integrations
      // Admins can read all video integrations
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    create: ({ req: { user } }: any) => !!user, // Any authenticated user can create video integrations
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can update their own video integrations
      // Admins can update any video integrations
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can delete their own video integrations
      // Admins can delete any video integrations
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
        description: 'User who owns this video integration',
      },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Zoom', value: 'zoom' },
        { label: 'Google Meet', value: 'meet' },
        { label: 'Microsoft Teams', value: 'teams' },
        { label: 'Webex', value: 'webex' },
        { label: 'Jitsi', value: 'jitsi' },
        { label: 'Whereby', value: 'whereby' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Video conferencing provider',
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
        description: 'Integration status',
        position: 'sidebar',
      },
    },
    {
      name: 'provider_user_id',
      type: 'text',
      admin: {
        description: 'User ID from the video provider',
      },
    },
    {
      name: 'provider_email',
      type: 'email',
      admin: {
        description: 'Email associated with the video provider account',
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
      name: 'api_credentials',
      type: 'group',
      fields: [
        {
          name: 'api_key',
          type: 'text',
          admin: {
            description: 'API key for the video provider',
            condition: (data: any) => data.provider !== 'zoom' && data.provider !== 'meet' && data.provider !== 'teams',
          },
        },
        {
          name: 'api_secret',
          type: 'text',
          admin: {
            description: 'API secret for the video provider',
            condition: (data: any) => data.provider !== 'zoom' && data.provider !== 'meet' && data.provider !== 'teams',
          },
        },
        {
          name: 'webhook_secret',
          type: 'text',
          admin: {
            description: 'Webhook secret for verifying incoming webhooks',
          },
        },
      ],
      admin: {
        description: 'API credentials for the video provider',
      },
    },
    {
      name: 'meeting_settings',
      type: 'group',
      fields: [
        {
          name: 'default_meeting_duration',
          type: 'number',
          min: 15,
          max: 480,
          defaultValue: 60,
          admin: {
            description: 'Default meeting duration in minutes',
          },
        },
        {
          name: 'auto_record',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Automatically record meetings',
          },
        },
        {
          name: 'require_password',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Require password for meetings',
          },
        },
        {
          name: 'enable_waiting_room',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable waiting room for meetings',
          },
        },
        {
          name: 'mute_participants_on_entry',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Mute participants when they join',
          },
        },
        {
          name: 'allow_screen_share',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow screen sharing in meetings',
          },
        },
      ],
      admin: {
        description: 'Default meeting settings',
      },
    },
    {
      name: 'webhook_settings',
      type: 'group',
      fields: [
        {
          name: 'webhook_url',
          type: 'text',
          admin: {
            description: 'URL to receive webhook notifications',
          },
        },
        {
          name: 'webhook_events',
          type: 'array',
          dbName: 'webhooks',
          fields: [
            {
              name: 'event',
              type: 'select',
              options: [
                { label: 'Meeting Started', value: 'meeting.started' },
                { label: 'Meeting Ended', value: 'meeting.ended' },
                { label: 'Participant Joined', value: 'participant.joined' },
                { label: 'Participant Left', value: 'participant.left' },
                { label: 'Recording Completed', value: 'recording.completed' },
              ],
              admin: {
                description: 'Webhook event to subscribe to',
              },
            },
          ],
          admin: {
            description: 'Webhook events to receive',
          },
        },
      ],
      admin: {
        description: 'Webhook configuration for real-time notifications',
      },
    },
    {
      name: 'last_meeting',
      type: 'date',
      admin: {
        description: 'Date and time of the last meeting',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'meeting_stats',
      type: 'group',
      fields: [
        {
          name: 'total_meetings',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Total number of meetings created',
          },
        },
        {
          name: 'total_participants',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Total number of participants across all meetings',
          },
        },
        {
          name: 'total_duration',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Total meeting duration in minutes',
          },
        },
        {
          name: 'average_participants',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Average number of participants per meeting',
          },
        },
      ],
      admin: {
        description: 'Meeting statistics',
        position: 'sidebar',
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
      name: 'plan_limits',
      type: 'group',
      fields: [
        {
          name: 'max_meetings_per_month',
          type: 'number',
          min: 0,
          admin: {
            description: 'Maximum meetings allowed per month',
          },
        },
        {
          name: 'max_participants',
          type: 'number',
          min: 0,
          admin: {
            description: 'Maximum participants per meeting',
          },
        },
        {
          name: 'max_duration',
          type: 'number',
          min: 0,
          admin: {
            description: 'Maximum meeting duration in minutes',
          },
        },
        {
          name: 'storage_limit_gb',
          type: 'number',
          min: 0,
          admin: {
            description: 'Storage limit for recordings in GB',
          },
        },
      ],
      admin: {
        description: 'Plan limits and restrictions',
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
          console.log(`Video integration ${operation}d:`, {
            provider: doc.provider,
            status: doc.status,
            user: doc.user,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Video integrations should not have drafts
  },
};

export default VideoIntegrations;
