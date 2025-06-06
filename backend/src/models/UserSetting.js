const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserSetting = sequelize.define('UserSetting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  push_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  theme: {
    type: DataTypes.ENUM('light', 'dark', 'system'),
    defaultValue: 'system'
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en'
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC'
  },
  privacy_settings: {
    type: DataTypes.JSONB,
    defaultValue: {
      show_email: false,
      show_profile: true,
      show_activity: true
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['UserId']
    }
  ]
});

module.exports = UserSetting; 