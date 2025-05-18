import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";

const SeasonalPopup = ({ setShowPopup }) => {
  const [topPlace, setTopPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopBookedPlace = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:9527/api/payments/stats/top-booked");
        const top = res.data.topPlaces?.[0];

        if (top) {
          try {
            const placeDetails = await axios.get(`http://localhost:9527/api/places/${top.placeId}`);
            setTopPlace({
              ...top,
              ...placeDetails.data,
              placeImage: placeDetails.data.images?.[0] || getDefaultImage()
            });
          } catch (err) {
            console.error("Error fetching place details:", err);
            setTopPlace({
              ...top,
              placeImage: getDefaultImage(),
              error: true
            });
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching top booked places:", err);
        setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopBookedPlace();
  }, []);

  const getDefaultImage = () => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  const handleBackgroundClick = () => setShowPopup(false);
  const handleContentClick = (e) => e.stopPropagation();

  return (
 <div
  className="fixed inset-0 backdrop-blur-sm bg-opacity-30 z-50 flex justify-center items-center"
  onClick={handleBackgroundClick}
>
      <div
        onClick={handleContentClick}
        className="relative w-full max-w-4xl h-[40vh] bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFD700]"
        style={{ backgroundImage: `url(${topPlace?.images[0]})` }}
      >
        <div className="absolute inset-0 bg-opacity-60  p-8 flex flex-col justify-center items-center text-white text-center">
          <button
            aria-label="إغلاق النافذة"
            onClick={() => setShowPopup(false)}
            className="absolute top-4 left-4 text-white text-3xl font-bold hover:text-[#FFD700]-500  transition"
          >
            &times;
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-l-[#FFD700] rounded-full animate-spin mb-4"></div>
              <p className="text-white">جاري تحميل البيانات...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-5 rounded-xl max-w-md">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-[#FFD700] text-white px-4 py-2 rounded hover:bg-red-500"
              >
                حاول مرة أخرى
              </button>
            </div>
          ) : topPlace ? (
            <>
              <h2 className="text-3xl font-bold mb-3">#1 الأكثر حجزاً هذا الموسم</h2>
              <h3 className="text-2xl font-semibold mb-2">{topPlace.name}</h3>
              <p className="max-w-xl text-sm mb-6">{topPlace.short_description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold">
               
  
            </div>
              <div className="mt-6 bg-white text-[#2C3E50] px-5 py-3 rounded-xl shadow">
                🎁 احصل على خصم 15% عند حجزك لأكثر من مكان هذا الموسم!
              </div>
            </>
          ) : (
            <p className="text-white text-lg">لا توجد عروض حالياً</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonalPopup;



// import React, { useState, useEffect } from "react";
// import { FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaGift, FaFire, FaCalendarAlt } from "react-icons/fa";

// const SeasonalPopup = ({ setShowPopup }) => {
//   const [topPlace, setTopPlace] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [confetti, setConfetti] = useState(true);

//   useEffect(() => {
//     const fetchTopBookedPlace = async () => {
//       try {
//         setLoading(true);
//         // Simulate API call
//         setTimeout(() => {
//           setTopPlace({
//             name: "منتجع الشاطئ الذهبي",
//             short_description: "استمتع بإقامة فاخرة على شاطئ البحر مع مناظر خلابة وخدمات استثنائية. يوفر المنتجع تجربة لا تُنسى للعائلات والأزواج.",
//             rating: 4.9,
//             location: "الساحل الشمالي",
//             price: 750,
//             duration: "3 أيام",
//             bookings: 127,
//             discount: 15,
//             images: ["/api/placeholder/800/500"]
//           });
//           setLoading(false);
//         }, 1000);
//       } catch (err) {
//         console.error("Error fetching top booked places:", err);
//         setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
//         setLoading(false);
//       }
//     };

//     fetchTopBookedPlace();
    
//     // Hide confetti after some time
//     const timer = setTimeout(() => {
//       setConfetti(false);
//     }, 3000);
    
//     return () => clearTimeout(timer);
//   }, []);

//   const handleBackgroundClick = () => setShowPopup(false);
//   const handleContentClick = (e) => e.stopPropagation();

//   // Confetti particles
//   const renderConfetti = () => {
//     if (!confetti) return null;
    
//     const particles = [];
//     const colors = ['#FFD700', '#FF6B6B', '#4ecdc4', '#ff8c42', '#a64ac9'];
    
//     for (let i = 0; i < 50; i++) {
//       const style = {
//         position: 'absolute',
//         left: `${Math.random() * 100}%`,
//         top: `${Math.random() * 100}%`,
//         width: `${Math.random() * 10 + 5}px`,
//         height: `${Math.random() * 10 + 5}px`,
//         backgroundColor: colors[Math.floor(Math.random() * colors.length)],
//         borderRadius: '50%',
//         animation: `fall ${Math.random() * 3 + 2}s linear infinite`,
//         animationDelay: `${Math.random() * 2}s`,
//         opacity: Math.random() * 0.7 + 0.3,
//       };
      
//       particles.push(<div key={i} style={style} />);
//     }
    
//     return particles;
//   };

//   return (
//     <div
//       className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-50 z-50 flex justify-center items-center"
//       onClick={handleBackgroundClick}
//     >
//       <div
//         onClick={handleContentClick}
//         className="relative w-full max-w-4xl h-[60vh] bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFD700] transform transition-all duration-500 hover:scale-[1.01]"
//         style={{ backgroundImage: `url(${topPlace?.images[0]})` }}
//       >
//         {/* Glowing border animation */}
//         <div className="absolute inset-0 rounded-2xl z-0 animate-pulse" style={{
//           background: 'linear-gradient(45deg, #FFD700, #FF6B6B, #4ecdc4, #ff8c42, #a64ac9)',
//           backgroundSize: '400% 400%',
//           animation: 'gradient 3s ease infinite',
//           filter: 'blur(3px)',
//           opacity: 0.7,
//         }}></div>
        
//         {/* Celebration ribbon */}
//         <div className="absolute -top-2 -right-16 bg-[#FF6B6B] text-white py-1 px-12 transform rotate-45 shadow-lg z-10 font-bold">
//           عرض خاص!
//         </div>
        
//         {renderConfetti()}
        
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 p-8 flex flex-col justify-center items-center text-white text-center z-10">
//           <button
//             aria-label="إغلاق النافذة"
//             onClick={() => setShowPopup(false)}
//             className="absolute top-4 left-4 text-white text-3xl font-bold hover:text-[#FFD700] transition-colors"
//           >
//             &times;
//           </button>

//           {loading ? (
//             <div className="flex flex-col items-center justify-center">
//               <div className="w-12 h-12 border-4 border-white border-l-[#FFD700] rounded-full animate-spin mb-4"></div>
//               <p className="text-white">جاري تحميل العروض المميزة...</p>
//             </div>
//           ) : error ? (
//             <div className="bg-red-100 text-red-700 p-5 rounded-xl max-w-md">
//               <p>{error}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-3 bg-[#FFD700] text-white px-4 py-2 rounded hover:bg-red-500"
//               >
//                 حاول مرة أخرى
//               </button>
//             </div>
//           ) : topPlace ? (
//             <>
//               <div className="animate-bounce mb-4">
//                 <span className="inline-block bg-[#FFD700] text-black font-extrabold px-4 py-2 rounded-full">
//                   عرض موسمي حصري!
//                 </span>
//               </div>
            
//               <h2 className="text-4xl font-bold mb-3 text-[#FFD700] drop-shadow-lg">
//                 <FaFire className="inline-block mr-2" />
//                 الأكثر حجزاً هذا الموسم
//               </h2>
              
//               <h3 className="text-3xl font-semibold mb-2">{topPlace.name}</h3>
//               <p className="max-w-xl text-lg mb-6">{topPlace.short_description}</p>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base font-semibold mb-6">
//                 <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-[#FFD700]/30">
//                   <FaStar className="inline-block text-[#FFD700] mr-2" />
//                   <span>{topPlace.rating}/5</span>
//                 </div>
//                 <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-[#FFD700]/30">
//                   <FaMapMarkerAlt className="inline-block text-[#FF6B6B] mr-2" />
//                   <span>{topPlace.location}</span>
//                 </div>
//                 <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-[#FFD700]/30">
//                   <FaClock className="inline-block text-[#4ecdc4] mr-2" />
//                   <span>{topPlace.duration}</span>
//                 </div>
//                 <div className="bg-black/50 p-3 rounded-lg backdrop-blur-sm border border-[#FFD700]/30">
//                   <FaMoneyBillWave className="inline-block text-[#a64ac9] mr-2" />
//                   <span>{topPlace.price} ر.س</span>
//                 </div>
//               </div>
              
//               <div className="relative mt-2 mb-6">
//                 <div className="absolute -left-3 -top-3 bg-[#FF6B6B] text-white text-xl font-bold h-10 w-10 flex items-center justify-center rounded-full animate-pulse">
//                   {topPlace.discount}%
//                 </div>
//                 <div className="bg-gradient-to-r from-[#FFD700] to-[#FF6B6B] text-black px-8 py-4 rounded-xl shadow-lg transform transition hover:scale-105">
//                   <FaGift className="inline-block mr-2 text-xl" />
//                   <span className="font-bold text-lg">
//                     احصل على خصم {topPlace.discount}% عند حجزك لأكثر من مكان هذا الموسم!
//                   </span>
//                 </div>
//               </div>
              
//               <div className="flex gap-4 mt-2">
//                 <button className="bg-[#FFD700] hover:bg-[#e5c100] text-black font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105">
//                   احجز الآن
//                 </button>
//                 <button className="bg-white/10 hover:bg-white/20 text-white border border-white font-bold py-3 px-6 rounded-full shadow-lg backdrop-blur-sm">
//                   اكتشف المزيد
//                 </button>
//               </div>
              
//               <div className="mt-6 text-sm">
//                 <FaCalendarAlt className="inline-block mr-1" /> العرض ساري حتى نهاية الموسم | تم حجزه {topPlace.bookings} مرة هذا الأسبوع
//               </div>
//             </>
//           ) : (
//             <p className="text-white text-lg">لا توجد عروض حالياً</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SeasonalPopup;


