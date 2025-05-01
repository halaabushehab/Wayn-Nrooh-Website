import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AboutSection = () => {
  const [placeCount, setPlaceCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9527/api/places/count")
      .then((response) => {
        setPlaceCount(response.data.count);
        console.log("📥 Response:", response);
      })
      .catch((error) => {
        console.error("❌ Error fetching place count:", error);
      });
  }, []);

  return (
    <section id="about" className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* النص والوصف */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-right" // تأكيد على اتجاه النص العربي
            >
              <h2 className="text-3xl font-bold text-[#022C43] mb-2">
                عن وين نروح؟
              </h2>
              <h3 className="text-4xl font-bold text-[#022C43] mb-6">
                اكتشف أجمل الأماكن والأنشطة في الأردن بسهولة
              </h3>

              <p className="text-[#444444] mb-6 text-lg leading-relaxed">
                تُعد منصة "وين نروح" دليلك الشامل لاستكشاف الوجهات السياحية
                والترفيهية المميزة في الأردن. نقدم معلومات مفصلة عن الأماكن التي
                تناسب العائلات، الأصدقاء، الأطفال، وحتى الأفراد، لتستمتع بأوقات
                لا تُنسى.
              </p>

              <p className="text-[#444444] mb-8 leading-relaxed">
                من الحدائق والمتنزهات إلى المطاعم والأسواق المحلية، نساعدك في
                العثور على أفضل الخيارات بناءً على موقعك واهتماماتك. المنصة تجمع
                بين التقييمات، المراجعات، وتفاصيل مثل ساعات العمل، الأسعار
                المناسبة، والتكاليف.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                <div className="text-center">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div
                      className="text-7xl font-bold text-[#022C43]"
                      id="destination-counter"
                    >
                      {placeCount}
                    </div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#FFD700]/20 -z-10"></div>
                  </motion.div>
                  <p className="text-[#444444] font-medium">وجهة تم إدراجها</p>
                </div>

                <div className="h-px sm:h-16 sm:w-px bg-gray-300 w-full sm:w-auto"></div>
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#022C43] hover:bg-[#022C43]/90 text-white font-bold px-6 py-3 rounded-lg transition-colors"
                  >
                    اقرأ المزيد
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* الصور والرسومات */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <img
  src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTHgF0D8GIA2ESn3D80FVtsUtSec2cyF3tMCRSEJtFVocmJ8-xX"
  alt="مدينة عمان"
  className="object-cover w-full h-full"
  style={{ objectFit: "cover" }}
/>

                <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/50 to-transparent"></div>
                <div className="absolute bottom-6 right-6 text-white">
                  <p className="text-lg font-bold">عمّان، الأردن</p>
                  <p className="text-sm">العاصمة النابضة بالحياة</p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-10 -left-10 w-[200px] h-[150px] rounded-xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img
                  src="https://i.pinimg.com/736x/8d/36/fa/8d36fa2559d9575f79e2265e92c2597f.jpg"
                  alt="مدينة عمان"
                  className="object-cover"
                  style={{ width: "100%", height: "auto" }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/50 to-transparent"></div>
                <div className="absolute bottom-2 right-2 text-white">
                  <p className="text-xs font-bold">أنشطة للأطفال</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg transform rotate-12 cursor-pointer"
              >
                <p className="text-[#022C43] font-bold text-center text-sm">
                  اكتشف
                  <br />
                  الأردن
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
