const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// إضافة تعليق جديد
router.post('/', commentController.addComment);

// جلب جميع التعليقات لمقال معين
router.get('/:articleId', commentController.getCommentsForArticle);

module.exports = router;


