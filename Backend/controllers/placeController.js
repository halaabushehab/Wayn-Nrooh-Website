const Place = require("../models/places");
const User = require("../models/User"); 
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');


//  جلب عدد الأماكن
exports.getPlaceCount = async (req, res) => {
  try {
    const count = await Place.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب عدد الأماكن", error: error.message });
  }
};

//جلب تفاصيل المكان حسب  ID
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
exports.getPlacesGrouped = async (req, res) => {
  try {
    const { city, category_id, suitable_for, search, page = 1, limit = 8 } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

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

//  جلب الأماكن حسب المدينة
exports.getPlacesByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const places = await Place.find({ city, status: "approved" });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "خطأ في جلب الأماكن لهذه المدينة", error: error.message });
  }
};

//  جلب الأماكن حسب التصنيف
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

//  جلب الأماكن حسب الموسم
exports.getPlacesBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    const validSeasons = ["صيف", "شتاء", "ربيع", "خريف"];

    // تحقق من صحة الموسم
    if (!validSeasons.includes(season)) {
      return res.status(400).json({ message: "الموسم غير صالح." });
    }

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

//  البحث + الفلترة
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

//  جلب جميع الأماكن بحالة approved فقط
exports.getAllPlaces = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const query = { status: 'approved' };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: 'createdBy',
        strictPopulate: false 
      }
    };


    const places = await Place.paginate(query, options);


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
// تأكد من وجود الفهرس الجغرافي قبل تنفيذ الاستعلام
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
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

//  الأماكن القريبة
exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 2 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "يجب إرسال lat و lng" });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const distanceLimit = parseFloat(maxDistance); 

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
    const userId = req.params.userId; 

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


