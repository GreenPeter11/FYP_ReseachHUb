const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ProjectTag extends Model {}

ProjectTag.init({
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  },
  TagId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Tags',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'ProjectTag',
  timestamps: true
});

module.exports = ProjectTag; 