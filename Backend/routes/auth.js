const express = require('express');
const { authMiddleware, authenticateToken } = require('../middleware/authMiddleware');
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
router.get("/profile/me", authenticateToken, authMiddleware, getUserProfile);

// ✅ تعديل بيانات المستخدم
router.put('/profile/me/:id', authenticateToken, authMiddleware, upload.single('image'), updateUserData);

// ✅ حذف المستخدم (Soft Delete)
router.delete("/delete/:id", authenticateToken, authMiddleware, deleteUser);

// ✅ تغيير كلمة المرور
router.put('/change-password', authenticateToken, authMiddleware, changePassword);

// ✅ جلب مستخدم حسب الـ ID
router.get("/:id", getUserById);

//  مسارات الأدمن فقط
router.get("/admin/users", authenticateToken, authMiddleware, isAdmin, getAllUsers);

module.exports = router;