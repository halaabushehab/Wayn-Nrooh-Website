const express = require('express');
const router = express.Router();
const { createArticle, getArticleById, getAllArticles } = require('../controllers/ArticleController');

// مسار لإنشاء مقال جديد
router.post('/', createArticle);

// مسار لإحضار مقال معين
router.get('/:id', getArticleById);

// مسار لإحضار جميع المقالات
router.get('/', getAllArticles);

module.exports = router;