
const Payment = require("../models/Payment");
const Place = require("../models/places");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const exchangeRate = 0.71; // سعر الصرف من الدينار الأردني إلى الدولار
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.createPayment = async (req, res) => {
  try {
    const { userId, placeId, paymentMethod, ticketCount, stripeToken } = req.body;
    console.log("📩 البيانات المستلمة:", req.body);

    // Validate required fields
    if (!userId || !placeId || !paymentMethod || !ticketCount || !stripeToken) {
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

    // Use Stripe to create a payment
    const charge = await stripe.charges.create({
      amount: totalAmount * 100, // Stripe يقبل المبالغ بالسنتات
      currency: "usd", // أو العملة المطلوبة
      description: `Payment for tickets to ${place.name}`,
      source: stripeToken, // Token من Stripe
    });

    if (charge.status !== "succeeded") {
      return res.status(400).json({ error: "فشل في الدفع عبر Stripe" });
    }

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
      stripeChargeId: charge.id, // حفظ معرف الدفع من Stripe
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