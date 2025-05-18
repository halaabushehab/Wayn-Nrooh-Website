import React, { useState, useEffect } from 'react';
import { 
  SunIcon, 
  CloudSnowIcon, 
  LeafIcon, 
  FlowerIcon,
  MapPinIcon, 
  StarIcon, 
  HeartIcon,
  ChevronRightIcon,
  Loader2Icon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const SeasonalSection = () => {

  const navigate = useNavigate();
  const handleDetails = (place) => {
    console.log("🔹 Navigating to:", `/place-details/${place._id}`);
    navigate(`/place-details/${place._id}`);
  };



  const [activeSeason, setActiveSeason] = useState('صيف');
  const [likedPlaces, setLikedPlaces] = useState({});
  const [seasonalPlaces, setSeasonalPlaces] = useState({
    'صيف': [],
    'شتاء': [],
    'خريف': [],
    'ربيع': []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
 const seasons = [
    {
      id: "صيف",
      name: "الصيف",
      icon: <SunIcon className="w-8 h-5" />,
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50 ",
      seasonImage:
        "https://i.pinimg.com/736x/ad/2c/c5/ad2cc5b5fef198950de4dfb3c79768b1.jpg",
    },
    {
      id: "شتاء",
      name: "الشتاء",
      icon: <CloudSnowIcon className="w-5 h-5" />,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      seasonImage:
        "https://i.pinimg.com/736x/c3/30/dc/c330dccc327114fc3ea0019bc57d4c7e.jpg",
    },
    {
      id: "خريف",
      name: "الخريف",
      icon: <LeafIcon className="w-5 h-5" />,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      seasonImage:
        "https://i.pinimg.com/736x/ed/bb/c8/edbbc8083f0f91219be23d8b4d58dc0e.jpg",
    },
    {
      id: "ربيع",
      name: "الربيع",
      icon: <FlowerIcon className="w-5 h-5" />,
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      seasonImage:
        "https://i.pinimg.com/736x/79/47/92/794792e7810b3a00ed4e5e218c6a4b7d.jpg",
    },
  ];

  const activeSeasonObj = seasons.find((season) => season.id === activeSeason) || seasons[0];
  const activePlaces = seasonalPlaces[activeSeason] || [];
  console.log("Active Season:", activeSeason); // تحقق من القيمة
  console.log("Seasonal Places:", seasonalPlaces); // تحقق من شكل البيانات

  const seasonMap = {
    'صيف': 'summer',
    'شتاء': 'winter',
    'خريف': 'autumn',
    'ربيع': 'spring'
  };

  const fetchSeasonalPlaces = async () => {
    
    try {
      const seasonInArabic = activeSeason;
      setLoading(true);
      const response = await fetch(`http://localhost:9527/api/places/season/${activeSeason}`);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Error: ${errorDetails.message || 'Unknown error'}`);
      }
      const data = await response.json();
      console.log('Fetched Data:', data); // تحقق من البيانات
      setSeasonalPlaces(prev => {
        const updatedSeasonalPlaces = {
          ...prev,
          [activeSeason]: data,
        };
        console.log('Updated Seasonal Places:', updatedSeasonalPlaces); // Check if data is set correctly
        return updatedSeasonalPlaces;
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message); // تحديث واجهة المستخدم برسالة الخطأ
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasonalPlaces();
    console.log("Active Season:", activeSeason); // This logs the active season
  }, [activeSeason]);

  const toggleLike = (placeId) => {
    setLikedPlaces(prev => ({
      ...prev,
      [placeId]: !prev[placeId]
    }));
  };

return (
  <div className={`${activeSeasonObj.bgColor}`}>
    {/* Hero Section for Seasonal Destinations */}
    <div
      className="relative h-80 sm:h-96 md:h-110 w-full flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://media.istockphoto.com/id/502419865/photo/four-season-tree.jpg?s=2048x2048&w=is&k=20&c=_ljRCc6Pte_7lQyMPljaK7ca3YcV83JuDhbnyBaIT3U=')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-2xl bg-black/30 rounded-xl shadow-md mx-4 p-4 sm:p-6">
        <div className="mb-4 transform -rotate-2">
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-xl text-white">الوجهات الموسمية</h3>
          <div className="h-1 w-16 sm:w-20 bg-amber-400 mx-auto rounded-full"></div>
        </div>
        <p className="text-base sm:text-lg text-amber-100 leading-relaxed font-medium">
          استكشف أجمل الوجهات حسب كل موسم! استمتع بالثلوج شتاءً، وازهار الربيع، وشواطئ الصيف، وألوان الخريف الساحرة في مغامرات لا تُنسى.
        </p>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent"></div>
    </div>

    <section className={`${activeSeasonObj.bgColor} transition-colors duration-500`}>
      <div className="container mx-auto px-4 sm:px-6 mb-12">
        {/* Seasons Selector */}
        <div className="flex justify-center mb-12 md:mb-16 my-12 md:my-20">
          <div className="inline-flex bg-white p-1 rounded-full shadow-lg border border-gray-100 overflow-x-auto">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeason(season.id)}
                className={`flex flex-col items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all ${
                  activeSeason === season.id
                    ? `bg-gradient-to-r ${season.color} text-white shadow-md`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mb-1 text-sm sm:text-base">{season.icon}</span>
                <span className="font-medium text-xs sm:text-sm">{season.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Season Highlight */}
        <div className="mb-12 md:mb-20 bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-stretch">
            {/* Text Side */}
            <div className="md:w-1/2 p-6 sm:p-8 md:p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className={`bg-gradient-to-r ${activeSeasonObj.color} p-2 sm:p-3 rounded-lg`}>
                  {React.cloneElement(activeSeasonObj.icon, {
                    className: "w-8 h-8 sm:w-10 sm:h-10 text-white",
                  })}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mr-3 sm:mr-4">
                  {activeSeasonObj.name} في الأردن
                </h3>
              </div>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                {activeSeason === "صيف" &&
                  "عِش أجواء الصيف المنعشة في أحضان الطبيعة الأردنية، واستمتع بأيام مشمسة مثالية للأنشطة الخارجية والمغامرات الممتعة في ربوع البلاد"}
                {activeSeason === "شتاء" &&
                  "استمتع بدفء الأجواء الأردنية في فصل الشتاء، بين سحر الأمطار وهدوء الطبيعة، واستكشف الوجهات الهادئة والمريحة خلال هذا الفصل المميز"}
                {activeSeason === "خريف" &&
                  "انغمس في سكون الخريف وألوانه الساحرة التي تزين الطبيعة الأردنية، حيث الأجواء المعتدلة والمثالية للتنزه والاسترخاء بين ربوع الوطن"}
                {activeSeason === "ربيع" &&
                  "استقبل الربيع بتفتح الأزهار وجمال الطبيعة في أبهى حلّتها، واكتشف سحر الأردن في موسم التجدد والنسمات العليلة"}
              </p>
              <div className="flex items-center text-gray-500 text-sm sm:text-base">
                <MapPinIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span>أفضل الأماكن للزيارة في هذا الموسم</span>
                <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              </div>
            </div>

            {/* Image Side */}
            <div className="md:w-1/2 h-64 sm:h-80 md:h-[400px]">
              <img
                src={activeSeasonObj.seasonImage}
                alt={activeSeasonObj.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 md:py-20">
            <Loader2Icon className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
            <p>حدث خطأ أثناء جلب البيانات: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-700 transition"
            >
              حاول مرة أخرى
            </button>
          </div>
        )}

        {/* Places Grid */}
        {!loading && !error && activePlaces.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {activePlaces.map((place) => (
              <div
                key={place._id}
                className="bg-white w-full max-w-xs sm:w-auto sm:max-w-none rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
              >
                <div className="relative">
                  {/* Image with overlay gradient */}
                  <div className="h-48 sm:h-52 overflow-hidden">
                    <img
                      src={place.images?.[0] || 'https://via.placeholder.com/500'}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/80 to-transparent opacity-70"></div>
                  </div>
                  
                  {/* Season tag */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#FFD700] text-[#022C43] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-md">
                    {place.best_season || 'الربيع والخريف'}
                  </div>
                  
                  {/* Favorite button */}
                  <button
                    className={`absolute top-3 sm:top-4 left-3 sm:left-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      likedPlaces[place._id]
                        ? 'animate-heartbeat'
                        : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(place._id);
                    }}
                  >
                    <HeartIcon 
                      className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${
                        likedPlaces[place._id] ? 'text-red-500 fill-red-500' : 'text-white'
                      }`} 
                    />
                  </button>

                  {/* Place name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-5 py-3 sm:py-4">
                    <h3 className="font-bold text-lg sm:text-xl text-white drop-shadow-lg">
                      {place.name}
                    </h3>
                  </div>
                </div>
                
                <div className="p-4 sm:p-5">
                  {/* Location with icon */}
                  <div className="flex items-center text-gray-600 mb-3 sm:mb-4">
                    <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 text-[#115173]" />
                    <span className="text-xs sm:text-sm">{place.short_description}</span>
                  </div>
                  
                  {/* City tag */}
                  <div className="mb-3 sm:mb-4">
                    <span className="inline-block bg-gray-100 text-[#115173] text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
                      {place.city || 'عمان'}
                    </span>
                  </div>
                  
                  {/* Action button */}
                  <button
                    onClick={() => handleDetails(place)}
                    className="w-full bg-[#115173] text-white py-2 sm:py-3 rounded-xl hover:bg-[#022C43] transition-colors duration-300 flex items-center justify-center group"
                  >
                    <span className="text-sm sm:text-base">عرض التفاصيل</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && activePlaces.length === 0 && (
          <div className="text-center text-gray-500 py-8">لا توجد أماكن حالياً في هذا الموسم</div>
        )}
      </div>
    </section>
  </div>
);
};

export default SeasonalSection;
