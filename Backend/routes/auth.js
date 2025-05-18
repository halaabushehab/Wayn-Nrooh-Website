const express = require('express');
const { requireAuth } = require('../middleware/authMiddleware');
const { 
    register,
    login,  
    getAllUsers,
    getUserById,
    deleteUser,
    getUserProfile,
    updateUserData,
    changePassword,
    isAdmin,
    logout,
    restoreUser,
    googleLogin
} = require('../controllers/authController');

const router = express.Router();
const upload = require('../middleware/uploadMiddleware');


// Google login
router.post("/google-login", googleLogin);
// ✅ انشاء حساب كل المستخدمين
router.post('/register', register);

// ✅ تسجيل الدخول كل المستخدمين
router.post('/login', login);

// ✅ تسجيل الخروج
router.post('/logout', logout);

// تعريف المسار GET لجلب كل المستخدمين
router.get("/all", getAllUsers);


// ✅ جلب بروفايل المستخدم (يحتاج تسجيل دخول)
router.get("/profile/me", requireAuth , getUserProfile);

// ✅ تعديل بيانات المستخدم
router.put('/profile/me/:id', requireAuth , upload.single('image'), updateUserData);


// ✅ تغيير كلمة المرور
router.put('/change-password', requireAuth , changePassword);

// ✅ جلب مستخدم حسب الـ ID
router.get("/:id", getUserById);

//  مسارات الأدمن فقط
router.get("/admin/users", requireAuth , isAdmin, getAllUsers);

// ✅ حذف المستخدم (Soft Delete)
router.delete("/delete/:id", requireAuth , deleteUser);
router.delete('/restore/:id', restoreUser); 

module.exports = router;