import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isAdminField } from '../access/isAdminField'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: false, // Set to true if you want email verification
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
    useAPIKey: true,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'User Management',
  },
  access: {
    create: () => true, // Allow public registration
    read: () => true, // Allow users to read their own data
    update: ({ req: { user } }) => {
      // Users can update their own profile, admins can update anyone
      if (user?.role === 'admin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'client',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Client',
          value: 'client',
        },
        {
          label: 'Assistant',
          value: 'assistant',
        },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
    {
      name: 'profileData',
      type: 'json',
      label: 'Profile Data',
      admin: {
        description: 'Additional profile information (flexible JSON)',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    // TODO: Add avatar field when Media collection is implemented
    // {
    //   name: 'avatar',
    //   type: 'upload',
    //   relationTo: 'media',
    //   label: 'Profile Picture',
    // },
    {
      name: 'ssoProvider',
      type: 'select',
      label: 'SSO Provider',
      options: [
        {
          label: 'None (Email/Password)',
          value: 'none',
        },
        {
          label: 'Google',
          value: 'google',
        },
        {
          label: 'Microsoft',
          value: 'microsoft',
        },
      ],
      defaultValue: 'none',
      admin: {
        readOnly: true,
        description: 'Authentication method used',
      },
    },
    {
      name: 'ssoId',
      type: 'text',
      label: 'SSO User ID',
      admin: {
        readOnly: true,
        description: 'Unique ID from SSO provider',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: 'Last Login',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
        },
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Update lastLogin on login
        if (operation === 'update' && req.user) {
          data.lastLogin = new Date()
        }
        return data
      },
    ],
  },
}
