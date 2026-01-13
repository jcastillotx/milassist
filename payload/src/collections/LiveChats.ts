import type { CollectionConfig } from 'payload/types';

const LiveChats: CollectionConfig = {
  slug: 'live-chats',
  admin: {
    useAsTitle: 'client',
    group: 'Communication',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Clients can read their own chats, assistants can read assigned chats, admins can read all
      if (user.role === 'admin') return true;
      if (user.role === 'assistant') return true; // Will filter by assignment in query
      if (user.role === 'client') return true; // Will filter by ownership in query
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'client', // Only clients can start chats
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      return ['admin', 'assistant'].includes(user.role);
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin',
  },
  fields: [
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
        description: 'Client who initiated the chat',
      },
    },
    {
      name: 'assignedAssistant',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant assigned to handle this chat',
      },
    },
    {
      name: 'onCallAssistant',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'On-call assistant handling this chat (if assigned assistant unavailable)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'waiting',
      options: [
        { label: 'Waiting for Assistant', value: 'waiting' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Transferred', value: 'transferred' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
        { label: 'Abandoned', value: 'abandoned' },
      ],
      admin: {
        description: 'Current status of the chat',
      },
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      defaultValue: 'ai_chatbot',
      options: [
        { label: 'AI Chatbot', value: 'ai_chatbot' },
        { label: 'Live Chat', value: 'live_chat' },
        { label: 'Transferred from AI', value: 'transferred_from_ai' },
      ],
      admin: {
        description: 'How the chat was initiated',
      },
    },
    {
      name: 'subject',
      type: 'text',
      admin: {
        description: 'Brief description of the chat topic',
      },
    },
    {
      name: 'messages',
      type: 'array',
      fields: [
        {
          name: 'sender',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'senderType',
          type: 'select',
          required: true,
          options: [
            { label: 'Client', value: 'client' },
            { label: 'Assistant', value: 'assistant' },
            { label: 'AI Bot', value: 'ai_bot' },
            { label: 'System', value: 'system' },
          ],
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
          defaultValue: () => new Date(),
        },
        {
          name: 'isRead',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'attachments',
          type: 'array',
          fields: [
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'filename',
              type: 'text',
            },
          ],
        },
      ],
      admin: {
        description: 'Chat message history',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        description: 'When the chat was initiated',
      },
    },
    {
      name: 'assignedAt',
      type: 'date',
      admin: {
        description: 'When an assistant was assigned',
      },
    },
    {
      name: 'firstResponseAt',
      type: 'date',
      admin: {
        description: 'When the first response was sent',
      },
    },
    {
      name: 'resolvedAt',
      type: 'date',
      admin: {
        condition: (data: any) => ['resolved', 'closed'].includes(data?.status),
        description: 'When the chat was resolved',
      },
    },
    {
      name: 'rating',
      type: 'group',
      fields: [
        {
          name: 'score',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Client satisfaction rating (1-5)',
          },
        },
        {
          name: 'feedback',
          type: 'textarea',
          admin: {
            description: 'Client feedback',
          },
        },
        {
          name: 'ratedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
      admin: {
        description: 'Tags for categorization and search',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata (browser info, location, etc.)',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: any) => {
        if (operation === 'create') {
          // Auto-assign assistant based on availability
          // This will be handled by a separate function
        }
      },
    ],
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'update') {
          // Handle status changes (notifications, etc.)
          // This will be handled by a separate function
        }
      },
    ],
  },
};

export default LiveChats;
