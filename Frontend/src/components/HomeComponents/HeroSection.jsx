import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import photo3 from '../../components/img/WhatsApp Image 2025-04-29 at 1.06.30 AM.jpeg';
import photo2 from '../../components/img/img5.jpg';
import photo1 from '../../components/img/resize.webp';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // const slides = [
  //   "https://i.pinimg.com/736x/fb/65/c4/fb65c45d0e7274a7d18b8079dca7bf33.jpg",
  //   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Z_Amman_Hejaz_Railway_Station_4.jpg/1024px-Z_Amman_Hejaz_Railway_Station_4.jpg",
  //   "https://images.pexels.com/photos/2673300/pexels-photo-2673300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  // ];

  const slides = [photo1, photo2, photo3];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
  
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div dir="rtl" className="relative h-screen w-full overflow-hidden">
  {/* Slides */}
  {slides.map((slide, index) => (
    <div
      key={index}
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
        index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Image directly */}
      <img
        src={slide}  // هنا يجب التأكد من المسار أو الرابط الصحيح للصورة
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
        style={{ objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/1600x900"; // صورة بديلة لو فشل التحميل
        }}
      />
      
      {/* Optional: light black overlay */}
      {/* حط الغلاف لو بدك تأثير خفيف على الصورة */}
      <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none" />
    </div>
    
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
      <h1 
  className="font-light mb-4 drop-shadow-lg"
  style={{ 
    fontFamily: "Tajawal, sans-serif", 
    fontSize: "120px",  // هنا حطينا حجم يدوي كبير
    lineHeight: "1.2"   // المسافة بين السطور عشان يكون شكله نضيف
  }}
>
  وين نروح
</h1>

        <p className="text-xl md:text-2xl mb-8 max-w-lg mx-auto drop-shadow-md">
          اكتشف الأردن كما لم تره من قبل!
        </p>
        <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-8 rounded-md transition-colors duration-300">
          استكشف الآن
        </button>
      </div>

      {/* Navigation Arrows */}
      <button
  onClick={prevSlide}
  className="absolute left-4 top-1/2 transform -translate-y-1/2 
           hover:bg-white/25 
             p-4 rounded-full z-20 transition"
>
  <ChevronLeft size={40} className="text-white" />
</button>

<button
  onClick={nextSlide}
  className="absolute right-4 top-1/2 transform -translate-y-1/2 
             hover:bg-white/25
             p-4 rounded-full z-20 transition"
>
  <ChevronRight size={40} className="text-white" />
</button>

    </div>
  );
}






// import React, { useState, useEffect, useRef } from 'react';
// import { Star, Heart, ChevronLeftIcon, ChevronRightIcon, MapPin, Search, Users, Coffee } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const HeroSection = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [animating, setAnimating] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const containerRef = useRef(null);

//   // تحسين بيانات الأماكن مع معلومات أكثر تفصيلاً
//   const featuredPlaces = [
//     {
//       id: 1,
//       name: 'سوق الذهب التقليدي',
//       image: 'https://www.thisisamman.com/wp-content/uploads/2022/11/image1577108857894-1.png',
//       description: 'استمتع بتجربة فريدة في أروع الأسواق التقليدية، حيث يلتقي عبق التاريخ بجمال التسوق',
//       color: 'from-amber-600/90 to-amber-900/80',
//       rating: 4.8,
//       location: 'عمّان - وسط البلد',
//       visitors: '٥٠٠٠+',
//       category: 'تسوق'
//     },
//     {
//       id: 2,
//       name: 'منطقة ألعاب الأطفال التفاعلية',
//       image: 'https://s.alicdn.com/@sc04/kf/H76fb512c307b426d874db319a387b2a2m.jpg',
//       description: 'دع طفلك يستمتع بأجمل لحظات اللعب والاكتشاف مع وين نروح، حيث تجد أفضل الأماكن المناسبة للأطفال!',
//       color: 'from-blue-700/80 to-purple-600/70',
//       rating: 4.6,
//       location: 'عمّان - الجبيهة',
//       visitors: '٣٠٠٠+',
//       category: 'ترفيه'
//     },
//     {
//       id: 3,
//       name: 'متحف التراث العربي',
//       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn9WTXSKSdHIlhBIYJVeCdk68FECST92udN-c1NkWJyM79z6DI',
//       description: "اكتشف كنوز الماضي وتعرف على تاريخنا الغني في متحف التراث العربي، تجربة ثقافية لا تُنسى",
//       color: 'from-emerald-700/80 to-emerald-900/70',
//       rating: 4.9,
//       location: 'عمّان - الشميساني',
//       visitors: '٨٠٠٠+',
//       category: 'ثقافة'
//     },
//   ];
  
