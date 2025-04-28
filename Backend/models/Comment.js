const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: { // << جديد
    type: String,
    required: true,
  },
  profilePicture: { // << جديد
    type: String,
    default: 'http://localhost:9527/uploads/placeholder.jpg'
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
