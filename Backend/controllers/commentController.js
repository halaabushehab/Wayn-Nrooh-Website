// controllers/commentController.js
const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "غير مصرح" });

  try {
    const newComment = new Comment({
      articleId: req.body.articleId,
      content: req.body.content,
      userId: req.user._id,
      username: req.user.username,
      userAvatar: req.user.avatar || ''
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "خطأ في إضافة التعليق", error });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب التعليقات", error });
  }
};