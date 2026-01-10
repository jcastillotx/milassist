const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const CalendarConnection = sequelize.define('CalendarConnection', {
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
        type: DataTypes.ENUM('google', 'outlook'),
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
    calendarId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'disconnected', 'error'),
        defaultValue: 'active'
    }
});

module.exports = CalendarConnection;
