const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Alert = sequelize.define('Alert', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.ENUM('error', 'warning', 'info', 'success'),
        defaultValue: 'info'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    action: {
        type: DataTypes.STRING // Action button text
    },
    actionUrl: {
        type: DataTypes.STRING // Where the action navigates to
    },
    priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal'
    },
    status: {
        type: DataTypes.ENUM('active', 'dismissed', 'resolved'),
        defaultValue: 'active'
    },
    dismissedAt: {
        type: DataTypes.DATE
    },
    dismissedBy: {
        type: DataTypes.UUID // User ID who dismissed
    },
    metadata: {
        type: DataTypes.JSON, // Additional data related to the alert
        defaultValue: {}
    },
    expiresAt: {
        type: DataTypes.DATE // Auto-dismiss after this time
    }
});

module.exports = Alert;
