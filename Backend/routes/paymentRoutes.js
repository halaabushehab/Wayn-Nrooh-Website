const express = require("express");
const bodyParser = require("body-parser");
const {
  createCheckoutSession,
  handleStripeWebhook,
  getAllPayments,
  getPaymentById,
  verifyPayment
} = require("../controllers/paymentController");

const router = express.Router();

// 1) Webhook route — لازم يستخدم الجسم الخام (raw body) وليس JSON parser
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook
);

// 2) إنشاء جلسة الدفع
router.post("/pay", createCheckoutSession);

// 3) جلب كل المدفوعات
router.get("/payments", getAllPayments);

// 4) جلب دفعة واحدة
router.get("/payments/:paymentId", getPaymentById);

// 5) التحقق من الدفع بناءً على session_id
router.get("/verify-payment", verifyPayment);

module.exports = router;
