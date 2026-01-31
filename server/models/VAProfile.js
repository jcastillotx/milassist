const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VAProfile = sequelize.define('VAProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    // Role specialization
    role: {
      type: DataTypes.ENUM(
        'executive_support',
        'crm_sales_ops',
        'growth_marketing',
        'financial_admin',
        'technical_pm',
        'customer_success'
      ),
      allowNull: false,
      index: true,
    },
    // Service tier
    tier: {
      type: DataTypes.ENUM('general', 'specialized', 'executive', 'technical'),
      allowNull: false,
      defaultValue: 'general',
      index: true,
    },
    // Pricing
    hourlyRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // Skills & certifications
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('skills');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('skills', JSON.stringify(value));
      },
    },
    certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('certifications');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('certifications', JSON.stringify(value));
      },
    },
    // Tool proficiency (0-10 scale)
    toolProficiency: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('toolProficiency');
        return value ? JSON.parse(value) : {};
      },
      set(value) {
        this.setDataValue('toolProficiency', JSON.stringify(value));
      },
    },
    // Languages
    languages: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('languages');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('languages', JSON.stringify(value));
      },
    },
    // Availability
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'America/New_York',
    },
    availability: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('availability');
        return value ? JSON.parse(value) : {};
      },
      set(value) {
        this.setDataValue('availability', JSON.stringify(value));
      },
    },
    // Experience
    yearsExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    industryExperience: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('industryExperience');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('industryExperience', JSON.stringify(value));
      },
    },
    // Profile
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tagline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    portfolio: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const value = this.getDataValue('portfolio');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('portfolio', JSON.stringify(value));
      },
    },
    // Status
    status: {
      type: DataTypes.ENUM('available', 'busy', 'unavailable', 'inactive'),
      defaultValue: 'available',
      index: true,
    },
    currentCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Current hours per week committed',
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      defaultValue: 40,
      comment: 'Maximum hours per week available',
    },
    // Performance metrics
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00,
    },
    completedTasks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    responseTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Average response time in minutes',
    },
    // Verification
    backgroundCheckStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'failed', 'expired'),
      defaultValue: 'pending',
    },
    backgroundCheckDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ndaSigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    ndaSignedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'va_profiles',
    timestamps: true,
    indexes: [
      { fields: ['role', 'tier', 'status'] },
      { fields: ['hourlyRate'] },
      { fields: ['status', 'currentCapacity'] },
      { fields: ['rating'] },
    ],
  });

  return VAProfile;
};
