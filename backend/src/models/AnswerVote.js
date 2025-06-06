const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AnswerVote = sequelize.define('AnswerVote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  vote_type: {
    type: DataTypes.ENUM('upvote', 'downvote'),
    allowNull: false
  },
  voted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'AnswerId']
    }
  ]
});

module.exports = AnswerVote; 