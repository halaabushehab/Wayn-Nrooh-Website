const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

// 📌 إضافة تقييم جديد
router.post('/', ratingController.addRating);

// 📌 جلب جميع التقييمات لمكان معين مع حساب المتوسط
router.get("/:placeId", ratingController.getRatingsByPlace);

// 📌 جلب المكان الأعلى تقييماً من قبل المستخدمين
router.get('/top-rated/place', ratingController.getTopRatedPlace);

// 📌 جلب عدد التقييمات الكليّة
router.get('/total/count', ratingController.getTotalRatingsCount);


module.exports = router;


