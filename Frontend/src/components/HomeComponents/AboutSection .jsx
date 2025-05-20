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
    <section id="about" className="py-2 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* النص والوصف */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-right"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#022C43] mb-2">
                 وين نروح؟
              </h2>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#022C43] mb-4 sm:mb-6">
                اكتشف أجمل الأماكن والأنشطة في الأردن بسهولة
              </h3>

              <p className="text-[#444444] mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                تُعد منصة "وين نروح" دليلك الشامل لاستكشاف الوجهات السياحية
                والترفيهية المميزة في الأردن. نقدم معلومات مفصلة عن الأماكن التي
                تناسب العائلات، الأصدقاء، الأطفال، وحتى الأفراد، لتستمتع بأوقات
                لا تُنسى.
              </p>

              <p className="text-[#444444] mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                من الحدائق والمتنزهات إلى المطاعم والأسواق المحلية، نساعدك في
                العثور على أفضل الخيارات بناءً على موقعك واهتماماتك. المنصة تجمع
                بين التقييمات، المراجعات، وتفاصيل مثل ساعات العمل، الأسعار
                المناسبة، والتكاليف.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="text-center">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#022C43]">
                      {placeCount}
                    </div>
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#FFD700]/20 -z-10"></div>
                  </motion.div>
                  <p className="text-[#444444] font-medium text-sm sm:text-base">وجهة تم إدراجها</p>
                </div>

                <div className="h-px sm:h-16 sm:w-px bg-gray-300 w-full sm:w-auto"></div>
                <Link to="/about" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#022C43] hover:bg-[#022C43]/90 text-white font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors w-full sm:w-auto"
                  >
                    اقرأ المزيد
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* الصور والرسومات */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://www.hospitalitynewsmag.com/wp-content/uploads/2023/07/jordan-country-1200x630.jpg"
                  alt="مدينة عمان"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/50 to-transparent"></div>
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white">
                  <p className="text-base sm:text-lg font-bold">عمّان، الأردن</p>
                  <p className="text-xs sm:text-sm">العاصمة النابضة بالحياة</p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-[150px] h-[110px] sm:w-[200px] sm:h-[150px] rounded-xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCSOy-QoV_JNYST9KtMXlYWoeeou7nprwWq5sUDGZrxfcfe_Aqa43cr7vcF-4OREE0jo&usqp=CAU"
                  alt="مدينة عمان"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/50 to-transparent"></div>
                <div className="absolute bottom-2 right-2 text-white">
                  <p className="text-xs font-bold">أنشطة للأطفال</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg transform rotate-12 cursor-pointer"
              >
                <p className="text-[#022C43] font-bold text-center text-xs sm:text-sm">
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