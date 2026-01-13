import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'sender', 'receiver', 'readStatus', 'createdAt'],
    group: 'Communication',
  },
  access: {
    create: ({ req: { user } }) => {
      // Authenticated users can create messages
      return !!user
    },
    read: ({ req: { user } }) => {
      // Users can read messages they're involved in, admins can read all
      if (user?.role === 'admin') return true
      return false // Simplified for now - will implement proper access later
    },
    update: ({ req: { user } }) => {
      // Users can update their own messages, admins can update all
      if (user?.role === 'admin') return true
      if (!user) return false
      return {
        sender: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Users can delete their own messages, admins can delete all
      if (user?.role === 'admin') return true
      if (!user) return false
      return {
        sender: {
          equals: user.id,
        },
      }
    },
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Message Content',
      admin: {
        description: 'The text content of the message',
      },
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who sent the message',
        readOnly: true,
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
      name: 'receiver',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who should receive the message',
      },
    },
    {
      name: 'readStatus',
      type: 'checkbox',
      label: 'Read',
      defaultValue: false,
      admin: {
        description: 'Whether the message has been read by the receiver',
      },
    },
    {
      name: 'readAt',
      type: 'date',
      label: 'Read At',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
        },
      },
    },
    {
      name: 'messageType',
      type: 'select',
      label: 'Message Type',
      defaultValue: 'text',
      options: [
        {
          label: 'Text',
          value: 'text',
        },
        {
          label: 'System',
          value: 'system',
        },
        {
          label: 'File',
          value: 'file',
        },
      ],
      admin: {
        description: 'Type of message',
      },
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Attachments',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
        },
      ],
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
    beforeChange: [
      async ({ data, req, operation }) => {
        // Mark as read if sender is also receiver (system messages)
        if (operation === 'create' && data.sender === data.receiver) {
          data.readStatus = true
          data.readAt = new Date()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // TODO: Add real-time notification logic
        // This could trigger WebSocket events or push notifications
        if (operation === 'create') {
          console.log(`Message ${doc.id} sent from ${doc.sender} to ${doc.receiver}`)
        }
      },
    ],
  },
}
