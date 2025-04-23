const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');

// إضافة مكان للمفضلة
router.post("/add", addFavorite);

// إزالة مكان من المفضلة
router.post("/remove", removeFavorite);

// الحصول على المفضلات للمستخدم
router.get("/:userId", getFavorites);

module.exports = router;
