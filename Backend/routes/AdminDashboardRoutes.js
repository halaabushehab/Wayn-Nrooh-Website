const express = require('express');
const router = express.Router();
const { getAllPlaces,updateArticle, updatePlace,getAllPayments,  getAllArticles,
    softDeleteArticle, getDashboardOverview ,createArticle , deletePlace,updatePlaceStatus ,getPlaceById,addAdmin ,getPaymentsByPlaceId  } = require('../controllers/AdminDashboardController');
const  { isAdmin ,authenticateToken} = require('../middleware/authMiddleware'); // Correct path
const upload = require("../middleware/uploadMiddleware");


// المسارات الخاصة بالـ Admin
router.get('/places', authenticateToken, isAdmin, getAllPlaces);  // جلب الأماكن
router.patch('/places/:id/status', authenticateToken, isAdmin, updatePlaceStatus); // تحديث حالة المكان
router.get('/places/:id', authenticateToken, isAdmin, getPlaceById);

router.put('/places/update/:id', authenticateToken, isAdmin, upload.array('images'), updatePlace);

router.delete('/places/:id', authenticateToken, isAdmin, deletePlace);


// ADMIN Add 
router.post('/add-admin', authenticateToken, addAdmin);  // تأكد أن المسار مضبوط هنا


// Payment 
router.get("/place/:placeId",getPaymentsByPlaceId);
router.get("/all",getAllPayments);

// overview
router.get("/overview", getDashboardOverview);

// Plog
router.get('/', getAllArticles);
router.post('/articles', authenticateToken, isAdmin, createArticle);
router.patch('/articles/:id', authenticateToken, softDeleteArticle);
router.put('/articles/:id', authenticateToken, isAdmin, updateArticle);
module.exports = router;

