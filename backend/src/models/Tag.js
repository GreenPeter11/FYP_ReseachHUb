const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Tag extends Model {}

Tag.init({
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
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  projects_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Tag',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['slug']
    }
  ]
});

module.exports = Tag; 