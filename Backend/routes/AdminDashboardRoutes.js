const express = require('express');
const router = express.Router();
const { getAllPlaces,updateArticle, updatePlace,getAllPayments,  getAllArticles,
    softDeleteArticle, getDashboardOverview ,createArticle , deletePlace,updatePlaceStatus ,getPlaceById,addAdmin ,getPaymentsByPlaceId  } = require('../controllers/AdminDashboardController');
const { isAdmin, requireAuth } = require('../middleware/authMiddleware');
const upload = require("../middleware/uploadMiddleware");


// المسارات الخاصة بالـ Admin
router.get('/places', requireAuth, isAdmin, getAllPlaces);  // جلب الأماكن
router.patch('/places/:id/status', requireAuth, isAdmin, updatePlaceStatus); // تحديث حالة المكان
router.get('/places/:id', requireAuth, isAdmin, getPlaceById);

router.put('/places/update/:id', requireAuth, isAdmin, upload.array('images'), updatePlace);

router.delete('/places/:id', requireAuth, isAdmin, deletePlace);


// ADMIN Add 
router.post('/add-admin', requireAuth, addAdmin);  // تأكد أن المسار مضبوط هنا


// Payment 
router.get("/place/:placeId",getPaymentsByPlaceId);
router.get("/all",getAllPayments);

// overview
router.get("/overview", getDashboardOverview);

// Plog
router.get('/', getAllArticles);
router.post('/articles', requireAuth, isAdmin, createArticle);
router.patch('/articles/:id', requireAuth, softDeleteArticle);
router.put('/articles/:id', requireAuth, isAdmin, updateArticle);
module.exports = router;

