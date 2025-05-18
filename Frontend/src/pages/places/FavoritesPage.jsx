import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Star, ChevronLeft, ChevronRight, X, Search } from "lucide-react";
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

  const filteredFavorites = favorites.filter(place =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFavorites.length / placesPerPage);
  const currentFavorites = filteredFavorites.slice(
    (currentPage - 1) * placesPerPage,
    currentPage * placesPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPlaceDetails = (placeId) => navigate(`/place-details/${placeId}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e2e8f0]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#115173]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e2e8f0] p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 transform transition-all hover:scale-[1.01]">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-red-500 fill-red-100 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">قائمة المفضلة</h2>
          <p className="text-gray-600 text-center mb-8">
            يرجى تسجيل الدخول لعرض الأماكن المفضلة لديك
          </p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-[#115173] to-[#022C43] text-white py-3 rounded-xl hover:shadow-lg transition-all"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full border border-[#115173] text-[#115173] py-3 rounded-xl hover:bg-gray-50 transition-all"
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e2e8f0] p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 transform transition-all hover:scale-[1.01]">
          <div className="flex justify-center mb-6">
            <Heart className="w-16 h-16 text-red-500 fill-red-100" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">المفضلة فارغة</h2>
          <p className="text-gray-600 text-center mb-6">
            لم تقم بإضافة أي أماكن إلى المفضلة بعد
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/location')}
              className="bg-gradient-to-r from-[#115173] to-[#022C43] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all"
            >
              استكشف الأماكن
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (


    <>
    
    
        {/* Hero Section */}
        <section
  className="relative h-[50vh] bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.pexels.com/photos/8828327/pexels-photo-8828327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-10"></div>


  {/* Content */}
  <div
    dir="rtl"
    className="absolute inset-0 flex flex-col justify-center items-center px-6 text-white text-center z-10"
  >
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
      أماكنك المفضلة  
    </h1>

    {/* Title */}
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
    استعرض الأماكن التي أضفتها إلى قائمتك الخاصة
    </h1>
  </div>
</section>


    <div className="min-h-screen bg-gradient-to-br from-[#f7fafc] to-[#e2e8f0] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {/* <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <Heart className="w-16 h-16 text-red-500 fill-red-100" />
          </div> */}
          <h1 className="text-4xl font-bold text-[#022C43] mb-4 relative inline-block">
            <span className="relative z-10 px-4 bg-gradient-to-r from-[#f7fafc] to-[#e2e8f0]">الأماكن المفضلة</span>
            <span className="absolute bottom-2 left-0 right-0 h-3 bg-[#FFD700] z-0 opacity-30 rounded-full"></span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            الأماكن التي قمت بحفظها للمستقبل، يمكنك الوصول إليها بسهولة في أي وقت
          </p>
        </div>

        {/* Search and Stats */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="ابحث في المفضلة بالاسم أو المدينة..."
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <span className="text-gray-700 font-medium">
              العدد الكلي: <span className="text-[#115173]">{filteredFavorites.length}</span> مكان
            </span>
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredFavorites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentFavorites.map((place) => (
                <div
                  key={place._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#115173]/20"
                >
                  <div className="relative">
                    <img
                      src={place.gallery[0] || '/placeholder-image.jpg'}
                      alt={place.name}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => goToPlaceDetails(place._id)}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(place._id);
                      }}
                      className="absolute top-3 left-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-red-100 transition-colors"
                      title="إزالة من المفضلة"
                      aria-label="Remove from favorites"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-semibold text-lg truncate">{place.name}</h3>
                      <div className="flex items-center text-white/90">
                        <MapPin className="w-4 h-4 ml-1" />
                        <span className="text-sm">{place.city}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < place.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 mr-1">({place.rating})</span>
                      </div>
                      <span className="text-sm font-medium text-[#115173]">
                        {place.category}
                      </span>
                    </div>
                    <button
                      onClick={() => goToPlaceDetails(place._id)}
                      className="w-full bg-gradient-to-r from-[#115173] to-[#022C43] text-white py-2 rounded-lg hover:shadow-md transition-all"
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
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-all ${
                        currentPage === number 
                          ? 'bg-[#115173] text-white border-[#115173] shadow-md' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="inline-block p-5 bg-gray-100 rounded-full mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-3">لا توجد نتائج</h3>
            <p className="text-gray-500 mb-6">لم يتم العثور على أماكن تطابق بحثك "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-[#115173] text-white px-6 py-2 rounded-lg hover:bg-[#022C43] transition-colors"
            >
              عرض الكل
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default FavoritesPage;