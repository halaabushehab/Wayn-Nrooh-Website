// const Place = require("../models/places");
// const mongoose = require("mongoose");


// // ✅ جلب جميع الأماكن
// exports.getAllPlaces = async (req, res) => {
//   try {
//     const places = await Place.find();
//     res.status(200).json(places);
//   } catch (error) {
//     res.status(500).json({ message: "خطأ في جلب الأماكن", error });
//   }
// };


// // ✅ جلب الأماكن حسب المدينة
// exports.getPlacesByCity = async (req, res) => {
//   try {
//     const { city } = req.params;
//     const places = await Place.find({ city: city });
//     res.status(200).json(places);
//   } catch (error) {
//     res.status(500).json({ message: "خطأ في جلب الأماكن لهذه المدينة", error });
//   }
// };



// exports.addPlace = async (req, res) => {
//     try {
//       const newPlace = new Place(req.body);
//       await newPlace.save();
//       res.status(201).json({ message: "✅ Place added successfully!", place: newPlace });
//     } catch (error) {
//       res.status(400).json({ error: "❌ Failed to add place", details: error.message });
//     }
//   };

  

// // ✅ فلترة الأماكن حسب التصنيف والفئة المناسبة
// exports.filterPlaces = async (req, res) => {
//   try {
//     let filters = {};

//     // فلترة حسب المدينة
//     if (req.query.city) {
//       filters.city = req.query.city;
//     }

//     // فلترة حسب التصنيف (المتاحف فقط)
//     if (req.query.category) {
//       filters.categories = { $in: [req.query.category] }; // يبحث داخل المصفوفة
//     }

//     const places = await Place.find(filters);
//     res.status(200).json(places);
//     console.log("📌 Applied Filters:", filters);

    
//   } catch (error) {
//     res.status(500).json({ error: "❌ Error fetching places", details: error.message });
//   }
// };



// // ✅ جلب تفاصيل المكان حسب الـ ID

// exports.getPlaceById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("📌 Received ID:", id);

//     // التحقق من صحة الـ ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "❌ المعرف غير صالح." });
//     }

//     // جلب المكان من قاعدة البيانات
//     const place = await Place.findById(id);
    
//     if (!place) {
//       return res.status(404).json({ message: "❌ المكان غير موجود." });
//     }

//     // ✅ إرسال البيانات بدون الحاجة للتحقق من الموسم
//     res.status(200).json(place);
//   } catch (error) {
//     console.error("❌ خطأ في السيرفر:", error);
//     res.status(500).json({ message: "❌ حدث خطأ أثناء جلب تفاصيل المكان.", error: error.message });
//   }
// };


// // ✅ جلب عدد الأماكن من قاعدة البيانات
// exports.getPlaceCount = async (req, res) => {
//   try {
//     const count = await Place.countDocuments(); // حساب عدد الأماكن
//     res.status(200).json({ count });
//   } catch (error) {
//     console.error("❌ خطأ في جلب عدد الأماكن:", error);
//     res.status(500).json({ message: "❌ خطأ في السيرفر", error: error.message });
//   }
// };


// // ✅ جلب التصنيفات من قاعدة البيانات

// exports.getPlacesByCategory = async (req, res) => {
//   try {
//     const { category } = req.params; // ✅ استخراج الفئة من الرابط
//     console.log("🔍 البحث عن أماكن في الفئة:", category); // ✅ التحقق من الفئة المستلمة

//     const places = await Place.find({ categories: { $in: [category.trim()] } });

//     if (places.length === 0) {
//         return res.status(404).json({ message: "لا توجد أماكن متاحة لهذه الفئة" });
//     }

//     res.status(200).json(places);
// } catch (error) {
//     console.error("❌ خطأ في جلب الأماكن:", error);
//     res.status(500).json({ message: "حدث خطأ في الخادم" });
// }
// };


// //فلتره

// exports.getPlaces = async (req, res) => {
//     try {
//         const { city, category, ticket_price } = req.query;

//         // بناء كائن الفلترة
//         let filter = {};

//         if (city) filter.city = city;
//         if (category) filter.category = category;

//         // فلترة سعر التذكرة
//         if (ticket_price) {
//             if (ticket_price === "free") {
//                 filter.ticket_price = 0;
//             } else if (ticket_price === "less5") {
//                 filter.ticket_price = { $lt: 5 }; // أقل من 5 دنانير
//             } else if (ticket_price === "more5") {
//                 filter.ticket_price = { $gte: 5 }; // 5 دنانير فأكثر
//             }
//         }

//         // جلب الأماكن المفلترة من قاعدة البيانات
//         const places = await Place.find(filter);

//         res.status(200).json(places);
//     } catch (error) {
//         res.status(500).json({ message: "خطأ في جلب الأماكن", error: error.message });
//     }
// };

// // ✅ جلب التصنيفات الفصول  من قاعدة البيانات

// exports.getPlacesBySeason = async (req, res) => {
//   try {
//       const { season } = req.params;
      
