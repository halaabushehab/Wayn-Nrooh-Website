const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { createPlace } = require("../controllers/placeController");
const { cloudinary } = require('../config/cloudinaryConfig');


// ✅ جلب جميع الأماكن
router.get("/", placeController.getAllPlaces);

// ✅ جلب عدد الأماكن
router.get("/count", placeController.getPlaceCount);


// POST route to create a place
router.post('/', upload.array('images'), placeController.createPlace);



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


// Route to edit a place
router.patch('/places/:id', placeController.updatePlace);

// Route to soft delete a place
router.delete('/places/:id', placeController.softDeletePlace);

router.get("/status", placeController.getPlaceStatusStats);

module.exports = router;
