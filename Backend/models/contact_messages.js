const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true }, // ✅ إضافة العنوان
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["Read", "Unread"],
      default: "Unread",
    },
    adminReply: { type: String } // حقل الرد
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
