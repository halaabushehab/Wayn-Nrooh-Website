import React, { useState, useEffect } from "react";
import axios from "axios";

const SimilarPlaces = ({ category, currentPlaceId }) => {  // أضفنا currentPlaceId هنا
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;
    console.log("الفئة المستلمة:", category);

    const fetchRelatedPlaces = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:9527/api/places/category/${encodeURIComponent(category)}`
        );
        
        // تصفية النتائج لاستبعاد المكان الحالي
        const filteredPlaces = response.data.filter(
          place => place._id !== currentPlaceId
        ).slice(0, 6);
        
        setRelatedPlaces(filteredPlaces);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الأماكن المشابهة");
        console.error("Error fetching similar places:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPlaces();
  }, [category, currentPlaceId]);  // أضفنا currentPlaceId إلى dependencies

return (
  <div className="py-6 px-3">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b border-amber-300 pb-2">
      أماكن مشابهة
    </h2>

    {loading && (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    )}

    {error && (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 mb-4 text-sm rounded">
        {error}
      </div>
    )}

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {relatedPlaces.map((place) => (
        <div 
          key={place._id} 
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
        >
          <div className="h-40 bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
            {place.images?.[0] ? (
              <img
                src={place.images[0]} 
                alt={place.name} 
                className="object-cover w-full h-full" 
                loading="lazy"
              />
            ) : (
              <span className="text-base text-amber-300 font-semibold">لا يوجد صورة</span>
            )}
          </div>

          <div className="p-4">
            <h6 className="text-sm mb-2 text-gray-800 font-semibold truncate">
              {place.name}
            </h6>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-snug">
              {place.short_description}
            </p>
            <button className="w-full bg-amber-300 text-gray-800 text-sm font-semibold py-2 px-3 rounded hover:bg-amber-400 transition-colors">
              عرض التفاصيل
            </button>
          </div>
        </div>
      ))}
    </div>

    {!loading && relatedPlaces.length === 0 && (
      <div className="text-center py-4 text-sm text-gray-500">
        لا توجد أماكن مشابهة متاحة
      </div>
    )}
  </div>
);

};

export default SimilarPlaces;