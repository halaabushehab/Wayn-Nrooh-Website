// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Cookies from 'js-cookie';

// const PlogAdd = () => {
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingId, setEditingId] = useState(null);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     content_1: '',
//     tags: '',
//     imageSrc: ''
//   });

//   // Improved getToken function
//   const getToken = () => {
//     const userCookie = Cookies.get('user');
//     if (userCookie) {
//       const user = JSON.parse(userCookie);
//       const token = user.token; // استخراج التوكن من قيمة user
//       console.log("Token retrieved from user cookie:", token);
//       return token;
//     } else {
//       console.log("No user cookie found.");
//       toast.error("You need to log in.");
//       return null;
//     }
//   };
  
//   useEffect(() => {
//     fetchArticles();
//   }, []);




//   const fetchArticles = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:9527/dashboard/');
//       setArticles(Array.isArray(response.data) ? response.data : []);
//     } catch (error) {
//       console.error("Error fetching articles:", error);
//       toast.error("فشل في جلب المقالات");
//       setArticles([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = getToken();
//       const payload = {
//         ...formData,
//         tags: formData.tags.split(',').map(tag => tag.trim())
//       };

//       const config = {
//         headers: { Authorization: `Bearer ${token}` }
//       };

//       if (editingId) {
//         await axios.put(
//           `http://localhost:9527/dashboard/articles/${editingId}`,
//           payload,
//           config
//         );
//         toast.success('تم تحديث المقال بنجاح');
//       } else {
//         await axios.post(
//           'http://localhost:9527/dashboard/articles',
//           payload,
//           config
//         );
//         toast.success('تم إنشاء المقال بنجاح');
//       }

//       fetchArticles();
//       handleCancelEdit();
//     } catch (error) {
//       console.error("Error submitting article:", error);
//       toast.error(`فشل في ${editingId ? 'تحديث' : 'إنشاء'} المقال: ${error.message}`);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleEditClick = (article) => {
//     setEditingId(article._id);
//     setFormData({
//       title: article.title,
//       content: article.content,
//       content_1: article.content_1,
//       tags: article.tags?.join(', ') || '',
//       imageSrc: article.imageSrc
//     });
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setFormData({
//       title: '',
//       content: '',
//       content_1: '',
//       tags: '',
//       imageSrc: ''
//     });
//   };


//   const handleDelete = async (id) => {
//     if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا المقال؟')) return;
    
//     try {
//       const token = getToken(); // This will throw if no token
      
//       await axios.patch(
//         `http://localhost:9527/dashboard/articles/${id}`,
//         { isDeleted: true },
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       toast.success('تم حذف المقال بنجاح');
//       fetchArticles(); // Refresh the list
      
//     } catch (error) {
//       console.error('Delete error:', error);
//       if (error.message.includes('No token found')) {
//         toast.error('الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
//         // Consider redirecting to login:
//         // window.location.href = '/login';
//       } else {
//         toast.error(`فشل في حذف المقال: ${error.response?.data?.message || error.message}`);
//       }
//     }
//   };


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }



//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">إدارة المقالات</h1>

//       {/* نموذج المقال */}
//       <div className="bg-white shadow rounded-lg p-6 mb-8">
//         <h2 className="text-xl font-bold mb-4">
//           {editingId ? 'تعديل المقال' : 'إنشاء مقال جديد'}
//         </h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">المحتوى الرئيسي</label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
//               required
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">محتوى إضافي</label>
//             <textarea
//               name="content_1"
//               value={formData.content_1}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md h-32"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">الوسوم (مفصولة بفواصل)</label>
//             <input
//               type="text"
//               name="tags"
//               value={formData.tags}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة</label>
//             <input
//               type="text"
//               name="imageSrc"
//               value={formData.imageSrc}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//             {formData.imageSrc && (
//               <div className="mt-2">
//                 <img src={formData.imageSrc} alt="معاينة" className="max-w-xs max-h-40" />
//               </div>
//             )}
//           </div>
          
//           <div className="flex justify-end space-x-3 pt-4">
//             {editingId && (
//               <button
//                 type="button"
//                 onClick={handleCancelEdit}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//               >
//                 إلغاء
//               </button>
//             )}
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//               {editingId ? 'حفظ التعديلات' : 'إنشاء مقال'}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* قائمة المقالات */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العنوان</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المشاهدات</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {articles.length > 0 ? (
//               articles.map((article) => (
//                 <tr key={article._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">{article.title}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">
//                       {new Date(article.createdAt).toLocaleDateString()}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">{article.views}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => handleEditClick(article)}
//                       className="text-blue-600 hover:text-blue-900 ml-4"
//                     >
//                       تعديل
//                     </button>
//                     <button
//                       onClick={() => handleDelete(article._id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       حذف
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
//                   لا توجد مقالات متاحة
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PlogAdd;


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

  // Improved getToken function
  const getToken = () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const user = JSON.parse(userCookie);
      const token = user.token; // استخراج التوكن من قيمة user
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
      const token = getToken(); // This will throw if no token
      
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
      fetchArticles(); // Refresh the list
      
    } catch (error) {
      console.error('Delete error:', error);
      if (error.message.includes('No token found')) {
        toast.error('الجلسة منتهية، يرجى تسجيل الدخول مرة أخرى');
        // Consider redirecting to login:
        // window.location.href = '/login';
      } else {
        toast.error(`فشل في حذف المقال: ${error.response?.data?.message || error.message}`);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-right">إدارة المقالات</h1>
  
      {/* قائمة المقالات */}
      <div className="bg-white rounded-xl overflow-hidden mb-8 border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 text-right">مقالاتي</h2>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {articles.map((article) => (
              <div key={article._id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-sm transition-shadow duration-200">
                {article.imageSrc && (
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={article.imageSrc} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-md font-medium text-gray-800 mb-2 text-right line-clamp-2">{article.title}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    <span>👁️ {article.views}</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleEditClick(article)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-500 rounded-md hover:bg-blue-100 text-xs transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="px-2.5 py-1 bg-red-50 text-red-500 rounded-md hover:bg-red-100 text-xs transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-400 text-sm">لا توجد مقالات متاحة</p>
          </div>
        )}
      </div>
  
      {/* نموذج المقال */}
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-800 text-right">
            {editingId ? 'تعديل المقال' : 'مقال جديد'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
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
                    <img src={formData.imageSrc} alt="معاينة" className="w-full h-32 object-cover" />
                  </div>
                )}
              </div>
              
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
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 text-right">المحتوى</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg h-36 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1 text-right">محتوى إضافي</label>
                <textarea
                  name="content_1"
                  value={formData.content_1}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg h-28 focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-3">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              {editingId ? (
                <>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  حفظ
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

