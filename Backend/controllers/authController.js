const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();
const mongoose = require('mongoose');
const upload = require('../utils/upload');
const passport = require("passport");
const Joi = require("joi");

// تحقق من صحة بيانات التسجيل
const validateRegisterInput = (data) => {
  const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// تحقق من صحة بيانات الدخول
const validateLoginInput = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'يجب إدخال بريد إلكتروني صالح',
      'any.required': 'البريد الإلكتروني مطلوب'
    }),
    password: Joi.string().required().messages({
      'any.required': 'كلمة المرور مطلوبة'
    })
  });

  return schema.validate(data, { abortEarly: false });
};

const register = async (req, res) => {
  // التحقق من الصحة باستخدام Joi
  
  const { error } = validateRegisterInput(req.body);
  if (error) {
    return res.status(400).json({ 
      message: "Validation error",
      errors: error.details.map(err => err.message)
    });
  }

  const { username, email, password } = req.body;
  console.log("🔴 Received data:", req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    if (email === "halaabushehab@gmail.com") {
      user.isAdmin = true;
    }

    await user.save();
    console.log("✅ User registered:", user.username);

    // إنشاء التوكن
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // إعداد الكوكيز
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 ساعة
      sameSite: 'strict'
    });

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
  // التحقق من الصحة باستخدام Joi
  const { error } = validateLoginInput(req.body);
  if (error) {
    return res.status(400).json({ 
      message: "Validation error",
      errors: error.details.map(err => err.message)
    });
  }

  const { email, password } = req.body;
  console.log("🔵 Login attempt with email:", email);

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (email === "halaabushehab@gmail.com") {
      user.isAdmin = true;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // إعداد الكوكيز بشكل آمن
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 ساعة
      sameSite: 'strict'
    });

    console.log(`✅ User logged in: ${user.username} (Admin: ${user.isAdmin})`);

    return res.json({
      message: "Logged in",
      username: user.username,
      token,
      email: user.email,
      userId: user._id,
      isAdmin: user.isAdmin,
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const logout = (req, res) => {
  // مسح الكوكي
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.status(200).json({ message: "Logged out successfully" });
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
    console.log("Fetched users:", users);
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

const getUserById = async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    
    // التحقق من أن المعرف صالح قبل البحث
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        message: "معرف المستخدم غير صالح",
        code: "INVALID_USER_ID"
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ 
        message: "المستخدم غير موجود",
        code: "USER_NOT_FOUND"
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ 
      message: "خطأ في الخادم",
      code: "SERVER_ERROR",
      error: error.message 
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

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

    if (updates.username) user.username = updates.username;
    if (updates.email) user.email = updates.email;
    if (updates.password) {
      user.password = await bcrypt.hash(updates.password, 10);
    }
    if (updates.profilePicture) user.profilePicture = updates.profilePicture;
    if (updates.role) user.role = updates.role;
    if (updates.isdeleted !== undefined) user.isdeleted = updates.isdeleted;
    if (updates.isActivated !== undefined) user.isActivated = updates.isActivated;

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

const updateUserData = async (req, res) => {
  const { id } = req.params;
  const { username, email, phone, city, bio } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.city = city || user.city;
    user.bio = bio || user.bio;

    if (req.file) {
      user.photo = req.file.path;
    }

    await user.save();

    res.status(200).json({ message: 'تم تحديث البيانات بنجاح', user });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث البيانات', error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    console.log('User ID:', userId);
    console.log('Current Password:', currentPassword);

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      console.log('Current password is incorrect');
      return res.status(401).json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' });
    }

    if (currentPassword === newPassword) {
      console.log('New password must be different from current');
      return res.status(400).json({ success: false, message: 'كلمة المرور الجديدة يجب أن تكون مختلفة عن الحالية' });
    }

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

const authenticateToken = (req, res, next) => {
  // محاولة الحصول على التوكن من الكوكيز أولاً
  let token = req.cookies.token;
  
  // إذا لم يوجد في الكوكيز، جرب الهيدر
  if (!token) {
    const authHeader = req.header('Authorization');
    token = authHeader?.replace('Bearer ', '');
  }

  if (!token) {
    console.log("Token not provided");
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
    req.user = decoded; 
    next();
  } catch (error) {
    console.log("Token verification failed:", error);
    return res.status(401).json({ message: 'Failed to authenticate token' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
  getUserProfile,
  updateUserData,
  changePassword,
  authenticateToken,
  isAdmin
};