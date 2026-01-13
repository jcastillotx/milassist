import type { CollectionConfig } from 'payload';

const Research: CollectionConfig = {
  slug: 'research',
  admin: {
    useAsTitle: 'title',
    group: 'Research & Analysis',
    defaultColumns: ['title', 'client', 'status', 'priority', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own research
      // Assistants can read research for their assigned clients
      // Admins can read all research
      if (user.role === 'admin') return true;
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
      };
      if (user.role === 'assistant') return true; // Will filter by client relationships in query
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'assistant' || user?.role === 'admin', // Assistants and admins can create research
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can update their own research
      // Assistants and admins can update any research
      if (user.role === 'admin' || user.role === 'assistant') return true;
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
      };
      return false;
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete research
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Clear, descriptive title for the research project',
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
        description: 'Client for whom this research is being conducted',
      },
    },
    {
      name: 'assigned_assistant',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'assistant',
        },
      },
      admin: {
        description: 'Assistant assigned to conduct this research',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'planning',
      options: [
        { label: 'Planning', value: 'planning' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Review', value: 'review' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Current status of the research project',
        position: 'sidebar',
      },
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        description: 'Priority level of this research request',
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Market Research', value: 'market_research' },
        { label: 'Competitor Analysis', value: 'competitor_analysis' },
        { label: 'Industry Trends', value: 'industry_trends' },
        { label: 'Financial Analysis', value: 'financial_analysis' },
        { label: 'Customer Insights', value: 'customer_insights' },
        { label: 'Product Research', value: 'product_research' },
        { label: 'Regulatory Research', value: 'regulatory_research' },
        { label: 'Technology Assessment', value: 'technology_assessment' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Type of research being conducted',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Detailed description of what research is needed',
      },
    },
    {
      name: 'objectives',
      type: 'array',
      fields: [
        {
          name: 'objective',
          type: 'text',
          required: true,
          admin: {
            description: 'Specific objective for this research',
          },
        },
      ],
      admin: {
        description: 'Key objectives to be achieved through this research',
      },
    },
    {
      name: 'research_content',
      type: 'richText',
      admin: {
        description: 'Detailed research findings, analysis, and insights',
        condition: (data: any) => data.status === 'completed' || data.status === 'review',
      },
    },
    {
      name: 'sources',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Title or name of the source',
          },
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            description: 'URL of the source (if applicable)',
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Website', value: 'website' },
            { label: 'Document', value: 'document' },
            { label: 'Database', value: 'database' },
            { label: 'Interview', value: 'interview' },
            { label: 'Survey', value: 'survey' },
            { label: 'Report', value: 'report' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            description: 'Type of source',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Notes about this source',
          },
        },
      ],
      admin: {
        description: 'Sources used in the research',
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
        description: 'Tags for categorization and search',
        position: 'sidebar',
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
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            description: 'Description of this attachment',
          },
        },
      ],
      admin: {
        description: 'Files and documents related to this research',
      },
    },
    {
      name: 'estimated_completion',
      type: 'date',
      admin: {
        description: 'Estimated completion date',
        position: 'sidebar',
      },
    },
    {
      name: 'actual_completion',
      type: 'date',
      admin: {
        description: 'Actual completion date',
        condition: (data: any) => data.status === 'completed',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, data }: any) => {
            // Set actual completion date when status changes to completed
            if (data.status === 'completed' && !siblingData.actual_completion) {
              return new Date().toISOString();
            }
            return siblingData.actual_completion;
          },
        ],
      },
    },
    {
      name: 'time_spent',
      type: 'number',
      min: 0,
      admin: {
        description: 'Time spent on research in hours',
        position: 'sidebar',
      },
    },
    {
      name: 'quality_rating',
      type: 'select',
      options: [
        { label: '1 - Poor', value: '1' },
        { label: '2 - Below Average', value: '2' },
        { label: '3 - Average', value: '3' },
        { label: '4 - Good', value: '4' },
        { label: '5 - Excellent', value: '5' },
      ],
      admin: {
        description: 'Quality rating of the research (client feedback)',
        condition: (data: any) => data.status === 'completed',
        position: 'sidebar',
      },
    },
    {
      name: 'client_feedback',
      type: 'textarea',
      admin: {
        description: 'Feedback from the client on the research',
        condition: (data: any) => data.status === 'completed',
      },
    },
    {
      name: 'follow_up_actions',
      type: 'array',
      fields: [
        {
          name: 'action',
          type: 'text',
          required: true,
          admin: {
            description: 'Follow-up action item',
          },
        },
        {
          name: 'assigned_to',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'Person responsible for this action',
          },
        },
        {
          name: 'due_date',
          type: 'date',
          admin: {
            description: 'Due date for this action',
          },
        },
        {
          name: 'completed',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this action has been completed',
          },
        },
      ],
      admin: {
        description: 'Follow-up actions based on research findings',
        condition: (data: any) => data.status === 'completed',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Research ${operation}d:`, {
            title: doc.title,
            client: doc.client,
            status: doc.status,
            priority: doc.priority,
            category: doc.category,
          });
        }
      },
    ],
  },
  versions: {
    drafts: true, // Enable draft versions for research projects
  },
};

export default Research;
