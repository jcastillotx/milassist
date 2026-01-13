import type { CollectionConfig } from 'payload/types';

const OnCallAssistants: CollectionConfig = {
  slug: 'on-call-assistants',
  admin: {
    useAsTitle: 'assistant',
    group: 'Assistant Management',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // All authenticated users can read on-call status
      return true;
    },
    create: ({ req: { user } }: any) => user?.role === 'admin',
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Admins can update, assistants can update their own status
      return user.role === 'admin' || user.role === 'assistant';
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'assistant',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant who can be on-call',
      },
    },
    {
      name: 'isOnCall',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description: 'Whether this assistant is currently available for on-call duty',
      },
    },
    {
      name: 'onCallSchedule',
      type: 'array',
      fields: [
        {
          name: 'dayOfWeek',
          type: 'select',
          required: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'startTime',
          type: 'text', // HH:MM format
          required: true,
          validate: (value: string) => {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return timeRegex.test(value) || 'Must be in HH:MM format';
          },
        },
        {
          name: 'endTime',
          type: 'text', // HH:MM format
          required: true,
          validate: (value: string) => {
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return timeRegex.test(value) || 'Must be in HH:MM format';
          },
        },
      ],
      admin: {
        description: 'Regular on-call schedule for this assistant',
      },
    },
    {
      name: 'maxConcurrentChats',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      defaultValue: 3,
      admin: {
        description: 'Maximum number of concurrent chats this assistant can handle',
      },
    },
    {
      name: 'currentChatCount',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Current number of active chats (auto-updated)',
        readOnly: true,
      },
    },
    {
      name: 'skills',
      type: 'array',
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
        {
          name: 'proficiency',
          type: 'select',
          required: true,
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'Expert', value: 'expert' },
          ],
        },
      ],
      admin: {
        description: 'Special skills or expertise areas',
      },
    },
    {
      name: 'lastActivity',
      type: 'date',
      admin: {
        description: 'Last time this assistant was active',
        readOnly: true,
      },
    },
    {
      name: 'totalChatsHandled',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Total number of chats handled',
        readOnly: true,
      },
    },
    {
      name: 'averageResponseTime',
      type: 'number',
      min: 0,
      admin: {
        description: 'Average response time in minutes',
        readOnly: true,
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 0,
      max: 5,
      admin: {
        description: 'Average client rating',
        readOnly: true,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      required: true,
      defaultValue: true,
      admin: {
        description: 'Whether this assistant is active in the on-call system',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: any) => {
        if (operation === 'create') {
          // Ensure assistant is approved before adding to on-call
          // This will be validated in the API
        }
      },
    ],
  },
};

export default OnCallAssistants;
