import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { HeartIcon, MapPinIcon, StarIcon } from "lucide-react";
import favoriteImage from "../../components/img/bookmark.png";
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

  const placesPerPage = 6;
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // 🧠 Load user from cookies once
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

  // 🧠 Get favorites for current user
  useEffect(() => {
    if (user?.userId) {
      const storedFavorites =
        JSON.parse(localStorage.getItem(`favorites_${user.userId}`)) || [];
      setFavorites(storedFavorites);
    }
  }, [user]);

  // 🔄 Fetch places by city
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cityParam = params.get("city");

    if (cityParam && cityParam !== city) {
      setCity(cityParam);
      fetchPlaces(cityParam);
    }
  }, [location]);

  const fetchPlaces = async (city) => {
    try {
      const response = await axios.get(
        `http://localhost:9527/api/places/city/${city}`
      );
      const filteredPlaces = response.data.filter(
        (place) => place.status !== "معلق" && place.status !== "محذوف"
      );
      setPlaces(filteredPlaces);
    } catch (error) {
      console.error("❌ Error fetching places:", error);
    }
  };

  // ➕ Add to favorites
  const addToFavorites = (place) => {
    if (!user?.userId) {
      alert("يرجى تسجيل الدخول لحفظ الأماكن في المفضلة.");
      return;
    }

    let userFavorites =
      JSON.parse(localStorage.getItem(`favorites_${user.userId}`)) || [];

    if (!userFavorites.some((fav) => fav._id === place._id)) {
      userFavorites.push(place);
      localStorage.setItem(
        `favorites_${user.userId}`,
        JSON.stringify(userFavorites)
      );
      setFavorites(userFavorites);
      alert(`${place.name} تم إضافته للمفضلة!`);
    } else {
      alert(`${place.name} موجود بالفعل في المفضلة.`);
    }
  };

  // ❌ Remove from favorites
  const removeFromFavorites = (place) => {
    if (!user?.userId) return;

    let userFavorites =
      JSON.parse(localStorage.getItem(`favorites_${user.userId}`)) || [];
    userFavorites = userFavorites.filter((fav) => fav._id !== place._id);
    localStorage.setItem(
      `favorites_${user.userId}`,
      JSON.stringify(userFavorites)
    );
    setFavorites(userFavorites);
    toast.success(`${place.name} تم إضافته للمفضلة!`);

  };

  const getDisplayedPlaces = () => (showFavorites ? favorites : places);

  const handleDetails = (place) => {
    navigate(`/place-details/${place._id}`);
  };

  const getFilteredPlaces = () => {
    const filtered = getDisplayedPlaces().filter((place) =>
      place.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const startIndex = (currentPage - 1) * placesPerPage;
    const endIndex = startIndex + placesPerPage;
    return filtered.slice(startIndex, endIndex);
  };


  return (
    <>
      {/* Hero section end */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-white my-15">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
  
        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#115173]/70 via-[#022C43]/60 to-[#022C43]/90" />
  
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-6 right-6 w-28 h-28 border-t-4 border-r-4 border-[#FFD700] rounded-tr-3xl animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-28 h-28 border-b-4 border-l-4 border-[#FFD700] rounded-bl-3xl animate-pulse"></div>
        </div>
  
        {/* Hero Content */}
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
  
        {/* Scroll Down Indicator */}
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
      <h1 className="text-center text-3xl font-bold text-[#022C43] mb-50">
  <span className="border-b-4 border-[#FFD700] pb-2">الأماكن في {city}</span>
</h1>

  
      <div className="container mx-auto px-4" style={{ marginTop: "80px" }}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-4">
            {/* <a
              href="#"
              onClick={() => {
                const userToken = localStorage.getItem("token");
              
                if (!userToken || !user?.userId) {
                  alert("يرجى تسجيل الدخول لحفظ الأماكن في المفضلة.");
                  return;
                }
              
                setShowFavorites(!showFavorites);
              }}
              className="cursor-pointer relative group"
            >
              <div className="absolute inset-0 bg-[#FFD700]/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <img src={favoriteImage} alt="المفضلة" className="w-12 h-12 relative z-10" />
            </a> */}
          </div>

          <div className="w-64 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-full border-2 border-gray-200 focus:border-[#115173] focus:outline-none transition-all duration-300"
              placeholder=" ابحث عن الموقع"
              id="searchInput"
              style={{ textAlign: "right" }}
            />
            <div className="absolute left-3 top-3 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
  
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getFilteredPlaces().length > 0 ? (
              getFilteredPlaces().map((place) => (
                <div
                  key={place._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                >
                  <div className="relative">
                    {/* Image with overlay gradient */}
                    <div className="h-52 overflow-hidden">
                      <img
                        src={place.gallery[0]}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/80 to-transparent opacity-70"></div>
                    </div>
                    
                    {/* Season tag */}
                    <div className="absolute top-4 right-4 bg-[#FFD700] text-[#022C43] px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      {place.best_season}
                    </div>
                    
                    {/* Favorite button */}
                    <button
                      className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/60 transition-all duration-300 transform hover:scale-110"
                      onClick={() =>
                        showFavorites
                          ? removeFromFavorites(place)
                          : addToFavorites(place)
                      }
                    >
                      <HeartIcon className="w-5 h-5 text-white" />
                    </button>
                    
                    {/* Place name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                      <h3 className="font-bold text-xl text-white drop-shadow-lg">
                        {place.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    {/* Location with icon */}
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPinIcon className="w-5 h-5 ml-2 text-[#115173]" />
                      <span className="text-sm">{place.short_description}</span>
                    </div>
                    
                    {/* City tag */}
                    <div className="mb-4">
                      <span className="inline-block bg-gray-100 text-[#115173] text-xs font-semibold px-3 py-1 rounded-full">
                        {place.city}
                      </span>
                    </div>
                    
                    {/* Action button */}
                    <button
                      onClick={() => handleDetails(place)}
                      className="w-full bg-[#115173] text-white py-3 rounded-xl hover:bg-[#022C43] transition-colors duration-300 flex items-center justify-center group"
                    >
                      <span>عرض التفاصيل</span>
    
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-center text-xl text-gray-500">
                  لا توجد أماكن متاحة حالياً
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CityPage;
