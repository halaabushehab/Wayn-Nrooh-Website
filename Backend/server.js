
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth');
const placeRoutes = require("./routes/placeRoutes");
const messageroutes = require("./routes/messageroutes");
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const articleRoutes = require('./routes/ArticleRoutes');
const paymentRoutes = require("./routes/paymentRoutes");
const suggestionsRoutes = require('./routes/suggestionsRoutes');
// const subscribeRoutes   = require('./routes/subscribe');
const favoriteRoutes = require('./routes/favoritesRoutes');

const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const upload = require('./middleware/uploadMiddleware'); // ✅ هذا فيه إعدادات multer المخصصة

require("dotenv").config();
const nodemailer = require("nodemailer");

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const passport = require("passport");
require("./config/passport");

const app = express();
const PORT = process.env.PORT || 9527;
const fs = require('fs');
const https = require('https');

// ✅ CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

 

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});
module.exports = transporter;

// ✅ Passport
app.use(passport.initialize());

// ✅ ربط قاعدة البيانات
connectDB();

// ✅ استخدام المسارات
app.use("/api/auth", authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api", messageroutes);
app.use('/api', commentRoutes);
app.use('/api/ratings', ratingRoutes);
app.use("/api/payments", paymentRoutes);

app.use('/articles', articleRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/favorites', favoriteRoutes);

// app.use("/api/subscribe", subscribeRoutes);

// ✅ مسار تجريبي للتسجيل
app.post('/api/auth/register', (req, res) => {
    console.log("🔴Received data:", req.body);
    res.status(201).json({ message: "User registered" });
});

// ✅ لوج لكل طلب
app.use((req, res, next) => {
  console.log(`🔹 Received request: ${req.method} ${req.url}`);
  next();
});


app.get('/', (req, res) => {
  res.send('Hello World');
});

// ✅ تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