//       // المواسم المتاحة باللغة العربية
//       const validSeasons = ["صيف", "شتاء", "ربيع", "خريف"];
//       if (!validSeasons.includes(season)) {
//           return res.status(400).json({ message: "الموسم غير صالح." });
//       }

//       // جلب الأماكن من قاعدة البيانات التي تتطابق مع الموسم أو تعمل طوال السنة
//       const places = await Place.find({
//           $or: [
//               { best_season: { $regex: season, $options: "i" } }, // البحث بدون حساسية لحالة الأحرف
//               { best_season: "طوال السنة" } // تضمين الأماكن التي تعمل طوال السنة
//           ]
//       });

//       // التحقق إذا لم يتم العثور على أماكن
//       if (places.length === 0) {
//           return res.status(404).json({ message: "لا توجد أماكن لهذا الموسم." });
//       }

//       res.status(200).json(places);
//   } catch (error) {
//       console.error("خطأ أثناء جلب الأماكن:", error);
//       res.status(500).json({ message: "حدث خطأ أثناء جلب الأماكن." });
//   }
// };




// //  الكونترولر مع الفلترة والترقيم



// exports.getFilteredPlaces = async (req, res) => {
//   try {
//     let { city, category, season, page = 1, limit = 8 } = req.query;

//     let filters = {};

//     // ✅ تطبيق الفلترة إذا تم إرسال قيم محددة في الطلب
//     if (city) filters.city = city;
//     if (category) filters.categories = { $in: [category] };
//     if (season) {
//       filters.$or = [
//         { best_season: { $regex: season, $options: "i" } }, // تطابق الموسم
//         { best_season: "طوال السنة" } // تضمين الأماكن التي تعمل طوال السنة
//       ];
//     }

//     // ✅ تحويل القيم الرقمية للصفحة والحد
//     page = parseInt(page);
//     limit = parseInt(limit);
//     const skip = (page - 1) * limit; // حساب عدد العناصر التي يجب تخطيها

//     // ✅ البحث في قاعدة البيانات مع الفلترة والتقسيم إلى صفحات
//     const places = await Place.find(filters).skip(skip).limit(limit);
//     const totalPlaces = await Place.countDocuments(filters); // حساب العدد الكلي للنتائج

//     // ✅ إنشاء بيانات الاستجابة
//     res.status(200).json({
//       totalPlaces, // إجمالي عدد الأماكن بعد الفلترة
//       totalPages: Math.ceil(totalPlaces / limit), // حساب عدد الصفحات الكلي
//       currentPage: page,
//       places
//     });

//   } catch (error) {
//     console.error("❌ خطأ أثناء جلب الأماكن:", error);
//     res.status(500).json({ message: "❌ حدث خطأ في الخادم", error: error.message });
//   }
// };








const Place = require("../models/places");
const mongoose = require("mongoose");

// ✅ جلب جميع الأماكن
exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find({
      status: { $nin: ["معلق", "محذوف"] }
    }); // استبعاد الأماكن المعلقة والمحذوفة
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
    res.status(500).json({ message: "خطأ في جلب عدد الأماكن", error: error.message });
  }
};

// ✅ إضافة مكان جديد
exports.addPlace = (req, res) => {
  console.log("Received data:", req.body);

  const { 
    name, short_description, detailed_description, city, location, working_hours, 
    ticket_price, categories, best_season, is_outdoor, is_free, suitable_for, status 
  } = req.body;

  // إذا الصور ما تم رفعها
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Images are required" });
  }

  // استخراج روابط الصور من multer
  const uploadedImages = req.files.map(file => `/uploads/suggestions/${file.filename}`);

  // التحقق من الحقول المطلوبة
  if (
    !name || !short_description || !detailed_description || !city || !location || 
    !location.latitude || !location.longitude || !working_hours || !ticket_price || 
    !categories || !best_season || is_outdoor === undefined || is_free === undefined || 
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
    status
  });

  newPlace
    .save()
    .then(place => res.status(201).json(place))
    .catch(err => res.status(500).json({ error: "Error creating place", details: err }));
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
// ✅ جلب الأماكن حسب المدينة مع استبعاد الحالة "معلق" و "حذف"
exports.getPlacesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    // تعديل الاستعلام ليشمل الأماكن ذات الحالة "مقبول" أو لا تحتوي على حالة
    const places = await Place.find({
      city,
      $or: [{ status: "مقبول" }, { status: { $exists: false } }]
    });
    
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأماكن لهذه المدينة", error });
  }
};



// ✅ جلب الأماكن حسب التصنيف
exports.getPlacesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const places = await Place.find({ categories: { $in: [category.trim()] } });

    if (places.length === 0) {
      return res.status(404).json({ message: "لا توجد أماكن متاحة لهذه الفئة" });
    }

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

