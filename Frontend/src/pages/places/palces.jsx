import { HeartIcon, MapPinIcon, StarIcon } from "lucide-react";
import seasonsImage from "../../components/img/4-seasons.png"; // تأكد من المستوى الصحيح
import { Link } from "react-router-dom";
import favoriteImage from "../../components/img/bookmark.png"; // تأكد من المستوى الصحيح
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import bgVideo from "../../components/img/amman-vedio.mp4"; // قم بتعديل المسار حسب مكان تخزين الفيديو لديك

const CityPage = () => {
  const user = JSON.parse(localStorage.getItem("user")); // افترض أن المستخدم تم تخزينه هنا بعد تسجيل الدخول
  const [places, setPlaces] = useState([]);
  const [city, setCity] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const storedUserId = localStorage.getItem("userId");
  console.log("User ID:", storedUserId);
  const userEmail = user?.email || ""; // تصحيح التسمية
  console.log("User Email:", userEmail);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // تعريف currentPage
  const [searchTerm, setSearchTerm] = useState("");
  const placesPerPage = 6;

  const [userFavorites, setUserFavorites] = useState([]);

  useEffect(() => {
    if (userEmail) {
      const storedFavorites =
        JSON.parse(localStorage.getItem(`favorites_${userEmail}`)) || [];
      setUserFavorites(storedFavorites);
    }
  }, [userEmail]);

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
        `http://localhost:9527/places/city/${city}`
      ); // تصفية الأماكن حسب status
      const filteredPlaces = response.data.filter(
        (place) => place.status !== "معلق" && place.status !== "محذوف"
      );
      setPlaces(filteredPlaces); // تحديث الأماكن المعروضة
    } catch (error) {
      console.error("❌ Error fetching places:", error);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (storedUserId) setUserId(storedUserId);
    if (storedUsername) setUsername(storedUsername);

    console.log("User ID:", storedUserId);
    console.log("Username:", storedUsername);
  }, []);

  const addToFavorites = (place) => {
    if (!userId) {
      alert("يرجى تسجيل الدخول لحفظ الأماكن في المفضلة.");
      return;
    }

    let userFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];

    if (!userFavorites.some((fav) => fav._id === place._id)) {
      userFavorites.push(place);
      localStorage.setItem(
        `favorites_${userId}`,
        JSON.stringify(userFavorites)
      );

      // تحديث الحالة
      setFavorites(userFavorites);

      alert(`${place.name} تم إضافته للمفضلة!`);
    } else {
      alert(`${place.name} موجود بالفعل في المفضلة.`);
    }
  };

  const removeFromFavorites = (place) => {
    if (!userId) return;

    let userFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
    userFavorites = userFavorites.filter((fav) => fav._id !== place._id);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(userFavorites));

    // تحديث الحالة
    setFavorites(userFavorites);

    alert(`${place.name} تم إزالته من المفضلة.`);
  };
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (userId) {
      const storedFavorites =
        JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
      setFavorites(storedFavorites);
    }
  }, [userId]);

  const getDisplayedPlaces = () => {
    return showFavorites ? favorites : places;
  };

  const handleDetails = (place) => {
    console.log("🔹 Navigating to:", `/place-details/${place._id}`);
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
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-[#FFFFFF] my-15">
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
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#053F5E]/70 via-[#021E30]/60 to-[#021E30]/90" />

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-6 right-6 w-28 h-28 border-t-4 border-r-4 border-[#FFD700] rounded-tr-3xl animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-28 h-28 border-b-4 border-l-4 border-[#FFD700] rounded-bl-3xl animate-pulse"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in-up">
          <h1
            className="text-5xl md:text-12xl font-extrabold mb-4 text-white drop-shadow-xl tracking-wider"
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* <button className="px-8 py-3 bg-[#FFD700] text-[#053F5E] font-bold rounded-full hover:bg-white hover:text-[#053F5E] transition duration-300 shadow-lg" style={{ fontFamily: "'Cairo', sans-serif" }}>
        استكشف المدن
      </button> */}
          </div>
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

      <h2 className="section-title text-center text-3xl font-bold text-yellow-500 my-16 hover:text-yellow-400 transition-colors cursor-pointer">
        الوجهات ذات الصلة
      </h2>

      <div className="container mx-auto px-4" style={{ marginTop: "100px" }}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <a
              href="#"
              onClick={() => {
                const userToken = localStorage.getItem("token");
                localStorage.getItem(`favorites_${userEmail}`);

                if (!userToken) {
                  alert("يرجى تسجيل الدخول لحفظ الأماكن في المفضلة.");
                  return;
                }
                setShowFavorites(!showFavorites);
              }}
              className="cursor-pointer"
            >
              <img src={favoriteImage} alt="المفضلة" className="w-12 h-12" />
            </a>

            <Link to="/seasonPage/الشتاء">
              <img
                src={seasonsImage}
                alt="4 Seasons"
                className="w-12 h-12 cursor-pointer"
              />
            </Link>
          </div>
          <div className="w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="🔎 ابحث عن الموقع"
              id="searchInput"
              style={{ textAlign: "right" }}
            />
          </div>
        </div>

        <div className="py-8">
          <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
            الأماكن في {city}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredPlaces().length > 0 ? (
              getFilteredPlaces().map((place) => (
                <div
                  key={place._id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <div className="relative">
                    <img
                      src={place.gallery[0]}
                      alt={place.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        className="bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition"
                        onClick={() =>
                          showFavorites
                            ? removeFromFavorites(place)
                            : addToFavorites(place)
                        }
                      >
                        <HeartIcon className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-800">
                      {place.name}
                    </h3>
                    <div className="flex items-center text-gray-500 mb-3">
                      <MapPinIcon className="w-4 h-4 ml-1" />
                      <span className="text-sm">{place.short_description}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <StarIcon className="w-5 h-5 text-yellow-400 ml-1" />
                        <span className="font-medium">{place.best_season}</span>
                        <span className="text-gray-500 text-sm mr-1">
                          ({place.city})
                        </span>
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
              ))
            ) : (
              <p className="text-center text-lg text-gray-500 col-span-3">
                لا توجد أماكن متاحة.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CityPage;