//   const nextSlide = () => {
//     if (animating) return;
//     setAnimating(true);
//     setActiveIndex((prev) => (prev + 1) % featuredPlaces.length);
//     setTimeout(() => setAnimating(false), 600);
//   };
  
//   const prevSlide = () => {
//     if (animating) return;
//     setAnimating(true);
//     setActiveIndex((prev) => (prev - 1 + featuredPlaces.length) % featuredPlaces.length);
//     setTimeout(() => setAnimating(false), 600);
//   };

//   useEffect(() => {
//     const interval = isHovering ? null : setInterval(() => {
//       nextSlide();
//     }, 6000);
//     return () => interval && clearInterval(interval);
//   }, [animating, isHovering]);
  
//   // إضافة تأثير حركة المؤشر للخلفية
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
//       const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
//       setMousePosition({ x, y });
//     };
    
//     const container = containerRef.current;
//     if (container) {
//       container.addEventListener('mousemove', handleMouseMove);
//       return () => container.removeEventListener('mousemove', handleMouseMove);
//     }
//   }, []);
  
//   // Current slide data
//   const currentPlace = featuredPlaces[activeIndex];
//   const categoryIcons = {
//     'تسوق': <Coffee className="w-5 h-5" />,
//     'ترفيه': <Users className="w-5 h-5" />,
//     'ثقافة': <Star className="w-5 h-5" />
//   };
  
//   return (
//     <div 
//       ref={containerRef}
//       className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#022C43] to-[#053F5E] my-23"
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       {/* خلفية متحركة */}
//       <motion.div 
//         className="absolute inset-0 opacity-20 transition-opacity duration-1000"
//         style={{
//           backgroundImage: `url(${currentPlace.image})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           filter: 'blur(4px)',
//           translateX: mousePosition.x,
//           translateY: mousePosition.y
//         }}
//         initial={{ scale: 1.2 }}
//         animate={{ 
//           scale: isHovering ? 1.1 : 1.05,
//           x: mousePosition.x,
//           y: mousePosition.y
//         }}
//         transition={{ type: "spring", stiffness: 30 }}
//       />
      
//       {/* طبقة التدرج اللوني المتغيرة */}
//       <div className={`absolute inset-0 bg-gradient-to-br ${currentPlace.color} opacity-80`} />
      
//       {/* أنماط زخرفية متحركة في الخلفية */}
//       <div className="absolute inset-0 overflow-hidden opacity-10">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full bg-white"
//             style={{
//               width: Math.random() * 300 + 50,
//               height: Math.random() * 300 + 50,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               x: [0, Math.random() * 100 - 50],
//               y: [0, Math.random() * 100 - 50],
//             }}
//             transition={{
//               duration: Math.random() * 10 + 10,
//               repeat: Infinity,
//               repeatType: "reverse",
//               ease: "easeInOut"
//             }}
//           />
//         ))}
//       </div>
      
//       {/* شريط زمني عمودي مزخرف */}
//       <div className="absolute left-12 top-0 bottom-0 flex flex-col items-center z-10">
//         <div className="h-full w-px bg-white/20 relative">
//           {featuredPlaces.map((place, idx) => (
//             <motion.div 
//               key={idx} 
//               className="absolute -left-12 cursor-pointer"
//               style={{ top: `${25 + idx * 25}%` }}
//               onClick={() => {
//                 if (idx === activeIndex || animating) return;
//                 setAnimating(true);
//                 setActiveIndex(idx);
//                 setTimeout(() => setAnimating(false), 600);
//               }}
//             >
//               <motion.div 
//                 className={`w-24 h-24 flex items-center justify-center rounded-full ${
//                   idx === activeIndex 
//                     ? 'bg-amber-500/90 shadow-lg shadow-amber-500/30' 
//                     : 'bg-[#053F5E]/80'
//                 } transition-all duration-300`}
//                 whileHover={{ scale: 1.1 }}
//               >
//                 <div className="text-white text-sm text-center">
//                   {categoryIcons[place.category]}
//                   <div className="mt-1 font-bold">{place.category}</div>
//                 </div>
//               </motion.div>
//               <motion.div 
//                 className={`absolute left-24 top-1/2 h-px w-12 -translate-y-1/2 ${
//                   idx === activeIndex ? 'bg-amber-500' : 'bg-white/20'
//                 }`}
//               />
//             </motion.div>
//           ))}
//         </div>
//       </div>
      
