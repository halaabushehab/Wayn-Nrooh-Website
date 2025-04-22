import { Link } from "react-router-dom";
import { MapPinIcon, SparklesIcon, StarIcon } from 'lucide-react';

export default function SuggestPlaceBox() {
  return (
    <div className="relative w-[70%] mx-auto mt-10 group">
      {/* Animated decorative elements */}
      <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#FFD700] opacity-30 group-hover:scale-150 transition-all duration-700"></div>
      <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-[#115173] opacity-20 group-hover:scale-150 transition-all duration-700"></div>
      
      {/* Main card with hover effect */}
      <div className="relative bg-whit border-[#115173] rounded-2xl p-6 shadow-lg transform group-hover:-translate-y-2 transition-all duration-300 overflow-hidden z-10">
        {/* Diagonal accent line */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FFD700] rotate-45 opacity-20"></div>
        
        <div className="flex flex-col items-center">
          {/* Icon with animation */}
          <div className="w-16 h-16 bg-[#022C43] rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-all">
            <MapPinIcon size={28} className="text-[#FFD700]" />
          </div>
          
          <h2 className="text-[#022C43] text-2xl font-bold mb-3 text-center flex items-center gap-2">
            <SparklesIcon size={18} className="text-[#FFD700]" />
            هل زرت مكانًا مميزًا؟
            <SparklesIcon size={18} className="text-[#FFD700]" />
          </h2>
          
          <p className="text-[#115173] text-center mb-6 leading-relaxed">
            شاركنا تجربتك واقترح مكانًا رائعًا ليستمتع به الآخرون
            <br />في "وين نروح"
          </p>
          
          {/* Animated button */}
          <Link
            to="/suggest"
            className="relative bg-[#FFD700] text-[#022C43] font-bold px-8 py-3 rounded-xl overflow-hidden group-hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <span className="relative z-10">اقترح مكان</span>
            <StarIcon size={18} className="relative z-10 group-hover:rotate-45 transition-all" />
            <div className="absolute inset-0 w-0 bg-[#022C43] group-hover:w-full transition-all duration-300"></div>
            <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 text-[#FFD700] flex items-center justify-center transition-opacity duration-300 z-20">
              اقترح مكان
            </span>
          </Link>
        </div>
        
        {/* Small decorative corner */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#115173] rounded-tl-xl"></div>
      </div>
    </div>
  );
}