const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const IntegrationLog = sequelize.define('IntegrationLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    integrationId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    action: {
        type: DataTypes.STRING, // 'connect', 'disconnect', 'sync', 'send', 'receive', 'error'
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('success', 'error', 'warning', 'info'),
        defaultValue: 'info'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    details: {
        type: DataTypes.JSON, // Additional details about the action
        defaultValue: {}
    },
    userId: {
        type: DataTypes.UUID, // Who triggered the action
        allowNull: true
    }
});

module.exports = IntegrationLog;
