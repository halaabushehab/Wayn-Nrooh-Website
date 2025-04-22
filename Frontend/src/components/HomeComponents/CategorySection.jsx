// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
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
// } from 'lucide-react';
// import { PlaceCard } from '../HomeComponents/PlaceCard';
// const CategorySection = () => {
//   const [activeCategory, setActiveCategory] = useState('متاحف');
//   const [activePlaces, setActivePlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);




//   // "أماكن أثرية",
//   // منتزهات
//   const categories = [
//     { id: 'مطاعم', name: 'مطاعم', icon: <UtensilsIcon className="w-5 h-5" /> },
//     { id: 'متاحف', name: 'متاحف', icon: <LandmarkIcon className="w-5 h-5" /> },
//     { id: 'حدائق', name: 'حدائق', icon: <TreesIcon className="w-5 h-5" /> },
//     { id: 'رياضة', name: 'رياضة', icon: <DumbbellIcon className="w-5 h-5" /> },
//     { id: 'الأطفال', name: 'الأطفال', icon: <HeartIcon className="w-5 h-5" /> },
//     { id: 'ترفيه', name: 'ترفيه', icon: <MusicIcon className="w-5 h-5" /> },
//     { id: 'تسوق', name: 'تسوق', icon: <ShoppingBagIcon className="w-5 h-5" /> },
//     { id: 'تصوير', name: 'تصوير', icon: <CameraIcon className="w-5 h-5" /> },
//     { id: 'تاريخي', name: 'تاريخي', icon: <LandmarkIcon className="w-5 h-5" /> },
//     { id: 'مغامرات', name: 'مغامرات', icon: <MountainIcon className="w-5 h-5" /> },
//     { id: 'تعليمي', name: 'تعليمي', icon: <BookIcon className="w-5 h-5" /> },
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

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold mb-4">استكشف حسب الفئة</h2>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             اكتشف أفضل الأماكن في الأردن مصنفة حسب الفئات المختلفة. من المطاعم الشهيرة إلى المتاحف التاريخية والمنتزهات الخلابة.
//           </p>
//         </div>

//         <div
//           className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide"
//           style={{
//             scrollbarWidth: 'thin',
//             scrollbarColor: '#ffffff transparent',
//           }}
//         >
//           <div className="flex space-x-4 space-x-reverse mx-auto">
//             {categories.map((category) => (
//               <button
//                 key={category.id}
//                 onClick={() => setActiveCategory(category.id)}
//                 className={`flex items-center px-5 py-3 rounded-full whitespace-nowrap transition-all ${
//                   activeCategory === category.id
//                     ? 'bg-indigo-600 text-white shadow-lg'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 <span className="mr-2">{category.icon}</span>
//                 {category.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {loading ? (
//           <div className="col-span-full text-center py-20">
//             <p className="text-gray-500 text-lg">جارٍ تحميل البيانات...</p>
//           </div>
//         ) : error ? (
//           <div className="col-span-full text-center py-20">
//             <p className="text-red-500 text-lg">{error}</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {activePlaces.length > 0 ? (
//               activePlaces.map((place) =>
//                 place ? <PlaceCard key={place._id} place={place} /> : null
//               )
//             ) : (
//               <div className="col-span-full text-center py-20">
//                 <p className="text-gray-500 text-lg">لا توجد أماكن في هذه الفئة حالياً</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default CategorySection;






import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  UtensilsIcon,
  LandmarkIcon,
  TreesIcon,
  DumbbellIcon,
  HeartIcon,
  MusicIcon,
  ShoppingBagIcon,
  CameraIcon,
  MountainIcon,
  BookIcon,
  Compass,
} from 'lucide-react';
import { PlaceCard } from '../HomeComponents/PlaceCard';

