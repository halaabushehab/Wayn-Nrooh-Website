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
        const latest = response.data.data.docs[0]; // assuming you use mongoose-paginate-v2
        setLatestPlace(latest);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب أحدث مكان:", error);
      }
    };

    fetchLatestPlace();
  }, []);

  return (
    <div className="bg-gray-50 flex items-center justify-center my-20">
      <div className="w-full max-w-6xl h-200 md:h-[350px] rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row-reverse">
        {/* Right Section */}
        <div className="bg-[#0a2642] p-6 md:p-8 text-right md:w-1/2 flex flex-col justify-center relative">
          <Banknote className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-pulse" />
          <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4">
            جديدنا لهذا الموسم
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6">
            تعرّف على أحدث وجهة تم إضافتها إلى منصتنا! مكان استثنائي يجمع بين التجربة الفريدة، المتعة، والجودة. لا تفوّت فرصة استكشافه قبل الجميع.
          </p>
          <Link to="/places?city=عمان">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-[#0a2642] font-bold py-2 px-6 rounded-full w-fit self-end flex items-center gap-2">
              <TagIcon className="w-4 h-4" />
              استعرض جميع وجهاتنا المميزة
            </button>
          </Link>
        </div>
  
        {/* Left Section - Dynamic Image */}
        <div className="md:w-1/2 relative">
          <img
            src={latestPlace?.images?.[0] || "https://via.placeholder.com/600x350?text=Loading..."}
            alt={latestPlace?.name || "مكان"}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white rounded-lg p-3 text-right shadow-md max-w-[70%] sm:max-w-[60%] md:max-w-[50%]">
            <div className="text-[#0a2642] font-bold text-lg sm:text-xl">
              {latestPlace?.name || "اسم الوجهة"}
            </div>
            <div className="text-gray-500 text-xs sm:text-sm mt-1">
              تم إضافتها مؤخرًا – اكتشف التجربة الآن!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
}

export default Offer;
