// import React, { useEffect, useState } from 'react';
// import { TagIcon, TrendingUpIcon, StarIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// export function Offer() {
//   const [topPlace, setTopPlace] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTopPlace = async () => {
//       try {
//         const response = await axios.get('http://localhost:9527/api/places?sort=-bookingCount&limit=1');
//         const top = response.data.data.docs[0];
//         setTopPlace(top);
//       } catch (error) {
//         console.error("حدث خطأ أثناء جلب المكان الأكثر حجزًا:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopPlace();
//   }, []);

//   return (
//     <div className="flex items-center justify-center my-12">
//       <div className="w-full max-w-5xl h-72 md:h-80 rounded-lg overflow-hidden shadow-2xl relative">
//         {/* Background Image */}
//         <div className="absolute inset-0 z-0">
//           {loading ? (
//             <div className="bg-gray-200 animate-pulse w-full h-full"></div>
//           ) : (
//             <img
//               src={topPlace?.images?.[0] || "/fallback.jpg"}
//               alt={topPlace?.name || "وجهتنا الأكثر شعبية"}
//               className="w-full h-full object-cover"
//             />
//           )}
//           <div className="absolute inset-0 bg-black bg-opacity-50"></div>
//         </div>

//         {/* Content Overlay */}
//         <div className="absolute inset-0 z-10 p-6 md:p-8 text-right flex flex-col justify-center items-end text-white">
//           <div className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center mb-4 shadow-md">
//             <TrendingUpIcon className="w-4 h-4 ml-1" />
//             <span>الأكثر حجزًا</span>
//           </div>

//           <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-xl">
//             {topPlace?.name || "وجهتنا الأكثر شعبية"}
//           </h2>

//           <p className="text-sm md:text-base max-w-md mb-4 drop-shadow">
//             {topPlace?.description?.substring(0, 100) || "استمتع بتجربة استثنائية في أكثر وجهاتنا إقبالاً! سارع بالحجز الآن واكتشف لماذا يفضله الجميع."}
//             {topPlace?.description?.length > 100 ? "..." : ""}
//           </p>

//           <div className="flex gap-3">
//             <Link to={`/places/${topPlace?._id}`}>
//               <button className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded-full flex items-center gap-2 text-sm">
//                 <StarIcon className="w-4 h-4" />
//                 احجز الآن
//               </button>
//             </Link>
//             <Link to="/places">
//               <button className="bg-transparent hover:bg-white/20 text-white border border-white font-bold py-2 px-4 rounded-full flex items-center gap-2 text-sm">
//                 <TagIcon className="w-4 h-4" />
//                 جميع الوجهات
//               </button>
//             </Link>
//           </div>
//         </div>

//         {/* Price Tag */}
//         {topPlace && topPlace.price && (
//           <div className="absolute top-6 left-6 z-20 bg-white rounded-lg p-2 shadow-lg text-center">
//             <div className="text-black font-bold text-xl">{topPlace.price} د.أ</div>
//             {topPlace.discount > 0 && (
//               <div className="text-red-500 text-xs font-bold mt-1">
//                 خصم {topPlace.discount}%
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Offer;

import React, { useEffect, useState } from 'react';
import { PercentIcon, TagIcon, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function Offer() {
  const [latestPlace, setLatestPlace] = useState(null);

  useEffect(() => {
    const fetchLatestPlace = async () => {
      try {
        const response = await axios.get('http://localhost:9527/api/places?page=1&limit=1');
        const latest = response.data.data.docs[0];
        setLatestPlace(latest);
      } catch (error) {
        console.error("Error fetching latest place:", error);
      }
    };

    fetchLatestPlace();
  }, []);

  return (
    <div className="flex items-center justify-center my-6">
      <div className=" max-w-4xl rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row-reverse">
        
        {/* Right Section */}
        <div className="bg-[#0a2642] p-4 md:p-6 text-right md:w-1/2 flex flex-col justify-center relative">
          <Banknote className="absolute top-3 left-3 w-5 h-5 text-yellow-400 animate-pulse" />
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2">
            Our Latest This Season
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-4">
            Discover the newest destination added to our platform! An exceptional place combining unique experiences, fun, and quality.
          </p>
          <Link to="/places?city=Amman">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-[#0a2642] font-bold py-1.5 px-4 rounded-full w-fit self-end flex items-center gap-2 text-sm">
              <TagIcon className="w-4 h-4" />
              Browse Featured
            </button>
          </Link>
        </div>

        {/* Left Section - Image */}
        <div className="md:w-1/2 relative h-48 md:h-60">
          <img
            src={latestPlace?.images?.[0] || "https://via.placeholder.com/600x350?text=Loading..."}
            alt={latestPlace?.name || "Place"}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-white rounded-lg p-2 text-right shadow-md max-w-[75%] sm:max-w-[65%] md:max-w-[60%]">
            <div className="text-[#0a2642] font-bold text-sm sm:text-base">
              {latestPlace?.name || "Destination Name"}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Recently added – check it out!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Offer;
