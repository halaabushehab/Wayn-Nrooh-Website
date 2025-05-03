import { useState } from "react";
import NearbyPlacesMap from "./NearbyPlacesMap"; // تأكد من المسار الصحيح
import { MapPin } from "lucide-react"; // أيقونة افتراضية - غيّر حسب مكتبتك

const NearbyPlacesSection = () => {
  const [userCoords, setUserCoords] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleNearbyPlaces = async () => {
    if (showMap) {
      setShowMap(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // الحصول على الموقع الحالي
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserCoords(coords);

      // جلب الأماكن القريبة من السيرفر
      const response = await fetch(`http://localhost:9527/api/places/nearby?lat=${coords.lat}&lng=${coords.lng}`);

      if (!response.ok) {
        throw new Error("فشل في جلب الأماكن القريبة");
      }

      const data = await response.json();
      setNearbyPlaces(data);
      setShowMap(true);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching nearby places:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {/* زر عرض الأماكن القريبة */}
      <button
        onClick={handleNearbyPlaces}
        className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 
          hover:bg-[#115173]/5 transition-all duration-300"
      >
        <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
          <MapPin className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
        </div>
        <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">
          أماكن قريبة
        </span>
      </button>

      {/* الحالات المختلفة */}
      {loading && userCoords && (
        <div className="p-4 text-center">جاري تحميل الخريطة...</div>
      )}

      {error && (
        <div className="p-4 text-red-500 text-center">{error}</div>
      )}

      {showMap && userCoords && (
        <NearbyPlacesMap userCoords={userCoords} places={nearbyPlaces} />
      )}
    </div>
  );
};

export default NearbyPlacesSection;
