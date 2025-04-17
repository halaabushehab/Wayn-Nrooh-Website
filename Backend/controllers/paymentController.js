// const Payment = require("../models/Payment");
// // const SubscriptionCard = require("../models/SubscriptionCard");
// const User = require("../models/user");

// exports.createPayment = async (req, res) => {
//   try {
//     const { subscriber_id, subscriptionCard_id, payment_method } = req.body;

//     if (!subscriber_id || !subscriptionCard_id || !payment_method) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const subscriptionCard = await SubscriptionCard.findById(subscriptionCard_id);
//     if (!subscriptionCard) {
//       return res.status(404).json({ error: "Subscription card not found" });
//     }

//     // تحويل السعر إلى رقم (مثلاً 50 دولار)
//     const amount = parseFloat(subscriptionCard.price.replace("$", ""));

//     const paymentData = {
//       subscriber: subscriber_id,
//       subscriptionCard: subscriptionCard_id,
//       amount,
//       payment_method,
//       payment_status: "Completed",
//     };

//     const payment = await Payment.create(paymentData);

//     // استخراج مدة الاشتراك (مثلاً عدد الأشهر) من subscriptionCard.duration
//     const durationMatch = subscriptionCard.duration.match(/\d+/);
//     if (!durationMatch) {
//       throw new Error("No numeric value found in duration");
//     }
    
//     const durationNumber = parseInt(durationMatch[0], 10);
//     if (isNaN(durationNumber)) {
//       throw new Error("Invalid duration value");
//     }
    
//     const subscriptionExpiry = new Date();
//     subscriptionExpiry.setMonth(subscriptionExpiry.getMonth() + durationNumber);

//     await User.findByIdAndUpdate(subscriber_id, {
//       subscriptionPlan: subscriptionCard.title,
//       subscriptionExpiry,
//     });

//     return res
//       .status(201)
//       .json({ message: "Payment recorded successfully", payment });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };


// controllers/paymentController.js



const Payment = require("../models/Payment");
const Place = require("../models/places");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const exchangeRate = 0.71; // سعر الصرف من الدينار الأردني إلى الدولار


exports.createPayment = async (req, res) => {
  try {
    const { userId, placeId, paymentMethod, ticketCount } = req.body;
    console.log("📩 البيانات المستلمة:", req.body);

    // Validate required fields  
    if (!userId || !placeId || !paymentMethod || !ticketCount) {
      console.log("🚨 خطأ: بعض الحقول مفقودة");
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }

    // Find user and place
    const user = await User.findById(userId);
    if (!user) {
      console.log("🚨 خطأ: المستخدم غير موجود");
      return res.status(404).json({ error: "المستخدم غير موجود" });
    }
    console.log("✅ المستخدم موجود:", user.email);

    const place = await Place.findById(placeId);
    if (!place) {
      console.log("🚨 خطأ: المكان غير موجود");
      return res.status(404).json({ error: "المكان غير موجود" });
    }
    console.log("✅ المكان موجود:", place.name, "ticket_price:", place.ticket_price);

    // Determine ticket price
    let ticketPrice;
    if (typeof place.ticket_price === "number") {
      ticketPrice = place.ticket_price;
    } else if (typeof place.ticket_price === "string") {
      const priceMatch = place.ticket_price.match(/(\d+(\.\d+)?)/);
      if (!priceMatch) {
        console.log("🚨 خطأ: السعر غير صالح");
        return res.status(400).json({ error: "المكان لا يحتوي على سعر صالح" });
      }
      ticketPrice = parseFloat(priceMatch[0]);
    } else {
      console.log("🚨 خطأ: نوع ticket_price غير مدعوم");
      return res.status(400).json({ error: "المكان لا يحتوي على سعر صالح" });
    }
    console.log("💰 السعر المستخرج:", ticketPrice);

    // Calculate total amount
    const totalAmount = ticketPrice * ticketCount;
    console.log("💰 المبلغ الإجمالي:", totalAmount);

    // Create payment record with additional data (user and place name)
    const payment = new Payment({
      subscriber: userId,
      subscriptionCard: placeId,
      ticketCount,
      amount: totalAmount,
      payment_method: paymentMethod.toLowerCase(),
      payment_status: "completed",
      userName: user.name,    // إضافة اسم المستخدم
      placeName: place.name,  // إضافة اسم المكان
    });
    await payment.save();
    console.log("✅ تم إنشاء الدفع:", payment);

    res.status(201).json({ message: "تم الدفع بنجاح", payment });
  } catch (error) {
    console.error("خطأ في الدفع:", error);
    res.status(500).json({ error: "حدث خطأ أثناء معالجة الدفع" });
  }
};
// Get booking and payment details
exports.getBookingWithPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "الحجز غير موجود" });
    }

    // Find payment related to the booking
    const payment = await Payment.findOne({ where: { subscriptionCard: booking.placeId, subscriber: booking.userId } });
    if (!payment) {
      return res.status(404).json({ error: "تفاصيل الدفع غير موجودة" });
    }

    res.status(200).json({ booking, payment });

  } catch (error) {
    console.error("خطأ أثناء جلب تفاصيل الحجز والدفع:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب البيانات", details: error.message });
  }
};


// إدخال دفعة جديدة (POST) - لا تغيير
// exports.createPayment = async (req, res) => {
//   try {
//     const newPayment = await Payment.create(req.body);
//     res.status(201).json({ message: "تمت إضافة الدفع بنجاح", payment: newPayment });
//   } catch (error) {
//     console.error("خطأ أثناء إضافة الدفع:", error);
//     res.status(500).json({ error: "حدث خطأ أثناء إدخال الدفع", details: error.message });
//   }
// };

// جلب جميع المدفوعات (GET) - مسار جديد
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find(); // 🔴 تأكد أن Payment هو الموديل الصحيح
    res.status(200).json({ payments });
  } catch (error) {
    console.error("خطأ أثناء جلب المدفوعات:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب المدفوعات", details: error.message });
  }
};   