import type { CollectionConfig } from 'payload';

const Integrations: CollectionConfig = {
  slug: 'integrations',
  admin: {
    useAsTitle: 'provider',
    group: 'Integrations',
    defaultColumns: ['provider', 'category', 'status', 'last_sync', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can read integrations
    create: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can create integrations
    update: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can update integrations
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete integrations
  },
  fields: [
    {
      name: 'provider',
      type: 'text',
      required: true,
      admin: {
        description: 'Integration provider name',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Communication', value: 'communication' },
        { label: 'Calendar', value: 'calendar' },
        { label: 'Video Conferencing', value: 'video' },
        { label: 'Email', value: 'email' },
        { label: 'Payment', value: 'payment' },
        { label: 'Storage', value: 'storage' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'CRM', value: 'crm' },
        { label: 'HR', value: 'hr' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Category of integration',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'inactive',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Error', value: 'error' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Deprecated', value: 'deprecated' },
      ],
      admin: {
        description: 'Integration status',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of the integration',
        rows: 3,
      },
    },
    {
      name: 'website',
      type: 'text',
      admin: {
        description: 'Provider website URL',
      },
    },
    {
      name: 'documentation_url',
      type: 'text',
      admin: {
        description: 'API documentation URL',
      },
    },
    {
      name: 'api_base_url',
      type: 'text',
      admin: {
        description: 'Base URL for API calls',
      },
    },
    {
      name: 'auth_type',
      type: 'select',
      options: [
        { label: 'OAuth 2.0', value: 'oauth2' },
        { label: 'API Key', value: 'api_key' },
        { label: 'Basic Auth', value: 'basic_auth' },
        { label: 'JWT', value: 'jwt' },
        { label: 'Webhook', value: 'webhook' },
        { label: 'None', value: 'none' },
      ],
      admin: {
        description: 'Authentication method',
      },
    },
    {
      name: 'credentials',
      type: 'group',
      fields: [
        {
          name: 'api_key',
          type: 'text',
          admin: {
            description: 'API key',
            condition: (data: any) => data.auth_type === 'api_key',
          },
        },
        {
          name: 'client_id',
          type: 'text',
          admin: {
            description: 'OAuth client ID',
            condition: (data: any) => data.auth_type === 'oauth2',
          },
        },
        {
          name: 'client_secret',
          type: 'text',
          admin: {
            description: 'OAuth client secret',
            condition: (data: any) => data.auth_type === 'oauth2',
          },
        },
        {
          name: 'access_token',
          type: 'text',
          admin: {
            description: 'Access token',
            condition: (data: any) => ['oauth2', 'jwt'].includes(data.auth_type),
          },
        },
        {
          name: 'refresh_token',
          type: 'text',
          admin: {
            description: 'Refresh token',
            condition: (data: any) => data.auth_type === 'oauth2',
          },
        },
        {
          name: 'token_expiry',
          type: 'date',
          admin: {
            description: 'Token expiry date',
            condition: (data: any) => ['oauth2', 'jwt'].includes(data.auth_type),
          },
        },
        {
          name: 'username',
          type: 'text',
          admin: {
            description: 'Username for basic auth',
            condition: (data: any) => data.auth_type === 'basic_auth',
          },
        },
        {
          name: 'password',
          type: 'text',
          admin: {
            description: 'Password for basic auth',
            condition: (data: any) => data.auth_type === 'basic_auth',
          },
        },
      ],
      admin: {
        description: 'Authentication credentials',
      },
    },
    {
      name: 'settings',
      type: 'json',
      admin: {
        description: 'Additional configuration settings',
      },
    },
    {
      name: 'rate_limits',
      type: 'group',
      fields: [
        {
          name: 'requests_per_minute',
          type: 'number',
          min: 1,
          admin: {
            description: 'Maximum requests per minute',
          },
        },
        {
          name: 'requests_per_hour',
          type: 'number',
          min: 1,
          admin: {
            description: 'Maximum requests per hour',
          },
        },
        {
          name: 'requests_per_day',
          type: 'number',
          min: 1,
          admin: {
            description: 'Maximum requests per day',
          },
        },
        {
          name: 'burst_limit',
          type: 'number',
          min: 1,
          admin: {
            description: 'Burst request limit',
          },
        },
      ],
      admin: {
        description: 'API rate limiting configuration',
      },
    },
    {
      name: 'webhooks',
      type: 'array',
      fields: [
        {
          name: 'event',
          type: 'text',
          required: true,
          admin: {
            description: 'Webhook event name',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            description: 'Webhook URL',
          },
        },
        {
          name: 'secret',
          type: 'text',
          admin: {
            description: 'Webhook secret for verification',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Whether this webhook is active',
          },
        },
      ],
      admin: {
        description: 'Webhook configurations',
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
          name: 'total_requests',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Total API requests made',
          },
        },
        {
          name: 'successful_requests',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Successful API requests',
          },
        },
        {
          name: 'failed_requests',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Failed API requests',
          },
        },
        {
          name: 'last_error',
          type: 'textarea',
          admin: {
            description: 'Last error message',
            rows: 2,
          },
        },
      ],
      admin: {
        description: 'API usage statistics',
        position: 'sidebar',
      },
    },
    {
      name: 'version',
      type: 'text',
      admin: {
        description: 'API version being used',
      },
    },
    {
      name: 'supported_features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
          admin: {
            description: 'Supported feature name',
          },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Whether this feature is enabled',
          },
        },
      ],
      admin: {
        description: 'Features supported by this integration',
      },
    },
    {
      name: 'maintenance_mode',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this integration is in maintenance mode',
        position: 'sidebar',
      },
    },
    {
      name: 'maintenance_message',
      type: 'textarea',
      admin: {
        description: 'Maintenance message to display',
        condition: (data: any) => data.maintenance_mode,
        rows: 2,
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Integration ${operation}d:`, {
            provider: doc.provider,
            category: doc.category,
            status: doc.status,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Integrations should not have drafts
  },
};

export default Integrations;
