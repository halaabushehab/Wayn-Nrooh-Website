import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { HeartIcon, MapPinIcon, StarIcon } from "lucide-react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgVideo from "../../components/img/AmmanHero.mp4";

const Location = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    category_id: '',
    suitable_for: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 8,
    totalItems: 0
  });
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const navigate = useNavigate();

  // Load user from cookies
  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
            });
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

  useEffect(() => {
    const debouncedFetch = debounce(fetchPlaces, 500);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [filters, pagination.currentPage]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9527/api/places/grouped/', {
        params: {
          ...filters,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage
        }
      });

      let fetchedPlaces = [];
      const seenIds = new Set();

      const processGroup = (groupArray) => {
        if (Array.isArray(groupArray)) {
          groupArray.forEach(place => {
            if (!seenIds.has(place._id)) {
              seenIds.add(place._id);
              fetchedPlaces.push(place);
            }
          });
        }
      };

      if (response.data.byCategory) Object.values(response.data.byCategory).forEach(processGroup);
      if (response.data.byCity) Object.values(response.data.byCity).forEach(processGroup);
      if (response.data.bySuitable) Object.values(response.data.bySuitable).forEach(processGroup);

      setPlaces(fetchedPlaces);
      setPagination(prev => ({
        ...prev,
        totalItems: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 1
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setLoading(false);
    }
  };

  // Favorite functions
  const addToFavorites = async (place) => {
    if (!user?.userId) {
      toast.info("يرجى تسجيل الدخول لحفظ الأماكن في المفضلة");
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
        setFavorites((prev) => [...prev, place]);
        toast.success(`${place.name} تم إضافته للمفضلة!`);
      }
    } catch (error) {
      console.error("❌ Error adding to favorites:", error);
      toast.error("حدث خطأ أثناء إضافة الموقع للمفضلة.");
    }
  };

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
        setFavorites((prev) => prev.filter((fav) => fav._id !== place._id));
        toast.success(`${place.name} تم إزالته من المفضلة!`);
      }
    } catch (error) {
      console.error("❌ Error removing from favorites:", error);
      toast.error("حدث خطأ أثناء إزالة الموقع من المفضلة.");
    }
  };

  const isInFavorites = (placeId) => {
    return favorites.some(fav => fav._id === placeId);
  };

  const handleDetails = (place) => {
    navigate(`/place-details/${place._id}`);
  };


  const handlePageChange = (pageNumber) => {
    setPagination(prev => ({
      ...prev,
      currentPage: pageNumber
    }));
  };

  const toggleFavorites = () => {
    if (!user?.userId) {
      toast.info("يرجى تسجيل الدخول لعرض الأماكن المفضلة");
      return;
    }
    setShowFavorites(!showFavorites);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const displayedPlaces = showFavorites ? 
    places.filter(place => isInFavorites(place._id)) : 
    places;

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center mb-20">
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
  <div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in-up">
  <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-xl tracking-wide">
            اكتشف أجمل الأماكن في الأردن
  </h1>
  <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed">
            استكشف أفضل الوجهات السياحية والترفيهية في المملكة
  </p>
</div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* Section Title */}

<div class="text-center mb-16">
  <h2 class="text-4xl md:text-5xl font-bold text-[#022C43] mb-4 animate-fadeIn">
    <span class="text-[#115173]">الوجهات</span> المتوفرة لدينا
  </h2>
  <div class="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
  <p class="text-xl text-[#022C43] max-w-2xl mx-auto leading-relaxed">
    مجموعة مختارة من أجمل الوجهات التي يمكنك زيارتها في مختلف أنحاء الأردن، جميعها في مكان واحد.
  </p>
</div>

      {/* Section Header */}

