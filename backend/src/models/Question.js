const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  answers_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_solved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  solved_answer_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['title']
    },
    {
      fields: ['tags']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Question; 