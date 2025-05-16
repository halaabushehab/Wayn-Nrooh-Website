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
// في الـ controller الخاص بالتقييمات
exports.getRatingsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;  // استخراج placeId من المعاملات

    // جلب التقييمات المتعلقة بالمكان مع بيانات المستخدم
    const ratings = await Rating.find({ placeId, isHidden: false })
      .populate("userId", "username photo")  // إضافة username و profilePicture
    
      .sort({ createdAt: -1 });  // ترتيب التقييمات حسب التاريخ (الأحدث أولاً)

    // إرسال التقييمات
    res.status(200).json(ratings);
  } catch (error) {
    // التعامل مع الأخطاء عند فشل جلب التقييمات
    console.error("❌ خطأ أثناء جلب التقييمات:", error.message);
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


// 📌 جلب جميع التقييمات لمكان معين مع حساب المتوسط
// exports.getRatings = async (req, res) => {
//   try {
//     const { placeId } = req.params;

//     // ✅ التحقق من وجود المكان
//     if (!placeId) {
//       return res.status(400).json({ error: "❌ يجب توفير placeId" });
//     }

//     // ✅ جلب التقييمات المتعلقة بالمكان
//     const ratings = await Rating.find({ placeId }).populate("userId", "username");

//     // ✅ حساب المتوسط
//     const averageRating = ratings.reduce((acc, r) => acc + r.rating, 0) / (ratings.length || 1);

//     res.json({
//       ratings,
//       averageRating: averageRating.toFixed(1),
//     });
//   } catch (error) {
//     console.error("❌ خطأ أثناء جلب التقييمات:", error.message);
//     res.status(500).json({ error: `❌ حدث خطأ أثناء جلب التقييمات: ${error.message}` });
//   }
// };





























































// 📜 جلب التعليقات الخاصة بمقال معين
exports.getCommentsByArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    const comments = await Comment.find({ articleId, status: "approved" })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("خطأ أثناء جلب التعليقات:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب التعليقات", details: error.message });
  }
};

// ❌ حذف تعليق معين
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ error: "التعليق غير موجود" });
    }

    res.status(200).json({ message: "تم حذف التعليق بنجاح" });
  } catch (error) {
    console.error("خطأ أثناء حذف التعليق:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حذف التعليق", details: error.message });
  }
};

// ✅ الموافقة على التعليق
exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { status } = req.body; // نأخذ الحالة من الجسم (Body)

    const comment = await Comment.findByIdAndUpdate(commentId, { status }, { new: true });
    if (!comment) {
      return res.status(404).json({ error: "التعليق غير موجود" });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("خطأ أثناء الموافقة على التعليق:", error);
    res.status(500).json({ error: "حدث خطأ أثناء الموافقة على التعليق", details: error.message });
  }
};

// 🚩 الإبلاغ عن تعليق
exports.reportComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reason } = req.body;

    const comment = await Comment.findByIdAndUpdate(commentId, {
      reported: true,
      reportReason: reason,
      status: "pending" // تحديث الحالة إلى "pending"
    }, { new: true });

    if (!comment) {
      return res.status(404).json({ error: "التعليق غير موجود" });
    }

    res.status(200).json({ message: "تم الإبلاغ عن التعليق", comment });
  } catch (error) {
    console.error("خطأ أثناء الإبلاغ عن التعليق:", error);
    res.status(500).json({ error: "حدث خطأ أثناء الإبلاغ عن التعليق", details: error.message });
  }
};

// 🚨 جلب التعليقات المبلغ عنها
exports.getReportedComments = async (req, res) => {
  try {
    const comments = await Comment.find({ reported: true })
      .populate("userId", "name")
      .populate("articleId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("خطأ أثناء جلب التعليقات المبلغ عنها:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب التعليقات المبلغ عنها", details: error.message });
  }
};

// 🟠 جلب التعليقات المعلقة
exports.getPendingComments = async (req, res) => {
  try {
    const comments = await Comment.find({ status: "pending" })
      .populate("userId", "name")
      .populate("articleId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error("خطأ أثناء جلب التعليقات المعلقة:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب التعليقات المعلقة", details: error.message });
  }
};
