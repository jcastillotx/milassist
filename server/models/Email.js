const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Email = sequelize.define('Email', {
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
        messageId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        to: {
            type: DataTypes.TEXT,
        },
        subject: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATE,
        },
        body: {
            type: DataTypes.TEXT,
        },
        htmlBody: {
            type: DataTypes.TEXT,
        },
        hasAttachments: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        attachments: {
            type: DataTypes.TEXT, // JSON string
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        folder: {
            type: DataTypes.STRING,
            defaultValue: 'inbox',
        },
    }, {
        indexes: [
            { fields: ['userId', 'messageId'] },
            { fields: ['userId', 'date'] },
        ],
    });

    return Email;
};
