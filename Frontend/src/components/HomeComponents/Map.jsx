import { useEffect, useRef, useState } from "react"
import { Map } from "lucide-react"
import { motion } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const touristSpots = [
  {
    name: ' مطعم وكافيه الحاكورة ',
    position: [32.4178794, 35.6456594],
    description: ' الحاكورة: مكان ريفي يجمع ما بين الماضي والحاضر',
  },
  {
    name: ' ساكورا ',
    position: [32.1008288,36.1050677],
    description: 'سوشي من ساكورا',
  },
  {
    name: 'فوريست بارك',
    position: [32.114343, 35.8931464],
    description: 'مكان يجمع بين المرح والراحة،',
  },
  {
    name: ' بيت شقير للثقافة و التراث',
    position: [31.9475384, 35.9232525],
    description: 'البيت دمشقي مع روح عمّان الجبليّة ',
  },
  {
    name: 'مفاتيح الدماغ ',
    position: [31.9699722, 35.8362778],
    description: 'برنامج مبتكر لتنمية الذكاء والإبداع',
  },

  {
    name: 'باب المدينة الزرقاء',
    position: [32.0786, 36.0880],
    description: 'مركز تسوق ومجمع تجاري في مدينة الزرقاء، يضم العديد من المتاجر والمطاعم.',
  },
  {
    name: 'Konige Academy',
    position: [31.9756, 35.9091],
    description: 'أكاديمية متخصصة في تدريب رياضة الريشة الطائرة في عمّان لجميع المستويات.',
  },
  {
    name: 'Amman Panorama Art Gallery',
    position: [31.9500, 35.9200],
    description: 'معرض فني ساحر يحتضن أعمالًا فنية تأسر الأنفاس في قلب عمّان.',
  },
  {
    name: ' فايف بي مول  ',
    position: [31.9182847, 35.9044993],
    description: ' وجهة التسوق الجديدة في عمّان',
  },
   {
    name: 'قلعة الكرك',
    position: [31.1804, 35.7013],
    description: 'قلعة تاريخية تعود للعصور الصليبية وتطل على مدينة الكرك.',
  },
  {
    name: 'شاطئ العقبة الجنوبي',
    position: [29.4772, 34.9802],
    description: 'مكان مميز للسباحة والغطس في البحر الأحمر.',
  },
  {
    name: 'متحف آثار إربد',
    position: [32.5556, 35.8462],
    description: 'يضم مجموعة مميزة من القطع الأثرية التي تعكس تاريخ المنطقة.',
  },
  {
    name: 'محمية ضانا الطبيعية',
    position: [30.6672, 35.6169],
    description: 'واحدة من أجمل المحميات الطبيعية في الأردن، تجمع بين الطبيعة والتنوع الحيوي.',
  },
  {
    name: 'متحف السلط التاريخي',
    position: [32.0362, 35.7283],
    description: 'يقدم لمحة عن تاريخ وثقافة مدينة السلط القديمة.',
  },
  {
    name: 'مقام النبي شعيب',
    position: [32.6795, 35.7414],
    description: 'موقع ديني مهم في محافظة البلقاء، يجذب الزوار من داخل الأردن وخارجه.',
  },
  {
    name: 'منتزه مادبا الأثري',
    position: [31.7181, 35.7939],
    description: 'يحتوي على فسيفساء بيزنطية مدهشة، من بينها خريطة مادبا الشهيرة.',
  },
  {
    name: 'وادي الهيدان',
    position: [31.5333, 35.7167],
    description: 'مكان مغامرات مثالي لعشاق التخييم والمشي والسباحة بين الشلالات.',
  },
  {
    name: 'مقام النبي هارون',
    position: [30.3167, 35.4333],
    description: 'يقع بالقرب من البتراء على قمة جبل ويعد من الأماكن الدينية والتاريخية.',
  },
  {
  name: 'قصر عمرة',
  position: [31.8014, 36.5816],
  description: 'أحد القصور الأموية الصحراوية في الأزرق، يتميز بجدرانه المزينة بالرسومات.',
},
{
  name: 'البتراء',
  position: [30.3285, 35.4444],
  description: 'المدينة الوردية المنحوتة بالصخر، أحد عجائب الدنيا السبع وتقع في محافظة معان.',
}
];

// RoadSign Component
function RoadSign({ destination, distance }) {
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.8 }}
      transition={{ duration: 0.5 }}
      className=" p-3 rounded-lg shadow-lg border-2 border-[#FFD700]"
    >
      <div className="text-center">
        <div className="text-lg font-bold text-[#022C43]">{destination}</div>
        <div className="text-sm text-[#444444]">{distance}</div>
      </div>
    </motion.div>
  )
}

// TravelStamp Component
function TravelStamp({ text, color, size }) {
  const fontSize = size / 4
  const borderWidth = size / 40

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full border-dashed"
        style={{
          borderWidth: `${borderWidth}px`,
          borderColor: color,
        }}
      ></div>

      <div
        className="absolute inset-2 rounded-full"
        style={{
          border: `${borderWidth}px solid ${color}`,
        }}
      ></div>

      <div
        className="font-bold text-center"
        style={{
          color: color,
          fontSize: `${fontSize}px`,
          transform: "rotate(-5deg)",
        }}
      >
        {text}
      </div>

      <div
        className="absolute"
        style={{
          top: `${size / 2 - fontSize / 2}px`,
          left: 0,
          right: 0,
          height: `${borderWidth}px`,
          background: color,
          transform: "rotate(-5deg)",
        }}
      ></div>
    </div>
  )
}



// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
})

// Map Section Component
function MapSection() {
  const mapRef = useRef(null)

  // Default center and zoom for Jordan
  const center = [31.24, 36.51]
  const zoom = 7

  return (
    <>
      
      <section className="py-16  relative">
        <div className="absolute top-10 right-10 rotate-12 opacity-80 hidden lg:block">
          <RoadSign destination="الاردن" distance="50 كم" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#022C43]"> خريطة كنوز الأردن الخفية </h2>
            <div className="h-1 bg-[#FFD700] flex-1 mr-4 rounded-full md:block hidden"></div>
            <p className="text-[#444444] max-w-md mt-4 md:mt-0">
            استكشف واختر وجهتك التالية من بين وجهاتنا المخفية.

</p>

          </div>
          <div className="bg-[#F5F5F5] rounded-xl h-[500px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-5 left-5 rotate-12 opacity-50">
              <TravelStamp text="شمال" color="#022C43" size={70} />
            </div>
            <div className="absolute bottom-5 right-5 -rotate-6 opacity-50">
              <TravelStamp text="جنوب" color="#022C43" size={70} />
            </div>

            <MapContainer 
              center={center} 
              zoom={zoom} 
              style={{ height: '100%', width: '100%', zIndex: 10 }}
              ref={mapRef}
              className="rounded-xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {touristSpots.map((spot, index) => (
                <Marker 
                  key={index} 
                  position={spot.position}
                  icon={customIcon}
                >
                  <Popup>
                    <div className="text-right">
                      <h3 className="font-bold text-lg text-[#022C43]">{spot.name}</h3>
                      <p className="text-[#444444]">{spot.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        
        </div>
      </section>
    </>
  )
}

export default MapSection