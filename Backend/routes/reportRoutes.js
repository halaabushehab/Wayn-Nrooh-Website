const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware'); 

// الإبلاغ عن تعليق
router.post('/', authMiddleware, reportController.reportComment);

// جلب جميع البلاغات (للمشرفين)
router.get('/', authMiddleware, isAdmin, reportController.getAllReports);

// تحديث حالة البلاغ (للمشرفين)
router.put('/:id/resolve', authMiddleware, isAdmin, reportController.resolveReport);

module.exports = router;
