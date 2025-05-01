// import { useState } from "react";
// import { motion } from "framer-motion";
// import { MapPin, Star, Landmark, Castle, Mountain, Sun, Heart } from "lucide-react";

// function JordanDestinations() {
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [likedItems, setLikedItems] = useState({});

//   const toggleLike = (index) => {
//     setLikedItems(prev => ({ ...prev, [index]: !prev[index] }));
//   };

//   const destinations = [
//     {
//       title: "البتراء",
//       description: "إحدى عجائب الدنيا السبع الجديدة، مدينة وردية منحوتة في الصخور تعود إلى حضارة الأنباط.",
//       image: "https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       icon: <Landmark className="h-6 w-6" />,
//       category: "تاريخية",
//       location: "معان"
//     },
//     {
//       title: "وادي رم",
//       description: "وادي القمر الصحراوي الذي يتميز بمناظره الخلابة وتكويناته الصخرية الفريدة، موقع مثالي للمغامرات.",
//       image: "https://images.unsplash.com/photo-1581777017485-52b5a9802673?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       icon: <Mountain className="h-6 w-6" />,
//       category: "طبيعية",
//       location: "العقبة"
//     },
//     {
//       title: "البحر الميت",
//       description: "أخفض نقطة على سطح الأرض، مشهور بمياهه المالحة الغنية بالمعادن والطين العلاجي.",
//       image: "https://images.unsplash.com/photo-1565992441121-4367c2967103?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       icon: <Sun className="h-6 w-6" />,
//       category: "علاجية",
//       location: "البحر الميت"
//     },
//     {
//       title: "قلعة عجلون",
//       description: "قلعة إسلامية تاريخية بنيت على قمة جبل لتكون حصناً ضد الصليبيين، تطل على مناظر خلابة.",
//       image: "https://images.unsplash.com/photo-1581434682618-9a3431c1511a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       icon: <Castle className="h-6 w-6" />,
//       category: "تاريخية",
//       location: "عجلون"
//     }
//   ];

//   const getDecoration = (isHovered, index) => {
//     if (!isHovered) return null;

//     return (
//       <>
//         <motion.div
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//           className="absolute top-20 right-6"
//         >
//           <Star className="h-6 w-6 text-[#FFD700]" />
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"
//         />
//       </>
//     );
//   };

