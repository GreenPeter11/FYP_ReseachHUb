const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserStats = sequelize.define('UserStats', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  total_projects: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_downloads: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  questions_asked: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  answers_provided: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  accepted_answers: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reputation_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_activity: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['reputation_score']
    },
    {
      fields: ['last_activity']
    }
  ]
});

module.exports = UserStats; 