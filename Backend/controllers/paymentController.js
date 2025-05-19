// controllers/paymentController.js
const Payment = require("../models/Payment");
const User = require("../models/User");
const Place = require("../models/places");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// إعداد النقل باستخدام Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// إنشاء جلسة Stripe
exports.createCheckoutSession = async (req, res) => {
  try {
    const { userId, placeId, ticketCount } = req.body;

    if (!userId || !placeId || !ticketCount || ticketCount <= 0) {
      return res.status(400).json({ message: "Invalid placeId or ticketCount" });
    }

    console.log("Received data:", req.body);

    const user = await User.findById(userId);
    const place = await Place.findById(placeId);

    if (!user || !place) {
      console.log("User or place not found");
      return res.status(404).json({ error: "المستخدم أو المكان غير موجود" });
    }

    // استخدام سعر التذكرة من قاعدة البيانات
    const ticketPriceJOD = Number(place.ticket_price);
    const totalJOD = ticketPriceJOD * ticketCount;

    // تحويل الدينار الأردني إلى الدولار الأمريكي
    const JOD_TO_USD = 1.41;
    const totalAmountUSD = totalJOD * JOD_TO_USD;
    const ticketPriceUSD = totalAmountUSD / ticketCount;

    console.log(`🔹 عدد التذاكر: ${ticketCount}`);
    console.log(`🔹 السعر لكل تذكرة بالدينار: ${ticketPriceJOD}`);
    console.log(`🔹 المبلغ الكلي بالدينار: ${totalJOD}`);
    console.log(`🔹 المبلغ الكلي بالدولار: $${totalAmountUSD}`);
    console.log(`🔹 السعر لكل تذكرة بالدولار: $${ticketPriceUSD}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `تذاكر ${place.name}`,
            },
            unit_amount: Math.round(ticketPriceUSD * 100),
          },
          quantity: ticketCount,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
      metadata: { userId, placeId, ticketCount: ticketCount.toString(), placeName: place.name, totalJOD: totalJOD.toString() },
    });

    console.log("✅ Stripe session created successfully:", session.id);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء جلسة الدفع" });
  }
};


// التعامل مع Webhook من Stripe للتحقق من الدفع
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("📩 Webhook received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { userId, placeId, ticketCount, totalJOD } = session.metadata;

      const user = await User.findById(userId);
      const place = await Place.findById(placeId);

      console.log("Webhook session metadata:", session.metadata);
      console.log("Webhook amount total:", session.amount_total);

      const payment = new Payment({
        userId,
        placeId,
        ticketCount: parseInt(ticketCount),
        amount: session.amount_total / 100, // Stripe returns amount in cents
        amountJOD: parseFloat(totalJOD), // حفظ المبلغ بالدينار أيضًا
        currency: session.currency,
        paymentStatus: session.payment_status,
        paymentMethod: session.payment_method_types[0],
        stripeSessionId: session.id,
      });

      await payment.save();

      console.log("💰 Payment saved:", payment);

      await transporter.sendMail({
        from: `"WaynNrooh" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "تأكيد الدفع بنجاح",
        html: `
          <p>مرحباً <strong>${user.name}</strong>,</p>
          <p>تم استلام دفعتك بقيمة <strong>${(session.amount_total / 100).toFixed(2)} USD</strong> (حوالي ${totalJOD} دينار أردني) للمكان <strong>${place.name}</strong>.</p>
          <p>شكراً لاستخدامك <em>WaynNrooh</em>!</p>
        `,
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook signature verification failed or error occurred:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

// الحصول على جميع المدفوعات
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب المدفوعات" });
  }
};

// الحصول على دفعة واحدة حسب ID
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "الدفع غير موجود" });
    }
    res.status(200).json({ payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب الدفع" });
  }
};

// التحقق من الدفع باستخدام Stripe
exports.verifyPayment = async (req, res) => {
  const { session_id } = req.query;

  try {
    // استرجاع جلسة الدفع من Stripe باستخدام session_id
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") {
      return res.status(404).json({ message: "الدفع غير موجود أو لم يتم الدفع بعد" });
    }

    // استخراج البيانات من metadata
    const { userId, placeId, ticketCount } = session.metadata;

    const user = await User.findById(userId);
    const place = await Place.findById(placeId);

    if (!user || !place) {
      return res.status(404).json({ message: "المستخدم أو المكان غير موجود" });
    }

    // تحويل السعر من دولار إلى دينار
    const USD_TO_JOD = 1.41;
    const totalAmountUSD = session.amount_total / 100;
    const ticketPriceUSD = totalAmountUSD / Number(ticketCount);
    const ticketPriceJOD = ticketPriceUSD / USD_TO_JOD;

    res.status(200).json({
      userId,
      userName: user.name,
      placeId,
      placeName: place.name,
      ticketCount,
      ticketPriceJOD: ticketPriceJOD.toFixed(2),
      totalAmountJOD: (ticketPriceJOD * ticketCount).toFixed(2),
      amountUSD: totalAmountUSD.toFixed(2),
      currency: session.currency,
      paymentStatus: session.payment_status,
      paymentMethod: session.payment_method_types?.[0] || 'unknown',
    });
  } catch (error) {
    console.error("Error verifying payment:", error.message);
    res.status(500).json({ message: "خطأ في التحقق من الدفع" });
  }
};


