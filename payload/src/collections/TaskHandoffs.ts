import type { CollectionConfig } from 'payload';

const TaskHandoffs: CollectionConfig = {
  slug: 'task-handoffs',
  admin: {
    useAsTitle: 'task',
    group: 'Operations',
    defaultColumns: ['task', 'from_assistant', 'to_assistant', 'status', 'handoff_date', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read handoffs they're involved in
      // Admins can read all handoffs
      if (user.role === 'admin') return true;
      return {
        from_assistant: {
          equals: user.id,
        },
      };
    },
    create: ({ req: { user } }: any) => {
      if (!user) return false;
      // Only assistants and admins can create handoffs
      return user.role === 'assistant' || user.role === 'admin';
    },
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Only admins can update handoffs
      return user.role === 'admin';
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete handoffs
  },
  fields: [
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      required: true,
      admin: {
        description: 'Task being handed off',
      },
    },
    {
      name: 'from_assistant',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant handing off the task',
      },
    },
    {
      name: 'to_assistant',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant receiving the task',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'accepted',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Handoff status',
        position: 'sidebar',
      },
    },
    {
      name: 'handoff_date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0],
      admin: {
        description: 'Date of the handoff',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Notes about the handoff',
        rows: 4,
      },
    },
    {
      name: 'reason',
      type: 'select',
      options: [
        { label: 'Workload balancing', value: 'workload' },
        { label: 'Skill specialization', value: 'specialization' },
        { label: 'Time constraints', value: 'time' },
        { label: 'Priority escalation', value: 'priority' },
        { label: 'Client request', value: 'client_request' },
        { label: 'Supervisor reassignment', value: 'supervisor' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Reason for the handoff',
      },
    },
    {
      name: 'urgency',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Critical', value: 'critical' },
      ],
      admin: {
        description: 'Urgency level of the handoff',
        position: 'sidebar',
      },
    },
    {
      name: 'transfer_checklist',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
          admin: {
            description: 'Checklist item to complete during transfer',
          },
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this item has been completed',
          },
        },
        {
          name: 'completed_by',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'Who completed this item',
          },
        },
        {
          name: 'completed_at',
          type: 'date',
          admin: {
            description: 'When this item was completed',
          },
        },
      ],
      admin: {
        description: 'Transfer checklist items',
      },
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'File attachment for the handoff',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Description of the attachment',
          },
        },
      ],
      admin: {
        description: 'Files attached to the handoff',
      },
    },
    {
      name: 'follow_up_required',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether follow-up is required',
        position: 'sidebar',
      },
    },
    {
      name: 'follow_up_date',
      type: 'date',
      admin: {
        description: 'Date for follow-up',
        condition: (data: any) => data.follow_up_required,
      },
    },
    {
      name: 'follow_up_notes',
      type: 'textarea',
      admin: {
        description: 'Follow-up notes',
        condition: (data: any) => data.follow_up_required,
        rows: 3,
      },
    },
    {
      name: 'approved_by',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'admin',
        },
      },
      admin: {
        description: 'Admin who approved the handoff',
        condition: (data: any) => data.status !== 'pending',
      },
    },
    {
      name: 'approved_at',
      type: 'date',
      admin: {
        description: 'When the handoff was approved',
        condition: (data: any) => data.status !== 'pending',
        position: 'sidebar',
      },
    },
    {
      name: 'rejection_reason',
      type: 'textarea',
      admin: {
        description: 'Reason for rejection',
        condition: (data: any) => data.status === 'rejected',
        rows: 3,
      },
    },
    {
      name: 'completion_notes',
      type: 'textarea',
      admin: {
        description: 'Notes about handoff completion',
        condition: (data: any) => data.status === 'completed',
        rows: 3,
      },
    },
    {
      name: 'time_spent',
      type: 'number',
      min: 0,
      admin: {
        description: 'Time spent on the handoff process (minutes)',
        condition: (data: any) => data.status === 'completed',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Task handoff ${operation}d:`, {
            task: doc.task,
            from_assistant: doc.from_assistant,
            to_assistant: doc.to_assistant,
            status: doc.status,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Task handoffs should not have drafts
  },
};

export default TaskHandoffs;
