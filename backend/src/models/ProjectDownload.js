const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectDownload = sequelize.define('ProjectDownload', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_agent: {
    type: DataTypes.STRING
  },
  downloaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['ProjectId']
    },
    {
      fields: ['UserId']
    },
    {
      fields: ['downloaded_at']
    }
  ]
});

module.exports = ProjectDownload; 