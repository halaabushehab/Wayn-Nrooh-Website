const express = require("express");
const {
  getMessages,
  addMessages,
  updateMessageStatus,
  replyToContact,
} = require("../controllers/messagecontrollers");

const router = express.Router();

// ✅ Route لإضافة رسالة جديدة
router.post("/message", addMessages);

// ✅ Route لجلب جميع الرسائل
router.get("/message", getMessages);

router.put("/message/:id", updateMessageStatus);

// تأكد من أن هذا السطر موجود في ملف الروتر
router.post("/message/reply", replyToContact);

module.exports = router;
