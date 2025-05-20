import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const PlogAdd = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_1: '',
    tags: '',
    imageSrc: ''
  });

  const getToken = () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      const token = user.token;
      console.log("Token retrieved from user cookie:", token);
      return token;
    } else {
      console.log("No user cookie found.");
      toast.error("You need to log in.");
      return null;
    }
  };
  
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9527/dashboard/');
      setArticles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("فشل في جلب المقالات");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      };

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingId) {
        await axios.put(
          `http://localhost:9527/dashboard/articles/${editingId}`,
          payload,
          config
        );
        toast.success('تم تحديث المقال بنجاح');
      } else {
        await axios.post(
          'http://localhost:9527/dashboard/articles',
          payload,
          config
        );
        toast.success('تم إنشاء المقال بنجاح');
      }

      fetchArticles();
      handleCancelEdit();
    } catch (error) {
      console.error("Error submitting article:", error);
      toast.error(`فشل في ${editingId ? 'تحديث' : 'إنشاء'} المقال: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (article) => {
    setEditingId(article._id);
    setFormData({
      title: article.title,
      content: article.content,
      content_1: article.content_1,
      tags: article.tags?.join(', ') || '',
      imageSrc: article.imageSrc
    });
    
    // التمرير إلى نموذج التحرير عند النقر على "تعديل"
    setTimeout(() => {
      document.getElementById('article-form').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: '',
      content: '',
      content_1: '',
      tags: '',
      imageSrc: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المقال؟')) return;
    
    try {
      const token = getToken();
      
      await axios.patch(
        `http://localhost:9527/dashboard/articles/${id}`,
        { isDeleted: true },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('تم حذف المقال بنجاح');
      fetchArticles();
      
    } catch (error) {
      console.error('Delete error:', error);
      if (error.message.includes('No token found')) {
        toast.error('الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
      } else {
        toast.error(`فشل في حذف المقال: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-right">إدارة المقالات</h1>
  
      {/* قائمة المقالات */}
      <div className="bg-white rounded-xl overflow-hidden mb-6 sm:mb-8 border border-gray-100 shadow-sm">
        <div className="p-3 sm:p-5 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-medium text-gray-800 text-right">مقالاتي</h2>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4">
            {articles.map((article) => (
              <div key={article._id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-200">
                {article.imageSrc && (
                  <div className="h-32 sm:h-40 overflow-hidden">
                    <img 
                      src={article.imageSrc} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-md font-medium text-gray-800 mb-2 text-right line-clamp-2">{article.title}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>👁️ {article.views}</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditClick(article)}
                      className="px-2 py-1 bg-blue-50 text-blue-500 rounded-md hover:bg-blue-100 text-xs transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="px-2 py-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 text-xs transition-colors mr-2"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 sm:p-6 text-center">
            <p className="text-gray-400 text-sm">لا توجد مقالات متاحة</p>
          </div>
        )}
      </div>
  
      {/* نموذج المقال */}
      <div id="article-form" className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-3 sm:p-5 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-medium text-gray-800 text-right">
            {editingId ? 'تعديل المقال' : 'مقال جديد'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-3 sm:p-5 space-y-4">
          <div className="space-y-3">
            {/* العنوان */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 text-right">العنوان</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                required
              />
            </div>
            
            {/* رابط الصورة */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 text-right">رابط الصورة</label>
              <input
                type="text"
                name="imageSrc"
                value={formData.imageSrc}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageSrc && (
                <div className="mt-2 rounded-md overflow-hidden border border-gray-200">
                  <img 
                    src={formData.imageSrc} 
                    alt="معاينة" 
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x150?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* الوسوم */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 text-right">الوسوم</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                placeholder="وسم1, وسم2"
              />
            </div>
            
            {/* المحتوى */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 text-right">المحتوى</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg h-28 sm:h-36 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                required
              />
            </div>
            
            {/* محتوى إضافي */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 text-right">محتوى إضافي</label>
              <textarea
                name="content_1"
                value={formData.content_1}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg h-24 sm:h-28 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>
          
          {/* أزرار الإجراءات */}
          <div className="flex justify-end space-x-2 pt-3">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-xs sm:text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1.5 text-xs sm:text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mr-2"
            >
              {editingId ? (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  حفظ
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  إنشاء
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlogAdd;