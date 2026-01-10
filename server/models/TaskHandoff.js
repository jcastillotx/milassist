const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const TaskHandoff = sequelize.define('TaskHandoff', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Tasks',
            key: 'id'
        }
    },
    fromAssistantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    toAssistantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'completed'),
        defaultValue: 'accepted'
    },
    handoffDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = TaskHandoff;
