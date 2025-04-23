// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const bodyParser = require("body-parser");

// Webhook endpoint
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook
);

// Payment endpoints
router.post("/pay", paymentController.createCheckoutSession);
router.get("/payments", paymentController.getAllPayments);
router.get("/payments/:paymentId", paymentController.getPaymentById);

module.exports = router;