const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState('متاحف');
  const [activePlaces, setActivePlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categoriesRef = useRef(null);

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const categories = [
    { id: 'مطاعم', name: 'مطاعم', icon: <UtensilsIcon className="w-5 h-5" /> },
    { id: 'متاحف', name: 'متاحف', icon: <LandmarkIcon className="w-5 h-5" /> },
    { id: 'حدائق', name: 'حدائق', icon: <TreesIcon className="w-5 h-5" /> },
    { id: 'رياضة', name: 'رياضة', icon: <DumbbellIcon className="w-5 h-5" /> },
    { id: 'الأطفال', name: 'الأطفال', icon: <HeartIcon className="w-5 h-5" /> },
    { id: 'ترفيه', name: 'ترفيه', icon: <MusicIcon className="w-5 h-5" /> },
    { id: 'تصوير', name: 'تصوير', icon: <CameraIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);
      console.log(`Fetching places for category: ${activeCategory}`);

      try {
        const response = await axios.get(`http://localhost:9527/api/places/category/${activeCategory}`);
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setActivePlaces(response.data);
        } else {
          console.error("البيانات المسترجعة ليست مصفوفة", response.data);
          setActivePlaces([]);
        }
      } catch (err) {
        setError(err.response ? err.response.data.message : 'فشل في جلب البيانات');
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [activeCategory]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-opacity-10 rounded-full" style={{ backgroundColor: '#115173', filter: 'blur(60px)' }}></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-opacity-5 rounded-full" style={{ backgroundColor: '#FFD700', filter: 'blur(80px)' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" 
              style={{ backgroundColor: '#115173' }}
            >
              <Compass className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-4xl font-bold mb-4" style={{ color: '#022C43' }}>استكشف حسب الفئة</h2>
          <div className="w-20 h-1 mx-auto mb-6" style={{ backgroundColor: '#FFD700' }}></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الأماكن في الأردن مصنفة حسب الفئات المختلفة. من المطاعم الشهيرة إلى المتاحف التاريخية والمنتزهات الخلابة.
          </p>
        </motion.div>

        <div className="relative mb-12">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollRight}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 focus:outline-none hidden md:block"
            style={{ backgroundColor: '#FFD700' }}
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: '#022C43' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg> */}
          </motion.button>

          <div 
            ref={categoriesRef}
            className="flex overflow-x-auto py-2 px-4 scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex space-x-4 space-x-reverse mx-auto">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-5 py-3 rounded-full whitespace-nowrap transition-all shadow-sm ${
                    activeCategory === category.id
                      ? 'text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{ 
                    backgroundColor: activeCategory === category.id ? '#115173' : '',
                    borderBottom: activeCategory === category.id ? '3px solid #FFD700' : ''
                  }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollLeft}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 focus:outline-none hidden md:block"
            style={{ backgroundColor: '#FFD700' }}
          >
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: '#022C43' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg> */}
          </motion.button>
        </div>

        {loading ? (
          <div className="col-span-full text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-12 h-12 border-4 border-t-4 rounded-full"
              style={{ borderColor: '#FFD700 transparent transparent transparent' }}
            ></motion.div>
            <p className="text-gray-500 text-lg mt-4">جارٍ تحميل البيانات...</p>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-20"
          >
            <div className="bg-red-50 p-6 rounded-lg inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-lg">{error}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {activePlaces.length > 0 ? (
              activePlaces.map((place, index) =>
                place ? (
                  <motion.div 
                    key={place._id} 
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
                    className="transition-all duration-300"
                  >
                    <PlaceCard place={place} />
                  </motion.div>
                ) : null
              )
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <img 
                  src="/api/placeholder/200/200" 
                  alt="No places found" 
                  className="mx-auto mb-4 opacity-50" 
                />
                <p className="text-gray-500 text-lg">لا توجد أماكن في هذه الفئة حالياً</p>
                <button 
                  className="mt-4 px-6 py-2 rounded-full text-white"
                  style={{ backgroundColor: '#115173' }}
                >
                  اكتشف فئات أخرى
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;













































































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
//   MapPin,
//   Heart
// } from 'lucide-react';

// // تعريف مكون PlaceCard المعدل
// const PlaceCard = ({ place }) => {
//   return (
//     <motion.div 
//       className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col"
//       whileHover={{ 
//         boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//       }}
//     >
//       {/* Image container with relative positioning for badge */}
//       <div className="relative w-full h-48">
//         {/* Place image */}
//         <img 
//           src={place.images && place.images.length > 0 ? place.images[0] : "/api/placeholder/400/320"} 
//           alt={place.name || "صورة المكان"}
//           className="w-full h-full object-cover"
//         />
        
//         {/* Favorite button */}
//         <button 
//           className="absolute top-2 left-2 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 transition-all duration-200"
//           aria-label="إضافة إلى المفضلة"
//         >
//           <Heart className="w-5 h-5 text-gray-600" />
//         </button>
        
//         {/* Category badge */}
//         <div 
//           className="absolute top-2 right-2 px-3 py-1 text-xs font-bold text-black rounded-full"
//           style={{ backgroundColor: '#FFD700' }}
//         >
//           {place.category || "الفئة والترفيه"}
//         </div>
//       </div>
      
//       {/* Content */}
//       <div className="p-4 flex flex-col flex-grow">
//         {/* Title */}
//         <h3 className="text-xl font-bold mb-2 text-right" style={{ color: '#022C43' }}>
//           {place.name || "الحديقة اليابانية"}
//         </h3>
        
//         {/* Location */}
//         <div className="flex items-center justify-end mb-4 text-gray-600">
//           <span className="text-sm">{place.city || "عمان"}</span>
//           <MapPin className="w-4 h-4 mr-1 ml-2" />
//           <span className="text-sm text-gray-500">{place.location || "حديقة مستوحاة من التصميم الياباني في عمان"}</span>
//         </div>
        
//         {/* Button */}
//         <div className="mt-auto">
//           <button 
//             className="w-full py-2 text-white font-medium rounded transition-all duration-200 hover:opacity-90"
//             style={{ backgroundColor: '#115173' }}
//           >
//             عرض التفاصيل
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const CategorySection = () => {
//   const [activeCategory, setActiveCategory] = useState('متاحف');
//   const [activePlaces, setActivePlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const categoriesRef = useRef(null);

//   const scrollLeft = () => {
//     if (categoriesRef.current) {
//       categoriesRef.current.scrollBy({ left: -200, behavior: 'smooth' });
//     }
//   };
  
//   const scrollRight = () => {
//     if (categoriesRef.current) {
//       categoriesRef.current.scrollBy({ left: 200, behavior: 'smooth' });
//     }
//   };

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

//   return (
//     <section className="py-16 bg-white relative overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute top-0 left-0 w-32 h-32 bg-opacity-10 rounded-full" style={{ backgroundColor: '#115173', filter: 'blur(60px)' }}></div>
//       <div className="absolute bottom-0 right-0 w-64 h-64 bg-opacity-5 rounded-full" style={{ backgroundColor: '#FFD700', filter: 'blur(80px)' }}></div>
      
//       <div className="container mx-auto px-4 relative z-10">
//         <motion.div 
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <div className="inline-block mb-4">
//             <motion.div 
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" 
//               style={{ backgroundColor: '#115173' }}
//             >
//               <Compass className="w-8 h-8 text-white" />
//             </motion.div>
//           </div>
//           <h2 className="text-4xl font-bold mb-4" style={{ color: '#022C43' }}>استكشف حسب الفئة</h2>
//           <div className="w-20 h-1 mx-auto mb-6" style={{ backgroundColor: '#FFD700' }}></div>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             اكتشف أفضل الأماكن في الأردن مصنفة حسب الفئات المختلفة. من المطاعم الشهيرة إلى المتاحف التاريخية والمنتزهات الخلابة.
//           </p>
//         </motion.div>

//         <div className="relative mb-12">
//           <motion.button 
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={scrollRight}
//             className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 focus:outline-none hidden md:block"
//             style={{ backgroundColor: '#FFD700' }}
//           >
//             {/* Arrow icon code goes here if needed */}
//           </motion.button>

//           <div 
//             ref={categoriesRef}
//             className="flex overflow-x-auto py-2 px-4 scrollbar-hide scroll-smooth"
//             style={{
//               scrollbarWidth: 'none',
//               msOverflowStyle: 'none',
//             }}
//           >
//             <div className="flex space-x-4 space-x-reverse mx-auto">
//               {categories.map((category) => (
//                 <motion.button
//                   key={category.id}
//                   onClick={() => setActiveCategory(category.id)}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`flex items-center px-5 py-3 rounded-full whitespace-nowrap transition-all shadow-sm ${
//                     activeCategory === category.id
//                       ? 'text-white shadow-lg'
//                       : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
//                   }`}
//                   style={{ 
//                     backgroundColor: activeCategory === category.id ? '#115173' : '',
//                     borderBottom: activeCategory === category.id ? '3px solid #FFD700' : ''
//                   }}
//                 >
//                   <span className="mr-2">{category.icon}</span>
//                   {category.name}
//                 </motion.button>
//               ))}
//             </div>
//           </div>

//           <motion.button 
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={scrollLeft}
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 focus:outline-none hidden md:block"
//             style={{ backgroundColor: '#FFD700' }}
//           >
//             {/* Arrow icon code goes here if needed */}
//           </motion.button>
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
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           >
//             {activePlaces.length > 0 ? (
//               activePlaces.map((place, index) =>
//                 place ? (
//                   <motion.div 
//                     key={place._id} 
//                     variants={itemVariants}
//                     whileHover={{ y: -10, transition: { duration: 0.2 } }}
//                     className="transition-all duration-300"
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
//                   className="mt-4 px-6 py-2 rounded-full text-white"
//                   style={{ backgroundColor: '#115173' }}
//                 >
//                   اكتشف فئات أخرى
//                 </button>
//               </motion.div>
//             )}
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default CategorySection;






















