import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AboutSectionEN = () => {
  const [placeCount, setPlaceCount] = useState(0);

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
          {/* Text and description */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-[#022C43] mb-2">
               ? About Wayn Nrooh
              </h2>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#022C43] mb-4 sm:mb-6">
                Discover the Best Places and Activities in Jordan
              </h3>

              <p className="text-[#444444] mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                "Wayn Nrooh" is your ultimate guide to explore the most unique and fun destinations across Jordan. Whether you’re planning for family outings, friend adventures, or solo trips, we help you create unforgettable memories.
              </p>

              <p className="text-[#444444] mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                From parks and gardens to restaurants and local markets, we help you find the best options based on your location and interests. The platform includes reviews, ratings, working hours, price ranges, and more.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="text-center">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative">
                    <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#022C43]">
                      {placeCount}
                    </div>
                    <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#FFD700]/20 -z-10"></div>
                  </motion.div>
                  <p className="text-[#444444] font-medium text-sm sm:text-base">Listed Destinations</p>
                </div>

                <div className="h-px sm:h-16 sm:w-px bg-gray-300 w-full sm:w-auto"></div>
                <Link to="/about" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#022C43] hover:bg-[#022C43]/90 text-white font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-lg transition-colors w-full sm:w-auto"
                  >
                    Read More
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Images and visuals */}
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
                  alt="Amman City"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/50 to-transparent"></div>
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-white text-right">
                  <p className="text-base sm:text-lg font-bold">Amman, Jordan</p>
                  <p className="text-xs sm:text-sm">The vibrant capital</p>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-[150px] h-[110px] sm:w-[200px] sm:h-[150px] rounded-xl overflow-hidden shadow-xl border-4 border-white"
              >
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCSOy-QoV_JNYST9KtMXlYWoeeou7nprwWq5sUDGZrxfcfe_Aqa43cr7vcF-4OREE0jo&usqp=CAU"
                  alt="Children Activities"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/50 to-transparent"></div>
                <div className="absolute bottom-2 right-2 text-white">
                  <p className="text-xs font-bold">Kids Activities</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg transform rotate-12 cursor-pointer"
              >
                <p className="text-[#022C43] font-bold text-center text-xs sm:text-sm">
                  Explore
                  <br />
                  Jordan
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionEN;
