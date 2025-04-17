
const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const upload = require("../utils/upload");
const authMiddleware = require("../middleware/authMiddleware");
const { getNearbyPlaces } = require('../controllers/placeController'); // تأكد من المسار الصحيح

// ✅ جلب جميع الأماكن
router.get("/", placeController.getAllPlaces);

// ✅ جلب عدد الأماكن
router.get("/count", placeController.getPlaceCount);

// ✅ جلب مكان حسب الـ ID
router.get("/:id", placeController.getPlaceById);

// ✅ إضافة مكان جديد
router.post("/", authMiddleware, upload.array('images', 5), placeController.addPlace);
// ✅ جلب الأماكن حسب المدينة
router.get("/city/:city", placeController.getPlacesByCity);

// ✅ جلب الأماكن حسب التصنيف
router.get("/category/:category", placeController.getPlacesByCategory);

// ✅ جلب الأماكن حسب الموسم
router.get("/season/:season", placeController.getPlacesBySeason);

// ✅ فلترة الأماكن
router.get("/filter", placeController.getPlaces);

// ✅ فلترة الأماكن مع الترقيم
router.get("/filtered", placeController.getFilteredPlaces);


// router.get("/suitable-options",placeController.getUniqueSuitableFor); // استخدمها كـ callback function



// الراوت الخاص بالأماكن القريبة
router.get('/nearby', getNearbyPlaces); // استخدام الدالة هنا
// تحديث حالة المكان (للأدمن فقط)
router.patch("/:id/status", placeController.updatePlaceStatus);
router.put("/update/:id", placeController.updatePlace); // 🔹 تحديث مكان
router.delete("/soft-delete/:id", placeController.softDeletePlace); // 🔹 حذف ناعم
router.put("/restore/:id", placeController.restorePlace); // 🔹 استعادة مكان محذوف

module.exports = router;
