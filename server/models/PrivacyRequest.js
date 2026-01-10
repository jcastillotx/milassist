const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const PrivacyRequest = sequelize.define('PrivacyRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('EXPORT', 'DELETE'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED'),
        defaultValue: 'PENDING'
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = PrivacyRequest;
