import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'

// Import collections (we'll create these next)
import { Users } from './collections/Users'
import { Tasks } from './collections/Tasks'
import { Messages } from './collections/Messages'
import { Invoices } from './collections/Invoices'
import { Documents } from './collections/Documents'
import { Media } from './collections/Media'
import Trips from './collections/Trips'
import TimeEntries from './collections/TimeEntries'
import Meetings from './collections/Meetings'
import FormTemplates from './collections/FormTemplates'
import ServiceRequests from './collections/ServiceRequests'
import Pages from './collections/Pages'
import Resources from './collections/Resources'
import Research from './collections/Research'
import Calls from './collections/Calls'
import RoutingRules from './collections/RoutingRules'
import PrivacyRequests from './collections/PrivacyRequests'
import EmailConnections from './collections/EmailConnections'
import VideoIntegrations from './collections/VideoIntegrations'
import CalendarConnections from './collections/CalendarConnections'
import TaskHandoffs from './collections/TaskHandoffs'
import Integrations from './collections/Integrations'
import AssistantOnboarding from './collections/AssistantOnboarding'
import TrainingModules from './collections/TrainingModules'
import Assessments from './collections/Assessments'
import LiveChats from './collections/LiveChats'
import OnCallAssistants from './collections/OnCallAssistants'
import { Media } from './collections/Media'
import { Tasks } from './collections/Tasks'
import { Messages } from './collections/Messages'
import { Invoices } from './collections/Invoices'
import { Documents } from './collections/Documents'
import Trips from './collections/Trips'
import TimeEntries from './collections/TimeEntries'
import Meetings from './collections/Meetings'
import FormTemplates from './collections/FormTemplates'
import ServiceRequests from './collections/ServiceRequests'
import Research from './collections/Research'
import Calls from './collections/Calls'
import RoutingRules from './collections/RoutingRules'
import PrivacyRequests from './collections/PrivacyRequests'
import EmailConnections from './collections/EmailConnections'
import CalendarConnections from './collections/CalendarConnections'
import TaskHandoffs from './collections/TaskHandoffs'
import Integrations from './collections/Integrations'
import VideoIntegrations from './collections/VideoIntegrations'
import Resources from './collections/Resources'
import Pages from './collections/Pages'

// Import globals
// import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Admin configuration
  admin: {
    user: Users.slug,
  },

  // Collections
  collections: [
    Users,
    Tasks,
    Messages,
    Invoices,
    Documents,
    Trips,
    TimeEntries,
    Meetings,
    FormTemplates,
    ServiceRequests,
    Pages,
    Resources,
    Research,
    Calls,
    RoutingRules,
    PrivacyRequests,
    EmailConnections,
    VideoIntegrations,
    CalendarConnections,
    TaskHandoffs,
    Integrations,
    Skills,
    AssistantOnboarding,
    TrainingModules,
    Assessments,
    LiveChats,
    OnCallAssistants,
    Media,
    Tasks,
    Messages,
    Invoices,
    Documents,
    Trips,
    TimeEntries,
    Meetings,
    FormTemplates,
    ServiceRequests,
    Research,
    Calls,
    RoutingRules,
    PrivacyRequests,
    EmailConnections,
    CalendarConnections,
    TaskHandoffs,
    Integrations,
    VideoIntegrations,
    Resources,
    Pages,
  ],
  // Global settings
  globals: [
    Settings,
  ],

  // Database adapter - PostgreSQL for Supabase
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  // Rich text editor
  editor: lexicalEditor({}),

  // Secret for JWT
  secret: process.env.PAYLOAD_SECRET || '',

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
