const Rating = require('../models/Rating');

// 📌 إضافة تقييم جديد
exports.addRating = async (req, res) => {
  try {
    const { userId, placeId, rating, comment } = req.body;

    // ✅ التحقق من صحة البيانات
    if (!userId || !placeId || !rating) {
      return res.status(400).json({ error: "❌ يرجى إدخال جميع الحقول المطلوبة" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "❌ يجب أن يكون التقييم بين 1 و 5" });
    }

    // ✅ إضافة التقييم إلى قاعدة البيانات
    const newRating = new Rating({ userId, placeId, rating, comment });
    await newRating.save();

    res.status(201).json({ message: "✅ تم إضافة التقييم بنجاح", rating: newRating });
  } catch (error) {
    console.error("❌ خطأ أثناء إضافة التقييم:", error.message);
    res.status(500).json({ error: `❌ حدث خطأ أثناء إضافة التقييم: ${error.message}` });
  }
};


// 📌 جلب جميع التقييمات لمكان معين مع حساب المتوسط
exports.getRatingsForPlace = async (req, res) => {
  try {
    let { placeId } = req.params;

    // 🔥 تنظيف `placeId` من أي فراغات أو سطور جديدة
    placeId = placeId.trim();

    console.log("📌 placeId بعد التنظيف:", placeId);

    // 🔥 تحقق من صحة `ObjectId`
    if (!placeId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "❌ placeId غير صالح" });
    }

    const ratings = await Rating.find({ placeId });

    console.log("✅ التقييمات:", ratings);

    if (!ratings.length) {
      return res.json({ average: 0, ratings: [] });
    }

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = (total / ratings.length).toFixed(1);

    res.json({ average, ratings });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب التقييمات:", error);
    res.status(500).json({ error: "❌ حدث خطأ أثناء جلب التقييمات" });
  }
};
