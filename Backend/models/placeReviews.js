const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Place = require('./Place');
const User = require('./User');


const PlaceReview = sequelize.define('PlaceReview', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  place_id: {
    type: DataTypes.UUID,
    references: {
      model: 'places',
      key: 'id',
    },
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.TIMESTAMP,
    defaultValue: DataTypes.NOW,
  },
}, {
  modelName: 'place_reviews',
  tableName: 'place_reviews',
  timestamps: false,
});



// الربط بالعلاقات
PlaceReview.belongsTo(Place, { foreignKey: 'placeId' });
PlaceReview.belongsTo(User, { foreignKey: 'userId' }); 

module.exports = PlaceReview;
