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
    name: 'أكاديمية آسيا للشطرنج',
    position: [31.9718654, 31.9718654],
    description: 'أكاديمية آسيا للشطرنج   .',
  },
  {
    name: ' دكانة الحُب',
    position: [31.9466855, 35.9299303],
    description: 'مساحة فنية مميزة تجمع بين الحرف اليدوية، الفوتوغراف، والهدايا الفنية في جبل عمّان     .',
  },
  {
    name: 'أم قيس',
    position: [32.6500, 35.7167],
    description: 'مدينة تاريخية تطل على بحيرة طبريا.',
  },
  {
    name: 'قلعة عجلون',
    position: [32.3333, 35.7333],
    description: 'قلعة إسلامية تاريخية في شمال الأردن.',
  },
  {
    name: 'وادي رم',
    position: [29.5850, 35.3986],
    description: 'صحراء ذات مناظر طبيعية خلابة.',
  },
  {
    name: 'البحر الميت',
    position: [31.5, 35.5],
    description: 'أخفض نقطة على سطح الأرض.',
  },
  {
    name: 'العقبة',
    position: [29.5310, 35.0078],
    description: 'مدينة ساحلية على البحر الأحمر.',
  },
]

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

// TravelAnimation Component
function TravelAnimation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full window size
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Create map points
    const points = []
    const pointCount = 30

    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        pulse: 0,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.02 + 0.01,
      })
    }

    // Draw a map pin
    const drawMapPin = (x, y, size, opacity) => {
      ctx.save()
      ctx.globalAlpha = opacity

      // Pin head
      ctx.beginPath()
      ctx.arc(x, y - size, size, 0, Math.PI * 2)
      ctx.fillStyle = "#FFD700"
      ctx.fill()

      // Pin body
      ctx.beginPath()
      ctx.moveTo(x, y - size)
      ctx.lineTo(x + size, y + size)
      ctx.lineTo(x - size, y + size)
      ctx.closePath()
      ctx.fillStyle = "#FFD700"
      ctx.fill()

      ctx.restore()
    }

    // Draw a pulsing circle
    const drawPulse = (x, y, radius, opacity) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 215, 0, ${opacity})`
      ctx.fill()
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw points
      for (let i = 0; i < points.length; i++) {
        const p = points[i]

        // Update pulse
        p.pulse += p.speed
        if (p.pulse > 1) p.pulse = 0

        // Draw pulse effect
        if (p.pulse < 0.5) {
          const pulseSize = p.size * (1 + p.pulse * 5)
          const pulseOpacity = (0.5 - p.pulse) * 0.5
          drawPulse(p.x, p.y, pulseSize, pulseOpacity)
        }

        // Draw map pin
        drawMapPin(p.x, p.y, p.size, p.opacity)
      }

      // Draw connecting lines between nearby points
      ctx.strokeStyle = "rgba(255, 215, 0, 0.1)"
      ctx.lineWidth = 1

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.globalAlpha = (1 - distance / 150) * 0.3
            ctx.beginPath()
            ctx.moveTo(points[i].x, points[i].y)
            ctx.lineTo(points[j].x, points[j].y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: "linear-gradient(to bottom, #022C43, #053F5E)" }}
    />
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
  const [showAnimation, setShowAnimation] = useState(false)
  const mapRef = useRef(null)

  // Default center and zoom for Jordan
  const center = [31.24, 36.51]
  const zoom = 7

  return (
    <>
      {showAnimation && <TravelAnimation />}
      
      <section className="py-16  relative">
        <div className="absolute top-10 right-10 rotate-12 opacity-80 hidden lg:block">
          <RoadSign destination="الاردن" distance="50 كم" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#022C43]"> خريطة كنوز الأردن الخفية </h2>
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