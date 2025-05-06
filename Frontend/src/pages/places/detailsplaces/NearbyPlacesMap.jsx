// import { useState } from "react";
// import NearbyPlacesMap from "./NearbyPlacesMap"; // تأكد من المسار الصحيح
// import { MapPin } from "lucide-react"; // أيقونة افتراضية - غيّر حسب مكتبتك

// const NearbyPlacesSection = () => {
//   const [userCoords, setUserCoords] = useState(null);
//   const [nearbyPlaces, setNearbyPlaces] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showMap, setShowMap] = useState(false);

//   const handleNearbyPlaces = async () => {
//     if (showMap) {
//       setShowMap(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       // الحصول على الموقع الحالي
//       const position = await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//       });

//       const coords = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };
//       setUserCoords(coords);

//       // جلب الأماكن القريبة من السيرفر
//       const response = await fetch(`http://localhost:9527/api/places/nearby?lat=${coords.lat}&lng=${coords.lng}`);

//       if (!response.ok) {
//         throw new Error("فشل في جلب الأماكن القريبة");
//       }

//       const data = await response.json();
//       setNearbyPlaces(data);
//       setShowMap(true);
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching nearby places:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-8">
//       {/* زر عرض الأماكن القريبة */}
//       <button
//         onClick={handleNearbyPlaces}
//         className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 
//           hover:bg-[#115173]/5 transition-all duration-300"
//       >
//         <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
//           <MapPin className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
//         </div>
//         <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">
//           أماكن قريبة
//         </span>
//       </button>

//       {/* الحالات المختلفة */}
//       {loading && userCoords && (
//         <div className="p-4 text-center">جاري تحميل الخريطة...</div>
//       )}

//       {error && (
//         <div className="p-4 text-red-500 text-center">{error}</div>
//       )}

//       {showMap && userCoords && (
//         <NearbyPlacesMap userCoords={userCoords} places={nearbyPlaces} />
//       )}
//     </div>
//   );
// };

// export default NearbyPlacesSection;
// import { useEffect, useState } from "react";

// const NearbyPlacesMap = ({ lat, lng, showMap, closePopup }) => {
//   const [nearbyPlaces, setNearbyPlaces] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!lat || !lng || !showMap) return;

//     const fetchNearbyPlaces = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`http://localhost:9527/api/places/nearby?lat=${lat}&lng=${lng}`);
//         if (!response.ok) {
//           throw new Error("فشل في جلب الأماكن القريبة");
//         }

//         const { data } = await response.json();
//         setNearbyPlaces(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNearbyPlaces();
//   }, [lat, lng, showMap]);

//   if (!showMap) return null;

//   return (
//     <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="popup-content bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative">
//         <button 
//           className="popup-close-btn absolute top-2 left-2 text-2xl font-bold text-gray-500 hover:text-gray-700"
//           onClick={closePopup}
//         >
//           &times;
//         </button>
//         <h2 className="text-xl font-bold mb-4 text-right">الأماكن القريبة منك</h2>
        
//         {loading && <div className="text-center py-4">جاري تحميل الأماكن القريبة...</div>}
//         {error && <div className="text-red-500 text-center py-4">{error}</div>}
//         {!loading && !error && (
//           nearbyPlaces.length === 0 ? (
//             <p className="text-center py-4">لا توجد أماكن قريبة</p>
//           ) : (
//             <div className="space-y-4">
//               {nearbyPlaces.map((place) => (
//                 <div key={place._id} className="p-4 border rounded-lg">
//                   <h3 className="text-lg font-bold text-right">{place.name}</h3>
//                   <p className="text-gray-600 text-right">{place.short_description}</p>
//                   {place.map_link && (
//                     <a 
//                       href={place.map_link} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="text-blue-500 hover:underline block text-right mt-2"
//                     >
//                       عرض على الخريطة
//                     </a>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   const [showMap, setShowMap] = useState(false);
//   const [userCoords, setUserCoords] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleNearbyPlaces = async () => {
//     if (showMap) {
//       setShowMap(false); // إغلاق الـ Popup عند الضغط إذا كانت مفتوحة
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       if (!navigator.geolocation) {
//         throw new Error("المتصفح لا يدعم الموقع الجغرافي");
//       }

//       const position = await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(
//           resolve,
//           (err) => reject(new Error("فشل في تحديد الموقع: " + err.message))
//         );
//       });

//       const coords = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };

//       setUserCoords(coords);
//       setShowMap(true);  // عرض الـ Popup بعد تحديد الموقع
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <button 
//         onClick={handleNearbyPlaces} 
//         className="btn-primary bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
//         disabled={loading}
//       >
//         {loading ? "جاري التحميل..." : showMap ? "إخفاء الأماكن" : "عرض الأماكن القريبة"}
//       </button>

//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       {/* عرض Popup عند الضغط على الزر */}
//       {showMap && userCoords && (
//         <NearbyPlacesMap
//           lat={userCoords.lat}
//           lng={userCoords.lng}
//           showMap={showMap}
//           closePopup={() => setShowMap(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default App;


import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// أيقونات Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function NearbyPlacesMap({ lat, lng }) {
  // مثال لأماكن ثابتة (ممكن تجيبها من API أو database)
  const places = [
    { name: "حديقة جميلة", lat: lat + 0.01, lng: lng + 0.01 },
    { name: "متحف قريب", lat: lat - 0.01, lng: lng - 0.01 },
    { name: "مطعم رائع", lat: lat + 0.005, lng: lng - 0.005 },
  ];

  return (
    <div className="w-full h-[300px] mt-4 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* موقع المستخدم */}
        <Marker position={[lat, lng]}>
          <Popup>أنت هنا</Popup>
        </Marker>

        {/* الأماكن القريبة */}
        {places.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lng]}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
