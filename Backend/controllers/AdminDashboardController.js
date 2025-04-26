// controllers/adminDashboardController.js
const Place = require("../models/places"); // موديل الـ Place
const mongoose = require("mongoose");
const User = require("../models/User"); // Ensure the path is correct
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const upload = require('../middleware/uploadMiddleware');
const passport = require("passport");
const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");


// جلب جميع الأماكن
const getAllPlaces = async (req, res) => {
  try {
    const user = req.user;
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden, Admin access only" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const filter = { isDeleted: false };


    if (search) {
      // ابحث مثلاً بالعنوان أو الاسم
      filter.name = { $regex: search, $options: 'i' };
    }
    
    const statusFilter = req.query.status; // ⬅️ إضافة هذا السطر
    const query = { isDeleted: false };

    // 👇 تطبيق الفلترة حسب الحالة إذا تم إرسالها
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }

    const places = await Place.find(query)
      .skip(skip)
      .limit(limit);

    const totalPlaces = await Place.countDocuments(query);

    res.status(200).json({
      places,
      currentPage: page,
      totalPages: Math.ceil(totalPlaces / limit),
      totalPlaces
    });
  } catch (err) {
    console.error("Error fetching places:", err);
    res.status(500).json({ message: "Error fetching places" });
  }
};

const getPlaceById = async (req, res) => {
  const { id } = req.params;  // جلب الـ ID من المسار
  try {
    const place = await Place.findById(id);  // البحث عن المكان باستخدام الـ ID
    if (!place) {
      return res.status(404).json({ message: "المكان غير موجود" });
    }
    res.status(200).json(place);  // إرجاع البيانات
  } catch (error) {
    console.error("حدث خطأ أثناء جلب المكان:", error);
    res.status(500).json({ message: "خطأ في جلب البيانات", error: error.message });
  }
};

// تعديل المكان
const updatePlace = async (req, res) => {
  const { id } = req.params; // تأكد من أن هذا هو الـ id الصحيح
  const updateData = req.body; // الحقول التي جائت من الفورم

  try {
    // إضافة لوج لتصحيح القيم المرسلة
    console.log('تم استقبال البيانات لتحديث المكان:', updateData);

    // إذا كانت هناك صور مرفوعة:
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `http://localhost:9527/uploads/${file.filename}`);
    }

    // تحديث المكان
    const place = await Place.findByIdAndUpdate(id, updateData, { new: true });
    if (!place) {
      return res.status(404).json({ message: "المكان غير موجود" });
    }

    console.log('تم التحديث بنجاح:', place);
    res.status(200).json(place); // إعادة المكان المحدث
  } catch (error) {
    console.error("حدث خطأ أثناء التعديل:", error);
    res.status(500).json({ message: "خطأ في التعديل", error: error.message });
  }
};


const deletePlace = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid place ID" });
    }

    const place = await Place.findByIdAndUpdate(
      id, 
      { isDeleted: true },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json({ 
      message: "Place soft deleted successfully", 
      place 
    });
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({ 
      message: "Error deleting place", 
      error: error.message 
    });
  }
};

const updatePlaceStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid place ID" });
  }

  const allowedStatuses = ['approved', 'pending', 'rejected'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const place = await Place.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.status(200).json({ 
      message: "Status updated successfully", 
      place 
    });
  } catch (error) {
    console.error("Error updating place status:", error);
    res.status(500).json({ 
      message: "Failed to update status", 
      error: error.message 
    });
  }
};

// User ==========================

const addAdmin = async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Only admins can add other admins." });
      }
  
      const { username, email, password } = req.body;
      
      // تحقق من وجود المستخدم
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // إضافة المستخدم كأدمن
      const newAdmin = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin: true
      });
  
      await newAdmin.save();
  
      res.status(201).json({
        message: "Admin added successfully",
        admin: { username: newAdmin.username, email: newAdmin.email, isAdmin: newAdmin.isAdmin }
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  


  // Payment ==========================


  // الحصول على جميع المدفوعات
  const getAllPayments = async (req, res) => {
    try {
      const payments = await Payment.find();
      res.status(200).json({ payments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "حدث خطأ أثناء جلب المدفوعات" });
    }
  };
  
const getPaymentsByPlaceId = async (req, res) => {
  try {
    const { placeId } = req.params;
    const payments = await Payment.find({ placeId });  // نجلب المدفوعات بناءً على المكان
    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب مدفوعات المكان" });
  }
};


//view =================================
const getDashboardOverview = async (req, res) => {
  try {
    const allData = await axios.get("http://localhost:9527/dashboard/all");
    const places = await axios.get("http://localhost:9527/api/places/");
    const messages = await axios.get("http://localhost:9527/api/message");
    const users = await axios.get("http://localhost:9527/api/auth/all");

    // حساب إجمالي الإيرادات
    const totalRevenue = allData.data.payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

    // دمج البيانات
    const dashboardData = {
      allData: { ...allData.data, totalRevenue },
      places: places.data,
      messages: messages.data,
      users: users.data,
    };

    res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server error");
  }
};


module.exports = { getAllPlaces,getDashboardOverview ,getPlaceById,updatePlaceStatus, updatePlace, deletePlace,addAdmin ,getPaymentsByPlaceId ,getAllPayments };
