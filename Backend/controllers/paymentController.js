// // controllers/paymentController.js
// const Payment = require("../models/Payment");
// const User = require("../models/User");
// const Place = require("../models/places");
// const nodemailer = require("nodemailer");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// // إعداد النقل باستخدام Nodemailer
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: process.env.SMTP_SECURE === "true",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// // إنشاء جلسة Stripe
// exports.createCheckoutSession = async (req, res) => {
//   try {
//     const { userId, placeId, ticketCount } = req.body;

//     if (!userId || !placeId || !ticketCount || ticketCount <= 0) {
//       return res.status(400).json({ message: "Invalid placeId or ticketCount" });
//     }
//     // سجل البيانات المرسلة من الفرونت إند
//     console.log("Received data:", req.body);

//     if (!userId || !placeId || !ticketCount) {
//       console.log("Missing required fields");
//       return res.status(400).json({ error: "جميع الحقول مطلوبة" });
//     }

//     // تحقق من وجود المستخدم والمكان
//     const user = await User.findById(userId);
//     const place = await Place.findById(placeId);

//     if (!user || !place) {
//       console.log("User or place not found");
//       return res.status(404).json({ error: "المستخدم أو المكان غير موجود" });
//     }

//     // استخراج سعر التذكرة
//     const ticketPrice = parseFloat(String(place.ticket_price).match(/\d+(\.\d+)?/)[0]);
//     const totalAmount = ticketPrice * ticketCount;

//     // سجل البيانات قبل استدعاء Stripe
//     console.log("Creating Stripe session with totalAmount:", totalAmount);

//     // إنشاء الجلسة مع Stripe
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: `تذاكر ${place.name}` },
//             unit_amount: Math.round(ticketPrice * 100),
//           },
//           quantity: ticketCount,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
//       metadata: { userId, placeId, ticketCount },
//     });

//     // سجل الـ URL قبل إرساله للفرونت إند
//     console.log("Stripe session created successfully:", session);

//     res.status(200).json({ url: session.url });
//     console.log("Payment URL:", session.url);
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     res.status(500).json({ error: "حدث خطأ أثناء إنشاء جلسة الدفع" });
//   }
// };


// // التعامل مع Webhook من Stripe للتحقق من الدفع
// exports.handleStripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;
//   console.log("Webhook received:", event);

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     console.log("Webhook received:", event); // سجل الحدث
//   } catch (err) {
//     console.error("Webhook signature verification failed.", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const { userId, placeId, ticketCount } = session.metadata;
//     try {
//       const user = await User.findById(userId);
//       const place = await Place.findById(placeId);
//       if (!user || !place) throw new Error("User  or place not found");
      
//       // حفظ الدفع في قاعدة البيانات
//       const payment = new Payment({
//         subscriber: userId,
//         subscriptionCard: placeId,
//         ticketCount: parseInt(ticketCount, 10),
//         amount: session.amount_total / 100,
//         payment_method: session.payment_method_types[0],
//         payment_status: session.payment_status,
//         transactionId: session.payment_intent,
//         paymentDate: new Date(),
//         currency: "USD", // يمكن تغييره حسب الحاجة
//       });
//       await payment.save();
//       console.log("Payment saved:", payment); // سجل الدفع المحفوظ

//       // إرسال بريد إلكتروني لتأكيد الدفع
//       await transporter.sendMail({
//         from: `"WaynNrooh" <${process.env.SMTP_USER}>`,
//         to: user.email,
//         subject: "تأكيد الدفع بنجاح",
//         html: `<p>مرحباً ${user.name}, تم استلام دفعتك بقيمة ${(session.amount_total / 100).toFixed(2)} USD للمكان ${place.name}.</p>`,
//       });
//     } catch (err) {
//       console.error("Error in webhook handling:", err);
//     }
//   }
//   res.json({ received: true });
// };
// // الحصول على جميع المدفوعات
// exports.getAllPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find();
//     res.status(200).json({ payments });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "حدث خطأ أثناء جلب المدفوعات" });
//   }
// };

// // الحصول على دفعة واحدة حسب ID
// exports.getPaymentById = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const payment = await Payment.findById(paymentId);
//     if (!payment) {
//       return res.status(404).json({ error: "الدفع غير موجود" });
//     }
//     res.status(200).json({ payment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "حدث خطأ أثناء جلب الدفع" });
//   }
// };



// // التحقق من حالة الدفع
// exports.verifyPayment = async (req, res) => {
//   try {
//     const { session_id } = req.query;
//     if (!session_id) {
//       return res.status(400).json({ error: "معرف الجلسة مطلوب" });
//     }

//     const session = await stripe.checkout.sessions.retrieve(session_id);
//     console.log("Session details:", session); // سجل تفاصيل الجلسة
    
//     const payment = await Payment.findOne({ transactionId: session.payment_intent });
//     if (!payment) {
//       return res.status(404).json({ error: "لم يتم العثور على تفاصيل الدفع" });
//     }
    
//     res.status(200).json({ payment });
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({ error: "حدث خطأ أثناء التحقق من الدفع" });
//   }
// };



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

    // تحويل عدد التذاكر إلى دولار
    const JOD_TO_USD = 1.41;
    const totalAmountUSD = ticketCount * JOD_TO_USD;
    const ticketPriceUSD = totalAmountUSD / ticketCount;

    console.log(`🔹 عدد التذاكر: ${ticketCount}`);
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
      metadata: { userId, placeId, ticketCount },
    });

    console.log("✅ Stripe session created successfully:", session.id);
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إنشاء جلسة الدفع" });
  }
  console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

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
      const { userId, placeId, ticketCount } = session.metadata;

      const user = await User.findById(userId);
      const place = await Place.findById(placeId);
      console.log("Webhook received session:", {
        id: session.id,
        metadata: session.metadata,
        amount: session.amount_total
      });
      const payment = new Payment({
        userId,
        placeId,
        ticketCount,
        amount: session.amount_total / 100, // Stripe يرجع القيمة بالسنتات
        currency: session.currency,
        paymentStatus: session.payment_status,
        paymentMethod: session.payment_method_types[0],
        stripeSessionId: session.id,
      });

      await payment.save();

      console.log("💰 Payment saved:", payment);

      // إرسال بريد إلكتروني لتأكيد الدفع
      await transporter.sendMail({
        from: `"WaynNrooh" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "تأكيد الدفع بنجاح",
        html: `
          <p>مرحباً <strong>${user.name}</strong>,</p>
          <p>تم استلام دفعتك بقيمة <strong>${(session.amount_total / 100).toFixed(2)} USD</strong> للمكان <strong>${place.name}</strong>.</p>
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



// التحقق من حالة الدفع
// controller method
exports.verifyPayment = async (req, res) => {
  const { session_id } = req.query;

  try {
    const payment = await Payment.findOne({ stripeSessionId: session_id })
      .populate("placeId")
      .populate("userId");

    if (!payment) {
      return res.status(404).json({ message: "الدفع غير موجود" });
    }

    res.status(200).json({
      amount: payment.amount,
      ticketCount: payment.ticketCount,
      currency: payment.currency,
      paymentMethod: payment.paymentMethod,
      subscriptionCard: payment.placeId.name,
      username: payment.userId.username,
      paymentStatus: payment.paymentStatus,
    });
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ message: "خطأ في التحقق من الدفع" });
  }
};

