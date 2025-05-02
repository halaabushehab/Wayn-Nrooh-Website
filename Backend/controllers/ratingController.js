const Rating = require('../models/Rating');
const Place = require('../models/places'); // تأكد من وجود هذا النموذج

// 📌 إضافة تقييم جديد
exports.addRating = async (req, res) => {
  try {
    const { userId, placeId, rating, comment  } = req.body;

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

    // جلب التقييمات مع بيانات المستخدم
    const ratings = await Rating.find({ placeId }).populate('userId', 'username profilePicture'); // تأكد من أن لديك علاقة بين التقييمات والمستخدمين

    console.log("✅ التقييمات:", ratings);

    if (!ratings.length) {
      return res.json({ average: 0, ratings: [] });
    }

    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = (total / ratings.length).toFixed(1);

    // تحويل التقييمات لتشمل بيانات المستخدم
    const ratingsWithUser  = ratings.map(rating => ({
      rating: rating.rating,
      comment: rating.comment,
      createdAt: rating.createdAt,
      user: {
        username: rating.userId.username,
        profilePicture: rating.userId.profilePicture
      }
    }));

    res.json({ average, ratings: ratingsWithUser  });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب التقييمات:", error);
    res.status(500).json({ error: "❌ حدث خطأ أثناء جلب التقييمات" });
  }
};



// 📌 جلب المكان الأعلى تقييماً من قبل المستخدمين
exports.getTopRatedPlace = async (req, res) => {
  try {
    // تجميع التقييمات لحساب المتوسط لكل مكان
    const topPlace = await Rating.aggregate([
      {
        $group: {
          _id: "$placeId",
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 }
        }
      },
      { $sort: { averageRating: -1, totalRatings: -1 } },
      { $limit: 1 }
    ]);

    if (!topPlace.length) {
      return res.status(404).json({ message: "❌ لا يوجد تقييمات حتى الآن" });
    }

    // جلب بيانات المكان المرتبط
    const place = await Place.findById(topPlace[0]._id);

    res.json({
      place: {
        _id: place._id,
        name: place.name,
        image: place.image,
        description: place.description,
        averageRating: topPlace[0].averageRating.toFixed(1),
        totalRatings: topPlace[0].totalRatings
      }
    });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب أعلى مكان:", error);
    res.status(500).json({ error: "❌ حدث خطأ أثناء جلب أعلى مكان" });
  }
};

// 📌 جلب عدد التقييمات الكليّة على الموقع
exports.getTotalRatingsCount = async (req, res) => {
  try {
    const count = await Rating.countDocuments();
    
    if (count === 0) {
      return res.json({ message: "❌ لا توجد تقييمات حتى الآن" });
    }

    res.json({ totalRatings: count });
  } catch (error) {
    console.error("❌ خطأ أثناء جلب عدد التقييمات:", error);
    res.status(500).json({ error: "❌ حدث خطأ أثناء جلب عدد التقييمات" });
  }
};

