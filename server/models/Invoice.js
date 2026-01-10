const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue'),
        defaultValue: 'draft'
    },
    description: {
        type: DataTypes.STRING
    },
    due_date: {
        type: DataTypes.DATEONLY
    },
    // Foreign keys
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    assistantId: {
        type: DataTypes.UUID,
        allowNull: true // Optional if invoice is generic platform fee
    }
});

module.exports = Invoice;
