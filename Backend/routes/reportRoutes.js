const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireAuth, isAdmin } = require('../middleware/authMiddleware');

// الإبلاغ عن تعليق
router.post('/',  requireAuth, reportController.reportComment);

// جلب جميع البلاغات (للمشرفين)
router.get('/',  requireAuth, isAdmin, reportController.getAllReports);

// تحديث حالة البلاغ (للمشرفين)
router.put('/:id/resolve',  requireAuth, isAdmin, reportController.resolveReport);

module.exports = router;
