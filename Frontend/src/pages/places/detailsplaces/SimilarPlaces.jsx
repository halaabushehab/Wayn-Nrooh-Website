import React, { useState, useEffect } from "react";
import axios from "axios";

const SimilarPlaces = ({ category }) => {
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    const fetchRelatedPlaces = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:9527/api/places/category/${encodeURIComponent(category)}`
        );
        setRelatedPlaces(response.data.slice(0, 6));
      } catch (err) {
        setError("حدث خطأ أثناء جلب الأماكن المشابهة");
        console.error("Error fetching similar places:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPlaces();
  }, [category]);

  return (
    <div className="py-3 px-1">
      <h2 className="text-base font-medium mb-2 text-gray-800 border-b border-amber-300 pb-1">
        أماكن مشابهة
      </h2>

      {loading && (
        <div className="flex justify-center py-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-amber-400"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-2 border-red-400 text-red-600 p-1 mb-2 text-xs rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPlaces.map((place) => (
          <div 
            key={place._id} 
            className="bg-white rounded-lg overflow-hidden shadow-xs hover:shadow-sm transition-all duration-150 border border-gray-100"
          >
            {/* Image */}
            <div className="h-24 bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
              {place.images?.[0] ? (
                <img
                  src={place.images[0]} 
                  alt={place.name} 
                  className="object-cover w-full h-full" 
                  loading="lazy"
                />
              ) : (
                <span className="text-sm text-amber-300 font-medium">لا يوجد صورة</span>
              )}
            </div>

            {/* Content */}
            <div className="p-2">
            <h6 className="  text-[11px]  mb-1 text-gray-700 truncate">
  {place.name}
</h6>

              <p className="text-[11px] text-gray-500 mb-2 line-clamp-2 leading-tight">
                {place.short_description}
              </p>
              
              <button className="w-full bg-amber-300 text-gray-800 text-[11px] font-medium py-1 px-2 rounded hover:bg-amber-400 transition-colors">
                عرض التفاصيل
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && relatedPlaces.length === 0 && (
        <div className="text-center py-2 text-xs text-gray-400">
          لا توجد أماكن مشابهة متاحة
        </div>
      )}
    </div>
  );
};

export default SimilarPlaces;