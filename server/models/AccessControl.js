const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AccessControl = sequelize.define('AccessControl', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      index: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    resourceId: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    resourceType: {
      type: DataTypes.STRING,
      allowNull: false,
      index: true,
    },
    permissions: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue('permissions');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('permissions', JSON.stringify(value));
      },
    },
    grantedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    revokedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'revoked'),
      defaultValue: 'active',
      index: true,
    },
  }, {
    tableName: 'access_controls',
    timestamps: true,
    indexes: [
      { fields: ['userId', 'resourceId', 'status'] },
      { fields: ['expiresAt'] },
    ],
  });

  return AccessControl;
};
