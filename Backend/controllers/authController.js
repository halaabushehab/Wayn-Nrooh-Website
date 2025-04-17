const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();
const mongoose = require('mongoose');
const upload = require('../utils/upload'); // تأكد من المسار الصحيح
const passport = require("passport");
const Joi = require("joi");


const register = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("🔴 Received data:", req.body);

  if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });

      // ❗ إذا كان هذا الإيميل خاص بالمشرف
      if (email === "halaabushehab@gmail.com") {
          user.isAdmin = true;
      }

      await user.save();
      console.log("✅ User registered:", user.username);

      // ✅ إنشاء التوكن مباشرة بعد التسجيل
      const token = jwt.sign(
          { userId: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
      );

      // إرسال الرد مع التوكن والمعلومات
      res.status(201).json({
          message: "User registered successfully",
          token,
          username: user.username,
          email: user.email,
          userId: user._id,
          isAdmin: user.isAdmin,
      });

  } catch (error) {
      console.error("❌ Registration error:", error);
      res.status(500).json({ message: "Registration failed", error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔵 Login attempt with email:", email);

  try {
      const user = await User.findOne({ email });

      // التحقق من وجود المستخدم وكلمة المرور
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // ✅ **إعطاء حساب محدد صلاحية المسؤول تلقائيًا**
      if (email === "halaabushehab@gmail.com") {
          user.isAdmin = true; // تعيين المسؤولية للحساب المحدد
          await user.save(); // تحديث القاعدة البيانات إذا لزم الأمر
      }

      // 🔹 إنشاء التوكن مع `isAdmin`
      const token = jwt.sign(
          { userId: user.id, isAdmin: user.isAdmin, username: user.username, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
      );

      // 🔹 إرسال التوكن في الكوكيز
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

      console.log(`✅ User logged in: ${user.username} (Admin: ${user.isAdmin})`);

      return res.json({
          message: "Logged in",
          username: user.username,
          token,
          email: user.email,
          userId: user._id,
          isAdmin: user.isAdmin, // ✅ إرسال isAdmin إلى الفرونت
      });

  } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({ message: "Login failed", error: error.message });
  }
};


const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    console.log("Fetched users:", users); // إضافة هذه السطر لرؤية المستخدمين
    const userCount = users.length;

    res.status(200).json({
      message: "Users fetched successfully",
      users,
      userCount,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  // Get a single user by ID
  const getUserById = async (req, res) => {
    try {
        console.log("Requested ID:", req.params.id);  // ✅ تحقق من الـ id
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error in getUserById:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

  
  // Get user profile (based on token user ID)
  const getUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; // يتم استخراجه من التوكن بعد المصادقة
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const user = await User.findById(userId).select("-password -otp -otpExpiry");
  
      if (!user || user.isdeleted) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Edit user details
  const editUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
  
    try {
      const user = await User.findById(id);
  
      if (!user || user.isdeleted) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update only the fields that are provided
      if (updates.username) user.username = updates.username;
      if (updates.email) user.email = updates.email;
      if (updates.password) {
        user.password = await bcrypt.hash(updates.password, 10);
      }
      if (updates.profilePicture) user.profilePicture = updates.profilePicture;
      if (updates.role) user.role = updates.role;
      if (updates.isdeleted !== undefined) user.isdeleted = updates.isdeleted;
      if (updates.isActivated !== undefined)
        user.isActivated = updates.isActivated;
  
      // Save updated user
      await user.save();
  
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.otp;
      delete userResponse.otpExpiry;
  
      res.status(200).json({ message: "User updated successfully", user: userResponse });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Soft delete a user
  const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
  
    try {
      const user = await User.findById(id).select("isdeleted");
  
      if (!user || user.isdeleted) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await User.findByIdAndUpdate(id, { isdeleted: true }, { new: true });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  // userprofile ==================================================================
  const  updateUserData = async (req, res) => {
    const { id } = req.params;
    const { username, email, phone, city, bio } = req.body; // إزالة photo من هنا

    try {
        const user = await User.findById(id); // البحث عن المستخدم باستخدام الـ id

        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // تحديث بيانات المستخدم
        user.username = username || user.username;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.city = city || user.city;
        user.bio = bio || user.bio;

        // تحديث صورة المستخدم إذا تم رفع صورة جديدة
        if (req.file) {
            user.photo = req.file.path; // تأكد من حفظ مسار الصورة في قاعدة البيانات
        }

        await user.save(); // حفظ التغييرات في قاعدة البيانات

        res.status(200).json({ message: 'تم تحديث البيانات بنجاح', user });
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ أثناء تحديث البيانات', error: error.message });
    }
};



// دالة تغيير كلمة المرور
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId; // استخدم userId من req.user

    console.log('User  ID:', userId);
    console.log('Current Password:', currentPassword);

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log('User  not found');
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(401).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
    }

    // Ensure new password is different from current
    if (currentPassword === newPassword) {
      console.log('New password must be different from current');
      return res.status(400).json({ success: false, message: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    console.log('Password updated successfully');
    res.json({ success: true, message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' });
  }
};




// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     console.log("Token not provided");
//     return res.status(402).json({ message: 'Access denied. No token provided.' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded); // هنا تحقق من صحة البيانات
//     req.user = decoded; 
//     next();
//   } catch (error) {
//     console.log("Token verification failed:", error);
//     return res.status(401).json({ message: 'Failed to authenticate token' });
//   }
// };



// Route to update profile photo
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log("Token not provided");
    return res.status(402).json({ message: 'Access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // تحقق من صحة البيانات
    req.user = decoded; 

    // تحقق من وجود userId
    if (!req.user.userId) {
      console.log("User  ID not found in token");
      return res.status(401).json({ message: 'User  ID not found in token' });
    }

    next();
  } catch (error) {
    console.log("Token verification failed:", error);
    return res.status(401).json({ message: 'Failed to authenticate token' });
  }
};




const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=true`);
    }
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  })(req, res, next);
};


module.exports = {
    register,
    login,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
    getUserProfile,
    updateUserData ,
    changePassword,
    authenticateToken,
    isAdmin,
    googleAuth,
    googleCallback,

};


