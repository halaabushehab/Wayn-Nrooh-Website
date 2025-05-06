const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
// const upload = require("../middleware/uploadMiddleware");
// const authMiddleware = require("../middleware/authenticateToken");
const { createPlace } = require("../controllers/placeController");
// const { cloudinary } = require('../config/cloudinaryConfig');
const authMiddleware = require("../middleware/authenticateToken");  // أو:
const { upload } = require('../config/cloudinary');

// ✅ جلب جميع الأماكن
router.get("/", placeController.getAllPlaces);

// ✅ جلب عدد الأماكن
router.get("/count", placeController.getPlaceCount);

// POST route to create a place
router.post('/', upload.array('images', 10), placeController.createPlace);

// routes/placeRoutes.js
router.get('/nearby', placeController.getNearbyPlaces);

// ✅ جلب مكان حسب الـ ID
router.get("/:id", placeController.getPlaceById);

// ✅ جلب الأماكن حسب المدينة
router.get("/city/:city", placeController.getPlacesByCity);

// ✅ جلب الأماكن حسب التصنيف
router.get("/category/:category", placeController.getPlacesByCategory);

// ✅ جلب الأماكن حسب الموسم
router.get("/season/:season", placeController.getPlacesBySeason);

// ✅ فلترة + بحث
router.get("/filtered/search", placeController.getFilteredPlaces);


// routes/placeRoutes.js
router.get("/user-places/:userId", placeController.getPlacesByUser);

// البحث الأساسي
router.get('/main-search', placeController.globalSearch);

// اقتراحات البحث التلقائية
router.get('/auto-suggest', placeController.searchSuggestions);

module.exports = router;






