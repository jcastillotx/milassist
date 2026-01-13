import type { CollectionConfig } from 'payload';

const ServiceRequests: CollectionConfig = {
  slug: 'service-requests',
  admin: {
    useAsTitle: 'title',
    group: 'Forms & Templates',
    defaultColumns: ['title', 'client', 'form_template', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own service requests
      // Assistants can read service requests for their clients
      // Admins can read all service requests
      if (user.role === 'admin') return true;
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
      };
      if (user.role === 'assistant') return true; // Will filter by client relationships in query
      return false;
    },
    create: ({ req: { user } }: any) => user?.role === 'client', // Only clients can create service requests
    update: ({ req: { user } }: any) => {
      if (!user) return false;
      // Clients can update their own pending requests
      // Assistants and admins can update any request
      if (user.role === 'admin' || user.role === 'assistant') return true;
      if (user.role === 'client') return {
        client: {
          equals: user.id,
        },
        status: {
          equals: 'pending',
        },
      };
      return false;
    },
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete service requests
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Auto-generated title based on form template and submission',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, data }: any) => {
            // Auto-generate title if not provided
            if (!siblingData.title && data.form_template) {
              // This will be set by a beforeChange hook that looks up the form template
              return `Service Request - ${new Date().toLocaleDateString()}`;
            }
            return siblingData.title;
          },
        ],
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
        description: 'Client who submitted this service request',
        readOnly: true, // Set automatically when created
      },
    },
    {
      name: 'form_template',
      type: 'relationship',
      relationTo: 'form-templates',
      required: true,
      admin: {
        description: 'Form template used for this service request',
        readOnly: true, // Set automatically when created
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        description: 'Current status of the service request',
      },
    },
    {
      name: 'submission_data',
      type: 'json',
      required: true,
      admin: {
        description: 'Form field values submitted by the client',
        readOnly: true, // Set automatically when created
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
        description: 'Assistant assigned to handle this service request',
        condition: (data: any) => data.status !== 'pending',
      },
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      admin: {
        description: 'Priority level of this service request',
      },
    },
    {
      name: 'review_notes',
      type: 'textarea',
      admin: {
        description: 'Notes from the reviewer (assistant/admin)',
        condition: (data: any) => ['approved', 'rejected', 'completed'].includes(data.status),
      },
    },
    {
      name: 'completion_notes',
      type: 'textarea',
      admin: {
        description: 'Details about how the request was fulfilled',
        condition: (data: any) => data.status === 'completed',
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
        description: 'Files attached to this service request',
      },
    },
    {
      name: 'timeline',
      type: 'array',
      fields: [
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
        {
          name: 'action',
          type: 'select',
          required: true,
          options: [
            { label: 'Created', value: 'created' },
            { label: 'Status Changed', value: 'status_changed' },
            { label: 'Assigned', value: 'assigned' },
            { label: 'Comment Added', value: 'comment_added' },
            { label: 'Completed', value: 'completed' },
          ],
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
      ],
      admin: {
        description: 'Audit trail of actions taken on this service request',
        readOnly: true,
      },
    },
    {
      name: 'estimated_completion',
      type: 'date',
      admin: {
        description: 'Estimated completion date',
        condition: (data: any) => data.status === 'approved',
      },
    },
    {
      name: 'actual_completion',
      type: 'date',
      admin: {
        description: 'Actual completion date',
        condition: (data: any) => data.status === 'completed',
        readOnly: true,
      },
    },
    {
      name: 'satisfaction_rating',
      type: 'select',
      options: [
        { label: '1 - Very Dissatisfied', value: '1' },
        { label: '2 - Dissatisfied', value: '2' },
        { label: '3 - Neutral', value: '3' },
        { label: '4 - Satisfied', value: '4' },
        { label: '5 - Very Satisfied', value: '5' },
      ],
      admin: {
        description: 'Client satisfaction rating',
        condition: (data: any) => data.status === 'completed',
      },
    },
    {
      name: 'feedback',
      type: 'textarea',
      admin: {
        description: 'Client feedback and comments',
        condition: (data: any) => data.status === 'completed',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }: any) => {
        // Auto-set client if not provided (from authenticated user)
        if (operation === 'create' && !data.client && req.user?.role === 'client') {
          data.client = req.user.id;
        }

        // Add timeline entry for status changes
        if (operation === 'update' && data.status) {
          const timelineEntry = {
            timestamp: new Date(),
            action: 'status_changed',
            description: `Status changed to ${data.status}`,
            user: req.user?.id,
          };

          if (!data.timeline) data.timeline = [];
          data.timeline.push(timelineEntry);
        }

        // Set actual completion date when status changes to completed
        if (data.status === 'completed' && !data.actual_completion) {
          data.actual_completion = new Date();
        }
      },
    ],
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Service request ${operation}d:`, {
            id: doc.id,
            client: doc.client,
            form_template: doc.form_template,
            status: doc.status,
            priority: doc.priority,
          });
        }
      },
    ],
  },
};

export default ServiceRequests;
