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
    { id: 1, title: "Restaurants", description: "Explore the best restaurants...", date: "April 15, 2025", categoryId: "Restaurants", imageUrl: pho_1 },
    { id: 2, title: "Photography", description: "Discover the most beautiful spots...", date: "April 20, 2025", categoryId: "Photography", imageUrl: pho_2 },
    { id: 3, title: "Sports", description: "Explore the top sports clubs...", date: "April 25, 2025", categoryId: "Sports", imageUrl: pho_3 },
    { id: 4, title: "History & Heritage", description: "Discover the beauty of history...", date: "April 30, 2025", categoryId: "Museums", imageUrl: pho_4 }
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
            Our Categories
          </h2>
          <div className="h-1  mt-2 w-24 mr-130" style={{ backgroundColor: COLORS.gold }} />
          <p className="mt-6 text-xl text-center pr-12" style={{ color: COLORS.lightBlue }}>
            Explore the various categories available on our site
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
          showPopup={isPopupOpen}  // added this line
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
      className={`h-80 rounded-lg overflow-hidden relative transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{
        boxShadow: isHovered
          ? '0 22px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.1)'
          : '0 10px 30px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer'
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
              className="text-2xl font-bold text-right mb-2 transition-all duration-300" 
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
            Explore More
          </button>
        </div>
      </div>
    </div>
  );
}
