import React from "react";
import { MapPinIcon, StarIcon, HeartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PlaceCard = ({ place }) => {
  const navigate = useNavigate();
  const handleDetails = (place) => {
    console.log("🔹 Navigating to:", `/place-details/${place._id}`);
    navigate(`/place-details/${place._id}`);
  };

  return (
    <div className=" rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
      <div className="relative">
        <img
          src={place.images}
          alt={place.images[1]}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <button className="bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition">
            <HeartIcon className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
              <img
                src={place.images[0]}
                alt={place.images[1]}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-sm font-medium mr-2">
              {place.name}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{place.name}</h3>
        <div className="flex items-center text-gray-500 mb-3">
          <MapPinIcon className="w-4 h-4 ml-1" />
          <span className="text-sm">{place.short_description}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="w-5 h-5 text-yellow-400 ml-1" />
            <span className="font-medium">{place.rating}</span>
            <span className="text-gray-500 text-sm mr-1">({place.city})</span>
          </div>

          <button
            className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
            onClick={() => handleDetails(place)}
          >
            عرض التفاصيل
          </button>
        </div>
      </div>
    </div>
  );
};
