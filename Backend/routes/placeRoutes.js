const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const { createPlace } = require("../controllers/placeController");
const { requireAuth } = require("../middleware/authMiddleware");
const { upload } = require('../config/cloudinary');

// ✅ جلب جميع الأماكن
router.get("/", placeController.getAllPlaces);

// ✅ جلب عدد الأماكن
router.get("/count", placeController.getPlaceCount);
// ======================================================
// 🔁 جلب الأماكن مصنفة حسب المدينة والتصنيفات والمناسب لهم
router.get('/grouped', placeController.getPlacesGrouped);

// ======================================================
// POST route to create a place
router.post('/', upload.array('images', 10), placeController.createPlace);

 
router.get('/nearby', placeController.getNearbyPlaces);

// ✅ جلب مكان حسب الـ ID
router.get("/:id", placeController.getPlaceById);

// ✅ جلب الأماكن حسب المدينة
router.get("/city/:city", placeController.getPlacesByCity);

// ✅ جلب الأماكن حسب التصنيف
router.get("/category/:category", placeController.getPlacesByCategory);

// ✅ جلب الأماكن حسب الموسم
router.get("/season/:season", placeController.getPlacesBySeason);

// routes/placeRoutes.js
router.get("/user-places/:userId", placeController.getPlacesByUser);



module.exports = router;