// ✅ جلب الأماكن حسب الموسم
exports.getPlacesBySeason = async (req, res) => {
  try {
    const { season, status } = req.params;
    const validSeasons = ["صيف", "شتاء", "ربيع", "خريف"];
    const validStatuses = ["معلقة", "مقبولة", "مرفوضة"];  // إضافة حالة الأماكن هنا

    // تحقق من صحة الموسم
    if (!validSeasons.includes(season)) {
      return res.status(400).json({ message: "الموسم غير صالح." });
    }

    // تحقق من صحة الحالة إذا كانت موجودة
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "الحالة غير صالحة." });
    }

    // بناء الاستعلام
    let query = {
      $or: [{ best_season: { $regex: season, $options: "i" } }, { best_season: "طوال السنة" }]
    };

    // إذا كانت الحالة موجودة، أضفها إلى الاستعلام
    if (status) {
      query.status = status;
    }

    // جلب الأماكن بناءً على الموسم والحالة
    const places = await Place.find(query);

    if (places.length === 0) {
      return res.status(404).json({ message: "لا توجد أماكن لهذا الموسم والحالة." });
    }

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء جلب الأماكن." });
  }
};


// ✅ فلترة الأماكن حسب التصنيف، المدينة، السعر
exports.getPlaces = async (req, res) => {
  try {
    const { city, category, ticket_price, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (city) filter.city = city;
    if (category) filter.categories = { $in: [category] };
    if (ticket_price) {
      const price = Number(ticket_price);
      if (!isNaN(price)) filter.ticket_price = price;
    }

    const places = await Place.find(filter)
      .limit(limit * 1) // تحويل limit إلى عدد صحيح
      .skip((page - 1) * limit)
      .exec();

    const total = await Place.countDocuments(filter);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      places,
    });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأماكن", error: error.message });
  }
};


// ✅ الفلترة مع الترقيم (Pagination)
exports.getFilteredPlaces = async (req, res) => {
  try {
    let { city, category, season, page = 1, limit = 8 } = req.query;
    let filters = {};

    if (city) filters.city = city;
    if (category) filters.categories = { $in: [category] };
    if (season) {
      filters.$or = [
        { best_season: { $regex: season, $options: "i" } },
        { best_season: "طوال السنة" }
      ];
    }

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const places = await Place.find(filters).skip(skip).limit(limit);
    const totalPlaces = await Place.countDocuments(filters);

    res.status(200).json({
      totalPlaces,
      totalPages: Math.ceil(totalPlaces / limit),
      currentPage: page,
      places
    });

  } catch (error) {
    res.status(500).json({ message: "❌ حدث خطأ في الخادم", error: error.message });
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

    res.status(200).json({ message: `✅ تم تحديث حالة المكان إلى ${status}!`, place });
  } catch (error) {
    res.status(500).json({ message: "❌ حدث خطأ أثناء تحديث حالة المكان.", error: error.message });
  }
};

exports.getPendingPlaces = async (req, res) => {
  try {
    const pendingPlaces = await Place.find({ status: "معلق" });
    res.status(200).json(pendingPlaces);
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في جلب الأماكن المعلقة", error: error.message });
  }
};


exports.restorePlace = async (req, res) => {
  const { id } = req.params;

  try {
      const place = await Place.findByIdAndUpdate(
          id,
          { isDeleted: false },
          { new: true }
      );

      if (!place) {
          return res.status(404).json({ message: "المكان غير موجود" });
      }

      res.status(200).json({ message: "تم استعادة المكان بنجاح", place });
  } catch (error) {
      console.error("Error restoring place:", error);
      res.status(500).json({ message: "حدث خطأ أثناء استعادة المكان" });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ المعرف غير صالح." });
    }

    const updatedPlace = await Place.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPlace) {
      return res.status(404).json({ message: "❌ المكان غير موجود." });
    }

    res.status(200).json({ message: "✅ تم تحديث المكان بنجاح!", place: updatedPlace });
  } catch (error) {
    res.status(500).json({ message: "❌ حدث خطأ أثناء تحديث المكان.", error: error.message });
  }
};

exports.softDeletePlace = async (req, res) => {
  const { id } = req.params; // الحصول على معرف المكان من المعلمات

  try {
      const place = await Place.findByIdAndUpdate(
          id,
          { isDeleted: true }, // تحديث حالة الحذف الناعم
          { new: true } // إرجاع السجل المحدث
      );

      if (!place) {
          return res.status(404).json({ message: "المكان غير موجود" });
      }

      res.status(200).json({ message: "تم حذف المكان بنجاح", place });
  } catch (error) {
      console.error("Error deleting place:", error);
      res.status(500).json({ message: "حدث خطأ أثناء حذف المكان" });
  }
};




// دالة لحساب المسافة بين نقطتين
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // المسافة بالكيلومتر
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// ✅ الكنترولر الأساسي
exports.getNearbyPlaces = async (req, res) => {
  const { lat, lng } = req.query;

  console.log('Received lat:', lat, 'lng:', lng);  // تسجيل الإحداثيات لتأكد من وصولها

  if (!lat || !lng) {
    return res.status(400).json({ message: "إحداثيات غير موجودة" });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  // باقي الكود
};
