const Place = require("../models/places");
const User = require("../models/user"); // تأكد من وجود هذا الموديل
const mongoose = require("mongoose");

// ✅ جلب جميع الأماكن
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({
      $or: [
        { status: "approved" },
        { status: { $exists: false } }
      ]
    });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأماكن", error });
  }
};

// ✅ إضافة مكان جديد (فقط للكولكشن: places)
exports.addPlace = async (req, res) => {
  try {
    // تحقق من الحقول الإلزامية
    if (!req.body.name || !req.body.city || !req.body.detailed_description) {
      return res.status(400).json({ message: "❌ الاسم، المدينة، والوصف مطلوبون!" });
    }

    const placeData = {
      name: req.body.name,
      short_description: req.body.short_description || "",  // اختياري
      detailed_description: req.body.detailed_description,
      city: req.body.city,
      location: {
        latitude: req.body.latitude ? parseFloat(req.body.latitude) : undefined,
        longitude: req.body.longitude ? parseFloat(req.body.longitude) : undefined,
        address: req.body.address || "غير محدد"  // عنوان افتراضي إذا لم يتم تقديمه
      },
      working_hours: req.body.working_hours || "غير محدد",  // اختياري
      ticket_price: Number(req.body.ticket_price) || 0,  // اختياري
      price: Number(req.body.price) || 0,  // اختياري
      best_season: req.body.best_season || "any",  // اختياري
      requires_tickets: req.body.requires_tickets === 'true',  // اختياري
      is_free: req.body.is_free === 'true',  // اختياري
      categories: req.body.categories ? JSON.parse(req.body.categories) : [],  // اختياري
      suitable_for: req.body.suitable_for ? JSON.parse(req.body.suitable_for) : [],  // اختياري
      contact: req.body.contact ? JSON.parse(req.body.contact) : {},  // اختياري
      status: "pending",
      isDeleted: false,
      createdAt: new Date()
    };

    // ✅ الصور
    if (req.files && req.files.length > 0) {
      placeData.images = req.files.slice(0, 3).map(file => ({
        path: `/uploads/add/${file.filename}`,
        caption: file.originalname
      }));

      placeData.gallery = req.files.slice(3).map(file => ({
        path: `/uploads/add/${file.filename}`,
        caption: file.originalname
      }));
    } else {
      // إذا لم يتم إرسال صور، اترك الحقل فارغًا أو قم بتعيين قيمة افتراضية
      placeData.images = [];
      placeData.gallery = [];
    }

    const place = new Place(placeData);
    await place.save();

    res.status(201).json({
      message: "✅ تم حفظ المكان بنجاح",
      place
    });

  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ message: "❌ حدث خطأ أثناء المعالجة", error: err.message });
  }
};



// ✅ جلب عدد الأماكن
exports.getPlaceCount = async (req, res) => {
  try {
    const count = await Place.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب عدد الأماكن", error: error.message });
  }
};

// ✅ جلب تفاصيل المكان حسب الـ ID
exports.getPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ المعرف غير صالح." });
    }
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ message: "❌ المكان غير موجود." });
    }
    res.status(200).json(place);
  } catch (error) {
    res.status(500).json({ message: "❌ حدث خطأ أثناء جلب تفاصيل المكان.", error: error.message });
  }
};

// ✅ جلب الأماكن حسب المدينة
exports.getPlacesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const places = await Place.find({ city, status: "approved" });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأماكن لهذه المدينة", error: error.message });
  }
};

// ✅ جلب الأماكن حسب التصنيف
exports.getPlacesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const places = await Place.find({ categories: category, status: "approved" });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأماكن حسب التصنيف", error: error.message });
  }
};

