



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import {
//   UtensilsIcon,
//   LandmarkIcon,
//   TreesIcon,
//   DumbbellIcon,
//   HeartIcon,
//   MusicIcon,
//   ShoppingBagIcon,
//   CameraIcon,
//   MountainIcon,
//   BookIcon,
//   Compass,
//   MapPinIcon,
//   StarIcon
// } from 'lucide-react';

// // Updated PlaceCard component to match the style in CityPage
// const PlaceCard = ({ place }) => {
//   const [isFavorite, setIsFavorite] = useState(false);
  
//   const addToFavorites = (e) => {
//     e.stopPropagation();
//     setIsFavorite(!isFavorite);
//     // Here you would implement the actual favorites functionality
//     // similar to the one in CityPage component
//   };
  
//   const handleDetails = () => {
//     // Navigate to details page - would need to be connected to router
//     window.location.href = `/place-details/${place._id}`;
//   };
  
//   return (
//     <div className=" rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
//       <div className="relative">
//         {/* Image with overlay gradient */}
//         <div className="h-52 overflow-hidden">
//           <img
//             src={place.images?.[0] || "/api/placeholder/400/300"}
//             alt={place.name}
//             className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/80 to-transparent opacity-70"></div>
//         </div>
        
//         {/* Season tag */}
//         {place.best_season && (
//           <div className="absolute top-4 right-4 bg-[#FFD700] text-[#022C43] px-3 py-1 rounded-full text-sm font-bold shadow-md">
//             {place.best_season}
//           </div>
//         )}
        
//         {/* Favorite button */}
//         <button
//           className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
//             isFavorite 
//               ? 'bg-red-500 text-white animate-heartbeat' 
//               : 'bg-white/20 backdrop-blur-md hover:bg-white/60'
//           }`}
//           onClick={addToFavorites}
//         >
//           <HeartIcon 
//             className={`w-5 h-5 ${isFavorite ? 'fill-white' : 'text-white'}`} 
//           />
//         </button>
        
//         {/* Place name overlay */}
//         <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
//           <h3 className="font-bold text-xl text-white drop-shadow-lg">
//             {place.name}
//           </h3>
//         </div>
//       </div>
      
//       <div className="p-5">
//         {/* Location with icon */}
//         <div className="flex items-center text-gray-600 mb-4">
//           <MapPinIcon className="w-5 h-5 ml-2 text-[#115173]" />
//           <span className="text-sm">{place.short_description || place.description?.substring(0, 70) + '...'}</span>
//         </div>
        
//         {/* City tag */}
//         <div className="mb-4">
//           <span className="inline-block bg-gray-100 text-[#115173] text-xs font-semibold px-3 py-1 rounded-full">
//             {place.city}
//           </span>
//         </div>
        
//         {/* Action button */}
//         <button
//           onClick={handleDetails}
//           className="w-full bg-[#115173] text-white py-3 rounded-xl hover:bg-[#022C43] transition-colors duration-300 flex items-center justify-center group"
//         >
//           <span>عرض التفاصيل</span>
//           <svg className="w-5 h-5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//           </svg>
//         </button>
//       </div>
//     </div>
//   );
// };

// const CategorySection = () => {
//   const [activeCategory, setActiveCategory] = useState('متاحف');
//   const [activePlaces, setActivePlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const categoriesRef = useRef(null);


//   const categories = [
//     { id: 'مطاعم', name: 'مطاعم', icon: <UtensilsIcon className="w-5 h-5" /> },
//     { id: 'متاحف', name: 'متاحف', icon: <LandmarkIcon className="w-5 h-5" /> },
//     { id: 'حدائق', name: 'حدائق', icon: <TreesIcon className="w-5 h-5" /> },
//     { id: 'رياضة', name: 'رياضة', icon: <DumbbellIcon className="w-5 h-5" /> },
//     { id: 'الأطفال', name: 'الأطفال', icon: <HeartIcon className="w-5 h-5" /> },
//     { id: 'ترفيه', name: 'ترفيه', icon: <MusicIcon className="w-5 h-5" /> },
//     { id: 'تصوير', name: 'تصوير', icon: <CameraIcon className="w-5 h-5" /> },
//   ];

//   useEffect(() => {
//     const fetchPlaces = async () => {
//       setLoading(true);
//       setError(null);
//       console.log(`Fetching places for category: ${activeCategory}`);

//       try {
//         const response = await axios.get(`http://localhost:9527/api/places/category/${activeCategory}`);
//         console.log("API Response:", response.data);

//         if (Array.isArray(response.data)) {
//           setActivePlaces(response.data);
//         } else {
//           console.error("البيانات المسترجعة ليست مصفوفة", response.data);
//           setActivePlaces([]);
//         }
//       } catch (err) {
//         setError(err.response ? err.response.data.message : 'فشل في جلب البيانات');
//         console.error("API Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlaces();
//   }, [activeCategory]);

//   // Animation variants
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { 
//       opacity: 1,
//       transition: { 
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: { 
//       y: 0, 
//       opacity: 1,
//       transition: { 
//         type: "spring", 
//         stiffness: 100 
//       }
//     }
//   };
//   // <div dir="rtl" className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">

//   return (
// <section
//   className=" relative overflow-hidden bg-cover bg-center"
//   // style={{ backgroundImage: "url('https://i.pinimg.com/736x/cb/e4/eb/cbe4ebd704ad2c76868baa2407020fbb.jpg')" }}
// >      {/* Decorative elements */}
     
      
//       <div className="container mx-auto px-4 relative z-10">
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <h2 className="text-5xl font-bold mb-4" style={{ color: '#022C43' }}>
//   استكشف حسب الفئة
// </h2>
// <div className="w-40 h-1 mx-auto mb-6" style={{ backgroundColor: '#FFD700' }}></div>

//           <p className="text-gray-600 max-w-2xl mx-auto">
//             اكتشف أفضل الأماكن في الأردن مصنفة حسب الفئات المختلفة. من المطاعم الشهيرة إلى المتاحف التاريخية والمنتزهات الخلابة.
//           </p>
//         </motion.div>

//         <div className="relative mb-12">
      
//       <div className="relative mb-6">
//   <div 
//     ref={categoriesRef}
//     className="flex overflow-x-auto py-1 px-2 scrollbar-hide scroll-smooth"
//     style={{
//       scrollbarWidth: 'none',
//       msOverflowStyle: 'none',
//     }}
//   >
//     <div className="flex space-x-2 space-x-reverse mx-auto">
//       {categories.map((category) => (
//         <motion.button
//           key={category.id}
//           onClick={() => setActiveCategory(category.id)}
//           whileHover={{ scale: 1.04 }}
//           whileTap={{ scale: 0.96 }}
//           className={`flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all shadow-sm ${
//             activeCategory === category.id
//               ? 'text-white shadow-md'
//               : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
//           }`}
//           style={{
//             backgroundColor: activeCategory === category.id ? '#115173' : '',
//             borderBottom: activeCategory === category.id ? '2px solid #FFD700' : '',
//           }}
//         >
//           <span className="mr-1 text-base">{category.icon}</span>
//           {category.name}
//         </motion.button>
//       ))}
//     </div>
//   </div>
// </div>


      
//         </div>

//         {loading ? (
//           <div className="col-span-full text-center py-20">
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//               className="inline-block w-12 h-12 border-4 border-t-4 rounded-full"
//               style={{ borderColor: '#FFD700 transparent transparent transparent' }}
//             ></motion.div>
//             <p className="text-gray-500 text-lg mt-4">جارٍ تحميل البيانات...</p>
//           </div>
//         ) : error ? (
//           <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="col-span-full text-center py-20"
//           >
//             <div className="bg-red-50 p-6 rounded-lg inline-block">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p className="text-red-700 text-lg">{error}</p>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div 
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//           >
//             {activePlaces.length > 0 ? (
//               activePlaces.map((place, index) =>
//                 place ? (
//                   <motion.div 
//                     key={place._id} 
//                     variants={itemVariants}
//                     whileHover={{ y: -10, transition: { duration: 0.2 } }}
//                   >
//                     <PlaceCard place={place} />
//                   </motion.div>
//                 ) : null
//               )
//             ) : (
//               <motion.div 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="col-span-full text-center py-20"
//               >
//                 <img 
//                   src="/api/placeholder/200/200" 
//                   alt="No places found" 
//                   className="mx-auto mb-4 opacity-50" 
//                 />
//                 <p className="text-gray-500 text-lg">لا توجد أماكن في هذه الفئة حالياً</p>
//                 <button 
//                   className="mt-4 px-6 py-2 rounded-full text-white transition-all duration-300 hover:bg-[#022C43]"
//                   style={{ backgroundColor: '#115173' }}
//                 >
//                   اكتشف فئات أخرى
//                 </button>
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </div>
      
//       {/* Add heartbeat animation for favorite button */}
//       <style jsx>{`
//         @keyframes heartbeat {
//           0% { transform: scale(1); }
//           25% { transform: scale(1.2); }
//           50% { transform: scale(1); }
//           75% { transform: scale(1.2); }
//           100% { transform: scale(1); }
//         }
        
//         .animate-heartbeat { 
//           animation: heartbeat 1s ease-in-out; 
//         }
//       `}</style>
//     </section>
//   );
// };

// export default CategorySection;


//   const categories = [
//     {
//       id: 1,
//       title: "مطاعم",
//       description: "استكشف أفضل المطاعم في المدينة مع قائمة متنوعة من المأكولات المحلية والعالمية",
//       date: "١٥ أبريل ٢٠٢٥",
//             categoryId:"مطاعم",

//       imageUrl:pho_1
//     },
//     {
//       id: 2,
//       title: "تصوير",
//       description: "اكتشف أجمل الأماكن للتصوير ومشاركة لحظاتك المميزة مع الآخرين",
//       date: "٢٠ أبريل ٢٠٢٥",
//             categoryId:"تصوير",

//       imageUrl:pho_2
//     },
//     {
//       id: 3,
//       title: "رياضات",
//       description: "استكشف أفضل الأندية الرياضية والترفيهية لقضاء وقت ممتع",     
//        date: "٢٥ أبريل ٢٠٢٥",
//              categoryId:"رياضة",

//       imageUrl:pho_3
//     },
//     {
//   id: 4,
//   title: "تاريخ وتراث",
//   description: "اكتشف جمال التاريخ والتراث من خلال زيارة المواقع الأثرية والمتاحف والمعالم الثقافية المميزة.",
//   date: "٣٠ أبريل ٢٠٢٥",
//         categoryId:"متاحف",

//   imageUrl: pho_4
// }

//   ];

import { useState, useEffect } from 'react';
import pho_1 from '../../components/img/Cate1.png';
import pho_2 from '../../components/img/15d5bf42942e95ce5dc4a91c90334481.jpg';
import pho_3 from '../../components/img/Cate3.png';
import pho_4 from '../../components/img/Cate6 (2).png';
import ExplorePopup from "../../components/HomeComponents/ExplorePopup";

const COLORS = {
  gold: "#D4AF37",
  lightBlue: "#115173",
  darkBlue: "#011627",
  accent: "#F8F0E3"
};

export default function LuxuryCategorySection() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isTitleVisible, setIsTitleVisible] = useState(false);

  const categories = [
    { id: 1, title: "مطاعم", description: "استكشف أفضل المطاعم...", date: "١٥ أبريل ٢٠٢٥", categoryId: "مطاعم", imageUrl: pho_1 },
    { id: 2, title: "تصوير", description: "اكتشف أجمل الأماكن...", date: "٢٠ أبريل ٢٠٢٥", categoryId: "تصوير", imageUrl: pho_2 },
    { id: 3, title: "رياضات", description: "استكشف أفضل الأندية...", date: "٢٥ أبريل ٢٠٢٥", categoryId: "رياضة", imageUrl: pho_3 },
    { id: 4, title: "تاريخ وتراث", description: "اكتشف جمال التاريخ...", date: "٣٠ أبريل ٢٠٢٥", categoryId: "متاحف", imageUrl: pho_4 }
  ];

  const openPopup = (category) => {
    setActiveCategory(category);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setActiveCategory(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTitleVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="w-full  relative overflow-hidden" 

    >
      {/* Background decorative elements */}
      <div 
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full filter blur-3xl opacity-10" 
        style={{ backgroundColor: COLORS.gold }} 
      />
      <div 
        className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full filter blur-3xl opacity-5" 
        style={{ backgroundColor: COLORS.lightBlue }} 
      />

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl font-bold text-center" style={{ color: COLORS.darkBlue }}>
            فئات موقعنا
          </h2>
          <div className="h-1  mt-2 w-24 mr-130" style={{ backgroundColor: COLORS.gold }} />
          <p className="mt-6 text-xl text-center pr-12" style={{ color: COLORS.lightBlue }}>
            استكشف مختلف الفئات المتاحة في موقعنا
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <ElegantCategoryCard
              key={category.id}
              category={category}
              index={index}
              onOpenPopup={() => openPopup(category)}
            />
          ))}
        </div>
      </div>

      {/* Popup modal */}
{isPopupOpen && activeCategory && (
  <ExplorePopup
    goldColor={COLORS.gold}
    darkBlueColor={COLORS.darkBlue}
    activeCategory={activeCategory}
    showPopup={isPopupOpen}  // أضف هذه السطر
    onClose={closePopup}
  />
)}
    </div>
  );
}

