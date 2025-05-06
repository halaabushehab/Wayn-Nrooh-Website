import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaTicketAlt, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

const SeasonalPopup = ({ setShowPopup }) => {
  const [topBookedPlaces, setTopBookedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopBookedPlaces = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:9527/api/payments/stats/top-booked");
        
        const placesWithDetails = await Promise.all(
          res.data.topPlaces.map(async (place) => {
            try {
              const placeDetails = await axios.get(`http://localhost:9527/api/places/${place.placeId}`);
              return {
                ...place,
                ...placeDetails.data,
                placeImage: placeDetails.data.images?.[0] || getDefaultImage(place.placeId)
              };
            } catch (err) {
              console.error(`Error fetching details for place ${place.placeId}:`, err);
              return {
                ...place,
                placeImage: getDefaultImage(place.placeId),
                error: true
              };
            }
          })
        );
        
        setTopBookedPlaces(placesWithDetails);
        setError(null);
      } catch (err) {
        console.error("Error fetching top booked places:", err);
        setError("فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchTopBookedPlaces();
  }, []);

  const getDefaultImage = (placeId) => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    ];
    return defaultImages[placeId % defaultImages.length];
  };

  const getColorByIndex = (index) => {
    const colors = ["bg-[#FF6B6B]", "bg-[#4ECDC4]", "bg-[#45B7D1]", "bg-[#FFA07A]", "bg-[#98D8C8]"];
    return colors[index % colors.length];
  };

  const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-center gap-2">
      <div className="text-[#FF6B6B] text-base">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[#7F8C8D] text-xs">{label}</span>
        <span className="text-[#2C3E50] text-sm font-semibold">{value || "غير متوفر"}</span>
      </div>
    </div>
  );
  const renderPlaceCard = (place, index) => (
    <div
      key={place.placeId}
      className="flex flex-col rounded-xl overflow-hidden shadow-lg transition-all duration-300 bg-white hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="w-full h-36 overflow-hidden relative bg-gray-100">
        <img
          src={place.placeImage}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = getDefaultImage(place.placeId);
          }}
        />
        <div className={`absolute top-3 left-3 text-white px-2.5 py-1 rounded-full text-sm font-semibold shadow ${getColorByIndex(index)}`}>
          #{index + 1} الأكثر حجزاً
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg text-[#2C3E50] font-bold mb-1">{place.name}</h3>
        <p className="text-[#7F8C8D] text-sm mb-2 leading-relaxed min-h-[30px]">{place.short_description}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-3">
          <DetailItem icon={<FaMapMarkerAlt />} label="المدينة" value={place.city} />
          <DetailItem icon={<FaMoneyBillWave />} label="السعر" value={place.ticket_price ? `${place.ticket_price} د.أ` : "مجاني"} />
          <DetailItem icon={<FaStar />} label="التقييم" value={place.rating ? `${place.rating}` : "جديد"} />
          <DetailItem icon={<FaClock />} label="ساعات العمل" value={place.working_hours} />

        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm p-5">
      <div className="bg-white p-8 rounded-2xl w-full max-w-6xl max-h-[90vh] border-4 border-[#FF6B6B] bg-gradient-to-b from-white to-gray-50 relative shadow-2xl">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 left-4 bg-transparent border-none text-2xl cursor-pointer text-[#FF6B6B] font-bold p-1 rounded-full hover:bg-gray-100 transition-all"
          aria-label="إغلاق النافذة"
        >
          &times;
        </button>

        <h2 className="text-2xl text-[#2C3E50] font-bold text-center mb-2">الأماكن الأكثر حجزاً هذا الموسم</h2>
        <p className="text-[#7F8C8D] text-center text-base mb-8">اكتشف الوجهات المفضلة لدى زوارنا واحصل على عروض حصرية</p>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-gray-200 border-l-[#FF6B6B] rounded-full animate-spin mb-5"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="text-center p-10 bg-red-50 rounded-xl">
            <p className="text-[#FF6B6B] text-lg mb-5">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FF6B6B] text-white border-none px-5 py-2.5 rounded font-semibold hover:bg-[#e05b5b] transition-colors"
            >
              حاول مرة أخرى
            </button>
          </div>
        ) : topBookedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {topBookedPlaces.map((place, index) => renderPlaceCard(place, index))}
          </div>
        ) : (
          <div className="text-center p-10 bg-gray-50 rounded-xl">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              alt="لا توجد بيانات"
              className="w-20 h-20 opacity-60 mx-auto mb-4"
            />
            <p className="text-[#7F8C8D] text-lg">لا توجد عروض موسمية حالياً</p>
          </div>
        )}

        {/* <div className="bg-gray-50 px-5 py-4 rounded-lg text-center mt-5 border-l-4 border-[#4ECDC4]">
          <p className="text-[#2C3E50] font-semibold text-base m-0">
            🎁 احصل على خصم 15% عند حجزك لأكثر من مكان هذا الموسم!
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default SeasonalPopup;