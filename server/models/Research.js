const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Research = sequelize.define('Research', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    source_url: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT, // Analysis/Notes
        allowNull: false
    },
    tags: {
        type: DataTypes.STRING, // e.g. "finance, market-trends"
    },
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Research;
