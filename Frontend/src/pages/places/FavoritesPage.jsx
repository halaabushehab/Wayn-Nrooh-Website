import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const placesPerPage = 8;

  // تحميل بيانات المستخدم والمفضلة
  useEffect(() => {
    const loadUserAndFavorites = async () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          setUser({
            username: parsedUser.username,
            userId: parsedUser.userId,
          });

          // جلب الأماكن المفضلة
          const response = await axios.get(
            `http://localhost:9527/api/favorites/${parsedUser.userId}`
          );
          setFavorites(response.data);
        } catch (error) {
          console.error("Error loading favorites:", error);
          toast.error("حدث خطأ في تحميل المفضلة");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserAndFavorites();
  }, []);

  // إزالة من المفضلة
  const removeFavorite = async (placeId) => {
    try {
      await axios.post(`http://localhost:9527/api/favorites/remove`, {
        userId: user.userId,
        placeId: placeId,
      });

      setFavorites(favorites.filter(place => place._id !== placeId));
      toast.success("تمت الإزالة من المفضلة");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("حدث خطأ أثناء الإزالة من المفضلة");
    }
  };

  // تصفية النتائج حسب البحث
  const filteredFavorites = favorites.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredFavorites.length / placesPerPage);

  // الحصول على الأماكن للصفحة الحالية
  const currentFavorites = filteredFavorites.slice(
    (currentPage - 1) * placesPerPage,
    currentPage * placesPerPage
  );

  // تغيير الصفحة
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // الذهاب لتفاصيل المكان
  const goToPlaceDetails = (placeId) => {
    navigate(`/place-details/${placeId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center  items-center h-screen">
        <div className="animate-spin  rounded-full h-16 w-16 border-t-4 border-[#115173]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col  items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <Heart className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">قائمة المفضلة فارغة</h2>
          <p className="text-gray-600 mb-6">
            يرجى تسجيل الدخول لعرض الأماكن المفضلة لديك
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#115173] text-white py-3 rounded-lg hover:bg-[#022C43] transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <Heart className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">قائمة المفضلة فارغة</h2>
          <p className="text-gray-600 mb-6">
            لم تقم بإضافة أي أماكن إلى المفضلة بعد
          </p>
          {/* <button
            onClick={() => navigate('/places')}
            className="w-full bg-[#115173] text-white py-3 rounded-lg hover:bg-[#022C43] transition-colors"
          >
            استكشف الأماكن
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#022C43] mb-4 relative inline-block">
            <span className="relative z-10">الأماكن المفضلة</span>
            <span className="absolute bottom-0 left-0 right-0 h-2 bg-[#FFD700] z-0 opacity-30"></span>
          </h1>
          <p className="text-lg text-gray-600">
            الأماكن التي قمت بحفظها للمستقبل
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="ابحث في المفضلة..."
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent"
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

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentFavorites.map((place) => (
            <div
              key={place._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={place.gallery[0]}
                  alt={place.name}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => goToPlaceDetails(place._id)}
                />
                <button
                  onClick={() => removeFavorite(place._id)}
                  className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
                  title="إزالة من المفضلة"
                >
                  <X className="w-5 h-5 text-red-500" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-semibold text-lg">{place.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 ml-1 text-[#115173]" />
                  <span className="text-sm">{place.city}</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < place.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => goToPlaceDetails(place._id)}
                  className="w-full bg-[#115173] text-white py-2 rounded-lg hover:bg-[#022C43] transition-colors"
                >
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => paginate(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-1 border rounded-md ${currentPage === number ? 'bg-[#115173] text-white border-[#115173]' : 'border-gray-300'}`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}

        {/* Empty Search Results */}
        {filteredFavorites.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-500">لم يتم العثور على أماكن تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;