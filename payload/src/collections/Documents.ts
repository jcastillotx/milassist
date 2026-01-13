import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'client', 'createdAt'],
    group: 'Content Management',
  },
  access: {
    create: ({ req: { user } }) => {
      // Authenticated users can create documents
      return !!user
    },
    read: ({ req: { user } }) => {
      // Users can read documents they're involved in, admins can read all
      if (user?.role === 'admin') return true
      return false // Simplified for now - will implement proper access later
    },
    update: ({ req: { user } }) => {
      // Users can update documents they uploaded, admins can update all
      if (user?.role === 'admin') return true
      if (!user) return false
      return {
        uploadedBy: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Users can delete documents they uploaded, admins can delete all
      if (user?.role === 'admin') return true
      if (!user) return false
      return {
        uploadedBy: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Document Title',
    },
    {
      name: 'uploadedFile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'File',
      admin: {
        description: 'Upload the document file',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        {
          label: 'Contract',
          value: 'contract',
        },
        {
          label: 'Invoice',
          value: 'invoice',
        },
        {
          label: 'Report',
          value: 'report',
        },
        {
          label: 'Legal',
          value: 'legal',
        },
        {
          label: 'Training',
          value: 'training',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
      admin: {
        description: 'Document category for organization',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Review',
          value: 'review',
        },
        {
          label: 'Approved',
          value: 'approved',
        },
        {
          label: 'Archived',
          value: 'archived',
        },
      ],
      admin: {
        description: 'Document review status',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description of the document',
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
        description: 'Client this document belongs to (if applicable)',
      },
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
        description: 'User who uploaded this document',
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
    {
      name: 'tags',
      type: 'text',
      label: 'Tags',
      admin: {
        description: 'Comma-separated tags for search',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiration Date',
      admin: {
        date: {
          displayFormat: 'MMM dd, yyyy',
        },
        description: 'When this document expires (if applicable)',
      },
    },
    {
      name: 'version',
      type: 'text',
      label: 'Version',
      defaultValue: '1.0',
      admin: {
        description: 'Document version number',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
      admin: {
        description: 'Additional metadata (flexible JSON)',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // TODO: Add document processing logic
        // Could include OCR, virus scanning, etc.
        if (operation === 'create') {
          console.log(`Document ${doc.id} uploaded by ${doc.uploadedBy}`)
        }
      },
    ],
  },
}
