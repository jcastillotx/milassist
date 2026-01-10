const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const VideoIntegration = sequelize.define('VideoIntegration', {
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
        type: DataTypes.ENUM('zoom', 'meet', 'webex', 'teams'),
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
    providerUserId: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = VideoIntegration;
