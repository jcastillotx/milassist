import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { isOwner } from '../access/isOwner'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'priority', 'client', 'assistant', 'dueDate'],
    group: 'Task Management',
  },
  access: {
    create: ({ req: { user } }) => {
      // Clients can create tasks, assistants can create tasks for their clients, admins can create any
      return !!user
    },
    read: ({ req: { user } }) => {
      // Users can read tasks they're involved in, admins can read all
      if (user?.role === 'admin') return true
      return false // Simplified for now - will implement proper access later
    },
    update: ({ req: { user } }) => {
      // Users can update tasks they're involved in, admins can update all
      if (user?.role === 'admin') return true
      return false // Simplified for now - will implement proper access later
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Task Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Detailed description of the task',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'todo',
      options: [
        {
          label: 'To Do',
          value: 'todo',
        },
        {
          label: 'In Progress',
          value: 'in_progress',
        },
        {
          label: 'In Review',
          value: 'in_review',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        description: 'Current status of the task',
      },
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Urgent',
          value: 'urgent',
        },
      ],
      admin: {
        description: 'Priority level of the task',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Due Date',
      admin: {
        date: {
          displayFormat: 'MMM dd, yyyy',
        },
      },
    },
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
        description: 'Client this task belongs to',
      },
    },
    {
      name: 'assistant',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant assigned to this task',
      },
    },
    {
      name: 'estimatedHours',
      type: 'number',
      label: 'Estimated Hours',
      min: 0,
      admin: {
        description: 'Estimated time to complete the task',
      },
    },
    {
      name: 'actualHours',
      type: 'number',
      label: 'Actual Hours',
      min: 0,
      admin: {
        description: 'Actual time spent on the task',
        readOnly: true,
      },
    },
    {
      name: 'tags',
      type: 'text',
      label: 'Tags',
      admin: {
        description: 'Comma-separated tags for categorization',
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
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Internal notes not visible to clients',
      },
      access: {
        read: ({ req: { user } }) => {
          // Only assistants and admins can read internal notes
          return user?.role === 'assistant' || user?.role === 'admin'
        },
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-assign assistant if not specified and user is assistant
        if (operation === 'create' && !data.assistant && req.user?.role === 'assistant') {
          data.assistant = req.user.id
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // TODO: Add notification logic for status changes
        // This could send emails or in-app notifications
        console.log(`Task ${doc.id} status changed to ${doc.status}`)
      },
    ],
  },
}
