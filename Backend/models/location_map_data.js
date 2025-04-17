const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Place = require('./Place'); // ربط مع جدول الأماكن

const LocationMapData = sequelize.define('LocationMapData', {
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
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  nearby_places: {
    type: DataTypes.JSON, // لتخزين قائمة بالأماكن القريبة
    allowNull: true,
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
  modelName: 'LocationMapData',
  tableName: 'location_map_data',
  timestamps: false,
});

// الربط بالعلاقات
LocationMapData.belongsTo(Place, { foreignKey: 'placeId' });

module.exports = LocationMapData;
