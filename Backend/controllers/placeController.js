const Place = require("../models/places");
const User = require("../models/User"); // تأكد من وجود هذا الموديل
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const Suggestion = require('../models/Suggestion');
const haversine = require('haversine-distance'); // تأكد من تثبيت الحزمة أولاً
const axios = require('axios');
const Article = require('../models/Article');



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

// متحكم: جلب الأماكن القريبة

// exports.getNearbyPlaces = async (req, res) => {
//   try {
//     const lat = parseFloat(req.query.lat);
//     const lng = parseFloat(req.query.lng);
//     const maxDistance = 5000; // المسافة بالـ متر (5 كم)

//     // التحقق من الإحداثيات
//     if (isNaN(lat) || isNaN(lng)) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'إحداثيات غير صالحة',
//         data: null
//       });
//     }

//     // جلب جميع الأماكن من قاعدة البيانات
//     const places = await Place.find();

//     // موقع المستخدم
//     const userLocation = { latitude: lat, longitude: lng };

//     // فلترة الأماكن بناءً على المسافة باستخدام Haversine
//     const nearbyPlaces = places.filter(place => {
//       const placeLocation = {
//         latitude: place.location.latitude,
//         longitude: place.location.longitude
//       };

//       // حساب المسافة بين مكان المستخدم والمكان باستخدام Haversine
//       const distance = haversine(userLocation, placeLocation, { unit: 'meter' });

//       return distance <= maxDistance; // إذا كانت المسافة ضمن الحد الأقصى (5 كم)
//     });

//     // التحقق إذا كانت هناك أماكن قريبة
//     if (nearbyPlaces.length === 0) {
//       return res.status(200).json({ 
//         success: true,
//         message: 'لا توجد أماكن قريبة',
//         data: []
//       });
//     }

//     // إعادة الأماكن القريبة
//     res.status(200).json({
//       success: true,
//       message: 'تم جلب الأماكن القريبة بنجاح',
//       data: nearbyPlaces
//     });
//   } catch (error) {
//     console.error('Error in getNearbyPlaces:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'فشل في جلب الأماكن القريبة',
//       error: error.message,
//       data: null
//     });
//   }
// };

const getDrivingDistance = async (userLat, userLng, placeLat, placeLng) => {
  try {
    const url = process.env.API_URL;  // تأكد من أن الرابط هنا صحيح
    const params = {
      origins: `${userLat},${userLng}`,
      destinations: `${placeLat},${placeLng}`,
      key: process.env.YOUR_GOOGLE_API_KEY,
    };

    const response = await axios.get(url, { params });

    console.log("📦 Google API Full Response:", JSON.stringify(response.data, null, 2));

    if (
      response.data &&
      response.data.rows &&
      response.data.rows.length > 0 &&
      response.data.rows[0].elements &&
      response.data.rows[0].elements.length > 0 &&
      response.data.rows[0].elements[0].status === "OK"
    ) {
      return response.data.rows[0].elements[0].distance.value;
    } else {
      console.warn("📭 Distance Matrix returned incomplete data:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error in getDrivingDistance:", error);
    return null;
  }
};

exports.getNearbyPlaces = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const maxDistance = 10000; // 10 كم

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        success: false,
        message: "إحداثيات غير صالحة",
        data: null,
      });
    }

    const places = await Place.find();
    const nearbyPlaces = [];

    for (const place of places) {
      const placeLat = place.location.latitude;
      const placeLng = place.location.longitude;

      const distance = await getDrivingDistance(lat, lng, placeLat, placeLng);

      if (distance !== null && distance <= maxDistance) {
        nearbyPlaces.push({ ...place.toObject(), distance });
      }
    }

    nearbyPlaces.sort((a, b) => a.distance - b.distance);

    return res.status(200).json({
      success: true,
      message: "تم جلب الأماكن القريبة بنجاح",
      data: nearbyPlaces.slice(0, 2),
    });
  } catch (error) {
    console.error("Error in getNearbyPlaces:", error);
    res.status(500).json({
      success: false,
      message: "فشل في جلب الأماكن القريبة",
      error: error.message,
      data: null,
    });
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
    
    // البحث في الأماكن
    const placesPromise = Place.find({
      status: 'approved',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } } // البحث باسم المدينة كحقل نصي
      ]
    })
    .skip(skip)
    .limit(limit)
    .lean();
    
    // البحث في المقالات
    const articlesPromise = Article.find({
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
    .skip(skip)
    .limit(limit)
    .lean();
    
    // جلب العدد الكلي للأماكن المطابقة
    const countPlacesPromise = Place.countDocuments({
      status: 'approved',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } }
      ]
    });
    
    const [places, articles, totalPlaces] = await Promise.all([
      placesPromise,
      articlesPromise,
      countPlacesPromise
    ]);
    
    // استخراج المدن الفريدة من نتائج الأماكن
    const uniqueCities = [];
    const cityMap = new Map();
    
    places.forEach(place => {
      if (place.city && !cityMap.has(place.city)) {
        cityMap.set(place.city, true);
        uniqueCities.push({
          name: place.city,
          placesCount: places.filter(p => p.city === place.city).length
        });
      }
    });
    
    res.json({
      success: true,
      results: {
        places,
        articles,
        cities: uniqueCities.slice(0, 10) // الحد الأقصى للمدن المعروضة
      },
      total: totalPlaces,
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
    const { term } = req.query;
    
    if (!term || term.trim().length < 2) {
      return res.json([]);
    }
    
    const [places, articles] = await Promise.all([
      Place.find({
        status: 'approved',
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { city: { $regex: term, $options: 'i' } }
        ]
      })
      .limit(5)
      .select('name city')
      .lean(),
      
      Article.find({
        status: 'published',
        title: { $regex: term, $options: 'i' }
      })
      .limit(5)
      .select('title')
      .lean()
    ]);
    
    const suggestions = [
      ...places.map(p => ({ 
        name: p.name, 
        type: 'مكان',
        city: p.city ? `(${p.city})` : ''
      })),
      ...places.filter(p => p.city && p.city.toLowerCase().includes(term.toLowerCase()))
               .map(p => ({
                 name: p.city,
                 type: 'مدينة'
               })),
      ...articles.map(a => ({ 
        name: a.title, 
        type: 'مقال' 
      }))
    ].slice(0, 8); // الحد الأقصى للاقتراحات
    
    // إزالة التكرارات
    const uniqueSuggestions = [];
    const seen = new Set();
    
    suggestions.forEach(item => {
      const key = `${item.name}-${item.type}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSuggestions.push(item);
      }
    });
    
    res.json(uniqueSuggestions);
    
  } catch (err) {
    console.error('Suggestions error:', err);
    res.status(500).json([]);
  }
};