import React, { useEffect, useState } from 'react';
import { HeartIcon, ClockIcon, MapPinIcon } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate,  } from "react-router-dom";

export const UserActivities = () => {
  const [favorites, setFavorites] = useState([]);
  const [userPlaces, setUserPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Load user from cookies
  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          if (parsedUser.token && parsedUser.userId) {
            setUserId(parsedUser.userId);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
    };
    loadUserFromCookies();
  }, []);

  // تحميل الأماكن المفضلة للمستخدم
  useEffect(() => {
    if (!userId) return;

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:9527/api/favorites/${userId}`);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid favorites data format');
        }

        const formattedFavorites = response.data.map(place => ({
          id: place._id, // or id depending on your backend response structure
          name: place.name,
          date: 'تمت الإضافة مؤخرًا',
          image: place.images?.[0] || 'https://via.placeholder.com/300x200?text=Place+Image',
        }));
        
  
        
        setFavorites(formattedFavorites);
      } catch (err) {
        console.error('Failed to load favorites:', { error: err, userId });
        setError('فشل في تحميل الأماكن المفضلة. يرجى تحديث الصفحة والمحاولة مرة أخرى');
      }
    };

    fetchFavorites();
  }, [userId]);

  // تحميل الأماكن التي أضافها المستخدم
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserPlaces = async () => {
try {
  const response = await axios.get(`http://localhost:9527/api/places/user-places/${userId}`);
  const formattedPlaces = response.data.map(place => ({
    id: place._id,
    name: place.name,
    date: new Date(place.createdAt).toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    image: place.images?.[0] || 'https://via.placeholder.com/300x200?text=Place+Image',
  }));

  setUserPlaces(formattedPlaces);
} catch (err) {
  if (err.response && err.response.status === 404) {
    setUserPlaces([]); // لا توجد أماكن، لكن لا تُظهر رسالة خطأ
  } else {
    setError("فشل تحميل الأماكن المضافة. الرجاء التأكد من اتصال الإنترنت والمحاولة لاحقاً");
  }
} finally {
  setLoading(false);
}
    };

    fetchUserPlaces();
  }, [userId]);
  
  const handleDetails = (place) => {
    if (place.id) {
      console.log(place.id); // Ensure that this logs the correct ID
      navigate(`/place-details/${place.id}`);
    } else {
      console.error("Place ID is missing:", place);
    }
  };
  
  
  
  // Combine activities
  const activitiesFromFavorites = favorites.map((place) => ({
    id: `${place.id}-fav`,
    place: place.name,
    action: "تمت إضافته للمفضلة",
    date: place.date,
    icon: HeartIcon,
  }));

  const activitiesFromUserPlaces = userPlaces.map((place) => ({
    id: `${place.id}-usr`,
    place: place.name,
    action: "تم اقتراحه مؤخرًا",
    date: place.date,
    icon: MapPinIcon,
  }));

  const recentActivities = [...activitiesFromFavorites, ...activitiesFromUserPlaces]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5); // Show only 5 most recent activities

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022C43]"></div>
        <span className="mr-3 text-[#022C43]">جاري التحميل...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mt-6 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-[#022C43]">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#022C43] text-white rounded-lg hover:bg-[#115173] transition-colors"
        >
          إعادة تحميل
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-2xl font-bold text-[#022C43] mb-6 border-b pb-2">نشاطاتك</h2>

      {/* Favorites Section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <HeartIcon size={24} className="ml-2 text-[#FF6B6B]" />
          <h3 className="text-xl font-semibold text-[#115173]">الأماكن المفضلة</h3>
        </div>
        
 
        {favorites.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <HeartIcon size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">لا توجد أماكن مفضلة حتى الآن</p>
            <p className="text-gray-400 mt-1">اضغط على ♡ لإضافة أماكن إلى المفضلة</p>
            
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex flex-col bg-[#F8FAFC] rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={favorite.image}
                  alt={favorite.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200?text=Place+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-[#022C43] text-lg mb-1">{favorite.name}</h4>
                <p className="text-sm text-gray-500 flex items-center justify-end">
                  <ClockIcon size={14} className="ml-1" />
                  {favorite.date}
                </p>
                <button
                  onClick={() => handleDetails(favorite)}
                  className="mt-2 text-[#115173] hover:text-[#022C43] flex items-center justify-end group"
                >
                  <span>عرض التفاصيل</span>
                  <svg className="w-5 h-5 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Recent Activities Section */}
      <div>
        <div className="flex items-center mb-4">
          <ClockIcon size={24} className="ml-2 text-[#4D96FF]" />
          <h3 className="text-xl font-semibold text-[#115173]">النشاطات الأخيرة</h3>
        </div>
        
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <ClockIcon size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg">لا توجد نشاطات مؤخراً</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center bg-[#F8FAFC] p-4 rounded-lg border border-gray-100 hover:bg-[#F0F4F8] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#022C43] rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-[#022C43] font-medium">
                      <span className="text-[#115173] font-semibold">{activity.place}</span>
                      <span className="mx-1">-</span>
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};