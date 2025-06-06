const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Category extends Model {}

Category.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  parent_id: {
    type: DataTypes.UUID,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  is_discipline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  projects_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Category',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['slug']
    },
    {
      fields: ['parent_id']
    },
    {
      fields: ['is_discipline']
    }
  ]
});

module.exports = Category; 