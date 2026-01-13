import type { CollectionConfig } from 'payload';

const Resources: CollectionConfig = {
  slug: 'resources',
  admin: {
    useAsTitle: 'title',
    group: 'Knowledge Base',
    defaultColumns: ['title', 'type', 'category', 'is_public', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // All authenticated users can read - filtering happens at field level
      return true;
    },
    create: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can create resources
    update: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can update resources
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete resources
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Resource title displayed in the knowledge base',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'guide',
      options: [
        { label: 'Guide', value: 'guide' },
        { label: 'Checklist', value: 'checklist' },
        { label: 'Template', value: 'template' },
        { label: 'Video', value: 'video' },
        { label: 'Document', value: 'document' },
        { label: 'FAQ', value: 'faq' },
        { label: 'Quick Reference', value: 'quick_ref' },
      ],
      admin: {
        description: 'Type of resource for categorization and display',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'General',
      options: [
        { label: 'General', value: 'General' },
        { label: 'Onboarding', value: 'Onboarding' },
        { label: 'Tools & Software', value: 'Tools' },
        { label: 'Soft Skills', value: 'Soft Skills' },
        { label: 'Client Communication', value: 'Client Communication' },
        { label: 'Technical Support', value: 'Technical Support' },
        { label: 'Compliance & Security', value: 'Compliance' },
        { label: 'Best Practices', value: 'Best Practices' },
        { label: 'Troubleshooting', value: 'Troubleshooting' },
      ],
      admin: {
        description: 'Category for organizing resources',
        position: 'sidebar',
      },
    },
    {
      name: 'content_type',
      type: 'radio',
      options: [
        { label: 'Rich Text (Markdown)', value: 'markdown' },
        { label: 'External Link/URL', value: 'url' },
        { label: 'File Upload', value: 'file' },
      ],
      defaultValue: 'markdown',
      admin: {
        description: 'How the resource content is provided',
        layout: 'horizontal',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Resource content in rich text format',
        condition: (data: any) => data.content_type === 'markdown',
      },
    },
    {
      name: 'external_url',
      type: 'text',
      admin: {
        description: 'External URL for this resource',
        condition: (data: any) => data.content_type === 'url',
      },
      validate: (value: string | null | undefined, { data }: any) => {
        if (data?.content_type === 'url' && !value) {
          return 'External URL is required when content type is URL';
        }
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'URL must start with http:// or https://';
        }
        return true;
      },
    },
    {
      name: 'attached_file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload a file for this resource',
        condition: (data: any) => data.content_type === 'file',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description shown in resource listings',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Tags for better searchability',
        position: 'sidebar',
      },
    },
    {
      name: 'is_public',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Make this resource visible to all assistants (unchecked = admin/assistant only)',
        position: 'sidebar',
      },
    },
    {
      name: 'is_featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Feature this resource prominently in the knowledge base',
        position: 'sidebar',
      },
    },
    {
      name: 'estimated_read_time',
      type: 'number',
      min: 1,
      max: 60,
      admin: {
        description: 'Estimated reading time in minutes',
        position: 'sidebar',
      },
    },
    {
      name: 'difficulty_level',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
      admin: {
        description: 'Difficulty level for filtering',
        position: 'sidebar',
      },
    },
    {
      name: 'prerequisites',
      type: 'array',
      fields: [
        {
          name: 'resource',
          type: 'relationship',
          relationTo: 'resources',
          required: true,
          admin: {
            description: 'Required resource to read first',
          },
        },
      ],
      admin: {
        description: 'Resources that should be read before this one',
      },
    },
    {
      name: 'related_resources',
      type: 'array',
      fields: [
        {
          name: 'resource',
          type: 'relationship',
          relationTo: 'resources',
          required: true,
          admin: {
            description: 'Related resource for cross-referencing',
          },
        },
      ],
      admin: {
        description: 'Related resources for further reading',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Resource author/creator',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, siblingData }: any) => {
            // Auto-set author on creation
            if (req.user && !siblingData.author) {
              return req.user.id;
            }
            return siblingData.author;
          },
        ],
      },
    },
    {
      name: 'view_count',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Number of times this resource has been viewed',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'helpful_votes',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Number of helpful votes from users',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'last_reviewed',
      type: 'date',
      admin: {
        description: 'Date when this resource was last reviewed for accuracy',
        position: 'sidebar',
      },
    },
    {
      name: 'review_notes',
      type: 'textarea',
      admin: {
        description: 'Notes from the last review',
        condition: (data: any) => !!data.last_reviewed,
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Resource ${operation}d:`, {
            title: doc.title,
            type: doc.type,
            category: doc.category,
            is_public: doc.is_public,
            is_featured: doc.is_featured,
          });
        }
      },
    ],
  },
  versions: {
    drafts: true, // Enable draft versions for resources
  },
};

export default Resources;
