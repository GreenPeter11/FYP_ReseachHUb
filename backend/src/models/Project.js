const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Project extends Model {}

Project.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  abstract: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downloads_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester: {
    type: DataTypes.ENUM('1', '2'),
    allowNull: false
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Project',
  timestamps: true
});

module.exports = Project; 