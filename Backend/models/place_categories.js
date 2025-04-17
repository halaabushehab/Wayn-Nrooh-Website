const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Place = require('./Place'); // ربط مع جدول الأماكن

const PlaceCategory = sequelize.define('PlaceCategory', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  placeId: {
    type: DataTypes.UUID,
    references: {
      model: 'places',
      key: 'id',
    },
    allowNull: false,
  },
  category_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.TIMESTAMP,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.TIMESTAMP,
    allowNull: true,
    onUpdate: 'CASCADE',
  },
}, {
  modelName: 'PlaceCategory',
  tableName: 'place_categories',
  timestamps: false,
});

// الربط بالعلاقات
PlaceCategory.belongsTo(Place, { foreignKey: 'placeId' });

module.exports = PlaceCategory;
