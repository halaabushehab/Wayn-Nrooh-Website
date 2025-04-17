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
      icon: <SunIcon className="w-5 h-5" />,
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
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
      const response = await fetch(`http://localhost:9527/places/season/${activeSeason}`);
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
    <section className={`py-16 ${activeSeasonObj.bgColor} transition-colors duration-500 my-20`}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">السياحة الموسمية في الأردن</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            اكتشف أجمل الوجهات السياحية في الأردن التي تتناسب مع كل فصل من فصول السنة. اختر الموسم وشاهد أفضل الأماكن للزيارة
          </p>
        </div>

        {/* Seasons Selector */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white p-1 rounded-full shadow-lg border border-gray-100">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeason(season.id)}
                className={`flex flex-col items-center px-6 py-3 rounded-full transition-all ${
                  activeSeason === season.id
                    ? `bg-gradient-to-r ${season.color} text-white shadow-md`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mb-1">{season.icon}</span>
                <span className="font-medium text-sm">{season.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Season Highlight */}
        <div className="mb-20 bg-white rounded-3xl shadow-xl overflow-hidden max-w-7xl mx-auto">
  <div className="flex flex-col md:flex-row items-center md:items-stretch">
    {/* Text Side */}
    <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
      <div className="flex items-center mb-6">
        <div className={`bg-gradient-to-r ${activeSeasonObj.color} p-3 rounded-lg`}>
          {React.cloneElement(activeSeasonObj.icon, {
            className: "w-10 h-10 text-white",
          })}
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mr-4">
          {activeSeasonObj.name} في الأردن
        </h3>
      </div>
      <p className="text-gray-600 text-lg leading-relaxed mb-8">
        {activeSeason === "صيف" &&
          "عِش أجواء الصيف المنعشة في أحضان الطبيعة الأردنية، واستمتع بأيام مشمسة مثالية للأنشطة الخارجية والمغامرات الممتعة في ربوع البلاد"}
        {activeSeason === "شتاء" &&
          "استمتع بدفء الأجواء الأردنية في فصل الشتاء، بين سحر الأمطار وهدوء الطبيعة، واستكشف الوجهات الهادئة والمريحة خلال هذا الفصل المميز"}
        {activeSeason === "خريف" &&
          "انغمس في سكون الخريف وألوانه الساحرة التي تزين الطبيعة الأردنية، حيث الأجواء المعتدلة والمثالية للتنزه والاسترخاء بين ربوع الوطن"}
        {activeSeason === "ربيع" &&
          "استقبل الربيع بتفتح الأزهار وجمال الطبيعة في أبهى حلّتها، واكتشف سحر الأردن في موسم التجدد والنسمات العليلة"}
      </p>
      <div className="flex items-center text-gray-500">
        <MapPinIcon className="w-6 h-6 mr-2" />
        <span className="text-base">أفضل الأماكن للزيارة في هذا الموسم</span>
        <ChevronRightIcon className="w-5 h-5 mr-1" />
      </div>
    </div>

    {/* Image Side */}
    <div className="md:w-1/2 h-[400px]">
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
          <div className="flex justify-center items-center py-20">
            <Loader2Icon className="w-12 h-12 text-indigo-500 animate-spin" />
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
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {activePlaces.map((place) => (
    <div key={place._id} className="rounded-2xl overflow-hidden shadow-md bg-white">
      {/* الصورة */}
      <div className="relative h-48">
        <img
          src={place.images?.[0] || 'https://via.placeholder.com/500'}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        {/* زر الإعجاب */}
        <button
          onClick={() => toggleLike(place._id)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition ${
            likedPlaces[place._id]
              ? 'bg-rose-500/90 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
          }`}
        >
          <HeartIcon className="w-5 h-5" fill={likedPlaces[place._id] ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* التفاصيل */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{place.name}</h3>
        <div className="text-sm text-gray-600 flex items-center gap-1 mb-1">
          <MapPinIcon className="w-4 h-4 text-gray-500" />
          <span>{place.description}</span>
        </div>
        <div className="text-sm text-gray-500 mb-2">{place.city || 'عمان'}</div>

        {/* الموسم والرابط */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-yellow-600 font-medium">
            <StarIcon className="w-4 h-4" />
            <span>{place.season || 'الربيع والخريف'}</span>
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
  ))}
</div>

)}

{!loading && !error && activePlaces.length === 0 && (
  <div className="text-center text-gray-500">لا توجد أماكن حالياً في هذا الموسم</div>
)}


      </div>
    </section>
  );
};

export default SeasonalSection;
