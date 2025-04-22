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
    const newPlace = new Place(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    console.error("Error creating place:", error);
    res.status(400).json({ message: "Failed to create place", error: error.message });
  }
};

// ✅ تعديل المكان (Edit)
exports.updatePlace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ المعرف غير صالح." });
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      id,
      { $set: req.body }, // Set the fields from the request body
      { new: true } // Return the updated document
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "❌ المكان غير موجود." });
    }

    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: "❌ حدث خطأ أثناء تحديث المكان.", error: error.message });
  }
};

// ✅ حذف المكان (Soft delete)
exports.softDeletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "❌ المعرف غير صالح." });
    }

    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ message: "❌ المكان غير موجود." });
    }

    // Mark the place as deleted (soft delete)
    place.status = "deleted";
    await place.save();

    res.status(200).json({ message: "✔️ تم حذف المكان بنجاح." });
  } catch (error) {
    res.status(500).json({ message: "❌ حدث خطأ أثناء حذف المكان.", error: error.message });
  }
};

 
// ✅ جلب إحصائيات الحالات
exports.getPlaceStatusStats = async (req, res) => {
  try {
    const approved = await Place.countDocuments({ status: "approved" });
    const rejected = await Place.countDocuments({ status: "rejected" });
    const pending = await Place.countDocuments({ status: "pending" });

    res.status(200).json({ approved, rejected, pending });
  } catch (error) {
    console.error("Error in getPlaceStatusStats:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};