import type { CollectionConfig } from 'payload';

const TrainingModules: CollectionConfig = {
  slug: 'training-modules',
  admin: {
    useAsTitle: 'title',
    group: 'Training & Onboarding',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // All authenticated users can read training modules
      return true;
    },
    create: ({ req: { user } }: any) => user?.role === 'admin',
    update: ({ req: { user } }: any) => user?.role === 'admin',
    delete: ({ req: { user } }: any) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Module title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description of the module',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full training content',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Platform Basics', value: 'platform_basics' },
        { label: 'Client Communication', value: 'client_communication' },
        { label: 'Task Management', value: 'task_management' },
        { label: 'Time Tracking', value: 'time_tracking' },
        { label: 'Document Handling', value: 'document_handling' },
        { label: 'Travel Coordination', value: 'travel_coordination' },
        { label: 'Compliance & Security', value: 'compliance_security' },
        { label: 'Best Practices', value: 'best_practices' },
      ],
      admin: {
        description: 'Training category',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      defaultValue: 'beginner',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'estimatedDuration',
      type: 'number',
      required: true,
      min: 5,
      max: 120,
      admin: {
        description: 'Estimated completion time in minutes',
        step: 5,
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Display order in training sequence',
      },
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Must be completed for onboarding',
      },
    },
    {
      name: 'prerequisites',
      type: 'relationship',
      relationTo: 'training-modules',
      hasMany: true,
      admin: {
        description: 'Modules that must be completed first',
      },
    },
    {
      name: 'resources',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Video', value: 'video' },
            { label: 'Document', value: 'document' },
            { label: 'Link', value: 'link' },
            { label: 'Quiz', value: 'quiz' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (data: any) => ['video', 'document', 'link'].includes(data?.type),
          },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (data: any) => data?.type === 'document',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        description: 'Additional resources for this module',
      },
    },
    {
      name: 'assessment',
      type: 'relationship',
      relationTo: 'assessments',
      admin: {
        description: 'Assessment to complete this module',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Active training modules are available for new assistants',
      },
    },
  ],
};

export default TrainingModules;
