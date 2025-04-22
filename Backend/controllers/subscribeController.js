import Subscriber from "../models/Subscriber.js";

export const subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "البريد الإلكتروني مطلوب." });
  }

  try {
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "هذا البريد مشترك بالفعل." });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "تم الاشتراك بنجاح!" });
  } catch (err) {
    res.status(500).json({ message: "حدث خطأ أثناء الاشتراك.", error: err.message });
  }
};
