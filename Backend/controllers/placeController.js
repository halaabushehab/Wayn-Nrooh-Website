const Place = require("../models/places");
const User = require("../models/User"); // تأكد من وجود هذا الموديل
const mongoose = require("mongoose");




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



exports.createPlace = async (req, res) => {
  try {
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
    } = req.body;

    console.log(req.body);


    // Handle uploaded files
    const images = req.files && req.files.length > 0 
    ? req.files.map(file => `http://localhost:9527/uploads/${file.filename}`) 
    : [];
    const newPlace = new Place({
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
      categories,
      suitable_for,
      phone,
      website,
      images,
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
    console.log("Query options: ", options);

    const places = await Place.paginate(query, options);

    // طباعة النتيجة قبل إرسالها
    console.log("Fetched places: ", places);

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


