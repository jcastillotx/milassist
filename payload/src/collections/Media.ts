import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'mimeType', 'filesize'],
    group: 'Content Management',
  },
  access: {
    read: () => true, // Public read access for uploaded files
    create: ({ req: { user } }) => {
      // Only authenticated users can upload
      return !!user
    },
    update: ({ req: { user } }) => {
      // Users can update their own uploads, admins can update all
      if (user?.role === 'admin') return true
      return {
        uploadedBy: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Users can delete their own uploads, admins can delete all
      if (user?.role === 'admin') return true
      return {
        uploadedBy: {
          equals: user?.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption',
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        description: 'User who uploaded this file',
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create' && req.user) {
              return req.user.id
            }
          },
        ],
      },
    },
  ],
  timestamps: true,
}
