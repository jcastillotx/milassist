const { DataTypes } = require('sequelize');
const { sequelize } = require('./index');

const Trip = sequelize.define('Trip', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    flight_details: {
        type: DataTypes.JSON, // e.g. { airline: 'Delta', flightNum: 'DL123' }
        defaultValue: {}
    },
    hotel_details: {
        type: DataTypes.JSON, // e.g. { name: 'Hilton', address: '...' }
        defaultValue: {}
    },
    status: {
        type: DataTypes.ENUM('draft', 'booked', 'completed', 'cancelled'),
        defaultValue: 'draft'
    },
    // Foreign Keys
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Trip;