// ✅ جلب الأماكن حسب الموسم
exports.getPlacesBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    const validSeasons = ["صيف", "شتاء", "ربيع", "خريف"];

    // تحقق من صحة الموسم
    if (!validSeasons.includes(season)) {
      return res.status(400).json({ message: "الموسم غير صالح." });
    }

    // نبني الاستعلام ليشمل الأماكن التي:
    // 1) حالتها approved
    // 2) موسمها مطابق للموسم المطلوب أو طوال السنة
    const query = {
      status: "approved",
      $or: [
        { best_season: { $regex: season, $options: "i" } },
        { best_season: "طوال السنة" }
      ]
    };

    // جلب الأماكن بناءً على الموسم والحالة
    const places = await Place.find(query);

    if (places.length === 0) {
      return res
        .status(404)
        .json({ message: "لا توجد أماكن معتمدة لهذا الموسم." });
    }

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الأماكن.", error: error.message });
  }
};


// ✅ البحث + الفلترة
exports.getFilteredPlaces = async (req, res) => {
  try {
    const { city, category, season, freeOnly } = req.query;
    const filter = { status: "approved" };

    if (city) filter.city = city;
    if (category) filter.categories = category;
    if (season) filter.best_season = season;
    if (freeOnly === "true") filter.is_free = true;

    const places = await Place.find(filter);
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "خطأ في الفلترة والبحث", error: error.message });
  }
};




// exports.getPendingPlaces = async (req, res) => {
//   try {
//     const pendingPlaces = await Place.find({ status: "معلق" });
//     res.status(200).json(pendingPlaces);
//   } catch (error) {
//     res.status(500).json({ message: "❌ خطأ في جلب الأماكن المعلقة", error: error.message });
//   }
// };

// exports.restorePlace = async (req, res) => {
//   const { id } = req.params;

//   try {
//       const place = await Place.findByIdAndUpdate(
//           id,
//           { isDeleted: false },
//           { new: true }
//       );

//       if (!place) {
//           return res.status(404).json({ message: "المكان غير موجود" });
//       }

//       res.status(200).json({ message: "تم استعادة المكان بنجاح", place });
//   } catch (error) {
//       console.error("Error restoring place:", error);
//       res.status(500).json({ message: "حدث خطأ أثناء استعادة المكان" });
//   }
// };

// exports.updatePlace = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "❌ المعرف غير صالح." });
//     }

//     const updatedPlace = await Place.findByIdAndUpdate(id, updates, { new: true });

//     if (!updatedPlace) {
//       return res.status(404).json({ message: "❌ المكان غير موجود." });
//     }

//     res.status(200).json({ message: "✅ تم تحديث المكان بنجاح!", place: updatedPlace });
//   } catch (error) {
//     res.status(500).json({ message: "❌ حدث خطأ أثناء تحديث المكان.", error: error.message });
//   }
// };

// exports.softDeletePlace = async (req, res) => {
//   const { id } = req.params; // الحصول على معرف المكان من المعلمات

//   try {
//       const place = await Place.findByIdAndUpdate(
//           id,
//           { isDeleted: true }, // تحديث حالة الحذف الناعم
//           { new: true } // إرجاع السجل المحدث
//       );

//       if (!place) {
//           return res.status(404).json({ message: "المكان غير موجود" });
//       }

//       res.status(200).json({ message: "تم حذف المكان بنجاح", place });
//   } catch (error) {
//       console.error("Error deleting place:", error);
//       res.status(500).json({ message: "حدث خطأ أثناء حذف المكان" });
//   }
// };

// // دالة لحساب المسافة بين نقطتين
// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   const R = 6371; // نصف قطر الأرض بالكيلومتر
//   const dLat = deg2rad(lat2 - lat1);
//   const dLon = deg2rad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c; // المسافة بالكيلومتر
// }

// function deg2rad(deg) {
//   return deg * (Math.PI / 180);
// }

// ✅ الكنترولر الأساسي
// exports.getNearbyPlaces = async (req, res) => {
//   const { lat, lng } = req.query;

//   console.log('Received lat:', lat, 'lng:', lng);  // تسجيل الإحداثيات لتأكد من وصولها

//   if (!lat || !lng) {
//     return res.status(400).json({ message: "إحداثيات غير موجودة" });
//   }

//   const userLat = parseFloat(lat);
//   const userLng = parseFloat(lng);

//   // باقي الكود
// };
