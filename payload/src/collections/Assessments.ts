import type { CollectionConfig } from 'payload/types';

const Assessments: CollectionConfig = {
  slug: 'assessments',
  admin: {
    useAsTitle: 'title',
    group: 'Training & Onboarding',
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // All authenticated users can read assessments
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
        description: 'Assessment title',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Instructions for the assessment',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Multiple Choice', value: 'multiple_choice' },
        { label: 'True/False', value: 'true_false' },
        { label: 'Short Answer', value: 'short_answer' },
        { label: 'Essay', value: 'essay' },
        { label: 'Practical', value: 'practical' },
      ],
      admin: {
        description: 'Type of assessment',
      },
    },
    {
      name: 'passingScore',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
      defaultValue: 70,
      admin: {
        description: 'Minimum score required to pass (%)',
      },
    },
    {
      name: 'timeLimit',
      type: 'number',
      min: 5,
      max: 180,
      admin: {
        description: 'Time limit in minutes (optional)',
      },
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Multiple Choice', value: 'multiple_choice' },
            { label: 'True/False', value: 'true_false' },
            { label: 'Short Answer', value: 'short_answer' },
            { label: 'Essay', value: 'essay' },
          ],
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'isCorrect',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
          admin: {
            condition: (data: any) => data?.type === 'multiple_choice',
            description: 'Answer options for multiple choice',
          },
        },
        {
          name: 'correctAnswer',
          type: 'text',
          admin: {
            condition: (data: any) => ['true_false', 'short_answer'].includes(data?.type),
            description: 'Correct answer for true/false or short answer',
          },
        },
        {
          name: 'sampleAnswer',
          type: 'textarea',
          admin: {
            condition: (data: any) => data?.type === 'essay',
            description: 'Sample correct answer for essay questions',
          },
        },
        {
          name: 'points',
          type: 'number',
          required: true,
          min: 1,
          max: 10,
          defaultValue: 1,
        },
      ],
      admin: {
        description: 'Assessment questions',
      },
    },
    {
      name: 'associatedModule',
      type: 'relationship',
      relationTo: 'training-modules',
      admin: {
        description: 'Training module this assessment belongs to',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Active assessments are available for use',
      },
    },
  ],
};

export default Assessments;
