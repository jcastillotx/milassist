import type { CollectionConfig } from 'payload';

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Content Management',
    defaultColumns: ['title', 'slug', 'is_published', 'updatedAt'],
    // Note: GrapesJS editor integration will be added via custom admin components
  },
  access: {
    read: ({ req: { user } }: any) => {
      if (!user) return false;
      // All authenticated users can read published pages
      // Admins and assistants can read all pages
      if (user.role === 'admin' || user.role === 'assistant') return true;
      return {
        is_published: {
          equals: true,
        },
      };
    },
    create: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can create pages
    update: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can update pages
    delete: ({ req: { user } }: any) => user?.role === 'admin', // Only admins can delete pages
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Page title displayed in browser tab and search results',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "about-us", "services")',
        position: 'sidebar',
      },
      validate: (value: string | string[] | null | undefined) => {
        if (typeof value === 'string') {
          if (!/^[a-z0-9-]+$/.test(value)) {
            return 'Slug must contain only lowercase letters, numbers, and hyphens';
          }
        }
        return true;
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description for SEO and social sharing',
        position: 'sidebar',
      },
    },
    {
      name: 'content_blocks',
      type: 'json',
      required: true,
      defaultValue: [],
      admin: {
        description: 'Page content blocks created with GrapesJS visual editor',
        hidden: true, // Hidden from admin UI, edited via GrapesJS
      },
    },
    {
      name: 'is_published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Make this page publicly accessible',
        position: 'sidebar',
      },
    },
    {
      name: 'published_at',
      type: 'date',
      admin: {
        description: 'Date when this page was first published',
        position: 'sidebar',
        condition: (data: any) => data.is_published,
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData, data }: any) => {
            // Set published_at when first published
            if (data.is_published && !siblingData.published_at) {
              return new Date().toISOString();
            }
            return siblingData.published_at;
          },
        ],
      },
    },
    {
      name: 'seo_settings',
      type: 'group',
      admin: {
        description: 'Search engine optimization settings',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'meta_title',
          type: 'text',
          admin: {
            description: 'Custom meta title (defaults to page title if empty)',
          },
        },
        {
          name: 'meta_description',
          type: 'textarea',
          admin: {
            description: 'Meta description for search results',
          },
        },
        {
          name: 'canonical_url',
          type: 'text',
          admin: {
            description: 'Canonical URL to prevent duplicate content issues',
          },
        },
        {
          name: 'no_index',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page',
          },
        },
      ],
    },
    {
      name: 'template_type',
      type: 'select',
      options: [
        { label: 'Landing Page', value: 'landing' },
        { label: 'About Page', value: 'about' },
        { label: 'Services Page', value: 'services' },
        { label: 'Contact Page', value: 'contact' },
        { label: 'Blog Post', value: 'blog' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Page template type for organization',
        position: 'sidebar',
      },
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for social sharing and previews',
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Page author/creator',
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
        description: 'Tags for categorization and filtering',
        position: 'sidebar',
      },
    },
    {
      name: 'version_history',
      type: 'array',
      fields: [
        {
          name: 'version',
          type: 'number',
          required: true,
        },
        {
          name: 'content_snapshot',
          type: 'json',
          required: true,
        },
        {
          name: 'changed_by',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'change_summary',
          type: 'text',
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        },
      ],
      admin: {
        description: 'Version history for content changes',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }: any) => {
        // Auto-generate slug from title if not provided
        if (operation === 'create' && data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        }

        // Track version history on updates
        if (operation === 'update' && data.content_blocks) {
          if (!data.version_history) data.version_history = [];

          const latestVersion = data.version_history.length > 0
            ? Math.max(...data.version_history.map((v: any) => v.version))
            : 0;

          data.version_history.push({
            version: latestVersion + 1,
            content_snapshot: data.content_blocks,
            changed_by: req.user?.id,
            change_summary: 'Content updated via GrapesJS editor',
            timestamp: new Date().toISOString(),
          });
        }
      },
    ],
    afterChange: [
      ({ doc, operation }: any) => {
        if (operation === 'create' || operation === 'update') {
          console.log(`Page ${operation}d:`, {
            title: doc.title,
            slug: doc.slug,
            is_published: doc.is_published,
            template_type: doc.template_type,
          });
        }
      },
    ],
  },
  versions: {
    drafts: true, // Enable draft versions
  },
};

export default Pages;
