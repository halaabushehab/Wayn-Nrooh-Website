

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// // أيقونات Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });

// export default function NearbyPlacesMap({ lat, lng }) {
//   // مثال لأماكن ثابتة (ممكن تجيبها من API أو database)
//   const places = [
//     { name: "حديقة جميلة", lat: lat + 0.01, lng: lng + 0.01 },
//     { name: "متحف قريب", lat: lat - 0.01, lng: lng - 0.01 },
//     { name: "مطعم رائع", lat: lat + 0.005, lng: lng - 0.005 },
//   ];

//   return (
//     <div className="w-full h-[300px] mt-4 rounded-lg overflow-hidden border border-gray-300">
//       <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
//         {/* موقع المستخدم */}
//         <Marker position={[lat, lng]}>
//           <Popup>أنت هنا</Popup>
//         </Marker>

//         {/* الأماكن القريبة */}
//         {places.map((place, index) => (
//           <Marker key={index} position={[place.lat, place.lng]}>
//             <Popup>{place.name}</Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }


import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// إعداد أيقونات الخريطة
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function NearbyPlacesMap({ lat, lng }) {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState(null);

  const handleNearbyPlaces = async () => {
    if (showMap) {
      setShowMap(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // جلب الأماكن القريبة عبر Overpass API (OpenStreetMap)
      const query = `
        [out:json];
        (
          node["amenity"](around:1000, ${lat}, ${lng});
          way["amenity"](around:1000, ${lat}, ${lng});
          relation["amenity"](around:1000, ${lat}, ${lng});
        );
        out center;
      `;
      const response = await axios.post(
        "https://overpass-api.de/api/interpreter",
        query,
        { headers: { "Content-Type": "text/plain" } }
      );

      const extractedPlaces = response.data.elements.map((element) => ({
        name: element.tags?.name || "مكان بدون اسم",
        lat: element.lat || element.center?.lat,
        lng: element.lon || element.center?.lon,
        type: element.tags?.amenity,
      }));

      setPlaces(extractedPlaces);
      setShowMap(true);
    } catch (err) {
      setError("فشل في جلب الأماكن القريبة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 hover:bg-[#115173]/5 transition-all duration-300">
        <button
          onClick={handleNearbyPlaces}
          className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]"
          disabled={loading}
        >
          {loading ? "جاري التحميل..." : showMap ? "إخفاء الأماكن" : "عرض الأماكن القريبة"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {showMap && (
        <div className="w-full h-[400px] mt-4 rounded-lg overflow-hidden border border-gray-300">
  <MapContainer center={[lat, lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

  {/* Marker للمستخدم */}
  <Marker position={[lat, lng]}>
    <Popup>أنت هنا</Popup>
  </Marker>

  {/* Marker للأماكن القريبة */}
  {places.map((place, index) => (
    <Marker key={index} position={[place.lat, place.lng]}>
      <Popup>
        <strong>{place.name}</strong><br />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          افتح في الخريطة
        </a>
      </Popup>
    </Marker>
  ))}
</MapContainer>


        </div>
      )}
    </div>
  );
}
