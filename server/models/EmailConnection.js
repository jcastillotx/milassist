const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const EmailConnection = sequelize.define('EmailConnection', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    provider: {
        type: DataTypes.ENUM('gmail', 'outlook'),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessToken: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'disconnected', 'error'),
        defaultValue: 'active'
    },
    scopes: {
        type: DataTypes.JSON,
        defaultValue: []
    }
});

module.exports = EmailConnection;
