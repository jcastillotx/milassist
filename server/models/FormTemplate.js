const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const FormTemplate = sequelize.define('FormTemplate', {
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
        type: DataTypes.STRING
    },
    fields_schema: {
        type: DataTypes.JSON, // Array of field definitions { label, type, required, options }
        allowNull: false,
        defaultValue: []
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = FormTemplate;
