const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VAMatch = sequelize.define('VAMatch', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      index: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    vaId: {
      type: DataTypes.UUID,
      allowNull: false,
      index: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    matchScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('requirements');
        return value ? JSON.parse(value) : {};
      },
      set(value) {
        this.setDataValue('requirements', JSON.stringify(value));
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'expired'),
      defaultValue: 'pending',
      index: true,
    },
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'va_matches',
    timestamps: true,
  });

  return VAMatch;
};
