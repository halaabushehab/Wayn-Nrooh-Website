



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
  MapPinIcon,
  StarIcon
} from 'lucide-react';

// Updated PlaceCard component to match the style in CityPage
const PlaceCard = ({ place }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const addToFavorites = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // Here you would implement the actual favorites functionality
    // similar to the one in CityPage component
  };
  
  const handleDetails = () => {
    // Navigate to details page - would need to be connected to router
    window.location.href = `/place-details/${place._id}`;
  };
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
      <div className="relative">
        {/* Image with overlay gradient */}
        <div className="h-52 overflow-hidden">
          <img
            src={place.gallery?.[0] || "/api/placeholder/400/300"}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/80 to-transparent opacity-70"></div>
        </div>
        
        {/* Season tag */}
        {place.best_season && (
          <div className="absolute top-4 right-4 bg-[#FFD700] text-[#022C43] px-3 py-1 rounded-full text-sm font-bold shadow-md">
            {place.best_season}
          </div>
        )}
        
        {/* Favorite button */}
        <button
          className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
            isFavorite 
              ? 'bg-red-500 text-white animate-heartbeat' 
              : 'bg-white/20 backdrop-blur-md hover:bg-white/60'
          }`}
          onClick={addToFavorites}
        >
          <HeartIcon 
            className={`w-5 h-5 ${isFavorite ? 'fill-white' : 'text-white'}`} 
          />
        </button>
        
        {/* Place name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
          <h3 className="font-bold text-xl text-white drop-shadow-lg">
            {place.name}
          </h3>
        </div>
      </div>
      
      <div className="p-5">
        {/* Location with icon */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPinIcon className="w-5 h-5 ml-2 text-[#115173]" />
          <span className="text-sm">{place.short_description || place.description?.substring(0, 70) + '...'}</span>
        </div>
        
        {/* City tag */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-[#115173] text-xs font-semibold px-3 py-1 rounded-full">
            {place.city}
          </span>
        </div>
        
        {/* Action button */}
        <button
          onClick={handleDetails}
          className="w-full bg-[#115173] text-white py-3 rounded-xl hover:bg-[#022C43] transition-colors duration-300 flex items-center justify-center group"
        >
          <span>عرض التفاصيل</span>
          <svg className="w-5 h-5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

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
<section
  className="py-16 relative overflow-hidden bg-cover bg-center"
  // style={{ backgroundImage: "url('https://i.pinimg.com/736x/cb/e4/eb/cbe4ebd704ad2c76868baa2407020fbb.jpg')" }}
>      {/* Decorative elements */}
     
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* <div className="inline-block mb-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" 
              style={{ backgroundColor: '#115173' }}
            >
              <Compass className="w-8 h-8 text-white" />
            </motion.div>
          </div> */}
          <h2 className="text-5xl font-bold mb-4" style={{ color: '#022C43' }}>
  استكشف حسب الفئة
</h2>
<div className="w-40 h-1 mx-auto mb-6" style={{ backgroundColor: '#FFD700' }}></div>

          <p className="text-gray-600 max-w-2xl mx-auto">
            اكتشف أفضل الأماكن في الأردن مصنفة حسب الفئات المختلفة. من المطاعم الشهيرة إلى المتاحف التاريخية والمنتزهات الخلابة.
          </p>
        </motion.div>

        <div className="relative mb-12">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollRight}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 focus:outline-none hidden md:block"
            style={{ backgroundColor: '#FFD700' }}
          >
          
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
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 focus:outline-none hidden md:block"
            style={{ backgroundColor: '#FFD700' }}
          >
        
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {activePlaces.length > 0 ? (
              activePlaces.map((place, index) =>
                place ? (
                  <motion.div 
                    key={place._id} 
                    variants={itemVariants}
                    whileHover={{ y: -10, transition: { duration: 0.2 } }}
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
                  className="mt-4 px-6 py-2 rounded-full text-white transition-all duration-300 hover:bg-[#022C43]"
                  style={{ backgroundColor: '#115173' }}
                >
                  اكتشف فئات أخرى
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Add heartbeat animation for favorite button */}
      <style jsx>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        .animate-heartbeat { 
          animation: heartbeat 1s ease-in-out; 
        }
      `}</style>
    </section>
  );
};

export default CategorySection;










































































