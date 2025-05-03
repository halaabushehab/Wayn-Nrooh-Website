import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HeartIcon, MapPinIcon, StarIcon, Compass, Utensils, Landmark, Trees, Dumbbell, Music, Camera } from "lucide-react";
import bgVideo from "../../components/img/amman-vedio.mp4";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CityPage = () => {
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [city, setCity] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [isLoading, setIsLoading] = useState(true);

  const placesPerPage = 8;
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // تصنيفات الأماكن
const categories = [
  { id: "الكل", name: "الكل", icon: <Compass className="w-5 h-5" /> },
  { id: "تصوير", name: "تصوير", icon: <Camera className="w-5 h-5" /> },
  { id: "ترفيه الأطفال", name: "ترفيه الأطفال", icon: <HeartIcon className="w-5 h-5" /> },
  { id: "رياضة", name: "رياضة", icon: <Dumbbell className="w-5 h-5" /> },
  { id: "حدائق", name: "حدائق", icon: <Trees className="w-5 h-5" /> },
  { id: "مطاعم", name: "مطاعم", icon: <Utensils className="w-5 h-5" /> },
];

  // Load user from cookies once
  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          console.log("🧖 Loaded user from cookies:", parsedUser);

          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
            });

            axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
    };

    loadUserFromCookies();
  }, []);

  // Get favorites for current user
  useEffect(() => {
    if (user?.userId) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9527/api/favorites/${user.userId}`
          );
          setFavorites(response.data);
        } catch (error) {
          console.error("❌ Error fetching favorites:", error);
        }
      };
  
      fetchFavorites();
    }
  }, [user]);

  // Fetch places by city
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cityParam = params.get("city");

    if (cityParam && cityParam !== city) {
      setCity(cityParam);
      fetchPlaces(cityParam);
    }
  }, [location]);

  const fetchPlaces = async (city) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:9527/api/places/city/${city}`
      );
      const filteredPlaces = response.data.filter(
        (place) => place.status !== "معلق" && place.status !== "محذوف"
      );
      setPlaces(filteredPlaces);
      setCurrentPage(1);
    } catch (error) {
      console.error("❌ Error fetching places:", error);
      toast.error("حدث خطأ أثناء جلب الأماكن");
    } finally {
      setIsLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = async (place) => {
    if (!user?.userId) {
      alert("يرجى تسجيل الدخول لحفظ الأماكن في المفضلة.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9527/api/favorites/add`,
        {
          userId: user.userId,
          placeId: place._id,
        }
      );

      if (response.status === 200) {
        setFavorites((prevFavorites) => [...prevFavorites, place]);
        toast.success(`${place.name} تم إضافته للمفضلة!`);
      }
    } catch (error) {
      console.error("❌ Error adding to favorites:", error);
      toast.error("حدث خطأ أثناء إضافة الموقع للمفضلة.");
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (place) => {
    if (!user?.userId) return;

    try {
      const response = await axios.post(
        `http://localhost:9527/api/favorites/remove`,
        {
          userId: user.userId,
          placeId: place._id,
        }
      );

      if (response.status === 200) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((fav) => fav._id !== place._id)
        );
        toast.success(`${place.name} تم إزالته من المفضلة!`);
      }
    } catch (error) {
      console.error("❌ Error removing from favorites:", error);
      toast.error("حدث خطأ أثناء إزالة الموقع من المفضلة.");
    }
  };

  const getDisplayedPlaces = () => (showFavorites ? favorites : places);

  const handleDetails = (place) => {
    navigate(`/place-details/${place._id}`);
  };

  const getFilteredPlaces = () => {
    let filtered = getDisplayedPlaces().filter((place) =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeCategory !== "الكل") {
      filtered = filtered.filter(place => place.category === activeCategory);
    }

    return filtered;
  };

  const getPaginatedPlaces = () => {
    const filtered = getFilteredPlaces();
    const startIndex = (currentPage - 1) * placesPerPage;
    const endIndex = startIndex + placesPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const isInFavorites = (placeId) => {
    return favorites.some(fav => fav._id === placeId);
  };

  return (
    <>
      {/* Hero section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center mb-20 ">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
  
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#115173]/70 via-[#022C43]/60 to-[#022C43]/90" />
  
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-6 right-6 w-28 h-28 border-t-4 border-r-4 border-[#FFD700] rounded-tr-3xl animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-28 h-28 border-b-4 border-l-4 border-[#FFD700] rounded-bl-3xl animate-pulse"></div>
        </div>
  
        <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in-up">
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-xl tracking-wider"
            style={{ fontFamily: "'Tajawal', sans-serif" }}
          >
            مرحباً بك في مدن الأردن
          </h1>
          <p
            className="text-lg md:text-2xl text-white mb-10 leading-relaxed"
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            استعد لاكتشاف سحر الأردن! من الأزقة القديمة في عمان، إلى الطبيعة
            الخلابة في إربد، والأسواق النابضة بالحياة في الزرقاء.
          </p>
        </div>
  
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-7 h-7 text-[#FFD700]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </div>
      </section>
      {/*Hero section end */}
      
      {/* Section Title */}
      <h1 className="text-center text-3xl font-bold text-[#022C43] ">
        <span className="relative">
          الأماكن في {city}
          <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-[#FFD700]"></span>
        </span>
      </h1>

      <div className="container mx-auto px-4">
        {/* تصنيفات الأماكن */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 my-20">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(1);
                }}
                className={`flex items-center px-4 py-2 rounded-full border transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-[#115173] text-white border-[#115173]"
                    : "bg-white text-[#115173] border-[#115173] hover:bg-[#115173]/10"
                }`}
              >
                <span className="ml-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          {/* Favorites Toggle Button */}
          <button
            onClick={() => {
              if (!user?.userId) {
                alert("يرجى تسجيل الدخول لحفظ الأماكن في المفضلة.");
                return;
              }
              setShowFavorites(!showFavorites);
              setCurrentPage(1);
            }}
            className={`flex items-center px-4 py-2 rounded-full border ${
              showFavorites 
                ? "bg-red-100 text-red-600 border-red-300" 
                : "bg-white text-[#115173] border-[#115173]"
            } transition-all duration-300`}
          >
            <HeartIcon 
              className={`w-5 h-5 mr-2 ${showFavorites ? "fill-red-500" : ""}`} 
              strokeWidth={showFavorites ? 0 : 1.5} 
            />
            {showFavorites ? "عرض الكل" : "عرض المفضلة"}
          </button>
          
          {/* Search Input */}
          <div className="w-full md:w-64 relative">
            <input
              type="text"
              placeholder="ابحث عن مكان..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#115173]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
  
        <div className="py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {getPaginatedPlaces().length > 0 ? (
                  getPaginatedPlaces().map((place) => {
                    const isFavorite = isInFavorites(place._id);
                    
                    return (
                      <div
                        key={place._id}
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                      >
                        <div className="relative">
                          <div className="h-52 overflow-hidden">
                            <img
                              src={place.images[0]}
                              alt={place.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/80 to-transparent opacity-70"></div>
                          </div>
                          
                          <div className="absolute top-4 right-4 bg-[#FFD700] text-[#022C43] px-3 py-1 rounded-full text-sm font-bold shadow-md">
                            {place.best_season}
                          </div>
                          
                          <button
                            className="absolute top-4 left-4 p-2 transition-all duration-300 transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              isFavorite
                                ? removeFromFavorites(place)
                                : addToFavorites(place);
                            }}
                          >
                            <HeartIcon 
                              className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : 'text-white'}`}
                              strokeWidth={isFavorite ? 0 : 1.5}
                            />
                          </button>
                          
                          <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                            <h3 className="font-bold text-xl text-white drop-shadow-lg">
                              {place.name}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPinIcon className="w-5 h-5 ml-2 text-[#115173]" />
                            <span className="text-sm">{place.short_description}</span>
                          </div>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="inline-block bg-gray-100 text-[#115173] text-xs font-semibold px-3 py-1 rounded-full">
                              {place.city}
                            </span>
                            <span className="inline-block bg-gray-100 text-[#115173] text-xs font-semibold px-3 py-1 rounded-full">
                              {place.category}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleDetails(place)}
                            className="w-full bg-[#115173] text-white py-3 rounded-xl hover:bg-[#022C43] transition-colors duration-300 flex items-center justify-center group"
                          >
                            <span>عرض التفاصيل</span>
                            <svg className="w-5 h-5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-4 flex flex-col items-center justify-center py-16">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-center text-xl text-gray-500">
                      {showFavorites ? "لا توجد أماكن في المفضلة" : "لا توجد أماكن متاحة حالياً"}
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {getFilteredPlaces().length > placesPerPage && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      السابق
                    </button>

                    {Array.from({ length: Math.ceil(getFilteredPlaces().length / placesPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === index + 1 ? 'bg-[#115173] text-white border-[#115173]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(getFilteredPlaces().length / placesPerPage)))}
                      disabled={currentPage === Math.ceil(getFilteredPlaces().length / placesPerPage)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      التالي
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CityPage;