const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Place = require('./Place');
const User = require('./User');


const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  place_id: {
    type: DataTypes.UUID,
    references: {
      model: 'places',
      key: 'id',
    },
    allowNull: false,
  },
  created_at: {
    type: DataTypes.TIMESTAMP,
    defaultValue: DataTypes.NOW,
  },
}, {
  modelName: 'favorites',
  tableName: 'favorites',
  timestamps: false,
});


// الربط بالعلاقات
Favorite.belongsTo(Place, { foreignKey: 'placeId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

module.exports = Favorite;
