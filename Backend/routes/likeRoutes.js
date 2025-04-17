



const express = require('express');
const router = express.Router();
const commentController = require('../controllers/likeController ');

// مسار  
router.post('/like/:id', articleController.likeArticle);


module.exports = router;
