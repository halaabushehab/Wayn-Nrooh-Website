import { useState, useRef, useEffect } from 'react'; // Fixed import
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

const NearbyPlacesModal = ({ userLocation, onClose }) => {
  const [showMap, setShowMap] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Custom icons
  const currentPlaceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Fetch nearby places when component mounts
  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      try {
        const response = await fetch(`http://localhost:9527/api/places/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`);
        const data = await response.json();
        
        // Add distance text to each place
        const placesWithDistance = data.nearbyPlaces.map(place => ({
          ...place,
          distanceText: `${place.distance.toFixed(1)} كم`
        }));
        
        setNearbyPlaces(placesWithDistance);
      } catch (error) {
        console.error("Error fetching nearby places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, [userLocation]);

  // Filter places based on selected type
  const filteredPlaces = filterType === 'all' 
    ? nearbyPlaces 
    : nearbyPlaces.filter(place => place.type === filterType);

  if (!showMap) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  z-[1000] flex items-center justify-center p-4">
      <div 
  className="bg-white rounded-xl shadow-2xl w-full max-w-4xl  h-[60vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-[#022C43] p-4 text-white">
          <h3 className="text-lg font-semibold">
            الأماكن القريبة من موقعك الحالي
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="w-full md:w-3/5 h-96 md:h-auto">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              scrollWheelZoom={true}
              className="h-full w-full"
              ref={mapRef}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Marker للموقع الحالي */}
              <Marker 
                position={[userLocation.lat, userLocation.lng]} 
                icon={currentPlaceIcon}
              >
                <Popup>
                  <div className="font-bold text-red-600">موقعك الحالي</div>
                </Popup>
              </Marker>

              {/* Markers للأماكن القريبة */}
              {filteredPlaces.map((place) => (
                <Marker 
                  key={place.id} 
                  position={[place.lat, place.lng]} 
                  icon={customIcon}
                >
                  <Popup>
                    <div className="font-bold">{place.name}</div>
                    <div className="text-sm">{place.type}</div>
                    <div className="text-xs text-gray-500">{place.distanceText}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* قائمة الأماكن - تأخذ 40% من المساحة */}
          <div className="w-full md:w-2/5 overflow-y-auto p-4 bg-gray-50">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022C43]"></div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button 
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filterType === 'all' ? 'bg-[#022C43] text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    الكل ({nearbyPlaces.length})
                  </button>
                  {Array.from(new Set(nearbyPlaces.map(p => p.type))).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filterType === type ? 'bg-[#115173] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {type} ({nearbyPlaces.filter(p => p.type === type).length})
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((place) => (
                      <div 
                        key={place.id} 
                        className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                        onClick={() => {
                          if (mapRef.current) {
                            mapRef.current.flyTo([place.lat, place.lng], 15);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-[#115173]">{place.name}</h5>
                            <p className="text-sm text-gray-600">{place.type}</p>
                          </div>
                          <span className="text-xs bg-[#022C43]/10 text-[#022C43] px-2 py-1 rounded">
                            {place.distanceText}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد أماكن قريبة تطابق الفلتر المحدد
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 border-t flex justify-between items-center">
          <div className="text-sm text-gray-600">
            الإحداثيات: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
          </div>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#0a3a52] transition-colors"
          >
            إغلاق الخريطة
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyPlacesModal;