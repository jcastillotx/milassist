import type { CollectionConfig } from 'payload';

const FormTemplates: CollectionConfig = {
  slug: 'form-templates',
  admin: {
    useAsTitle: 'title',
    group: 'Forms & Templates',
    defaultColumns: ['title', 'description', 'is_active', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // All authenticated users can read active form templates
      // Admins can read all templates
      if (user.role === 'admin') return true;
      return {
        is_active: {
          equals: true,
        },
      };
    },
    create: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can create form templates
    update: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can update form templates
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete form templates
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for the form template',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of what this form is used for',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Client Onboarding', value: 'client_onboarding' },
        { label: 'Service Request', value: 'service_request' },
        { label: 'Feedback', value: 'feedback' },
        { label: 'Assessment', value: 'assessment' },
        { label: 'Contact', value: 'contact' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Category to help organize form templates',
      },
    },
    {
      name: 'fields_schema',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'field_name',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this field (no spaces, use underscores)',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Display label shown to users',
          },
        },
        {
          name: 'field_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Text Input', value: 'text' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'phone' },
            { label: 'Number', value: 'number' },
            { label: 'Date', value: 'date' },
            { label: 'Select Dropdown', value: 'select' },
            { label: 'Radio Buttons', value: 'radio' },
            { label: 'Checkboxes', value: 'checkbox' },
            { label: 'File Upload', value: 'file' },
          ],
          admin: {
            description: 'Type of input field',
          },
        },
        {
          name: 'placeholder',
          type: 'text',
          admin: {
            description: 'Placeholder text shown in the input field',
          },
        },
        {
          name: 'help_text',
          type: 'text',
          admin: {
            description: 'Help text displayed below the field',
          },
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this field is required',
          },
        },
        {
          name: 'options',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Options for select, radio, or checkbox fields',
            condition: (data: any) => ['select', 'radio', 'checkbox'].includes(data.field_type),
          },
        },
        {
          name: 'validation',
          type: 'group',
          fields: [
            {
              name: 'min_length',
              type: 'number',
              min: 0,
              admin: {
                description: 'Minimum character length',
                condition: (data: any) => ['text', 'textarea', 'email', 'phone'].includes(data.field_type),
              },
            },
            {
              name: 'max_length',
              type: 'number',
              min: 0,
              admin: {
                description: 'Maximum character length',
                condition: (data: any) => ['text', 'textarea', 'email', 'phone'].includes(data.field_type),
              },
            },
            {
              name: 'min_value',
              type: 'number',
              admin: {
                description: 'Minimum numeric value',
                condition: (data: any) => data.field_type === 'number',
              },
            },
            {
              name: 'max_value',
              type: 'number',
              admin: {
                description: 'Maximum numeric value',
                condition: (data: any) => data.field_type === 'number',
              },
            },
            {
              name: 'pattern',
              type: 'text',
              admin: {
                description: 'Regex pattern for validation',
                condition: (data: any) => ['text', 'email', 'phone'].includes(data.field_type),
              },
            },
          ],
        },
        {
          name: 'conditional_logic',
          type: 'group',
          fields: [
            {
              name: 'depends_on',
              type: 'text',
              admin: {
                description: 'Field name this field depends on',
              },
            },
            {
              name: 'condition',
              type: 'select',
              options: [
                { label: 'Equals', value: 'equals' },
                { label: 'Not Equals', value: 'not_equals' },
                { label: 'Contains', value: 'contains' },
                { label: 'Greater Than', value: 'greater_than' },
                { label: 'Less Than', value: 'less_than' },
              ],
            },
            {
              name: 'condition_value',
              type: 'text',
              admin: {
                description: 'Value to compare against',
              },
            },
          ],
          admin: {
            description: 'Show/hide this field based on another field\'s value',
          },
        },
      ],
      admin: {
        description: 'Define the fields that will appear in this form',
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this form template is available for use',
      },
    },
    {
      name: 'submit_button_text',
      type: 'text',
      defaultValue: 'Submit',
      admin: {
        description: 'Text displayed on the submit button',
      },
    },
    {
      name: 'success_message',
      type: 'textarea',
      defaultValue: 'Thank you for your submission!',
      admin: {
        description: 'Message shown after successful form submission',
      },
    },
    {
      name: 'email_notifications',
      type: 'group',
      fields: [
        {
          name: 'send_to_admin',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send email notification to administrators',
          },
        },
        {
          name: 'admin_email',
          type: 'email',
          admin: {
            description: 'Email address to send admin notifications to',
            condition: (data: any) => data.send_to_admin,
          },
        },
        {
          name: 'send_to_submitter',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Send confirmation email to the person who submitted the form',
          },
        },
        {
          name: 'submitter_email_field',
          type: 'text',
          admin: {
            description: 'Field name that contains the submitter\'s email address',
            condition: (data: any) => data.send_to_submitter,
          },
        },
      ],
      admin: {
        description: 'Configure email notifications for form submissions',
      },
    },
    {
      name: 'usage_count',
      type: 'number',
      min: 0,
      defaultValue: 0,
      admin: {
        description: 'Number of times this form has been used',
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Form template ${operation}d:`, {
            title: doc.title,
            category: doc.category,
            field_count: doc.fields_schema?.length || 0,
            is_active: doc.is_active,
          });
        }
      },
    ],
  },
};

export default FormTemplates;
