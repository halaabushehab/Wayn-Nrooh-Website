// // models/Payment.js
// const mongoose = require("mongoose");

// const PaymentSchema = new mongoose.Schema(
//   {
//     subscriber: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     subscriptionCard: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "SubscriptionCard",
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     payment_method: {
//       type: String,
//       required: true,
//     },
//     payment_status: {
//       type: String,
//       required: true,
//       default: "Completed",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Payment", PaymentSchema);


const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionCard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionCard",
      required: true,
    },
    ticketCount: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["card", "stripe"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: { // معرّف المعاملة (للدفع عبر الإنترنت)
      type: String,
      required: false,
    },
    paymentDate: { // تاريخ الدفع
      type: Date,
      required: false,
    },
    discount: { // الخصم (إن وجد)
      type: Number,
      required: false,
      default: 0,
    },
    currency: { // العملة
      type: String,
      required: true,
      default: "JD", // افتراض العملة هي الدينار
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
