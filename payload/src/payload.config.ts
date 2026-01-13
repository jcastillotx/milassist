import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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

// Import globals
import { Settings } from './globals/Settings'

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
    AssistantOnboarding,
    TrainingModules,
    Assessments,
    LiveChats,
    OnCallAssistants,
  ],

  // Global settings
  globals: [
    Settings,
  ],

  // Database adapter (SQLite for development)
  db: sqliteAdapter({
    client: {
      url: 'file:./payload.db',
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
    // TODO: Add S3 storage plugin when environment variables are configured
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
