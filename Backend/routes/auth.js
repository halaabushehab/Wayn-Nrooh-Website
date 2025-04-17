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
    logout
} = require('../controllers/authController');

const router = express.Router();
const multer = require('multer');

// إعداد multer لتخزين الملفات
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
    }
});

const upload = multer({ storage: storage });

// ✅ انشاء حساب كل المستخدمين
router.post('/register', register);

// ✅ تسجيل الدخول كل المستخدمين
router.post('/login', login);

// ✅ تسجيل الخروج
router.post('/logout', logout);

// ✅ جلب كل المستخدمين
router.get("/all", getAllUsers);

// ✅ جلب بروفايل المستخدم (يحتاج تسجيل دخول)
router.get("/profile/me", authenticateToken, authMiddleware, getUserProfile);

// ✅ تعديل بيانات المستخدم
router.put('/profile/me/:id', authenticateToken, authMiddleware, upload.single('photo'), updateUserData);

// ✅ حذف المستخدم (Soft Delete)
router.delete("/delete/:id", authenticateToken, authMiddleware, deleteUser);

// ✅ تغيير كلمة المرور
router.put('/change-password', authenticateToken, authMiddleware, changePassword);

// ✅ جلب مستخدم حسب الـ ID
router.get("/:id", getUserById);

// 🛑 مسارات الأدمن فقط
router.get("/admin/users", authenticateToken, authMiddleware, isAdmin, getAllUsers);

module.exports = router;