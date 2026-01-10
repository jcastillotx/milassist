const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Document = sequelize.define('Document', {
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
        type: DataTypes.ENUM('contract', 'report', 'presentation', 'other'),
        defaultValue: 'other'
    },
    url: {
        type: DataTypes.STRING, // In real app, S3 URL
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('draft', 'review_pending', 'approved', 'rejected'),
        defaultValue: 'draft'
    },
    comments: {
        type: DataTypes.JSON, // Array of { user, text, date }
        defaultValue: []
    },
    // Foreign Keys
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Document;
