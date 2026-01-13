import type { CollectionConfig } from 'payload';

const EmailConnections: CollectionConfig = {
  slug: 'email-connections',
  admin: {
    useAsTitle: 'email',
    group: 'Integrations',
    defaultColumns: ['email', 'provider', 'user', 'status', 'last_sync', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own email connections
      // Admins can read all email connections
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    create: ({ req: { user } }: any) => !!user, // Any authenticated user can create email connections
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can update their own email connections
      // Admins can update any email connections
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can delete their own email connections
      // Admins can delete any email connections
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
        description: 'User who owns this email connection',
      },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      options: [
        { label: 'Gmail', value: 'gmail' },
        { label: 'Outlook', value: 'outlook' },
        { label: 'Yahoo', value: 'yahoo' },
        { label: 'iCloud', value: 'icloud' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Email provider',
        position: 'sidebar',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Connected email address',
      },
    },
    {
      name: 'display_name',
      type: 'text',
      admin: {
        description: 'Display name for this email account',
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
      name: 'scopes',
      type: 'array',
      fields: [
        {
          name: 'scope',
          type: 'text',
          required: true,
          admin: {
            description: 'OAuth scope granted',
          },
        },
      ],
      admin: {
        description: 'OAuth scopes granted to this connection',
      },
    },
    {
      name: 'imap_settings',
      type: 'group',
      fields: [
        {
          name: 'host',
          type: 'text',
          admin: {
            description: 'IMAP server hostname',
          },
        },
        {
          name: 'port',
          type: 'number',
          min: 1,
          max: 65535,
          defaultValue: 993,
          admin: {
            description: 'IMAP server port',
          },
        },
        {
          name: 'secure',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Use SSL/TLS encryption',
          },
        },
      ],
      admin: {
        description: 'IMAP connection settings',
        condition: (data: any) => data.provider !== 'gmail' && data.provider !== 'outlook',
      },
    },
    {
      name: 'smtp_settings',
      type: 'group',
      fields: [
        {
          name: 'host',
          type: 'text',
          admin: {
            description: 'SMTP server hostname',
          },
        },
        {
          name: 'port',
          type: 'number',
          min: 1,
          max: 65535,
          defaultValue: 587,
          admin: {
            description: 'SMTP server port',
          },
        },
        {
          name: 'secure',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Use SSL/TLS encryption',
          },
        },
      ],
      admin: {
        description: 'SMTP connection settings',
        condition: (data: any) => data.provider !== 'gmail' && data.provider !== 'outlook',
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
            description: 'Automatically sync emails',
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
            description: 'How often to sync emails',
          },
        },
        {
          name: 'sync_folders',
          type: 'array',
          fields: [
            {
              name: 'folder',
              type: 'text',
              required: true,
              admin: {
                description: 'Email folder to sync (e.g., INBOX, Sent)',
              },
            },
          ],
          admin: {
            description: 'Email folders to synchronize',
          },
        },
        {
          name: 'archive_after_sync',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Archive emails after syncing',
          },
        },
      ],
      admin: {
        description: 'Email synchronization settings',
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
      name: 'sync_status',
      type: 'select',
      options: [
        { label: 'Idle', value: 'idle' },
        { label: 'Syncing', value: 'syncing' },
        { label: 'Error', value: 'error' },
        { label: 'Paused', value: 'paused' },
      ],
      defaultValue: 'idle',
      admin: {
        description: 'Current sync status',
        position: 'sidebar',
      },
    },
    {
      name: 'error_message',
      type: 'textarea',
      admin: {
        description: 'Last error message',
        condition: (data: any) => data.status === 'error' || data.sync_status === 'error',
        rows: 3,
      },
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'emails_synced',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Total emails synchronized',
          },
        },
        {
          name: 'last_email_date',
          type: 'date',
          admin: {
            description: 'Date of the most recent email synced',
          },
        },
        {
          name: 'folders_count',
          type: 'number',
          min: 0,
          defaultValue: 0,
          admin: {
            description: 'Number of folders being monitored',
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
        condition: (data: any) => data.provider === 'gmail' || data.provider === 'outlook',
      },
    },
    {
      name: 'notification_settings',
      type: 'group',
      fields: [
        {
          name: 'notify_on_new_email',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send notifications for new emails',
          },
        },
        {
          name: 'notify_on_error',
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
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Email connection ${operation}d:`, {
            email: doc.email,
            provider: doc.provider,
            status: doc.status,
            user: doc.user,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Email connections should not have drafts
  },
};

export default EmailConnections;