//       {/* منطقة المحتوى الرئيسية */}
//       <div className="relative h-full flex items-center z-10">
//         <div className="container mx-auto px-8 w-full">
//           <div className="flex flex-col lg:flex-row items-center gap-8">
//             {/* القسم الأيسر - النص والبحث */}
//             <motion.div 
//               className="w-full lg:w-1/2 text-right"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 1 }}
//             >
//               <motion.div
//                 className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl border border-white/10"
//                 whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
//               >
//                 <motion.h1 
//                   className="text-6xl md:text-8xl font-bold text-white mb-6 font-arabic"
//                   initial={{ y: -20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ duration: 1.2, ease: "easeOut" }}
//                 >
//                   وين نروح؟
//                 </motion.h1>
                
//                 <AnimatePresence mode="wait">
//                   <motion.p 
//                     key={activeIndex}
//                     className="text-white/90 text-xl leading-relaxed mb-8 max-w-xl"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.5 }}
//                   >
//                     {currentPlace.description}
//                   </motion.p>
//                 </AnimatePresence>
                
//                 {/* مربع البحث المزخرف */}
//                 <div className="relative mb-8">
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="أين تريد أن تذهب اليوم؟"
//                     className="w-full py-4 px-6 pr-12 rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 text-right"
//                   />
//                   <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
//                 </div>
                
//                 {/* أزرار استكشاف وإضافة للمفضلة */}
//                 <div className="flex flex-wrap gap-4 justify-center md:justify-between">
//                   {/* <motion.button 
//                     className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-full flex items-center gap-3 transition-all duration-300 shadow-lg font-bold"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <span className="text-lg">استكشف الآن</span>
//                     <span className="transform rotate-180">←</span>
//                   </motion.button> */}
                  
//                   <motion.button 
//                     className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 border border-white/30"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                   >
//                     <span>استكشف الآن </span>
//                     <Heart className="w-5 h-5" />
//                   </motion.button>
//                 </div>
//               </motion.div>
              
//               {/* معلومات إضافية عن المكان الحالي */}
//               {/* <motion.div 
//                 className="mt-6 flex items-center justify-end gap-8 text-white/90 text-sm"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.8 }}
//               >
//                 <div className="flex items-center gap-2">
//                   <div className="text-amber-300">{currentPlace.visitors}</div>
//                   <Users className="w-4 h-4" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div>{currentPlace.location}</div>
//                   <MapPin className="w-4 h-4" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex">
//                     {[...Array(5)].map((_, i) => (
//                       <Star 
//                         key={i} 
//                         className={`w-4 h-4 ${i < Math.floor(currentPlace.rating) ? 'fill-amber-400 text-amber-400' : 'text-white/30'}`} 
//                       />
//                     ))}
//                   </div>
//                   <div>{currentPlace.rating}</div>
//                 </div>
//               </motion.div> */}
//             </motion.div>
            
//             {/* القسم الأيمن - معرض البطاقات */}
//             <div className="w-full lg:w-1/2 relative h-[500px]">
//               <AnimatePresence>
//                 {/* البطاقة الرئيسية */}
//                 <motion.div 
//                   key={`main-${activeIndex}`}
//                   className="absolute top-0 left-0 w-3/5 z-30"
//                   initial={{ opacity: 0, x: -50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 50 }}
//                   transition={{ duration: 0.6 }}
//                 >
//                   <motion.div 
//                     className="bg-gradient-to-br from-[#053F5E]/90 to-[#022C43]/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-white/10"
//                     whileHover={{ 
//                       scale: 1.03, 
//                       boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" 
//                     }}
//                   >
//                     <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
//                       <img 
//                         src={featuredPlaces[activeIndex].image}
//                         className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
//                         alt={featuredPlaces[activeIndex].name}
//                       />
//                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
//                         <div className="flex justify-between items-center mb-2">
//                           <div>
//                             {[...Array(5)].map((_, i) => (
//                               <Star 
//                                 key={i} 
//                                 className={`inline-block w-4 h-4 ${
//                                   i < Math.floor(currentPlace.rating) 
//                                     ? 'fill-amber-400 text-amber-400' 
//                                     : 'text-white/50'
//                                 }`} 
//                               />
//                             ))}
//                           </div>
//                         </div>
//                         <h3 className="text-white text-xl font-bold">{featuredPlaces[activeIndex].name}</h3>
//                         <div className="flex items-center gap-2 mt-2 text-white/80">
//                           <MapPin className="w-4 h-4" />
//                           <span className="text-sm">{currentPlace.location}</span>
//                         </div>
//                       </div>
//                       <motion.button 
//                         className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"
//                         whileHover={{ scale: 1.2, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         <Heart className="w-5 h-5 text-white" />
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 </motion.div>
                
