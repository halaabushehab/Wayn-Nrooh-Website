import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AdminAddPlaceForm from './AdminAddPlaceForm'; // عدل المسار حسب مكان الكمبوننت
import { 
  MapPin, 
  Star, 
  ChevronDown, 
  Filter, 
  Plus, 
  CheckCircle2, 
  XCircle,
  Trash2,
  Edit
} from 'lucide-react';



export function Places() {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1
  });


  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          console.log("🧖 Loading user from cookies:", parsedUser);

          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
              token: parsedUser.token
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
            console.log("Token added to axios headers from cookies.");
            
            if (parsedUser.isAdmin) {
              console.log("User is an admin.");
            } else {
              console.log("User is not an admin.");
            }
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
    };

    loadUserFromCookies();
  }, []);

  useEffect(() => {
    setPagination(prev => ({...prev, page: 1}));
  }, [filter]);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);

      const userCookie = Cookies.get("user");
      const token = userCookie ? JSON.parse(userCookie).token : null;
      console.log('Token:', token);
      
      if (!token) {
        console.error('No token found!');
        setError('No token found! Please log in.');
        setLoading(false);
        return;
        
      }

      const url = `http://localhost:9527/dashboard/places?page=${pagination.page}&limit=${pagination.limit}${
      
        filter !== 'all' ? `&status=${filter}` : ''
      }${searchQuery ? `&search=${searchQuery}` : ''}`;
      const placesRes = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