function ElegantCategoryCard({ category, index, onOpenPopup }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenPopup();
  };

  return (
    <div
      className={`h-[400px] rounded-lg overflow-hidden relative transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        boxShadow: isHovered
          ? '0 22px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)'
          : '0 10px 30px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        minHeight: '400px' // إضافة حد أدنى للارتفاع
      }}
    >
      {/* Hover overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(1, 22, 39, 0.2), rgba(1, 22, 39, 0.6))',
          zIndex: 2
        }}
      />

      {/* Top border animation */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
        style={{
          backgroundColor: COLORS.gold,
          width: isHovered ? '100%' : '0%',
          opacity: 0.8,
          zIndex: 10
        }}
      />

      {/* Image container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={category.imageUrl} 
          alt={category.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, ${COLORS.darkBlue}CC, ${COLORS.darkBlue}00 60%)`,
            opacity: isHovered ? 1 : 0.8,
            zIndex: 1
          }}
        />
      </div>

      {/* Gold border effect */}
      <div
        className="absolute inset-0 rounded-lg transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${COLORS.gold}`,
          opacity: isHovered ? 0.3 : 0,
          zIndex: 3
        }}
      />

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
        <div 
          className="w-8 h-0.5 mb-3 transition-all duration-500" 
          style={{
            backgroundColor: COLORS.gold,
            width: isHovered ? '3rem' : '2rem',
            opacity: isHovered ? 1 : 0.7
          }} 
        />

        <div className="flex justify-between items-end">
          <div className="flex-grow">
            <h3 
              className="text-2xl font-bold text-right mb-2 transition-all duration-300" 
              style={{
                color: 'white',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {category.title}
            </h3>
            <div 
              className="overflow-hidden transition-all duration-500" 
              style={{
                maxHeight: isHovered ? '80px' : '0',
                opacity: isHovered ? 1 : 0
              }}
            >
              <p className="text-right text-sm" style={{ color: COLORS.accent }}>
                {category.description}
              </p>
            </div>
          </div>

          <div 
            className="ml-4 mb-1 transition-all duration-500" 
            style={{
              opacity: isHovered ? 0 : 0.9,
              transform: isHovered ? 'translateX(20px)' : 'translateX(0)'
            }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.gold, color: COLORS.darkBlue }}
            >
              <span className="text-xs font-bold">+</span>
            </div>
          </div>
        </div>

        <div 
          className="flex justify-between items-center mt-4 transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
          }}
        >
          <div className="text-sm text-right" style={{ color: COLORS.gold }}>
            {category.date}
          </div>

          <button
            className="py-1 px-3 text-xs rounded transition-all duration-300 hover:bg-opacity-20 hover:bg-white"
            style={{ 
              backgroundColor: 'transparent', 
              border: `1px solid ${COLORS.gold}`, 
              color: COLORS.gold 
            }}
            onClick={handleClick}
          >
            استكشف المزيد
          </button>
        </div>
      </div>
    </div>
  );
}