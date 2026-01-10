const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'review', 'done'),
        defaultValue: 'todo'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium'
    },
    due_date: {
        type: DataTypes.DATE
    },
    // Foreign Keys will be associated in index.js
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    assistantId: {
        type: DataTypes.UUID,
        allowNull: true // Might be unassigned initially
    }
});

module.exports = Task;