<div className="bg-white py-6 px-4 sm:px-6 rounded-xl shadow-sm mb-8">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
  
   
    {/* العنوان الرئيسي مع التصميم المعدل */}
    <div className="flex-1">
      <h2 className="text-3xl font-bold text-[#022C43] relative inline-block">
        {/* <span className="relative z-10">
          وجهات مختارة
          <span className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#FFD700] transform -skew-x-12 z-0"></span>
        </span> */}
      </h2>
      {/* <p className="text-gray-600 mt-2 text-sm">اكتشف أفضل الأماكن للزيارة في الأردن</p> */}
    </div>
    
    {/* عناصر التحكم */}
  <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white shadow-md rounded-lg">
  {/* 🔍 حقل البحث */}
  <div className="relative w-full sm:w-80">
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      placeholder="ابحث عن وجهة..."
      className="w-full pr-10 pl-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent text-right"
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
    />
  </div>

  {/* ❤️ زر المفضلة */}
  <button
    onClick={toggleFavorites}
    className={`flex items-center justify-center px-6 py-2.5 rounded-full transition-all shadow-sm text-sm font-medium ${
      showFavorites 
        ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
        : 'bg-[#115173] text-white border border-[#115173] hover:bg-[#0e3e59]'
    } whitespace-nowrap`}
  >
    <HeartIcon 
      className={`w-5 h-5 ml-2 ${showFavorites ? 'fill-red-500' : 'fill-white'}`}
      strokeWidth={1.5}
      stroke="currentColor"
    />
    {showFavorites ? 'عرض الكل' : 'عرض المفضلة'}
  </button>
</div>

  </div>
  
  {/* الفلاتر المعدلة */}
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    {/* فلتر المدينة */}
    <div className="relative">
      <select
        className="w-full p-2.5 pr-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent appearance-none text-right bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_left_1rem]"
        onChange={(e) => setFilters({...filters, city: e.target.value})}
        value={filters.city}
      >
        <option value="">كل المدن</option>
        <option value="عمان">عمان</option>
        <option value="الزرقاء">الزرقاء</option>
        <option value="إربد">إربد</option>
        <option value="السلط">السلط</option>
        <option value="مادبا">مادبا</option>
        <option value="الطفيلة">الطفيلة</option>
        <option value="الكرك">الكرك</option>
        <option value="العقبة">العقبة</option>
        <option value="المفرق">المفرق</option>
        <option value="جرش">جرش</option>
        <option value="عجلون">عجلون</option>
        <option value="معان">معان</option>
      </select>
    </div>
    
    {/* فلتر التصنيف */}
    <div className="relative">
      <select
        className="w-full p-2.5 pr-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent appearance-none text-right bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_left_1rem]"
        onChange={(e) => setFilters({...filters, category_id: e.target.value})}
        value={filters.category_id}
      >
        <option value="">كل التصنيفات</option>
        <option value="حدائق">حدائق</option>
        <option value="مطاعم">مطاعم</option>
        <option value="ترفيه">ترفيه</option>
        <option value="رياضة">رياضة</option>
        <option value="اكل بيتي">اكل بيتي</option>
        <option value="تصوير">تصوير</option>
        <option value="متاحف">متاحف</option>
        <option value="مغامرة">مغامرة</option>
        <option value="اسواق">اسواق</option>
        <option value="تعليم">تعليم</option>
        <option value="منتزهات">منتزهات</option>
        <option value="مقاهي">مقاهي</option>
        <option value="اماكن تاريخية">اماكن تاريخية</option>
      </select>
    </div>
    
    {/* فلتر الفئات المناسبة */}
    <div className="relative">
      <select
        className="w-full p-2.5 pr-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent appearance-none text-right bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_left_1rem]"
        onChange={(e) => setFilters({...filters, suitable_for: e.target.value})}
        value={filters.suitable_for}
      >
        <option value="">مناسب لـ</option>
        <option value="العائلات">العائلات</option>
        <option value="الأصدقاء">الأصدقاء</option>
        <option value="الأطفال">الأطفال</option>
        <option value="محبو استكشاف الثقافات">محبو الثقافات</option>
        <option value="محبو الحيوانات">محبو الحيوانات</option>
        <option value="الرحلات المدرسية">رحلات مدرسية</option>
        <option value="محبو السيارات">محبو السيارات</option>
        <option value="محبو التاريخ">محبو التاريخ</option>
        <option value="محبو الرياضة">محبو الرياضة</option>
        <option value="محبو التصوير">محبو التصوير</option>
        <option value="محبو الأماكن الهادئة">الأماكن الهادئة</option>
        <option value="طلاب جامعات">طلاب جامعات</option>
        <option value="محبو الفن">محبو الفن</option>
      </select>
    </div>
    
    {/* زر إعادة الضبط */}
    <button 
      onClick={() => setFilters({
        search: '',
        city: '',
        category_id: '',
        suitable_for: ''
      })}
      className="p-2.5 rounded-full border border-gray-300 bg-white text-[#115173] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      إعادة الضبط
    </button>
  </div>
