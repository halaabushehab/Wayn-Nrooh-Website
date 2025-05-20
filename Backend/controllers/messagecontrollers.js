const Contact = require("../models/contact_messages");
const transporter = require("../mailer");  
const { Message } = require('../models/contact_messages'); // تأكد من المسار الصحيح
const User = require("../models/user"); 


const addMessages = async (req, res) => {
    try {
      console.log("Received data:", req.body); // ✅ عرض البيانات المستلمة في السيرفر
  
      const { name, email, title, message } = req.body;
  
      if (!name || !email || !title || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newMessage = await Contact.create({ name, email, title, message, status: "Unread" });
  
      return res.status(201).json({ message: "Message added successfully", data: newMessage });
    } catch (error) {
      console.error("Error adding message:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find(); // جلب جميع الرسائل من قاعدة البيانات
    return res.status(200).json({ data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMessage = await User.findByIdAndUpdate(
      id,
      { status: "Read" },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message status updated successfully", data: updatedMessage });
  } catch (error) {
    console.error("Error updating message status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const replyToContact = async (req, res) => {
  try {
    const { messageId, replyMessage } = req.body;

    if (!messageId || !replyMessage) {
      return res.status(400).json({ error: "يجب إدخال كل من المعرف والرد" });
    }

    const contact = await Contact.findById(messageId);
    if (!contact) {
      return res.status(404).json({ error: "لم يتم العثور على الرسالة" });
    }

    contact.adminReply = replyMessage;
    await contact.save();

    // ✅ ألغينا الإرسال مؤقتًا

    const user = await User.findOne({ email: contact.email });
    if (user) {
      await user.save();
    }

    return res.status(200).json({ success: true, message: "تم حفظ الرد بنجاح بدون إرسال بريد" });
  } catch (error) {
    console.error("خطأ في replyToContact:", error);
    return res.status(500).json({ error: "خطأ داخلي في السيرفر" });
  }
};




module.exports = { addMessages, getMessages, updateMessageStatus ,replyToContact};
