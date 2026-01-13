import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'MilAssist',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Military Assistant Platform',
    },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'supportPhone',
      type: 'text',
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable maintenance mode to prevent user access',
      },
    },
    {
      name: 'allowRegistration',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Allow new user registrations',
      },
    },
    {
      name: 'maxFileUploadSize',
      type: 'number',
      defaultValue: 10485760, // 10MB in bytes
      admin: {
        description: 'Maximum file upload size in bytes',
      },
    },
  ],
}
