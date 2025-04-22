const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false  },
    phone: { type: String, required: false },  // رقم الهاتف
    photo: { type: String, default: '' }, // صورة المستخدم
    bio: { type: String, required: false },    // السيرة الذاتية
    birthdate: { type: Date, required: false }, // تاريخ الميلاد
    joinDate: { type: Date, default: Date.now }, // تاريخ الانضمام
    city: { type: String, required: false },  // المدينة
    isAdmin: { type: Boolean, default: false } ,// تأكد من وجود هذا الحقل
    googleId: { type: String, unique: true, sparse: true },
    isDeleted: { type: Boolean, default: false } // الحقل الجديد


});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
