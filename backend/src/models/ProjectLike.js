const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ProjectLike extends Model {}

ProjectLike.init({
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'ProjectLike',
  timestamps: true
});

module.exports = ProjectLike; 