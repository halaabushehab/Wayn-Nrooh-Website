const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// إنشاء عملية دفع
router.post("/pay", paymentController.createPayment);

// الحصول على تفاصيل الحجز والدفع
router.get("/booking/:bookingId", paymentController.getBookingWithPayment);

// 🔴 احرص على أن هذا المسار موجود
router.get("/payments", paymentController.getAllPayments);





module.exports = router;
