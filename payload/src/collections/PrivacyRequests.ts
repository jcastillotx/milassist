import type { CollectionConfig } from 'payload';

const PrivacyRequests: CollectionConfig = {
  slug: 'privacy-requests',
  admin: {
    useAsTitle: 'type',
    group: 'Compliance',
    defaultColumns: ['type', 'user', 'status', 'createdAt', 'completedAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // Users can read their own privacy requests
      // Admins can read all privacy requests
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    create: ({ req: { user } }: any) => !!user, // Any authenticated user can create privacy requests
    update: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can update privacy requests
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete privacy requests
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User making the privacy request',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Data Export (GDPR Article 15)', value: 'EXPORT' },
        { label: 'Data Deletion (GDPR Article 17)', value: 'DELETE' },
        { label: 'Data Portability (GDPR Article 20)', value: 'PORTABILITY' },
        { label: 'Access Request (CCPA)', value: 'ACCESS' },
        { label: 'Do Not Sell (CCPA)', value: 'DO_NOT_SELL' },
        { label: 'Opt Out (CCPA)', value: 'OPT_OUT' },
      ],
      admin: {
        description: 'Type of privacy request',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'PENDING',
      options: [
        { label: 'Pending Review', value: 'PENDING' },
        { label: 'Under Review', value: 'UNDER_REVIEW' },
        { label: 'Processing', value: 'PROCESSING' },
        { label: 'Awaiting User Confirmation', value: 'AWAITING_CONFIRMATION' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Partially Completed', value: 'PARTIALLY_COMPLETED' },
      ],
      admin: {
        description: 'Current status of the privacy request',
        position: 'sidebar',
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
        description: 'Priority level for processing',
        position: 'sidebar',
      },
    },
    {
      name: 'reason',
      type: 'textarea',
      admin: {
        description: 'Reason for the privacy request',
        rows: 3,
      },
    },
    {
      name: 'request_details',
      type: 'textarea',
      admin: {
        description: 'Additional details about the request',
        rows: 4,
      },
    },
    {
      name: 'data_scope',
      type: 'array',
      fields: [
        {
          name: 'data_type',
          type: 'select',
          options: [
            { label: 'Personal Information', value: 'personal_info' },
            { label: 'Communication History', value: 'communications' },
            { label: 'Task Data', value: 'tasks' },
            { label: 'Document Files', value: 'documents' },
            { label: 'Research Data', value: 'research' },
            { label: 'Call Recordings', value: 'call_recordings' },
            { label: 'Time Tracking', value: 'time_entries' },
            { label: 'Invoice Data', value: 'invoices' },
            { label: 'All Data', value: 'all_data' },
          ],
          admin: {
            description: 'Type of data included in the request',
          },
        },
        {
          name: 'specific_records',
          type: 'textarea',
          admin: {
            description: 'Specific records or date ranges if applicable',
            rows: 2,
          },
        },
      ],
      admin: {
        description: 'Scope of data covered by this request',
      },
    },
    {
      name: 'assigned_admin',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          equals: 'admin',
        },
      },
      admin: {
        description: 'Admin assigned to handle this request',
      },
    },
    {
      name: 'review_notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes from the review process',
        rows: 3,
        condition: (data: any) => ['UNDER_REVIEW', 'PROCESSING', 'COMPLETED', 'REJECTED', 'PARTIALLY_COMPLETED'].includes(data.status),
      },
    },
    {
      name: 'rejection_reason',
      type: 'textarea',
      admin: {
        description: 'Reason for rejection (if applicable)',
        rows: 3,
        condition: (data: any) => data.status === 'REJECTED',
      },
    },
    {
      name: 'completion_notes',
      type: 'textarea',
      admin: {
        description: 'Details about how the request was fulfilled',
        rows: 4,
        condition: (data: any) => ['COMPLETED', 'PARTIALLY_COMPLETED'].includes(data.status),
      },
    },
    {
      name: 'export_file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Exported data file (for export requests)',
        condition: (data: any) => data.type === 'EXPORT' && ['COMPLETED', 'PARTIALLY_COMPLETED'].includes(data.status),
      },
    },
    {
      name: 'verification_method',
      type: 'select',
      options: [
        { label: 'Email Verification', value: 'email' },
        { label: 'Phone Verification', value: 'phone' },
        { label: 'Document Verification', value: 'document' },
        { label: 'In-Person Verification', value: 'in_person' },
      ],
      admin: {
        description: 'Method used to verify the requestor\'s identity',
      },
    },
    {
      name: 'verification_date',
      type: 'date',
      admin: {
        description: 'Date when identity was verified',
        position: 'sidebar',
      },
    },
    {
      name: 'deadline',
      type: 'date',
      admin: {
        description: 'Legal deadline for completing the request',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, data }: any) => {
            // Auto-calculate deadline based on GDPR (30 days) or CCPA (45 days) requirements
            if (!siblingData.deadline && !data.deadline) {
              const createdAt = data.createdAt || new Date();
              const deadline = new Date(createdAt);
              // Default to 30 days for GDPR compliance
              deadline.setDate(deadline.getDate() + 30);
              return deadline.toISOString().split('T')[0];
            }
            return siblingData.deadline;
          },
        ],
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'Date when the request was completed',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, data }: any) => {
            // Auto-set completion date when status changes to completed
            if (data.status === 'COMPLETED' || data.status === 'PARTIALLY_COMPLETED' || data.status === 'REJECTED') {
              if (!siblingData.completedAt) {
                return new Date().toISOString().split('T')[0];
              }
            }
            return siblingData.completedAt;
          },
        ],
      },
    },
    {
      name: 'follow_up_required',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether follow-up action is required',
        position: 'sidebar',
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
            description: 'Follow-up action to be taken',
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
        description: 'Follow-up actions required after request completion',
        condition: (data: any) => data.follow_up_required,
      },
    },
    {
      name: 'legal_reference',
      type: 'text',
      admin: {
        description: 'Legal reference (e.g., GDPR Article 17, CCPA Section 1798.110)',
        position: 'sidebar',
      },
    },
    {
      name: 'appeal_deadline',
      type: 'date',
      admin: {
        description: 'Deadline for appealing the decision',
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, data }: any) => {
            // Auto-calculate appeal deadline (typically 30 days from completion)
            if ((data.status === 'REJECTED' || data.status === 'PARTIALLY_COMPLETED') && !siblingData.appeal_deadline) {
              const completedAt = data.completedAt || new Date();
              const appealDeadline = new Date(completedAt);
              appealDeadline.setDate(appealDeadline.getDate() + 30);
              return appealDeadline.toISOString().split('T')[0];
            }
            return siblingData.appeal_deadline;
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Privacy request ${operation}d:`, {
            type: doc.type,
            status: doc.status,
            user: doc.user,
            priority: doc.priority,
          });
        }
      },
    ],
  },
  versions: {
    drafts: false, // Privacy requests should not have drafts
  },
};

export default PrivacyRequests;
