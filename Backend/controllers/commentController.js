const Comment = require('../models/Comment');
const Article = require('../models/Article');
const mongoose = require('mongoose');
// إضافة تعليق جديد
exports.addComment = async (req, res) => {
  try {
    const { userId, articleId, content } = req.body;

    // Validate the input
    if (!userId || !articleId || !content) {
      return res.status(400).json({ error: "❌ يرجى إدخال جميع الحقول المطلوبة" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ error: "❌ userId أو articleId غير صالح" });
    }

    // Find the article
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: "❌ المقال غير موجود" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "❌ المستخدم غير موجود" });
    }

    // Create and save the comment
    const newComment = new Comment({
      userId,
      articleId,
      content,
      username: user.username,
      profilePicture: user.profilePicture,
    });
    await newComment.save();

    // Populate the comment with user details
    const populatedComment = await Comment.findById(newComment._id).populate('userId', 'username profilePicture');
    
    // Send response with populated comment
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ خطأ في الخادم" });
  }
};



// جلب جميع التقييمات لمقال معين مع حساب المتوسط
exports.getCommentsForArticle = async (req, res) => {
  try {
    let { articleId } = req.params;  // استخدام المعامل مباشرة من URL

    // التحقق إذا كان articleId موجودًا أم لا
    if (!articleId) {
      return res.status(400).json({ error: "❌ يجب توفير articleId في الطلب" });
    }

    // تنظيف articleId (إزالة الفراغات الزائدة)
    articleId = articleId.trim();

    // التحقق من صلاحية ObjectId
    if (!mongoose.Types.ObjectId.isValid(articleId)) {
      return res.status(400).json({ error: "❌ articleId غير صالح" });
    }

    // جلب التعليقات مع بيانات المستخدم
    const comments = await Comment.find({ articleId })
      .populate('userId', 'username profilePicture')
      .sort({ createdAt: -1 }); // ترتيب التعليقات حسب تاريخ الإنشاء

    if (!comments.length) {
      return res.json({ comments: [] });
    }

    // تحضير البيانات للرد
    const commentsWithUser = comments.map(comment => ({
      comment: comment.comment,
      createdAt: comment.createdAt,
      user: {
        username: comment.userId.username,
        profilePicture: comment.userId.profilePicture
      }
    }));

    res.json({ comments: commentsWithUser });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب التعليقات:", error);
    res.status(500).json({ error: "❌ حدث خطأ أثناء جلب التعليقات" });
  }
};
