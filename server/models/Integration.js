const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Integration = sequelize.define('Integration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    provider: {
        type: DataTypes.STRING, // e.g. 'google', 'zoom', 'stripe', 'slack', 'twilio', 'zapier', 'calendly', 'quickbooks', 'aws'
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    category: {
        type: DataTypes.STRING, // 'calendar', 'communication', 'payments', 'automation', 'storage'
        defaultValue: 'other'
    },
    encrypted_credentials: {
        type: DataTypes.JSON, // Store tokens/keys here. NOTE: In a real app, MUST be encrypted at rest.
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'error', 'pending'),
        defaultValue: 'inactive'
    },
    settings: {
        type: DataTypes.JSON, // Additional config (e.g. calendarId, webhookUrl)
        defaultValue: {}
    },
    enabled_features: {
        type: DataTypes.JSON, // Array of enabled features like ['sync_calendar', 'send_reminders']
        defaultValue: []
    },
    last_sync: {
        type: DataTypes.DATE
    },
    sync_frequency: {
        type: DataTypes.STRING, // 'realtime', 'hourly', 'daily', 'manual'
        defaultValue: 'manual'
    },
    error_message: {
        type: DataTypes.TEXT
    },
    metadata: {
        type: DataTypes.JSON, // Store any additional provider-specific data
        defaultValue: {}
    }
});

module.exports = Integration;