// console.log("Request URL:", url);
      // console.log("Fetched places response:", placesRes);
      console.log('Search Query:', searchQuery);
      console.log('Request URL:', url);
      const responseData = placesRes.data;
      if (responseData.places && Array.isArray(responseData.places)) {
        setPlaces(responseData.places);
        setPagination(prev => ({
          ...prev,
          total: responseData.totalPlaces,
          totalPages: responseData.totalPages
        }));
      } else if (Array.isArray(responseData)) {
        setPlaces(responseData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching places:', error);
      setError('Failed to fetch places. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPlaces();
    }, 400);  // تأخير 400 مللي ثانية قبل استدعاء دالة البحث
  
    return () => clearTimeout(delayDebounce);
  }, [filter, pagination.page, pagination.limit, searchQuery]);

  
  const handleSoftDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من أنك تريد حذف هذا المكان؟')) return;
  
    const token = user?.token || JSON.parse(Cookies.get("user") || "{}")?.token;
    if (!token) {
      toast.error('مطلوب توثيق. يرجى تسجيل الدخول.');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:9527/dashboard/places/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPlaces(places.filter(p => p._id !== id));
      toast.success('تم حذف المكان بنجاح');
    } catch (error) {
      console.error('الخطأ:', error);
      toast.error(error.response?.data?.message || 'فشل في حذف المكان');
    }
  };
  
  const handleApprove = async (id) => {
    try {
      const token = user?.token || JSON.parse(Cookies.get("user") || "{}")?.token;
      await axios.patch(
        `http://localhost:9527/dashboard/places/${id}/status`,
        { status: 'approved' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPlaces(places.map(p => p._id === id ? { ...p, status: 'approved' } : p));
      toast.success('تم اعتماد المكان بنجاح');
    } catch (error) {
      console.error('الخطأ:', error);
      toast.error(error.response?.data?.message || 'فشل في اعتماد المكان');
    }
  };
  
  const handleReject = async (id) => {
    try {
      const token = user?.token || JSON.parse(Cookies.get("user") || "{}")?.token;
      await axios.patch(
        `http://localhost:9527/dashboard/places/${id}/status`,
        { status: 'rejected' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPlaces(places.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
      toast.success('تم رفض المكان بنجاح');
    } catch (error) {
      console.error('الخطأ:', error);
      toast.error(error.response?.data?.message || 'فشل في رفض المكان');
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/places/update/${id}`);
  };

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    } else {
      toast.info('This is the last page');
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  function getCategoryColor(category) {
    const colors = {
      'طبيعة': 'bg-green-500',
      'استجمام': 'bg-blue-500',
      'تاريخي': 'bg-amber-500',
      'تسوق': 'bg-purple-500',
      'ترفيه': 'bg-pink-500',
      'مطعم': 'bg-red-500',
      'مقهى': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  }

  const toggleForm = () => {
    setShowAddForm(prev => !prev); // لما تكبس الزر يبدل بين true و false
  };
  
  return (
    <div className="space-y-6 p-6 bg-white">
      {/* Header Section */}
      <div>
      {/* الزر */}
      <button 
        className="bg-[#115173] hover:bg-[#022C43] text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        onClick={toggleForm}
      >
        <Plus size={18} className="ml-2" />
        {showAddForm ? 'إغلاق النموذج' : 'إضافة مكان جديد'}
      </button>

      {/* عرض الفورم حسب الحالة */}
      {showAddForm && (
        <div className="mt-8">
          <AdminAddPlaceForm />
        </div>
      )}
    </div>
      {/* Filters and Search */}
      <div className="bg-[#F8FAFC] p-4 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-[#115173] text-white' : 'bg-white text-[#115173] border border-[#115173]'}`}
              onClick={() => setFilter('all')}
            >
              الكل
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-100 text-green-800' : 'bg-white text-green-800 border border-green-200'}`}
              onClick={() => setFilter('approved')}
            >
              معتمدة
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-white text-amber-800 border border-amber-200'}`}
              onClick={() => setFilter('pending')}
            >
              قيد الانتظار
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-white text-red-800 border border-red-200'}`}
              onClick={() => setFilter('rejected')}
            >
              مرفوضة
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ابحث عن مكان..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-[#FFD700] focus:border-[#115173] outline-none"
              onChange={handleSearch}
              value={searchQuery}
            />
            <Filter
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Places Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places && places.length > 0 ? (
              places.map(place => (
                <div key={place._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                  {/* Place Image */}
                  <div className="relative h-48">
                    {place.images?.[0] ? (
                      <img 
                        src={place.images[0]} 
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <MapPin size={40} />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${
                      place.status === 'approved' ? 'bg-green-100 text-green-800' :
                      place.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {place.status === 'approved' ? 'معتمد' : 
                       place.status === 'pending' ? 'قيد الانتظار' : 'مرفوض'}
                    </div>
                    
                    {/* Category Badge */}
                    {place.categories?.[0] && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-[#115173]">
                        {place.categories[0]}
                      </div>
                    )}
                  </div>
                  
                  {/* Place Details */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-[#022C43]">{place.name}</h3>
                      {place.rating && (
                        <div className="flex items-center bg-[#FFD700]/20 px-2 py-1 rounded text-sm">
                          <Star size={14} className="text-[#FFD700] mr-1" />
                          <span className="text-[#022C43]">{place.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mt-1 flex items-center">
                      <MapPin size={14} className="ml-1 text-[#115173]" />
                      {place.city || 'غير محدد'}
                    </p>
                    
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {place.short_description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {place.is_free ? 'مجاني' : place.ticket_price ? `${place.ticket_price} د.أ` : 'غير محدد'}
                      </div>
                      
                      <div className="flex space-x-2 space-x-reverse">
                      <button 
  onClick={() => handleEdit(place._id)}
  className="text-[#115173] hover:text-[#022C43] p-1"
  title="تعديل"
>
  <Edit size={18} />
</button>

                        
                        {place.status !== 'approved' ? (
                          <button
                            onClick={() => handleApprove(place._id)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="اعتماد"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleReject(place._id)}
                            className="text-amber-600 hover:text-amber-800 p-1"
                            title="رفض"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleSoftDelete(place._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <MapPin className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-lg">لا توجد أماكن مطابقة للبحث</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {places && places.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button 
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#115173] bg-white text-[#115173] hover:bg-[#115173] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => changePage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronDown className="rotate-90" size={18} />
                </button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = pagination.page <= 3 ? i + 1 : 
                                 pagination.page >= pagination.totalPages - 2 ? 
                                 pagination.totalPages - 4 + i : 
                                 pagination.page - 2 + i;
                  
                  if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg border ${
                        pagination.page === pageNum ? 
                        'bg-[#115173] text-white border-[#115173]' : 
                        'bg-white border-[#115173] text-[#115173] hover:bg-[#115173]/10'
                      }`}
                      onClick={() => changePage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#115173] bg-white text-[#115173] hover:bg-[#115173] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => changePage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  <ChevronDown className="-rotate-90" size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Statistics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Top Rated Places */}
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4 text-[#022C43] flex items-center">
                <Star className="text-[#FFD700] mr-2" size={20} />
                أعلى الأماكن تقييماً
              </h2>
              <div className="space-y-4">
                {places
                  .filter(p => p.rating)
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 3)
                  .map(place => (
                    <div key={place._id} className="flex items-center p-3 bg-white rounded-lg shadow-xs">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-3">
                        {place.images?.[0] ? (
                          <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <MapPin size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#022C43]">{place.name}</h4>
                        <div className="flex items-center mt-1">
                          <Star size={14} className="text-[#FFD700] mr-1" />
                          <span className="text-sm text-gray-600">{place.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Places by Category */}
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold mb-4 text-[#022C43] flex items-center">
                <MapPin className="text-[#115173] mr-2" size={20} />
                الأماكن حسب التصنيف
              </h2>
              <div className="space-y-3">
                {Array.from(new Set(places.flatMap(p => p.categories || [])))
                  .slice(0, 5)
                  .map(category => {
                    const count = places.filter(p => p.categories?.includes(category)).length;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)} mr-2`}></div>
                          <span className="text-[#022C43]">{category}</span>
                        </div>
                        <span className="text-gray-500 text-sm">{count} مكان</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Places;

