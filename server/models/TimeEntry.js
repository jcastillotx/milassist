const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const TimeEntry = sequelize.define('TimeEntry', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    duration_seconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    // Foreign Keys
    taskId: {
        type: DataTypes.UUID,
        allowNull: true
    },
    assistantId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    clientId: {
        type: DataTypes.UUID,
        allowNull: true
    }
});

module.exports = TimeEntry;
