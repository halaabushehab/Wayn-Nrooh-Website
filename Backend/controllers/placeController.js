const Place = require("../models/places");
const User = require("../models/User"); // تأكد من وجود هذا الموديل
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Suggestion = require('../models/Suggestion');



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

    // التحقق من صلاحية الـ ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ المعرف غير صالح." });
    }

    // البحث عن المكان باستخدام id
    const place = await Place.findById(id);
    
    // إذا لم يتم العثور على المكان
    if (!place) {
      return res.status(404).json({ message: "❌ المكان غير موجود." });
    }

    // إرسال البيانات عند العثور على المكان
    return res.status(200).json(place);

  } catch (error) {
    // التعامل مع الأخطاء في حال حدوثها
    console.error("Error fetching place details:", error); // لطباعة الأخطاء في الكونسول (للـ Debugging)
    return res.status(500).json({ message: "❌ حدث خطأ أثناء جلب تفاصيل المكان.", error: error.message });
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




exports.createPlace = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const {
      name,
      short_description,
      detailed_description,
      city,
      working_hours,
      rating,
      ticket_price,
      best_season,
      is_free,
      map_link,
      categories,
      suitable_for,
      phone,
      website,
      location // إضافة هذا الحقل الجديد
    } = req.body;

    // Parse categories and suitable_for if they are strings
    const parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories;
    const parsedSuitableFor = typeof suitable_for === 'string' ? JSON.parse(suitable_for) : suitable_for;

    // Handle images
    const images = req.files ? req.files.map(file => `http://localhost:9527/uploads/${file.filename}`) : [];

    const newPlace = new Place({
      createdBy: userId,
      name,
      short_description,
      detailed_description,
      city,
      working_hours,
      rating,
      ticket_price,
      best_season,
      is_free: is_free === "true" || is_free === true,
      map_link,
      categories: parsedCategories,
      suitable_for: parsedSuitableFor,
      phone,
      website,
      images,
      location: { // إضافة كائن location
        latitude: location?.latitude || null,
        longitude: location?.longitude || null
      }
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error("Error creating place:", error);
    res.status(400).json({ message: "Failed to create place", error: error.message });
  }
};



// ✅ جلب جميع الأماكن بحالة approved فقط
exports.getAllPlaces = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // query يتم ضبطه ليشمل فقط الأماكن ذات الحالة "approved"
    const query = { status: 'approved' };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'createdBy',
        strictPopulate: false // إذا كانت هناك مشكلة في الـ populate بسبب عدم وجود الحقل
      }
    };

    // طباعة الخيارات للتحقق من استعلام الصفحة

    const places = await Place.paginate(query, options);

    // طباعة النتيجة قبل إرسالها

    res.status(200).json({
      success: true,
      data: places
    });
  } catch (error) {
    console.error("Error fetching places:", error);
    res.status(500).json({
      success: false,
      message: 'فشل في جلب الأماكن',
      error: error.message
    });
  }
};


// دالة لحساب المسافة بين نقطتين جغرافياً
exports.getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// متحكم: جلب الأماكن القريبة
exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // تأكد من أن lat و lng موجودين
    if (!lat || !lng) {
      return res.status(400).json({ message: '❌ يجب توفير إحداثيات الموقع.' });
    }

    // تحويل lat, lng إلى كائن GeoJSON
    const location = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    // العثور على الأماكن القريبة باستخدام GeoJSON
    const places = await Place.find({
      location: {
        $near: {
          $geometry: location,
          $maxDistance: 5000,  // مسافة أقصاها 5 كيلومترات (تعديل حسب الحاجة)
        },
      },
    });

    if (!places.length) {
      return res.status(404).json({ message: '❌ لم يتم العثور على أماكن قريبة.' });
    }

    res.status(200).json(places);  // إرسال الأماكن القريبة في الاستجابة بتنسيق JSON
  } catch (error) {
    res.status(500).json({ message: '❌ فشل في جلب الأماكن القريبة', error: error.message });
  }
};


exports.getPlacesByUser = async (req, res) => {
  try {
    const userId = req.params.userId; // نستخدم req.params للحصول على الـ userId من الـ URL

    // التحقق من وجود الـ userId
    if (!userId) {
      return res.status(400).json({ message: "مفقود الـ userId في الرابط" });
    }

    const userPlaces = await Place.find({ createdBy: userId, isDeleted: false });

    if (!userPlaces || userPlaces.length === 0) {
      return res.status(404).json({ message: "لا توجد أماكن لهذا المستخدم." });
    }

    res.status(200).json(userPlaces);
  } catch (error) {
    console.error("Error fetching places by user:", error); // طباعة الخطأ
    res.status(500).json({ message: "حدث خطأ أثناء جلب الأماكن", error });
  }
};
