const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const RoutingRule = sequelize.define('RoutingRule', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    strategy: {
        type: DataTypes.ENUM('forward_to_assistant', 'voicemail', 'forward_to_external'),
        defaultValue: 'forward_to_assistant'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    forwarding_number: {
        type: DataTypes.STRING,
    },
    business_hours_start: {
        type: DataTypes.STRING, // e.g. "09:00"
        defaultValue: "09:00"
    },
    business_hours_end: {
        type: DataTypes.STRING, // e.g. "17:00"
        defaultValue: "17:00"
    },
    // Foreign Keys
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    assistantId: {
        type: DataTypes.UUID,
    }
});

module.exports = RoutingRule;
