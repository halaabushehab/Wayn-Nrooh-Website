import React from 'react'
import { PercentIcon, TagIcon, SparklesIcon,Banknote   } from 'lucide-react'
import { Link } from "react-router-dom";

export function Offer() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-[1200px] h-[350px] max-w-6xl rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row-reverse">
        {/* Right section - Content on the left now */}
        <div className="bg-[#0a2642] p-6 md:p-8 text-right md:w-1/2 flex flex-col justify-center relative">
  <Banknote className="absolute top-4 left-4 w-6 h-6 text-yellow-400 animate-pulse" />
  <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
    الأعلى تقييماً هذا الموسم 
  </h2>
  <p className="text-gray-300 text-sm md:text-base mb-6">
    اكتشف أفضل وجهة نالت إعجاب الزوار بتقييمات عالية. مكان يجمع بين الجودة،
    المتعة، والتجربة المميزة. لا تفوت الفرصة!
  </p>
  <Link to="/places?city=عمان">
  <button className="bg-yellow-400 hover:bg-yellow-500 text-[#0a2642] font-bold py-2 px-6 rounded-full w-fit self-end flex items-center gap-2">
    <TagIcon className="w-4 h-4" />
    استعرض جميع وجهاتنا المميزة
  </button>
</Link>
</div>


        {/* Left section - Image on the right now */}
        <div className="md:w-1/2 relative">
          <img
            src="https://images.pexels.com/photos/18717646/pexels-photo-18717646/free-photo-of-amman-cityscape-with-roman-theatre.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
            alt="Amman cityscape"
            className="w-full h-full object-cover"
          />
          {/* Discount badge */}
          <div className="absolute top-4 right-4 bg-white rounded-lg p-3 text-right shadow-md">
            <div className="text-[#0a2642] font-bold text-lg flex items-center justify-end gap-2">
              <span>خصم ١٥٪</span>
              <PercentIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-gray-500 text-xs">
              عند الدفع قبل نهاية الشهر
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Offer
