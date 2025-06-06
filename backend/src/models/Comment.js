const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.UUID,
    references: {
      model: 'Comments',
      key: 'id'
    }
  },
  commentable_type: {
    type: DataTypes.ENUM('project', 'answer'),
    allowNull: false
  },
  commentable_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['UserId']
    },
    {
      fields: ['parent_id']
    },
    {
      fields: ['commentable_type', 'commentable_id']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Comment; 