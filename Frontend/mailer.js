const nodemailer = require('nodemailer');

// إعداد الناقل (transporter) مرة واحدة
const transporter = nodemailer.createTransport({
  service: 'gmail', // يمكنك استخدام أي خدمة بريد إلكتروني
  auth: {
    user: 'your-email@gmail.com', // بريدك الإلكتروني
    pass: 'your-email-password', // كلمة المرور الخاصة بك
  },
});

module.exports = transporter; // تصدير الناقل