</div>
        {/* Places Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
          </div>
        ) : (
          <>
            {displayedPlaces.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="mt-4 text-xl text-gray-600">
                  {showFavorites ? "لا توجد أماكن في المفضلة" : "لا توجد أماكن متاحة"}
                </p>
              </div>
            ) : (
              <>
             {/* تصميم بطاقة المكان المحسن مع دعم اللغة العربية */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" dir="rtl">
  {displayedPlaces.map((place) => (
    <div
      key={place._id}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
      style={{ height: '450px' }} // ارتفاع ثابت للكارد كامل
    >
      {/* حاوية الصورة مع أبعاد ثابتة */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <img
            src={place.images?.[0] || '/images/placeholder-place.jpg'}
            alt={place.name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            style={{
              minWidth: '100%',
              minHeight: '100%',
              maxWidth: 'none',
              maxHeight: 'none'
            }}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

        {/* زر المفضلة */}
        <button
          className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all"
          onClick={(e) => {
            e.stopPropagation();
            isInFavorites(place._id)
              ? removeFromFavorites(place)
              : addToFavorites(place);
          }}
        >
          <HeartIcon
            className={`w-5 h-5 ${isInFavorites(place._id) ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'}`}
          />
        </button>

        {/* التقييم */}
        {place.rating && (
          <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 rounded-full flex items-center text-sm shadow-sm">
            <StarIcon className="w-4 h-4 text-yellow-500" />
            <span className="font-medium mr-1">{place.rating}</span>
          </div>
        )}

        {/* شارة المدينة */}
        <span className="absolute bottom-3 left-3 bg-[#115173] text-white px-3 py-1 rounded-full text-xs font-bold">
          {place.city}
        </span>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 hover:text-[#115173] transition-colors cursor-pointer"
          onClick={() => handleDetails(place)}
        >
          {place.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">
          {place.short_description || place.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {place.categories?.slice(0, 2).map((category, index) => (
            <span key={index} className="bg-[#115173]/10 text-[#115173] text-xs px-2 py-1 rounded-full">
              {category}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          {place.price && (
            <div className="flex items-center">
              <span className="ml-1">{place.price} دينار</span>
              <CurrencyDollarIcon className="w-3 h-3" />
            </div>
          )}
          {place.distance && (
            <div className="flex items-center">
              <span className="ml-1">{place.distance} كم</span>
              <MapPinIcon className="w-3 h-3" />
            </div>
          )}
        </div>

        <button
          onClick={() => handleDetails(place)}
          className="w-full bg-[#115173] hover:bg-[#022C43] text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <span className="text-sm font-medium">عرض التفاصيل</span>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>
    </div>
  ))}
</div>



                {/* Pagination */}
                {pagination.totalItems > pagination.itemsPerPage && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        السابق
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                        const pageNum = pagination.currentPage <= 3 ? i + 1 : 
                                       pagination.currentPage >= pagination.totalPages - 2 ? 
                                       pagination.totalPages - 4 + i : 
                                       pagination.currentPage - 2 + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 border rounded-md text-sm font-medium ${
                              pagination.currentPage === pageNum 
                                ? 'bg-[#115173] text-white border-[#115173]' 
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        التالي
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Location;