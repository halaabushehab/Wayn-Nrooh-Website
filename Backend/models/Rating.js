const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
  reported: { type: Boolean, default: false },  
  reportReason: { type: String, default: '' }  
});

module.exports = mongoose.model('Rating', ratingSchema);
