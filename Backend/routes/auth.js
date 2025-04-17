const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    register,
     login,  
    getAllUsers,
    getUserById,
    deleteUser,
    getUserProfile,
    updateUserData ,
    changePassword,
    authenticateToken,
    isAdmin,
    googleAuth,
     googleCallback,
 } = 
    require('../controllers/authController'); // استيراد الدوال

const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });




// ✅ انشاء حساب كل المستخدمين
router.post('/register', register);
// ✅ تسجيل الدخول  كل المستخدمين
router.post('/login', login);

// ✅ جلب كل المستخدمين
router.get("/all", getAllUsers);



// ✅ جلب بروفايل المستخدم (يحتاج تسجيل دخول)
router.get("/profile/me", authenticateToken,authMiddleware, getUserProfile);


// ✅ تعديل بيانات المستخدم
// استخدم multer هنا لاستقبال الملف
router.put('/profile/me/:id', authenticateToken, upload.single('photo'), updateUserData);

// ✅ حذف المستخدم (Soft Delete)
router.delete("/delete/:id", deleteUser);



// استخدم multer هنا لاستقبال الملف
router.put('/profile/:id/photo', authenticateToken, upload.single('photo'));
  
// تغيير كلمة المرور
router.put('/change-password', authenticateToken, authMiddleware, changePassword);


//admin
router.get("/admin/users", isAdmin, getAllUsers); // ❗️ هذه المسارات مخصصة للأدمن فقط


// Route to initiate Google OAuth
router.get("/google", googleAuth);

// Route to handle callback
router.get("/google/callback", googleCallback);

// ✅ جلب مستخدم حسب الـ ID
router.get("/:id", getUserById);

module.exports = router;