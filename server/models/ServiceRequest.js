const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const ServiceRequest = sequelize.define('ServiceRequest', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
        defaultValue: 'pending'
    },
    submission_data: {
        type: DataTypes.JSON, // The actual form values submitted by user
        allowNull: false
    },
    // Foreign Keys
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    formTemplateId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = ServiceRequest;
