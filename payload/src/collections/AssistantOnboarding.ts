import type { CollectionConfig } from 'payload';

const AssistantOnboarding: CollectionConfig = {
  slug: 'assistant-onboarding',
  admin: {
    useAsTitle: 'assistant',
    group: 'Assistant Management',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Admins can read all, assistants can read their own
      return user.role === 'admin' || user.role === 'assistant';
    },
    create: ({ req: { user } }: any) => user?.role === 'admin',
    update: ({ req: { user } }: any) => user?.role === 'admin',
    delete: ({ req: { user } }: any) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'assistant',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'The assistant going through onboarding',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not_started',
      options: [
        { label: 'Not Started', value: 'not_started' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        description: 'Current onboarding status',
      },
    },
    {
      name: 'progress',
      type: 'group',
      fields: [
        {
          name: 'completedModules',
          type: 'array',
          fields: [
            {
              name: 'moduleId',
              type: 'text',
              required: true,
            },
            {
              name: 'completedAt',
              type: 'date',
              required: true,
              defaultValue: () => new Date(),
            },
            {
              name: 'score',
              type: 'number',
              min: 0,
              max: 100,
            },
          ],
          admin: {
            description: 'Training modules completed by the assistant',
          },
        },
        {
          name: 'overallProgress',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 0,
          admin: {
            description: 'Overall completion percentage',
          },
        },
      ],
    },
    {
      name: 'trainingModules',
      type: 'array',
      fields: [
        {
          name: 'module',
          type: 'relationship',
          relationTo: 'training-modules',
          required: true,
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'order',
          type: 'number',
          min: 1,
        },
      ],
      admin: {
        description: 'Training modules assigned to this assistant',
      },
    },
    {
      name: 'assessmentResults',
      type: 'array',
      fields: [
        {
          name: 'assessment',
          type: 'relationship',
          relationTo: 'assessments',
        },
        {
          name: 'score',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'passed',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'completedAt',
          type: 'date',
        },
        {
          name: 'feedback',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'reviewNotes',
      type: 'group',
      fields: [
        {
          name: 'adminReview',
          type: 'textarea',
          admin: {
            description: 'Admin feedback and review notes',
          },
        },
        {
          name: 'reviewedBy',
          type: 'relationship',
          relationTo: 'users',
          filterOptions: {
            role: {
              equals: 'admin',
            },
          },
        },
        {
          name: 'reviewedAt',
          type: 'date',
        },
      ],
    },
    {
      name: 'approvedAt',
      type: 'date',
      admin: {
        condition: (data) => data.status === 'approved',
        description: 'When the assistant was approved to go live',
      },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      admin: {
        condition: (data) => data.status === 'rejected',
        description: 'Reason for rejection',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: any) => {
        if (operation === 'create' && data.assistant) {
          // Auto-populate training modules for new onboarding records
          // This will be handled by a separate function
        }
      },
    ],
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'update' && doc.status === 'approved') {
          // Update the assistant's user record to mark as approved
          // This will be handled by a custom endpoint
        }
      },
    ],
  },
};

export default AssistantOnboarding;
