const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Resource = sequelize.define('Resource', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('guide', 'checklist', 'template', 'video'),
        defaultValue: 'guide'
    },
    content: {
        type: DataTypes.TEXT, // Markdown content or URL
        allowNull: false
    },
    category: {
        type: DataTypes.STRING, // e.g. "Onboarding", "Tools", "Soft Skills"
        defaultValue: 'General'
    },
    is_public: {
        type: DataTypes.BOOLEAN, // Visible to all or just specific roles? Defaults to all assistants
        defaultValue: true
    }
});

module.exports = Resource;
