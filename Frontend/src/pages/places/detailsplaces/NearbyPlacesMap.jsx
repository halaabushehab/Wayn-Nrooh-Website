import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const NearbyPlacesMap = ({ userLat, userLng, nearbyPlaces }) => {
  // تأكد من أن الإحداثيات صالحة
  if (!userLat || !userLng) return <div>لا تتوفر إحداثيات الموقع</div>;

  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Marker for user location */}
      <Marker position={[userLat, userLng]}>
        <Popup className="custom-popup">
          <div className="max-w-xs">
            <h3 className="font-bold text-lg">موقعك الحالي</h3>
          </div>
        </Popup>
      </Marker>
      
      {/* Markers for nearby places */}
      {nearbyPlaces.map((place, index) => (
        <Marker 
          key={index} 
          position={[place.lat, place.lng]}
        >
          <Popup className="custom-popup">
            <div className="max-w-xs">
              <h3 className="font-bold text-lg">{place.name}</h3>
              {place.type && (
                <p className="text-gray-600">
                  <span className="font-semibold">النوع:</span> {place.type}
                </p>
              )}
              {place.distanceText && (
                <p className="text-gray-600">
                  <span className="font-semibold">المسافة:</span> {place.distanceText}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default NearbyPlacesMap;