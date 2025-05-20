
import { useEffect, useRef, useState } from 'react';
 import ammanVideo from '../../components/img/AmmanHero.mp4'; // قم بتعديل المسار حسب مكان الفيديو في مشروعك
import { Compass, Search, MapPin, Star, Menu, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



export default function WacoHeroSection() {
  const featuresSectionRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const navigate = useNavigate();

  // Features section visibility with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (featuresSectionRef.current) {
      observer.observe(featuresSectionRef.current);
    }

    return () => {
      if (featuresSectionRef.current) {
        observer.unobserve(featuresSectionRef.current);
      }
    };
  }, []);

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

 return (
  <>
    {/* Hero Section */}
<section className="relative min-h-screen w-full flex flex-col items-start sm:items-center justify-start sm:justify-center overflow-hidden bg-[#022C43] text-white py-8 sm:py-16">
      {/* Background Video */}
        <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={ammanVideo} type="video/mp4" />
      </video>  

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#115173]/20 via-[#115173]/20 to-[#022C43]/20 bg-[#115173]/20"></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-4 animate-fade-in">
          <span className="text-4xl sm:text-6xl md:text-8xl inline-block transform transition hover:scale-105 duration-700 text-[#FFD700]">وين نروح؟</span>
        </h1>

        <p className="mt-2 sm:mt-3 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 animate-fade-in-delay">
          اكتشف أماكن وأنشطة مميزة في الأردن، من الأماكن الطبيعية الخلابة إلى المواقع الفريدة التي لا يعرفها الكثيرون.
          <span className="hidden md:inline"> استمتع بتجارب جديدة تمامًا واكتشف ما يخفيه لك هذا البلد الجميل.</span>
        </p>

<div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center  mt-4 sm:mt-6 animate-fade-in-delay-2 w-fit mx-auto">
          <button
            className="bg-[#022C43] hover:bg-[#115173]/80 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm md:text-base"
            onClick={() => navigate('/location')}
          >
            استكشاف وجهات جديدة 
          </button>
          <button
            className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm md:text-base mt-2 xs:mt-0"
            onClick={() => navigate('/suggest')}
          >
            اقترح مكان 
          </button>
        </div>

        {/* Features Row */}
        <div
          ref={featuresSectionRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-12 max-w-full sm:max-w-2xl md:max-w-4xl mx-auto transition-opacity duration-1000 ${
            featuresVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Feature 1: مغامرات في الطبيعة */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transform transition-all duration-500 hover:scale-105 hover:bg-[#115173]/20 hover:shadow-lg hover:shadow-[#115173]/20">
            <div className="bg-[#FFD700]/70 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-[#115173] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-0.5">المغامرات الخفية</h3>
            <p className="text-gray-300 text-xs sm:text-sm">استكشف أماكن لم تكتشف بعد، مثل وادي برتا وسيل حسبان، حيث الطبيعة والشلالات الهادئة ومسارات المشي بين الجبال.</p>
          </div>

          {/* Feature 2: التراث الثقافي */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transform transition-all duration-500 hover:scale-105 hover:bg-[#115173]/20 hover:shadow-lg hover:shadow-[#115173]/20">
            <div className="bg-[#FFD700]/70 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-[#115173] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L6 21h12l-3.75-4M12 3v14" />
              </svg>
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">المتاحف المميزة</h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              استكشف المتاحف الفريدة في الأردن مثل متحف الشمع، ومعارض الصور الفنية، وجولات ليلية مبهرة تعطيك لمحة مختلفة عن التاريخ والثقافة بطريقة تفاعلية وجذابة.
            </p>
          </div>

          {/* Feature 3: المأكولات المحلية */}
          <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transform transition-all duration-500 hover:scale-105 hover:bg-[#115173]/20 hover:shadow-lg hover:shadow-[#115173]/20 sm:col-span-2 lg:col-span-1">
            <div className="bg-[#FFD700]/70 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-[#115173] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-0.5 sm:mb-1">تجربة الطبخ الثقافي</h3>
            <p className="text-gray-300 text-xs sm:text-sm">
              عيش تجربة فريدة من نوعها في مطابخ تفاعلية حيث يمكنك تعلم تحضير أكلات بنفسك أومطابخ تذوق أطعمة من ثقافات متعددة، في أجواء غنية بالتنوع والتراث.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
  <div
  className="hidden sm:flex absolute bottom-1 left-1/2 transform -translate-x-1/2 flex-col items-center animate-bounce cursor-pointer z-20"
  onClick={() => scrollToSection('attractions')}
>
  <span className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">مرر للأسفل لاستكشاف المزيد</span>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
</div>

    </section>
  </>
);
}







// import { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import photo3 from '../../components/img/WhatsApp Image 2025-04-29 at 1.06.30 AM.jpeg';
// import photo2 from '../../components/img/img5.jpg';
// import photo1 from '../../components/img/resize.webp';
// import { nextTick } from 'process';
// import { Link } from 'react-router-dom';

// export default function HeroSection() {
//   const [currentSlide, setCurrentSlide] = useState(0);

//   const slides = [
//     "https://autonationrentacar.com/assets/uploads/King_abdullah_mosque.jpg",
//     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Z_Amman_Hejaz_Railway_Station_4.jpg/1024px-Z_Amman_Hejaz_Railway_Station_4.jpg",
//     "https://iresizer.devops.arabiaweather.com/resize?url=https://adminassets.devops.arabiaweather.com/sites/default/files/field/image/p1fdn9uioa1u9ujuq1b4p108mjk24.jpg&size=800x450&force_webp=1"
//   ];

//   // const slides = [photo1, photo2, photo3];

//   const nextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const prevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//   nextSlide();
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//    <div dir="rtl" className="relative h-screen w-full overflow-hidden">
//   {/* Slides */}
//   {slides.map((slide, index) => (
//     <div
//       key={index}
//       className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
//         index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
//       }`}
//     >
//       {/* Image */}
//       <img
//         src={slide} // تأكد من المسار الصحيح للصورة
//         alt={`Slide ${index + 1}`}
//         className="w-full h-full object-cover"
//         style={{ objectFit: "cover" }}
//         onError={(e) => {
//           e.target.onerror = null;
//           e.target.src = "https://via.placeholder.com/1600x900"; // صورة بديلة لو فشل التحميل
//         }}
//       />
      
//       {/* Optional: light black overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none" />
//     </div>
//   ))}

//   {/* Content */}
//   <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
//     <h1
//       className="font-light mb-4 drop-shadow-lg text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
//       style={{
//         fontFamily: "Tajawal, sans-serif",
//         lineHeight: "1.2",
//       }}
//     >
//       وين نروح
//     </h1>

//     <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-lg mx-auto drop-shadow-md">
//       حاسس نفسك محتار؟ خلّينا نرشحلك أحلى أماكن بالأردن تناسب مزاجك!
//     </p>

//     <div className="flex gap-4 justify-center flex-wrap">
//       <Link to="/places?city=عمان">
//         <button className="bg-[#FFD700] hover:bg-[#e0b200] text-[#022C43] font-medium py-3 px-8 rounded-md transition-colors duration-300">
//           يلاّ نكتشف
//         </button>
//       </Link>

//       <Link to="/suggest">
//         <button className="bg-white hover:bg-gray-200 text-[#022C43] font-medium py-3 px-8 rounded-md transition-colors duration-300">
//           اقترح مكان
//         </button>
//       </Link>
//     </div>
//   </div>

//   {/* Navigation Arrows */}
//   <button
//     onClick={prevSlide}
//     className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-white/25 p-4 rounded-full z-20 transition"
//   >
//     <ChevronLeft size={40} className="text-white" />
//   </button>

//   <button
//     onClick={nextSlide}
//     className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-white/25 p-4 rounded-full z-20 transition"
//   >
//     <ChevronRight size={40} className="text-white" />
//   </button>
// </div>

//   );
// }
