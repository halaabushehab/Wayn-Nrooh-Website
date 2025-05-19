// import React, { useState } from "react";

// const PlacesFilter = ({ onFilterChange }) => {
//     const [city, setCity] = useState("");
//     const [category, setCategory] = useState("");
//     const [ticketPrice, setTicketPrice] = useState("");

//     // تحديث الفلاتر وإرسالها إلى Home.js
//     const handleFilterChange = () => {
//         const filters = {};

//         if (city) filters.city = city;
//         if (category) filters.category = category;
//         if (ticketPrice) filters.ticket_price = ticketPrice;

//         onFilterChange(filters); // تمرير الفلاتر إلى `Home.js`
//     };

//     return (
//         <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
//             <h2>🔍 فلترة الأماكن</h2>

//             <div>
//                 <label>المدينة:</label>
//                 <select value={city} onChange={(e) => setCity(e.target.value)}>
//                     <option value="">الكل</option>
//                     <option value="عمان">عمان</option>
//                     <option value="إربد">إربد</option>
//                     <option value="الزرقاء">الزرقاء</option>
//                 </select>
//             </div>

//             <div>
//                 <label>الفئة:</label>
//                 <select value={category} onChange={(e) => setCategory(e.target.value)}>
//                     <option value="">الكل</option>
//                     <option value="منتزهات">منتزهات</option>
//                     <option value="طبيعة">طبيعة</option>
//                     <option value="ترفيه">ترفيه</option>
//                 </select>
//             </div>

//             <div>
//                 <label>سعر التذكرة:</label>
//                 <select value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)}>
//                     <option value="">الكل</option>
//                     <option value="free">مجاني</option>
//                     <option value="less5">أقل من 5 دنانير</option>
//                     <option value="more5">5 دنانير فأكثر</option>
//                 </select>
//             </div>

//             <button onClick={handleFilterChange} style={{ marginTop: "10px", padding: "8px 15px", background: "blue", color: "white", border: "none", borderRadius: "5px" }}>
//                 🔍 تطبيق الفلترة
//             </button>
//         </div>
//     );
// };





// export default PlacesFilter;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ExplorePopup = ({ 
  goldColor = "#D4AF37", 
  darkBlueColor = "#011627", 
  activeCategory, 
  showPopup, 
  onClose 
}) => {
  const [activePlaces, setActivePlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  
  const handleDetails = (place) => {
    navigate(`/place-details/${place._id}`);
  };
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!activeCategory?.categoryId) return;
      
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:9527/api/places/category/${activeCategory.categoryId}`
        );
        
        setActivePlaces(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'فشل في جلب البيانات');
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    if (showPopup && activeCategory) {
      fetchPlaces();
    }
  }, [showPopup, activeCategory]);

  if (!showPopup || !activeCategory) return null;

return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div 
      className="bg-white rounded-xl p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]"
      style={{ border: `2px solid ${goldColor}` }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 left-2 text-red-600 hover:text-red-800 text-2xl font-bold"
        aria-label="إغلاق"
      >
        ×
      </button>

      <div className="text-center mb-6">
        <h2 
          className="text-2xl font-bold text-gray-800 mb-2"
          style={{ color: darkBlueColor }}
        >
          {activeCategory.title}
        </h2>
        <div 
          className="h-1 w-20 mx-auto mb-4"
          style={{ backgroundColor: goldColor }}
        />
        <p className="text-gray-600">{activeCategory.description}</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-blue-600 animate-pulse">جاري تحميل الأماكن...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            حاول مرة أخرى
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {activePlaces.length > 0 ? (
              activePlaces.slice(0, 6).map((place) => (
                <div 
                  key={place._id || place.id} 
                  className="border rounded-lg p-3 shadow hover:shadow-lg transition cursor-pointer"
                  style={{
                    width: '100%',        // يشغل كل المساحة المتاحة للعمود
                    height: '280px',      // ارتفاع ثابت
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <img 
                    src={place.images[0] || place.imageUrl} 
                    alt={place.name} 
                    className="w-full object-cover rounded mb-2"
                    style={{ height: '120px', flexShrink: 0 }}
                  />
                  <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                    <h3 className="font-semibold text-gray-800 truncate">{place.name}</h3>
                    <p 
                      className="text-sm text-gray-600 mt-1" 
                      style={{
                        maxHeight: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {place.short_description?.substring(0, 100) || 'لا يوجد وصف...'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDetails(place)}
                    className="mt-3 w-full bg-[#115173] hover:bg-[#022C43] text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    <span className="text-sm font-medium">عرض التفاصيل</span>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">لا توجد أماكن متاحة في هذه الفئة حالياً</p>
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/location"
              className="px-6 py-2 rounded font-medium transition"
              style={{
                backgroundColor: goldColor,
                color: darkBlueColor,
                border: `1px solid ${darkBlueColor}`
              }}
            >
              عرض المزيد من الأماكن
            </Link>
          </div>
        </>
      )}
    </div>
  </div>
);

};

export default ExplorePopup;