//                 {/* البطاقات الثانوية */}
//                 {featuredPlaces.length > 1 && (
//                   <>
//                     {/* البطاقة الثانية */}
//                     <motion.div 
//                       key={`second-${activeIndex}`}
//                       className="absolute top-20 right-0 w-2/5 z-20"
//                       initial={{ opacity: 0, y: -30 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 30 }}
//                       transition={{ duration: 0.6, delay: 0.1 }}
//                     >
//                       <motion.div 
//                         className="bg-gradient-to-br from-[#053F5E]/80 to-[#022C43]/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-white/10"
//                         whileHover={{ scale: 1.05 }}
//                       >
//                         <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
//                           <img 
//                             src={featuredPlaces[(activeIndex + 1) % featuredPlaces.length].image}
//                             className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                             alt={featuredPlaces[(activeIndex + 1) % featuredPlaces.length].name}
//                           />
//                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
//                             <h3 className="text-white text-base font-bold">
//                               {featuredPlaces[(activeIndex + 1) % featuredPlaces.length].name}
//                             </h3>
//                           </div>
//                         </div>
//                       </motion.div>
//                     </motion.div>
                    
//                     {/* البطاقة الثالثة */}
//                     <motion.div 
//                       key={`third-${activeIndex}`}
//                       className="absolute bottom-0 right-10 w-1/3 z-10"
//                       initial={{ opacity: 0, scale: 0.8 }}
//                       animate={{ opacity: 1, scale: 1 }}
//                       exit={{ opacity: 0, scale: 0.8 }}
//                       transition={{ duration: 0.6, delay: 0.2 }}
//                     >
//                       <motion.div 
//                         className="bg-gradient-to-br from-[#053F5E]/70 to-[#022C43]/70 backdrop-blur-sm p-2 rounded-lg shadow-md border border-white/10"
//                         whileHover={{ scale: 1.05 }}
//                       >
//                         <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
//                           <img 
//                             src={featuredPlaces[(activeIndex + 2) % featuredPlaces.length].image}
//                             className="w-full h-full object-cover"
//                             alt={featuredPlaces[(activeIndex + 2) % featuredPlaces.length].name}
//                           />
//                           <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-colors"></div>
//                         </div>
//                       </motion.div>
//                     </motion.div>
//                   </>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* أزرار التنقل في الأسفل */}
//       {/* <div className="absolute bottom-6 right-8 flex items-center space-x-4 z-20">
//         <div className="text-white/60 text-sm">
//           {String(activeIndex + 1).padStart(2, '0')} / {String(featuredPlaces.length).padStart(2, '0')}
//         </div>
//         <motion.button 
//           onClick={prevSlide}
//           className="bg-[#053F5E] hover:bg-[#115173] p-3 rounded-full transition-colors"
//           whileHover={{ scale: 1.1, backgroundColor: "#115173" }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <ChevronLeftIcon className="w-5 h-5 text-white" />
//         </motion.button>
//         <motion.button 
//           onClick={nextSlide}
//           className="bg-[#053F5E] hover:bg-[#115173] p-3 rounded-full transition-colors"
//           whileHover={{ scale: 1.1, backgroundColor: "#115173" }}
//           whileTap={{ scale: 0.9 }}
//         >
//           <ChevronRightIcon className="w-5 h-5 text-white" />
//         </motion.button>
//       </div> */}

//     </div>
//   );
// };

// export default HeroSection;