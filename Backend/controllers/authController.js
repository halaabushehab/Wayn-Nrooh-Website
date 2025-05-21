const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config();
const mongoose = require('mongoose');
const upload = require('../middleware/uploadMiddleware');
const Joi = require("joi");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,  
    });

    const payload = ticket.getPayload();
    const { email, name, sub, picture } = payload; 

    // التحقق من وجود المستخدم في قاعدة البيانات باستخدام الـ googleId
    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = new User({
        username: name,
        email: email,
        googleId: sub,
        photo: picture,  
        isActivated: true,  
      });

      await user.save();  
    }

    // توليد الـ JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },  // تضمين الـ userId و الـ username في الـ payload
      process.env.JWT_SECRET,
      { expiresIn: "1d" }  // تعيين مدة صلاحية الـ token (هنا 1 يوم)
    );

    // إرجاع الـ token مع بيانات المستخدم
    res.status(200).json({
      message: "Google login successful",
      token,
      user_id: user._id,
      username: user.username,  // يمكنك إرجاع اسم المستخدم أيضًا إذا أردت
      email: user.email,
      photo: user.photo,  // إرجاع الصورة إذا كانت موجودة
    });
  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
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
  const { error } = validateLoginInput(req.body);
  if (error) {
    return res.status(400).json({ 
      message: "Validation error",
      errors: error.details.map(err => err.message)
    });
  }

  const { email, password } = req.body;

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

const getUserById = async (req, res) => {
  try {
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
      const photoPath = `http://localhost:9527/uploads/${req.file.filename}`;
      user.photo = photoPath;
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

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // الاستجابة بالنجاح
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Error in changePassword:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



const authenticateToken = (req, res, next) => {
  let token = req.cookies.token;
  
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json({
      message: "Users fetched successfully",
      users,
      userCount: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// dashboard
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).select('isDeleted');
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    await User.findByIdAndUpdate(id, { isDeleted: true });
    res.status(200).json({ message: "User soft-deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const restoreUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).select('isDeleted');
    if (!user || !user.isDeleted) {
      return res.status(404).json({ message: "User not found or not deleted" });
    }

    await User.findByIdAndUpdate(id, { isDeleted: false });
    res.status(200).json({ message: "User restored successfully" });
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getAllUsers,
  getUserById,
  deleteUser,
  getUserProfile,
  updateUserData,
  changePassword,
  authenticateToken,
    googleLogin,
    restoreUser,
  isAdmin
};