const mongoose = require('mongoose');

// تعريف الـ Schema للموديل
const likeCountSchema = new mongoose.Schema({
  // تعريف الحقول هنا
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article', // إذا كان هناك علاقة مع موديل المقالات
    required: true,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
});

// إنشاء الموديل
const LikeCount = mongoose.model('LikeCount', likeCountSchema);

module.exports = LikeCount;
