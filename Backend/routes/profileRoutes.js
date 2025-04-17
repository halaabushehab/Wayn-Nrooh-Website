const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config();

const uploadProfilePicture = async (req, res) => {
  try {
    // استخراج معرف المستخدم من req.user (الذي تم تعيينه بواسطة authMiddleware)
    const userId = req.user;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "معرّف مستخدم غير صالح." });
    }

    // البحث عن المستخدم
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "لم يتم العثور على المستخدم." });
    }

    // التأكد من رفع الملف
    if (!req.file) {
      return res.status(400).json({ message: "لم يتم رفع أي صورة." });
    }

    // إعداد رابط الصورة الكامل (تأكد من ضبط BASE_URL في ملف .env أو استخدام القيمة الافتراضية)
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const fileName = req.file.filename;
    user.profilePicture = `${baseUrl}/uploads/${fileName}`;

    // (اختياري) تحديث اسم المستخدم إذا تم إرساله مع FormData
    if (req.body.username) {
      user.username = req.body.username;
    }

    await user.save();

    return res.status(200).json({
      message: "تم رفع صورة الملف الشخصي بنجاح",
      user,
    });
  } catch (error) {
    console.error("❌ خطأ في رفع صورة الملف الشخصي:", error);
    return res.status(500).json({ message: "حصل خطأ في السيرفر" });
  }
};

module.exports = {
  uploadProfilePicture,
};
