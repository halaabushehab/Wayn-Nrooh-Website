import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// حل مشكلة الأيقونات في React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function LocationMap({ latitude, longitude }) {
  return (
    <div className="mt-3 rounded-lg border border-gray-300 overflow-hidden">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '250px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>المكان هنا</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