//   return (
//     <section className="py-16 bg-gradient-to-b from-[#f8f9fa] to-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl font-bold text-[#022C43] mb-4">جوهرة الأردن السياحية</h2>
//           <p className="text-lg text-[#444444] max-w-3xl mx-auto">
//             اكتشف كنوز الأردن السياحية التي تخطف الأنفاس وتجمع بين عراقة التاريخ وسحر الطبيعة
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {destinations.map((destination, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: index * 0.1 }}
//               viewport={{ once: true }}
//               className="relative group"
//               onMouseEnter={() => setHoveredItem(index)}
//               onMouseLeave={() => setHoveredItem(null)}
//             >
//               <div className="relative overflow-hidden rounded-2xl shadow-xl border border-gray-200 bg-white h-full transition-all duration-300 hover:shadow-2xl hover:border-[#FFD700]/30">
//                 {getDecoration(hoveredItem === index, index)}

//                 <div className="absolute top-4 right-4 z-10 flex gap-2">
//                   <motion.div
//                     className="bg-white shadow-md px-3 py-2 rounded-full flex items-center gap-2"
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                   >
//                     {destination.icon}
//                     <span className="font-bold text-[#022C43]">{destination.category}</span>
//                   </motion.div>
                  
//                   <motion.button
//                     onClick={() => toggleLike(index)}
//                     className="bg-white shadow-md p-2 rounded-full"
//                     whileTap={{ scale: 0.9 }}
//                   >
//                     <Heart 
//                       className={`h-5 w-5 ${likedItems[index] ? 'text-red-500 fill-red-500' : 'text-[#022C43]'}`} 
//                     />
//                   </motion.button>
//                 </div>

//                 <div className="relative h-64 overflow-hidden">
//                   <img
//                     src={destination.image}
//                     alt={destination.title}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                   />
                  
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-t from-[#022C43]/70 to-transparent"
//                     initial={{ opacity: 0 }}
//                     whileHover={{ opacity: 1 }}
//                     transition={{ duration: 0.3 }}
//                   />

//                   <motion.div
//                     className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                     initial={{ opacity: 0 }}
//                     whileHover={{ opacity: 1 }}
//                   >
//                     <div className="text-white">
//                       <div className="flex items-center gap-2 mb-2">
//                         <MapPin className="h-5 w-5" />
//                         <span className="font-medium">{destination.location}</span>
//                       </div>
//                       <motion.button
//                         className="bg-[#FFD700] text-[#022C43] px-4 py-2 rounded-full font-bold flex items-center gap-2"
//                         whileHover={{ scale: 1.05 }}
//                       >
//                         استكشف الموقع
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                         </svg>
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 </div>

//                 <div className="p-6">
//                   <h3 className="text-xl font-bold mb-3 text-[#022C43]">{destination.title}</h3>
//                   <p className="text-[#444444] mb-4">{destination.description}</p>

//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center gap-1 text-sm text-[#022C43]">
//                       <span>⭐ 4.8</span>
//                       <span className="mx-1">•</span>
//                       <span>📍 {destination.location}</span>
//                     </div>
//                     <motion.button
//                       className="text-sm font-medium rounded-full px-4 py-1 border border-[#022C43] text-[#022C43] hover:bg-[#022C43] hover:text-white transition-colors"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       التفاصيل
//                     </motion.button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <motion.button
//             className="px-6 py-3 bg-[#022C43] text-white rounded-full font-medium shadow-lg hover:bg-[#115173] transition-colors"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             اكتشف المزيد من الوجهات
//           </motion.button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default JordanDestinations;






import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MapPin, Star } from "lucide-react";

function JordanGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [likedImages, setLikedImages] = useState({});

  const toggleLike = (index) => {
    setLikedImages(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const destinations = [
    {
      title: "THE TENNIS CLUB PLACE",
      description: "نادي رياضي يقدم أفضل الملاعب والأنشطة لمحبي التنس في عمان.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1PvyVCv9xqpr0UxfSDzDVV55TTTX949A5jA&s",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "GAMENATION",
      description: "مركز ألعاب ترفيهية يحتوي على ألعاب فيديو وتحديات تفاعلية مميزة.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHaTP41YSjfsJH8nn1SXZFvJjHhmc7I5WlQ9Bz5meSvs81mhPEgmD-u3UeklxfWkD1RM8&usqp=CAU",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "Amman Panorama Art",
      description: "معرض فني يعرض أعمالاً فنية مع إطلالة رائعة على مدينة عمان.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5BamXpYOpcM7TApo-XaoFdy8F82cJDTi0Aw&s",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "The Jordanian Kitchen",
      description: "مطعم يقدم أشهى الأطباق الأردنية التقليدية في جو مريح ودي.",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/99/b5/0f/caption.jpg?w=900&h=500&s=1",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "Digital City",
      description: "مدينة تقنية تحتوي على أحدث المرافق التقنية والشركات الناشئة.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbjCzaHVocKx3jMSRJ7tZD8whaYYt3gcfvmA&s",  // استبدل بالصورة المناسبة
      location: "عمان"
    },
    {
      title: "First Archer",
      description: "مركز تدريب رماية مع إطلالات رائعة على مدينة عمان. مناسب لجميع الأعمار.",
      image: "https://www.joc.jo/uploads/2021/10/89f97dca98b05222e8e501572c3704ed.jpg",  // استبدل بالصورة المناسبة
      location: "عمان"
    }
  ];
  

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#022C43] mb-4">معرض الأردن الساحر</h2>
          <p className="text-lg text-[#444444] max-w-3xl mx-auto">
            جولة مصورة بين أجمل الوجهات السياحية في المملكة الأردنية الهاشمية
          </p>
        </div>

        {/* Main Gallery */}
        <div className="relative h-[70vh] mb-8 rounded-2xl overflow-hidden shadow-xl">
          {/* Navigation Arrows */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronLeft className="h-6 w-6 text-[#022C43]" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <ChevronRight className="h-6 w-6 text-[#022C43]" />
          </button>

          {/* Like Button */}
          <button 
            onClick={() => toggleLike(activeIndex)}
            className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all"
          >
            <Heart 
              className={`h-6 w-6 ${likedImages[activeIndex] ? 'text-red-500 fill-red-500' : 'text-[#022C43]'}`} 
            />
          </button>

          {/* Current Image */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <img
              src={destinations[activeIndex].image}
              alt={destinations[activeIndex].title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">{destinations[activeIndex].title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5" />
                <span>{destinations[activeIndex].location}</span>
                <Star className="h-5 w-5 ml-4 text-yellow-400" />
                <span>4.8</span>
              </div>
              <p>{destinations[activeIndex].description}</p>
            </div>
          </motion.div>
        </div>

        {/* Thumbnail Gallery */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {destinations.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative h-32 rounded-lg overflow-hidden cursor-pointer transition-all ${activeIndex === index ? 'ring-4 ring-[#FFD700]' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-all" />
              {likedImages[index] && (
                <div className="absolute top-2 right-2">
                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Gallery Info */}
        <div className="text-center mt-8">
          <p className="text-[#444444]">
            {activeIndex + 1} / {destinations.length} - {destinations[activeIndex].title}
          </p>
        </div>
      </div>
    </section>
  );
}

export default JordanGallery;