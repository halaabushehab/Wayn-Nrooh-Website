const Place = require("../models/places");
const User = require("../models/User"); // تأكد من وجود هذا الموديل
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Suggestion = require('../models/Suggestion');
const haversine = require('haversine-distance'); // تأكد من تثبيت الحزمة أولاً
const axios = require('axios');
const Article = require('../models/Article');
const { db } = require("../config/db"); // تأكد أن هذا المسار صحيح حسب مشروعك





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


// ===============================================================
// ✅ دالة ترجع الأماكن كلها مصنفة حسب المدينة + التصنيفات + suitable_for
exports.getPlacesGrouped = async (req, res) => {
  try {
    const { city, category_id, suitable_for, search, page = 1, limit = 8 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // بناء استعلام الفلترة
    const filter = { status: "approved" };

    if (city) filter.city = city;
    
    if (category_id) {
    const categoriesArray = category_id.split(',').map(cat => cat.trim());
  filter.categories = {
    $elemMatch: {
      $regex: categoriesArray.join('|'),
      $options: 'i'
    }
  };
    }

 if (suitable_for) {
  const suitableArray = suitable_for.split(',').map(item => item.trim());
  filter.suitable_for = {
    $elemMatch: {
      $regex: suitableArray.join('|'),
      $options: 'i'
    }
  };
}


    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } }
      ];
    }

    // جلب العدد الكلي للأماكن
    const totalCount = await Place.countDocuments(filter);
    
    // جلب الأماكن مع تطبيق الباجنيشن
    const paginatedPlaces = await Place.find(filter)
      .skip(skip)
      .limit(limitNumber);

    // التصنيف كما كان
    const byCity = {};
    const byCategory = {};
    const bySuitable = {};

    paginatedPlaces.forEach(place => {
      // تصنيف حسب المدينة
      if (!byCity[place.city]) byCity[place.city] = [];
      byCity[place.city].push(place);

      // تصنيف حسب التصنيف
      place.categories.forEach(cat => {
        if (!byCategory[cat]) byCategory[cat] = [];
        byCategory[cat].push(place);
      });

      // تصنيف حسب suitable_for
      place.suitable_for.forEach(group => {
        if (!bySuitable[group]) bySuitable[group] = [];
        bySuitable[group].push(place);
      });
    });

    return res.status(200).json({
      byCity,
      byCategory,
      bySuitable,
      totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / limitNumber)
    });

  } catch (error) {
    res.status(500).json({ message: "❌ خطأ أثناء جلب الأماكن المصنفة", error: error.message });
  }
};





// ===============================================================

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

    const places = await Place.find({
      categories: { $regex: new RegExp(category, 'i') }, // تجاهل الأحرف
      status: "approved"
    });

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
    if (category) filter.categories = { $in: [category] }; // ✅ لو categories مصفوفة
    if (season) filter.best_season = season;
    if (freeOnly === "true") filter.is_free = true;

    const places = await Place.find(filter);
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "❌ خطأ في الفلترة والبحث", error: error.message });
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
      location
    } = req.body;

    const parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories;
    const parsedSuitableFor = typeof suitable_for === 'string' ? JSON.parse(suitable_for) : suitable_for;

    // الصور من Cloudinary URLs
    const images = req.files.map(file => file.path);

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
      location: {
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

//  جلب الأماكن القريبة
// تأكد من وجود الفهرس الجغرافي قبل تنفيذ الاستعلام
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const toRad = angle => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// ✅ الأماكن القريبة
exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 2 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "يجب إرسال lat و lng" });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const distanceLimit = parseFloat(maxDistance); // بالكيلومتر

    const allPlaces = await Place.find({});

    const nearbyPlaces = allPlaces.filter(place => {
      const placeLat = place.location.latitude;
      const placeLng = place.location.longitude;

      const distance = haversineDistance(userLat, userLng, placeLat, placeLng);
      return distance <= distanceLimit;
    });

    res.status(200).json({ nearbyPlaces, count: nearbyPlaces.length });
  } catch (error) {
    console.error("Error getting nearby places:", error);
    res.status(500).json({ message: "فشل في جلب الأماكن القريبة", error });
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


exports.globalSearch = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        message: 'يجب أن تكون كلمة البحث مكونة من حرفين على الأقل'
      });
    }
    
    // البحث في الأماكن مع pagination
    const places = await Place.find({
      status: 'approved',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { short_description: { $regex: query, $options: 'i' } },
        { detailed_description: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { categories: { $regex: query, $options: 'i' } }
      ]
    })
    .skip(skip)
    .limit(limit)
    .lean();
    
    // البحث في المقالات مع pagination
    const articles = await Article.find({
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    })
    .skip(skip)
    .limit(limit)
    .lean();
    
    // جلب المدن الفريدة من نتائج الأماكن
    const cities = await Place.aggregate([
      {
        $match: {
          status: 'approved',
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { city: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: "$_id",
          placesCount: "$count",
          _id: 0
        }
      },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      results: {
        places,
        articles,
        cities
      },
      total: places.length + articles.length + cities.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ 
      success: false,
      message: 'حدث خطأ أثناء البحث',
      error: err.message
    });
  }
};
// الاقتراحات التلقائية
exports.searchSuggestions = async (req, res) => {
 try {
    const searchQuery = req.query.search;
    
    // نفس منطق البحث المستخدم في Location.js
    const results = await Place.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { city: { $regex: searchQuery, $options: 'i' } },
            { categories: { $regex: searchQuery, $options: 'i' } }
          ]
        }
      },
      // يمكنك إضافة المزيد من مراحل التجميع حسب الحاجة
    ]);

    // تنظيم النتائج بنفس طريقة Location.js إذا كنت تستخدم التجميع
    res.json({
      byCategory: {}, // املأ هذه القيم حسب منطقك
      byCity: {},
      bySuitable: {},
      totalCount: results.length,
      totalPages: Math.ceil(results.length / 10)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// في ملف controller
exports.searchPlaces = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "يجب أن تحتوي كلمة البحث على حرفين على الأقل"
      });
    }

    const decodedQuery = decodeURIComponent(query);
    
    const results = await Place.find({
      $or: [
        { name: { $regex: decodedQuery, $options: 'i' } },
        { city: { $regex: decodedQuery, $options: 'i' } },
        { categories: { $regex: decodedQuery, $options: 'i' } }
      ],
      status: "approved"
    }).limit(20);

    res.json({
      success: true,
      results,
      count: results.length
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ أثناء البحث",
      error: error.message
    });
  }
};