const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const upload = require("../utils/upload");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ جلب جميع الأماكن
router.get("/", placeController.getAllPlaces);

// ✅ جلب عدد الأماكن
router.get("/count", placeController.getPlaceCount);

// ✅ إضافة مكان جديد
router.post("/add", placeController.addPlace);

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

module.exports = router;
