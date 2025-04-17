




import React, { useState, useEffect } from 'react'
import FeaturedCard from './FeaturedCard'
import { ChevronLeftIcon, ChevronRightIcon, Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  
  const featuredPlaces = [
        {
          id: 1,
          image: 'https://www.thisisamman.com/wp-content/uploads/2022/11/image1577108857894-1.png',
          description: 'استمتع بتجربة فريدة في أروع الأسواق المميزة والقديمة على وين نروح، حيث يلتقي عبق التاريخ بجمال التسوق',
          color: 'from-[#FFD700]/80 to-[#6B3E26]/80',
          accent: '#FF4500'
        },
        {
          id: 2,
          image: 'https://s.alicdn.com/@sc04/kf/H76fb512c307b426d874db319a387b2a2m.jpg',
          description: 'دع طفلك يستمتع بأجمل لحظات اللعب والاكتشاف مع وين نروح، حيث تجد أفضل الأماكن المناسبة للأطفال!',
          color: 'from-[#6B3E26]/80 to-[#053F5E]/80',
          accent: '#FFD700'
        },
        {
          id: 3,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn9WTXSKSdHIlhBIYJVeCdk68FECST92udN-c1NkWJyM79z6DI',
          description: "استمتع بتجربة فريدة في أروع الأسواق المميزة والقديمة على وين نروح، حيث يلتقي عبق التاريخ بجمال التسوق",
          color: 'from-[#053F5E]/80 to-[#FFD700]/80',
          accent: '#FFD700'
        },
        
      ]
  
  const nextSlide = () => {
    if (animating) return
    setAnimating(true)
    setActiveIndex((prev) => (prev + 1) % featuredPlaces.length)
    setTimeout(() => setAnimating(false), 600)
  }
  
  const prevSlide = () => {
    if (animating) return
    setAnimating(true)
    setActiveIndex((prev) => (prev - 1 + featuredPlaces.length) % featuredPlaces.length)
    setTimeout(() => setAnimating(false), 600)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(interval)
  }, [animating])
  
  // Current slide data
  const currentPlace = featuredPlaces[activeIndex]
  
  return (
    <div className="relative w-full h-screen  overflow-hidden bg-[#022C43]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity  duration-1000"
        style={{
          backgroundImage: `url(${currentPlace.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px)'
        }}
      />
      
      {/* Main gradient overlay */}
      <div className="absolute inset-0  " />
      
      {/* Decorative vertical timeline on left */}
      <div className="absolute left-12 top-0 bottom-0 flex flex-col items-center z-10">
        <div className="h-full w-px bg-white/20 relative">
          {featuredPlaces.map((_, idx) => (
            <div 
              key={idx} 
              className={`absolute w-4 h-4 rounded-full border-2 border-white/50 -left-1.5 cursor-pointer transition-all duration-300 ${
                idx === activeIndex ? 'bg-[#FFD700] scale-125 border-[#FFD700]' : 'bg-[#053F5E]'
              }`}
              style={{ top: `${25 + idx * 25}%` }}
              onClick={() => {
                if (idx === activeIndex || animating) return
                setAnimating(true)
                setActiveIndex(idx)
                setTimeout(() => setAnimating(false), 600)
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="relative h-full flex items-center z-10">
  <div className="container mx-auto px-8 max-w-screen-xll w-full ">

          <div className="flex flex-col lg:flex-row items-start ">
          <div className="flex justify-center items-center w-full h-screen  p-6   relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        className="absolute top-30 left-10 text-white text-opacity-30 text-9xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <FaMapMarkerAlt />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 right-10 text-white text-opacity-30 text-8xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <FaMapMarkerAlt />
      </motion.div>
      
      {/* Left Text Section */}
      <motion.div 
        className="w-full lg:w-5/6 text-right bg-opacity-80 p-8 rounded-lg shadow-xl bg-white/10 backdrop-blur-md"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}>
        <motion.h1 
          className="text-10xl md:text-8xl font-bold text-white mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}>
            
          وين نروح؟
        </motion.h1>
        
        <p className="text-white/80 text-xl leading-relaxed mb-8 max-w-xl ">
          اكتشف أماكن ساحرة وخفية، من الجبال الشاهقة إلى الأزقة القديمة، حيث تحمل كل زاوية قصة فريدة وتاريخًا نابضًا بالحياة.
        </p>
        
        <motion.button 
          className="bg-[#FFD700] hover:bg-[#115173] text-white px-10 py-3 rounded flex items-center gap-3 group transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}>
          <span className="text-lg">استكشف الآن</span>
          <span className="opacity-0 w-0 group-hover:opacity-100 group-hover:w-5 transition-all duration-300">→</span>
        </motion.button>
      </motion.div>
    </div>
            
            {/* Right Card Gallery */}
            <div className="w-full lg:w-7/10 relative h-[400px] mt-[100px] lg:mt-[170px] translate-y-10">
            {/* Main Featured Card */}
              <div className="absolute top-0 left-0 w-1/2 z-30">
                <div className="bg-[#053F5E]/80 backdrop-blur-sm p-2 rounded-lg">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <img 
                      src={featuredPlaces[activeIndex].image}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-120"
                      alt={featuredPlaces[activeIndex].name}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="inline-block w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-white text-lg">{featuredPlaces[activeIndex].name}</h3>
                    </div>
                    <button className="absolute top-3 right-3 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors">
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Secondary cards - only show if we have more than one place */}
              {featuredPlaces.length > 1 && (
                <>
                  {/* Second Card */}
                  <div className="absolute top-40 bottom-100 right-8 w-2/3 z-20">
                    <div className="bg-[#053F5E]/80 backdrop-blur-sm p-2 rounded-lg">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <img 
                          src={featuredPlaces[(activeIndex + 1) % featuredPlaces.length].image}
                          className="w-full h-full object-cover"
                          alt={featuredPlaces[(activeIndex + 1) % featuredPlaces.length].name}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="inline-block w-3 h-3 fill-[#FFD700] text-[#FFD700]" />
                              ))}
                            </div>
                          </div>
                          <h3 className="text-white text-base">{featuredPlaces[(activeIndex + 1) % featuredPlaces.length].name}</h3>
                        </div>
                        <button className="absolute top-2 right-2 bg-white/20 p-1.5 rounded-full hover:bg-white/40 transition-colors">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Third Card */}
                  <div className="absolute bottom-50 right-10 w-1/2 z-10">
                    <div className="bg-[#053F5E]/80 backdrop-blur-sm p-2 rounded-lg">
                      <div className="relative aspect-[1/1] overflow-hidden rounded-lg">
                        <img 
                          src={featuredPlaces[(activeIndex + 2) % featuredPlaces.length].image}
                          className="w-full h-full object-cover"
                          alt={featuredPlaces[(activeIndex + 2) % featuredPlaces.length].name}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                          <div>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="inline-block w-2 h-2 fill-[#FFD700] text-[#FFD700]" />
                            ))}
                          </div>
                          <h3 className="text-white text-sm">{featuredPlaces[(activeIndex + 2) % featuredPlaces.length].name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom navigation controls */}
      <div className="absolute bottom-6 right-8 flex items-center space-x-4 z-20">
        <div className="text-white/60 text-sm">
          {String(activeIndex + 1).padStart(2, '0')} / {String(featuredPlaces.length).padStart(2, '0')}
        </div>
        <button 
          onClick={prevSlide}
          className="bg-[#053F5E] hover:bg-[#115173] p-2 rounded-full transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        </button>
        <button 
          onClick={nextSlide}
          className="bg-[#053F5E] hover:bg-[#115173] p-2 rounded-full transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  )
}

export default HeroSection






// import { ChevronRight, MapPin, Search, Globe } from "lucide-react"
// import { useState } from "react"

// const JordanHero = () => {
//   const [sliderPosition, setSliderPosition] = useState(50)
//   const [isDragging, setIsDragging] = useState(false)

//   const handleMouseDown = () => setIsDragging(true)
//   const handleMouseUp = () => setIsDragging(false)

//   const handleMouseMove = (e) => {
//     if (isDragging) {
//       const container = e.currentTarget.getBoundingClientRect()
//       const position = ((e.clientX - container.left) / container.width) * 100
//       setSliderPosition(Math.min(Math.max(position, 10), 90))
//     }
//   }

//   const handleTouchMove = (e) => {
//     if (isDragging) {
//       const container = e.currentTarget.getBoundingClientRect()
//       const touch = e.touches[0]
//       const position = ((touch.clientX - container.left) / container.width) * 100
//       setSliderPosition(Math.min(Math.max(position, 10), 90))
//     }
//   }

//   return (
//     <div className="relative min-h-screen" dir="rtl">
//       {/* الشريط العلوي */}
//       <nav className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
//         <div className="flex items-center">
//           <h1 className="text-2xl font-bold text-white">
//             <span className="text-[#FFD700]">وين</span> نروح
//           </h1>
//         </div>
//         <div className="hidden md:flex items-center space-x-8 space-x-reverse">
//           <a href="#videos" className="text-white hover:text-[#FFD700] transition-colors">فيديوهات</a>
//           <a href="#destinations" className="text-white hover:text-[#FFD700] transition-colors">وجهات</a>
//           <a href="#bookings" className="text-white hover:text-[#FFD700] transition-colors">حجوزات</a>
//           <a href="#shop" className="text-white hover:text-[#FFD700] transition-colors">تسوق</a>
//           <button aria-label="بحث">
//             <Search className="text-white hover:text-[#FFD700]" />
//           </button>
//           <button aria-label="اللغة">
//             <Globe className="text-white hover:text-[#FFD700]" />
//           </button>
//         </div>
//         <button className="md:hidden text-white">
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
//             <line x1="3" y1="12" x2="21" y2="12" />
//             <line x1="3" y1="6" x2="21" y2="6" />
//             <line x1="3" y1="18" x2="21" y2="18" />
//           </svg>
//         </button>
//       </nav>

//       {/* شاشة الانقسام */}
//       <div
//         className="relative h-screen overflow-hidden"
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         onMouseLeave={handleMouseUp}
//         onTouchMove={handleTouchMove}
//         onTouchEnd={handleMouseUp}
//       >
//         {/* الجانب الأيسر - البتراء */}
//         <div
//           className="absolute inset-0 bg-[#053F5E]"
//           style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-30">
//             <div
//               className="h-full w-full bg-cover bg-center"
//               style={{ backgroundImage: `url('/petra.jpg')`, filter: "brightness(0.8)" }}
//             ></div>
//           </div>
//           <div className="absolute bottom-20 right-10 md:right-20 text-white max-w-md text-right z-10">
//             <h2 className="text-4xl md:text-5xl font-bold mb-2">البتراء،</h2>
//             <h3 className="text-3xl md:text-4xl font-bold mb-4">المدينة الوردية</h3>
//             <p className="text-lg opacity-90 mb-6">
//               أعجوبة أثرية منحوتة بالصخر، وموقع تراث عالمي لليونسكو منذ القرن الرابع قبل الميلاد.
//             </p>
//             <button className="px-6 py-3 bg-[#FFD700] text-[#053F5E] rounded-lg font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
//               استكشف البتراء <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>

//         {/* الجانب الأيمن - البحر الميت */}
//         <div
//           className="absolute inset-0 bg-[#115173]"
//           style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
//         >
//           <div className="absolute inset-0 bg-black bg-opacity-20">
//             <div
//               className="h-full w-full bg-cover bg-center"
//               style={{ backgroundImage: `url('/deadsea.jpg')`, filter: "brightness(0.9)" }}
//             ></div>
//           </div>
//           <div className="absolute bottom-20 left-10 md:left-20 text-white max-w-md z-10">
//             <h2 className="text-4xl md:text-5xl font-bold mb-2">البحر الميت،</h2>
//             <h3 className="text-3xl md:text-4xl font-bold mb-4">أخفض نقطة على وجه الأرض</h3>
//             <p className="text-lg opacity-90 mb-6">
//               تجربة فريدة بالطفو في مياه غنية بالمعادن بعمق 430 متر تحت مستوى سطح البحر.
//             </p>
//             <button className="px-6 py-3 bg-[#FFD700] text-[#053F5E] rounded-lg font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
//               اكتشف البحر الميت <ChevronRight size={18} />
//             </button>
//           </div>
//         </div>

//         {/* شريط التحكم */}
//         <div
//           className="absolute top-0 bottom-0 z-20 w-1 bg-white bg-opacity-70"
//           style={{ left: `${sliderPosition}%` }}
//         ></div>
//         <div
//           className="absolute top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg"
//           style={{ left: `calc(${sliderPosition}% - 24px)` }}
//           onMouseDown={handleMouseDown}
//           onTouchStart={handleMouseDown}
//         >
//           <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#053F5E" strokeWidth="2">
//               <polyline points="15 18 9 12 15 6"></polyline>
//             </svg>
//           </div>
//         </div>

//         {/* مؤشرات الوجهات */}
//         <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-20 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-[#053F5E]">
//               <MapPin size={16} />
//             </div>
//             <div className="text-right">
//               <p className="text-[#053F5E] font-medium text-sm">وادي رم</p>
//               <p className="text-xs text-[#115173]">صحراء ساحرة</p>
//             </div>
//           </div>
//         </div>

//         <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg z-20 -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-[#053F5E]">
//               <MapPin size={16} />
//             </div>
//             <div className="text-right">
//               <p className="text-[#053F5E] font-medium text-sm">جرش</p>
//               <p className="text-xs text-[#115173]">آثار رومانية</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default JordanHero
