const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CalendarEvent = sequelize.define('CalendarEvent', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        externalId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        provider: {
            type: DataTypes.ENUM('google', 'office365', 'outlook', 'caldav', 'icloud', 'yahoo_calendar'),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        location: {
            type: DataTypes.STRING,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isAllDay: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        attendees: {
            type: DataTypes.TEXT, // JSON string
        },
        meetingLink: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM('confirmed', 'tentative', 'cancelled'),
            defaultValue: 'confirmed',
        },
    }, {
        indexes: [
            { fields: ['userId', 'externalId', 'provider'], unique: true },
            { fields: ['userId', 'startTime'] },
        ],
    });

    return CalendarEvent;
};
