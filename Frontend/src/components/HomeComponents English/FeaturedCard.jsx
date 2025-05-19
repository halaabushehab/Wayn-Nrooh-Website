import React from 'react';

const FeaturedCard = ({ name, image, rating, isActive }) => {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden transition-all duration-700
                  aspect-[4/3] shadow-2xl ${isActive ? 'cursor-pointer' : ''}`}
    >
      <img src={image} alt={name} className="w-full h-full object-cover" />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {/* Content */}
      <div className="absolute bottom-0 w-full p-8">
        <div className="flex flex-col items-end">
          <h3 className="text-white text-4xl font-bold mb-3">{name}</h3>
          <div className="flex gap-1 mb-2">
            {[...Array(rating)].map((_, i) => (
              <span key={i} className="text-[#FFD700] text-2xl">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;