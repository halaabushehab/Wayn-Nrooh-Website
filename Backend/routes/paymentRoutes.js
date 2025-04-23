// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// إنشاء جلسة الدفع
router.post("/create-checkout-session", paymentController.createCheckoutSession);

// التعامل مع Webhook من Stripe
router.post("/stripe-webhook", paymentController.handleStripeWebhook);

// جلب جميع المدفوعات
router.get("/payments", paymentController.getAllPayments);

// جلب دفع معين حسب ID
router.get("/payment/:paymentId", paymentController.getPaymentById);

module.exports = router;
