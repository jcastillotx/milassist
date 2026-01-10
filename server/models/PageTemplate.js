const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const PageTemplate = sequelize.define('PageTemplate', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content_blocks: {
        type: DataTypes.JSON, // Stores the array of blocks (Hero, Text, etc.)
        allowNull: false,
        defaultValue: []
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = PageTemplate;
