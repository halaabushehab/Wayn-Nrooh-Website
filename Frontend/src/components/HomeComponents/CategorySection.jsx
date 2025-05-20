

import { useState, useEffect } from 'react';
import pho_1 from '../../components/img/Cate1.png';
import pho_2 from '../../components/img/15d5bf42942e95ce5dc4a91c90334481.jpg';
import pho_3 from '../../components/img/Cate3.png';
import pho_4 from '../../components/img/Cate6 (2).png';
import ExplorePopup from "../../components/HomeComponents/ExplorePopup";

const COLORS = {
  gold: "#D4AF37",
  lightBlue: "#115173",
  darkBlue: "#011627",
  accent: "#F8F0E3"
};

export default function LuxuryCategorySection() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isTitleVisible, setIsTitleVisible] = useState(false);

const categories = [
  {
    id: 1,
    title: "مطاعم",
    description: "استكشف أفضل المطاعم في الأردن، من الأطباق المحلية التقليدية مثل المنسف والمقلوبة، إلى المطاعم العالمية ذات التصاميم الحديثة. دلل حواسك بنكهات فريدة وأجواء ساحرة تناسب جميع الأذواق والمناسبات.",
    date: "١٥ أبريل ٢٠٢٥",
    categoryId: "مطاعم",
    imageUrl: pho_1,
  },
  {
    id: 2,
    title: "تصوير",
    description: "اكتشف أجمل الأماكن لالتقاط الصور الساحرة، من مناظر الغروب في البحر الميت، إلى الأزقة القديمة في السلط. وجهتك المثالية لكل مصور يبحث عن الإلهام والزوايا الفريدة التي تروي قصة لا تُنسى.",
    date: "٢٠ أبريل ٢٠٢٥",
    categoryId: "تصوير",
    imageUrl: pho_2,
  },
  {
    id: 3,
    title: "رياضات",
    description: "استكشف أفضل الأندية والمراكز الرياضية التي تقدم تجارب متنوعة مثل التسلق، التجديف، ركوب الدراجات، واللياقة البدنية. عش لحظات من التحدي والنشاط وسط طبيعة الأردن الخلابة أو في منشآت حديثة ومتطورة.",
    date: "٢٥ أبريل ٢٠٢٥",
    categoryId: "رياضة",
    imageUrl: pho_3,
  },
  {
    id: 4,
    title: "تاريخ وتراث",
    description: "اكتشف جمال التاريخ الأردني العريق من خلال زيارة المتاحف والمواقع الأثرية مثل جرش والبتراء، وتعرف على القصص التي صنعت هوية هذا البلد الغني بثقافته وتنوع حضاراته. تجربة تجمع بين التعلم والانبهار.",
    date: "٣٠ أبريل ٢٠٢٥",
    categoryId: "متاحف",
    imageUrl: pho_4,
  }
];


  const openPopup = (category) => {
    setActiveCategory(category);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setActiveCategory(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsTitleVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="w-full  relative overflow-hidden" 

    >
      {/* Background decorative elements */}
      <div 
        className="absolute top-0 left-1/4 w-64 h-64 rounded-full filter blur-3xl opacity-10" 
        style={{ backgroundColor: COLORS.gold }} 
      />
      <div 
        className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full filter blur-3xl opacity-5" 
        style={{ backgroundColor: COLORS.lightBlue }} 
      />

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Section header */}
        <div className={`text-center mb-16 transition-all duration-1000 transform ${
          isTitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-4xl font-bold text-center" style={{ color: COLORS.darkBlue }}>
            فئات موقعنا
          </h2>
          <div className="h-1  mt-2 w-24 mr-130" style={{ backgroundColor: COLORS.gold }} />
          <p className="mt-6 text-xl text-center pr-12" style={{ color: COLORS.lightBlue }}>
            استكشف مختلف الفئات المتاحة في موقعنا
          </p>
        </div>

        {/* Category cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <ElegantCategoryCard
              key={category.id}
              category={category}
              index={index}
              onOpenPopup={() => openPopup(category)}
            />
          ))}
        </div>
      </div>

      {/* Popup modal */}
{isPopupOpen && activeCategory && (
  <ExplorePopup
    goldColor={COLORS.gold}
    darkBlueColor={COLORS.darkBlue}
    activeCategory={activeCategory}
    showPopup={isPopupOpen}  // أضف هذه السطر
    onClose={closePopup}
  />
)}
    </div>
  );
}

function ElegantCategoryCard({ category, index, onOpenPopup }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400 + index * 200);
    return () => clearTimeout(timer);
  }, [index]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenPopup();
  };

  return (
    <div
      className={`h-[400px] rounded-lg overflow-hidden relative transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        boxShadow: isHovered
          ? '0 22px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)'
          : '0 10px 30px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
        minHeight: '400px' // إضافة حد أدنى للارتفاع
      }}
    >
      {/* Hover overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(1, 22, 39, 0.2), rgba(1, 22, 39, 0.6))',
          zIndex: 2
        }}
      />

      {/* Top border animation */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
        style={{
          backgroundColor: COLORS.gold,
          width: isHovered ? '100%' : '0%',
          opacity: 0.8,
          zIndex: 10
        }}
      />

      {/* Image container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img 
          src={category.imageUrl} 
          alt={category.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `linear-gradient(to top, ${COLORS.darkBlue}CC, ${COLORS.darkBlue}00 60%)`,
            opacity: isHovered ? 1 : 0.8,
            zIndex: 1
          }}
        />
      </div>

      {/* Gold border effect */}
      <div
        className="absolute inset-0 rounded-lg transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${COLORS.gold}`,
          opacity: isHovered ? 0.3 : 0,
          zIndex: 3
        }}
      />

      {/* Content container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
        <div 
          className="w-8 h-0.5 mb-3 transition-all duration-500" 
          style={{
            backgroundColor: COLORS.gold,
            width: isHovered ? '3rem' : '2rem',
            opacity: isHovered ? 1 : 0.7
          }} 
        />

        <div className="flex justify-between items-end">
          <div className="flex-grow">
            <h3 
              className="text-xl font-bold text-right mb-2 transition-all duration-300" 
              style={{
                color: 'white',
                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              {category.title}
            </h3>
            <div 
              className="overflow-hidden transition-all duration-500" 
              style={{
                maxHeight: isHovered ? '80px' : '0',
                opacity: isHovered ? 1 : 0
              }}
            >
              <p className="text-right text-sm" style={{ color: COLORS.accent }}>
                {category.description}
              </p>
            </div>
          </div>

          <div 
            className="ml-4 mb-1 transition-all duration-500" 
            style={{
              opacity: isHovered ? 0 : 0.9,
              transform: isHovered ? 'translateX(20px)' : 'translateX(0)'
            }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.gold, color: COLORS.darkBlue }}
            >
              <span className="text-xs font-bold">+</span>
            </div>
          </div>
        </div>

        <div 
          className="flex justify-between items-center mt-4 transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)'
          }}
        >
          <div className="text-sm text-right" style={{ color: COLORS.gold }}>
            {category.date}
          </div>

          <button
            className="py-1 px-3 text-xs rounded transition-all duration-300 hover:bg-opacity-20 hover:bg-white"
            style={{ 
              backgroundColor: 'transparent', 
              border: `1px solid ${COLORS.gold}`, 
              color: COLORS.gold 
            }}
            onClick={handleClick}
          >
            استكشف المزيد
          </button>
        </div>
      </div>
    </div>
  );
}