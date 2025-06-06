const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserActivity = sequelize.define('UserActivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  action: {
    type: DataTypes.ENUM(
      'login',
      'logout',
      'register',
      'update_profile',
      'submit_project',
      'edit_project',
      'delete_project',
      'like_project',
      'download_project',
      'ask_question',
      'answer_question',
      'comment',
      'like_comment',
      'vote_answer'
    ),
    allowNull: false
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_agent: {
    type: DataTypes.STRING
  },
  details: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['UserId']
    },
    {
      fields: ['action']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = UserActivity; 