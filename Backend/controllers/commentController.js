const mongoose = require('mongoose'); // تأكد من وجود هذا السطر
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const User = require('../models/User');

// إضافة تعليق جديد
exports.addComment = async (req, res) => {
  try {
    const { userId, articleId, content } = req.body;

    if (!userId || !articleId || !content) {
      return res.status(400).json({ error: "❌ يرجى إدخال جميع الحقول المطلوبة" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ error: "❌ معرّف غير صالح" });
    }

    const [article, user] = await Promise.all([
      Article.findById(articleId),
      User.findById(userId)
    ]);

    if (!article) return res.status(404).json({ error: "❌ المقال غير موجود" });
    if (!user) return res.status(404).json({ error: "❌ المستخدم غير موجود" });

    const newComment = new Comment({
      userId,
      username: user.username,  // 👈
      profilePicture: user.photo || 'http://localhost:9527/uploads/placeholder.jpg', // 👈
      articleId,
      content
    });

    await newComment.save();

    res.status(201).json({
      _id: newComment._id,
      content: newComment.content,
      createdAt: newComment.createdAt,
      user: {
        username: user.username,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ خطأ في الخادم" });
  }
};

// في ملف controllers/commentController.js
exports.getCommentsForArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    console.log('تم استلام طلب التعليقات للمقال ID:', articleId); // لتصحيح البيانات الواردة

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ error: "معرّف المقال غير صالح" });
    }

    const comments = await Comment.find({ articleId })
      .populate('userId', 'username profilePicture') // تأكد أن الـ populate يعمل كما هو متوقع
      .sort({ createdAt: -1 });

    console.log('التعليقات المسترجعة:', comments);  // تحقق من التعليقات المسترجعة من القاعدة

    if (!comments || comments.length === 0) {
      return res.status(200).json({ comments: [] });
    }

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error in getCommentsForArticle:', error);
    res.status(500).json({ error: "خطأ في الخادم", details: error.message });
  }
};

