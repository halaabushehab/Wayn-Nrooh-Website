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
    transactionId: {
      type: String,
      required: false,
    },
    paymentDate: {
      type: Date,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: "JD", // الدينار الأردني كافتراضي
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", PaymentSchema);
