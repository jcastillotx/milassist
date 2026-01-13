import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['description', 'amount', 'status', 'client', 'dueDate'],
    group: 'Billing',
  },
  access: {
    create: ({ req: { user } }) => {
      // Only admins can create invoices
      return user?.role === 'admin'
    },
    read: ({ req: { user } }) => {
      // Users can read invoices they're involved in, admins can read all
      if (user?.role === 'admin') return true
      return false // Simplified for now - will implement proper access later
    },
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Amount',
      min: 0,
      admin: {
        description: 'Invoice amount in cents (e.g., 10000 = $100.00)',
        step: 1,
      },
    },
    {
      name: 'currency',
      type: 'select',
      label: 'Currency',
      defaultValue: 'USD',
      options: [
        {
          label: 'USD',
          value: 'USD',
        },
        {
          label: 'EUR',
          value: 'EUR',
        },
        {
          label: 'GBP',
          value: 'GBP',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Sent',
          value: 'sent',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Overdue',
          value: 'overdue',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        description: 'Current status of the invoice',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
      admin: {
        description: 'Description of services provided',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      label: 'Due Date',
      admin: {
        date: {
          displayFormat: 'MMM dd, yyyy',
        },
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      label: 'Paid At',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
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
        description: 'Client being invoiced',
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
        description: 'Assistant who performed the work',
      },
    },
    {
      name: 'lineItems',
      type: 'array',
      label: 'Line Items',
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          label: 'Quantity',
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'rate',
          type: 'number',
          required: true,
          label: 'Rate',
          min: 0,
        },
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Amount',
          min: 0,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Additional notes for the client',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Payment Method',
      options: [
        {
          label: 'Credit Card',
          value: 'credit_card',
        },
        {
          label: 'Bank Transfer',
          value: 'bank_transfer',
        },
        {
          label: 'Check',
          value: 'check',
        },
        {
          label: 'Cash',
          value: 'cash',
        },
      ],
    },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      label: 'Stripe Payment Intent ID',
      admin: {
        readOnly: true,
        description: 'Stripe payment intent ID for tracking',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Auto-calculate amount from line items if not provided
        if (operation === 'create' && !data.amount && data.lineItems) {
          const total = data.lineItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0)
          data.amount = total
        }

        // Set paid date when status changes to paid
        if (data.status === 'paid' && !data.paidAt) {
          data.paidAt = new Date()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // TODO: Add email notification logic
        // Send invoice emails when status changes
        if (operation === 'update' && doc.status === 'sent') {
          console.log(`Invoice ${doc.id} sent to client ${doc.client}`)
        }
      },
    ],
  },
}
