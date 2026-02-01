import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'

// Import collections
import { Users } from './collections/Users'
import AssistantOnboarding from './collections/AssistantOnboarding'
import TrainingModules from './collections/TrainingModules'
import Assessments from './collections/Assessments'
import LiveChats from './collections/LiveChats'
import OnCallAssistants from './collections/OnCallAssistants'
import { Media } from './collections/Media'

// Import globals
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Default secret for builds - MUST be overridden in production via PAYLOAD_SECRET env var
const BUILD_SECRET = 'build-time-secret-do-not-use-in-production-32chars'

export default buildConfig({
  // Admin configuration
  admin: {
    user: Users.slug,
  },

  // Collections
  collections: [
    Users,
    AssistantOnboarding,
    TrainingModules,
    Assessments,
    LiveChats,
    OnCallAssistants,
    Media,
  ],
  
  // Global settings
  // globals: [
  //   Settings
  // ],

  // Database adapter - SQLite for local development
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }),

  // Rich text editor
  editor: lexicalEditor({}),

  // Secret for JWT - use BUILD_SECRET for development builds, require PAYLOAD_SECRET in production
  secret: process.env.PAYLOAD_SECRET || BUILD_SECRET,

  // TypeScript
  typescript: {
    outputFile: path.resolve(dirname, '../payload-types.ts'),
  },

  // Plugins
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: 'media/',
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
      },
    }),
  ],

  // CORS
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    'http://localhost:5173', // React frontend dev
    'http://localhost:5174', // React frontend dev (alternate)
  ].filter(Boolean),

  // CSRF
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean),

  // GraphQL
  graphQL: {
    schemaOutputFile: path.resolve(dirname, '../schema.graphql'),
  },
})
