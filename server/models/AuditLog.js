const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    severity: {
      type: DataTypes.ENUM('info', 'warning', 'error', 'critical'),
      allowNull: false,
      index: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      index: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    targetUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    resourceType: {
      type: DataTypes.STRING,
      allowNull: true,
      index: true,
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: true,
      index: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    outcome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('details');
        return value ? JSON.parse(value) : {};
      },
      set(value) {
        this.setDataValue('details', JSON.stringify(value));
      },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      index: true,
    },
  }, {
    tableName: 'audit_logs',
    timestamps: false,
    indexes: [
      { fields: ['userId', 'timestamp'] },
      { fields: ['eventType', 'timestamp'] },
      { fields: ['severity', 'timestamp'] },
      { fields: ['resourceType', 'resourceId'] },
    ],
  });

  return AuditLog;
};
