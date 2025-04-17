const Place = require("../models/places");
const mongoose = require("mongoose");

// ✅ جلب جميع الأماكن
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({
      $or: [
        { status: "proveed" }, // الأماكن التي حالتها proveed
        { status: { $exists: false } } // الأماكن التي ليس لها حالة
      ]
    }); 
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأماكن", error });
  }
};

// ✅ جلب عدد الأماكن
exports.getPlaceCount = async (req, res) => {
  try {
    const count = await Place.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "خطأ في جلب عدد الأماكن", error: error.message });
  }
};

// ✅ إضافة مكان جديد
exports.addPlace = (req, res) => {
  console.log("Received data:", req.body);

  const {
    name,
    short_description,
    detailed_description,
    city,
    location,
    working_hours,
    ticket_price,
    categories,
    best_season,
    is_outdoor,
    is_free,
    suitable_for,
    status,
  } = req.body;

  // إذا الصور ما تم رفعها
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Images are required" });
  }

  // استخراج روابط الصور من multer
  const uploadedImages = req.files.map(
    (file) => `/uploads/suggestions/${file.filename}`
  );

  // التحقق من الحقول المطلوبة
  if (
    !name ||
    !short_description ||
    !detailed_description ||
    !city ||
    !location ||
    !location.latitude ||
    !location.longitude ||
    !working_hours ||
    !ticket_price ||
    !categories ||
    !best_season ||
    is_outdoor === undefined ||
    is_free === undefined ||
    !suitable_for
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // إنشاء وحفظ المكان الجديد
  const newPlace = new Place({
    name,
    short_description,
    detailed_description,
    city,
    location,
    working_hours,
    ticket_price,
    categories,
    best_season,
    is_outdoor,
    is_free,
    suitable_for,
    images: uploadedImages, // استخدام الصور المرفوعة
    status,
  });

  newPlace
    .save()
    .then((place) => res.status(201).json(place))
    .catch((err) =>
      res.status(500).json({ error: "Error creating place", details: err })
    );
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
    res
      .status(500)
      .json({
        message: "❌ حدث خطأ أثناء جلب تفاصيل المكان.",
        error: error.message,
      });
  }
};

// ✅ جلب الأماكن حسب المدينة
exports.getPlacesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const places = await Place.find({
      city,
      status: "approved" // فلترة الأماكن بحالة approved فقط
    });

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({
      message: "خطأ في جلب الأماكن لهذه المدينة",
      error: error.message
    });
  }
};





// ✅ جلب الأماكن حسب التصنيف
exports.getPlacesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const places = await Place.find({ categories: { $in: [category.trim()] } });

    if (places.length === 0) {
      return res
        .status(404)
        .json({ message: "لا توجد أماكن متاحة لهذه الفئة" });
    }

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ في الخادم" });
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


// ✅ الفلترة مع الترقيم (Pagination)
exports.getFilteredPlaces = async (req, res) => {
  try {
    let {
      city,
      category,
      season,
      status = "approved",  // افتراضيّاً approved
      search,               // باراميتر البحث
      page = 1,
      limit = 8
    } = req.query;

    const filters = { status }; 

    if (city)     filters.city = city;
    if (category) filters.categories = { $in: [category] };
    if (season) {
      filters.$or = [
        { best_season: { $regex: season, $options: "i" } },
        { best_season: "طوال السنة" },
      ];
    }
    if (search) {
      // فلترة الاسم بمطابقة جزئية غير حسّاسة لحالة الحروف
      filters.name = { $regex: search.trim(), $options: "i" };
    }

    page  = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    // إجمالي الأماكن المطابقة
    const totalPlaces = await Place.countDocuments(filters);
    const totalPages  = Math.ceil(totalPlaces / limit);

    // جلب الصفحة المطلوبة
    const places = await Place
      .find(filters)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      totalPlaces,
      totalPages,
      currentPage: page,
      places,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "❌ حدث خطأ في الخادم", error: error.message });
  }
};

exports.updatePlaceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ المعرف غير صالح." });
    }

    const validStatuses = ["معلق", "منشور", "محذوف"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "❌ حالة غير صالحة." });
    }

    const place = await Place.findByIdAndUpdate(id, { status }, { new: true });

    if (!place) {
      return res.status(404).json({ message: "❌ المكان غير موجود." });
    }

    res
      .status(200)
      .json({ message: `✅ تم تحديث حالة المكان إلى ${status}!`, place });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "❌ حدث خطأ أثناء تحديث حالة المكان.",
        error: error.message,
      });
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
