const { DataTypes } = require('sequelize');
const { sequelize } = require('./db');

const Call = sequelize.define('Call', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    caller_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direction: {
        type: DataTypes.ENUM('inbound', 'outbound'),
        defaultValue: 'inbound'
    },
    status: {
        type: DataTypes.ENUM('completed', 'missed', 'voicemail', 'forwarded'),
        defaultValue: 'completed'
    },
    duration_seconds: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    recording_url: {
        type: DataTypes.STRING,
    },
    transcription: {
        type: DataTypes.TEXT,
    },
    // Foreign Keys
    clientId: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Call;
