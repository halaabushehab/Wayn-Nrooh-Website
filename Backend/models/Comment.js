// commentSchema.js
const mongoose = require('mongoose');

// في نموذج Comment
const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // تأكد من أن هذا يشير إلى نموذج "User"
    required: true
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;


// profilePicture: {
//   type: String, // URL للصورة
//   default: 'default-avatar-url', // يمكنك تحديد صورة افتراضية هنا
// },