// إضافة عملية الدفع إلى الـ Payment Collection
exports.createPayment = async (req, res) => {
  try {
    // الحصول على البيانات من الجسم
    const { 
      stripePaymentId,
      stripeChargeId,
      userEmail,
      userName,
      amountUSD,
      currency,
      paymentStatus,
      cardBrand,
      cardLast4,
      country,
      ticketCount,
      placeId,
      userId // تأكد من وجود userId في الـ request body
    } = req.body;

    // التحقق من البيانات
// In your createPayment function, change the validation to:
if (!userEmail || !amountUSD || !currency || !paymentStatus || !ticketCount || !placeId || !userId) {
  return res.status(400).json({ message: "بيانات غير مكتملة" });
}

    // البحث عن المستخدم والمكان
    const user = await User.findById(userId);
    const place = await Place.findById(placeId);
    
    if (!user || !place) {
      return res.status(404).json({ message: "المستخدم أو المكان غير موجود" });
    }
    // إنشاء عملية الدفع في الـ Payment collection
    const payment = new Payment({
      stripePaymentId,
      stripeChargeId,
      userEmail,
      userName,
      amountUSD,
      currency,
      paymentStatus,
      cardBrand,
      cardLast4,
      country,
      ticketCount,
      placeId,
      paymentDate: new Date(), // إضافة تاريخ الدفع
    });

    // حفظ عملية الدفع في قاعدة البيانات
    await payment.save();

    // إرسال الرد
    res.status(201).json({ message: "تم إنشاء عملية الدفع بنجاح", payment });
  } catch (error) {
    console.error("❌ Error creating payment:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء عملية الدفع" });
  }
};


// احصل على عدد التذاكر المحجوزة لجميع الأماكن
exports.getTotalTickets = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      { $group: { _id: null, totalTickets: { $sum: "$ticketCount" } } }
    ]);

    const total = result[0]?.totalTickets || 0;
    res.status(200).json({ totalTickets: total });
  } catch (error) {
    console.error("❌ Error getting total tickets:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حساب عدد التذاكر" });
  }
};


// احصل على عدد التذاكر المحجوزة لمكان محدد
exports.getTicketsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const result = await Payment.aggregate([
      { $match: { placeId } },
      { $group: { _id: "$placeId", totalTickets: { $sum: "$ticketCount" } } }
    ]);

    const total = result[0]?.totalTickets || 0;
    res.status(200).json({ placeId, totalTickets: total });
  } catch (error) {
    console.error("❌ Error getting tickets by place:", error);
    res.status(500).json({ error: "حدث خطأ أثناء حساب التذاكر للمكان" });
  }
};


// 📌 جلب أكثر الأماكن حجزًا (أعلى عدد تذاكر)
exports.getTopBookedPlaces = async (req, res) => {
  try {
    const topPlaces = await Payment.aggregate([
      {
        $addFields: {
          ticketCountInt: { $toInt: "$ticketCount" },
          placeObjectId: { $toObjectId: "$placeId" }
        }
      },
      {
        $group: {
          _id: "$placeObjectId",
          totalTickets: { $sum: "$ticketCountInt" }
        }
      },
      {
        $sort: { totalTickets: -1 }
      },
      {
        $limit: 2
      },
      {
        $lookup: {
          from: "places",
          localField: "_id",
          foreignField: "_id",
          as: "placeDetails"
        }
      },
      {
        $unwind: "$placeDetails"
      },
      {
        $project: {
          _id: 0,
          placeId: "$_id",
          totalTickets: 1,
          placeName: "$placeDetails.name",
          placeImage: "$placeDetails.image"
        }
      }
    ]);

    res.status(200).json({ topPlaces });
  } catch (error) {
    console.error("❌ Error getting top booked places:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب الأماكن الأكثر حجزًا" });
  }
};