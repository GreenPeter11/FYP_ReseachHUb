const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProjectView = sequelize.define('ProjectView', {
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
  viewed_at: {
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
      fields: ['viewed_at']
    }
  ]
});

module.exports = ProjectView; 