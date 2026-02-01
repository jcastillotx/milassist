-- ==========================================
-- INTEGRATIONS TABLE MIGRATION
-- Run this SQL in Supabase SQL Editor
-- ==========================================

-- Create ENUM types if they don't exist
DO $$ BEGIN
    CREATE TYPE integration_status AS ENUM ('active', 'inactive', 'error', 'pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE integration_log_status AS ENUM ('success', 'error', 'warning', 'info');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Integrations table
CREATE TABLE IF NOT EXISTS "Integrations" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) DEFAULT 'other',
    encrypted_credentials JSONB,
    status VARCHAR(20) DEFAULT 'inactive',
    settings JSONB DEFAULT '{}',
    enabled_features JSONB DEFAULT '[]',
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(50) DEFAULT 'manual',
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create IntegrationLogs table
CREATE TABLE IF NOT EXISTS "IntegrationLogs" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "integrationId" UUID NOT NULL REFERENCES "Integrations"(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'info',
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    "userId" UUID REFERENCES "Users"(id) ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_integrations_provider ON "Integrations"(provider);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON "Integrations"(status);
CREATE INDEX IF NOT EXISTS idx_integrations_category ON "Integrations"(category);
CREATE INDEX IF NOT EXISTS idx_integration_logs_integration ON "IntegrationLogs"("integrationId");
CREATE INDEX IF NOT EXISTS idx_integration_logs_created ON "IntegrationLogs"("createdAt" DESC);

-- Add trigger to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_integrations_updated_at ON "Integrations";
CREATE TRIGGER update_integrations_updated_at
    BEFORE UPDATE ON "Integrations"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integration_logs_updated_at ON "IntegrationLogs";
CREATE TRIGGER update_integration_logs_updated_at
    BEFORE UPDATE ON "IntegrationLogs"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default integration configurations (optional - can be created via UI)
INSERT INTO "Integrations" (provider, name, description, category, status, settings)
VALUES
    ('google', 'Google Workspace', 'Connect Google Calendar, Gmail, and Drive', 'calendar', 'inactive', '{"syncCalendar": true, "syncEmail": true, "syncDrive": false}'),
    ('microsoft', 'Microsoft 365', 'Connect Outlook, Teams, and OneDrive', 'calendar', 'inactive', '{"syncOutlook": true, "syncTeams": true, "syncOneDrive": false}'),
    ('zoom', 'Zoom', 'Video conferencing and meeting scheduling', 'communication', 'inactive', '{"autoRecord": false, "waitingRoom": true}'),
    ('slack', 'Slack', 'Team communication and notifications', 'communication', 'inactive', '{"defaultChannel": "#general", "notifyNewTasks": true}'),
    ('stripe', 'Stripe', 'Payment processing and subscriptions', 'payments', 'inactive', '{"webhookEnabled": true, "autoCharge": false}'),
    ('twilio', 'Twilio', 'SMS and voice communications', 'communication', 'inactive', '{"smsEnabled": true, "voiceEnabled": false}'),
    ('zapier', 'Zapier', 'Workflow automation and integrations', 'automation', 'inactive', '{"triggerOnNewTask": true, "triggerOnInvoice": true}'),
    ('calendly', 'Calendly', 'Appointment scheduling', 'calendar', 'inactive', '{"autoSync": true}'),
    ('quickbooks', 'QuickBooks', 'Accounting and invoicing', 'payments', 'inactive', '{"autoSyncInvoices": true, "syncExpenses": false}'),
    ('aws', 'AWS S3', 'Cloud storage for documents', 'storage', 'inactive', '{"autoBackup": true, "encryptionEnabled": true}')
ON CONFLICT (provider) DO NOTHING;

-- Verify the tables were created
SELECT 'Integrations table created' as status, count(*) as row_count FROM "Integrations";
SELECT 'IntegrationLogs table created' as status, count(*) as row_count FROM "IntegrationLogs";
