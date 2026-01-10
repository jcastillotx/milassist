const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Integration = sequelize.define('Integration', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    provider: {
        type: DataTypes.STRING, // e.g. 'google', 'zoom', 'stripe'
        allowNull: false
    },
    encrypted_credentials: {
        type: DataTypes.JSON, // Store tokens/keys here. NOTE: In a real app, MUST be encrypted at rest.
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'error'),
        defaultValue: 'inactive'
    },
    settings: {
        type: DataTypes.JSON, // Additional config (e.g. calendarId)
        defaultValue: {}
    }
});

module.exports = Integration;
