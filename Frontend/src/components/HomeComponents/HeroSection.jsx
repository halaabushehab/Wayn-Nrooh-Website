import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import photo3 from '../../components/img/WhatsApp Image 2025-04-29 at 1.06.30 AM.jpeg';
import photo2 from '../../components/img/img5.jpg';
import photo1 from '../../components/img/resize.webp';
import { nextTick } from 'process';

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // const slides = [
  //   "https://i.pinimg.com/736x/fb/65/c4/fb65c45d0e7274a7d18b8079dca7bf33.jpg",
  //   "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Z_Amman_Hejaz_Railway_Station_4.jpg/1024px-Z_Amman_Hejaz_Railway_Station_4.jpg",
  //   "https://images.pexels.com/photos/2673300/pexels-photo-2673300.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  // ];

  const slides = [photo1, photo2, photo3];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
  nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div dir="rtl" className="relative h-screen w-full overflow-hidden">
  {/* Slides */}
  {slides.map((slide, index) => (
    <div
      key={index}
      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
        index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Image directly */}
      <img
        src={slide}  // هنا يجب التأكد من المسار أو الرابط الصحيح للصورة
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
        style={{ objectFit: "cover" }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/1600x900"; // صورة بديلة لو فشل التحميل
        }}
      />
      
      {/* Optional: light black overlay */}
      {/* حط الغلاف لو بدك تأثير خفيف على الصورة */}
      <div className="absolute inset-0 bg-black bg-opacity-10 pointer-events-none" />
    </div>
    
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10 px-4">
  <h1
    className="font-light mb-4 drop-shadow-lg"
    style={{
      fontFamily: "Tajawal, sans-serif",
      fontSize: "120px",
      lineHeight: "1.2"
    }}
  >
    وين نروح
  </h1>

  <p className="text-xl md:text-2xl mb-8 max-w-lg mx-auto drop-shadow-md">
    حاسس نفسك محتار؟ خلّينا نرشحلك أحلى أماكن بالأردن تناسب مزاجك!
  </p>

  <div className="flex gap-4 justify-center">
    <button className="bg-[#FFD700]    hover:bg-[#e0b200] text-[#022C43] font-medium py-3 px-8 rounded-md transition-colors duration-300">
      يلاّ نكتشف
    </button>
    <button className="bg-white hover:bg-gray-200 text-[#022C43] font-medium py-3 px-8 rounded-md transition-colors duration-300">
      اقترح مكان 
    </button>
  </div>
</div>


      {/* Navigation Arrows */}
      <button
  onClick={prevSlide}
  className="absolute left-4 top-1/2 transform -translate-y-1/2 
           hover:bg-white/25 
             p-4 rounded-full z-20 transition"
>
  <ChevronLeft size={40} className="text-white" />
</button>

<button
  onClick={nextSlide}
  className="absolute right-4 top-1/2 transform -translate-y-1/2 
             hover:bg-white/25
             p-4 rounded-full z-20 transition"
>
  <ChevronRight size={40} className="text-white" />
</button>

    </div>
  );
}




