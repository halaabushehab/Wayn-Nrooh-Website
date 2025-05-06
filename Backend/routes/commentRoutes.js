const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// إضافة تعليق جديد (يتطلب تسجيل دخول)
router.post('/', commentController.addComment);

// جلب التعليقات لمقال معين (لا يتطلب تسجيل دخول)
router.get('/:articleId', commentController.getCommentsForArticle);





module.exports = router;
