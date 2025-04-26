// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie'; // تأكد من أنك قمت بتثبيت مكتبة js-cookie

// const UpdatePlace = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [place, setPlace] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [images, setImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   useEffect(() => {
//     const loadUserFromCookies = () => {
//       const userCookie = Cookies.get("user"); // جلب الكوكيز الذي يحمل بيانات المستخدم
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie); // تحليل الكوكيز
//           console.log("🧖 Loading user from cookies:", parsedUser);

//           if (parsedUser.token) {
//             // تعيين التوكن في هيدر الـ axios
//             axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
//           }
//         } catch (error) {
//           console.error("Error parsing user cookie:", error); // في حال حدث خطأ في تحليل الكوكيز
//           Cookies.remove("user"); // إزالة الكوكيز إذا كان هناك خطأ
//         }
//       }
//     };

//     loadUserFromCookies();
//   }, []);

//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9527/dashboard/places/${id}`);
//         const fetchedPlace = response.data;

//         fetchedPlace.categories = Array.isArray(fetchedPlace.categories) ? fetchedPlace.categories.join(", ") : fetchedPlace.categories;
//         fetchedPlace.suitable_for = Array.isArray(fetchedPlace.suitable_for) ? fetchedPlace.suitable_for.join(", ") : fetchedPlace.suitable_for;

//         setPlace(fetchedPlace);
//         setLoading(false);
//       } catch (err) {
//         setError('حدث خطأ أثناء تحميل البيانات');
//         setLoading(false);
//       }
//     };

//     fetchPlace();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setPlace((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);

//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews(previews);
//   };

//   const removeImage = (index) => {
//     const newImages = [...images];
//     newImages.splice(index, 1);
//     setImages(newImages);

//     const newPreviews = [...imagePreviews];
//     newPreviews.splice(index, 1);
//     setImagePreviews(newPreviews);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!place) return;
  
//     try {
//       const formData = new FormData();
//       formData.append('name', place.name);
//       formData.append('short_description', place.short_description);
//       formData.append('detailed_description', place.detailed_description);
//       formData.append('city', place.city);
//       formData.append('categories', place.categories); // تأكد من أن القيمة صحيحة
//       formData.append('suitable_for', place.suitable_for); // تأكد من أن القيمة صحيحة
//       formData.append('phone', place.phone);
//       formData.append('website', place.website);
//       formData.append('latitude', place.latitude);
//       formData.append('longitude', place.longitude);
//       formData.append('working_hours', place.working_hours);
//       formData.append('rating', place.rating);
  
//       if (images && images.length > 0) {
//         for (let i = 0; i < images.length; i++) {
//           formData.append('images', images[i]);
//         }
//       }
  
//       setIsSubmitting(true);
  
//       const response = await axios.put(`http://localhost:9527/dashboard/places/update/${id}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: axios.defaults.headers.common['Authorization'],
//         },
//       });
  
//       console.log('تم التعديل بنجاح');
//       setSubmitStatus('success');
//       navigate('/admin/places');
//     } catch (error) {
//       console.error('خطأ أثناء التعديل:', error);
//       setSubmitStatus('error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  

//   if (loading) return <div>جاري التحميل...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>تعديل المكان</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>اسم المكان</label>
//           <input
//             type="text"
//             name="name"
//             value={place?.name || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>الوصف المختصر</label>
//           <textarea
//             name="short_description"
//             value={place?.short_description || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>الوصف التفصيلي</label>
//           <textarea
//             name="detailed_description"
//             value={place?.detailed_description || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>المدينة</label>
//           <input
//             type="text"
//             name="city"
//             value={place?.city || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>الفئات</label>
//           <input
//             type="text"
//             name="categories"
//             value={place?.categories || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>مناسب لـ</label>
//           <input
//             type="text"
//             name="suitable_for"
//             value={place?.suitable_for || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>الهاتف</label>
//           <input
//             type="text"
//             name="phone"
//             value={place?.phone || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>الموقع الإلكتروني</label>
//           <input
//             type="text"
//             name="website"
//             value={place?.website || ''}
//             onChange={handleChange}
//           />
//         </div>

//         {/* الحقول الجديدة */}
//         <div>
//           <label>خط العرض (Latitude)</label>
//           <input
//             type="text"
//             name="latitude"
//             value={place?.latitude || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>خط الطول (Longitude)</label>
//           <input
//             type="text"
//             name="longitude"
//             value={place?.longitude || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>ساعات العمل</label>
//           <input
//             type="text"
//             name="working_hours"
//             value={place?.working_hours || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>التقييم (Rating)</label>
//           <input
//             type="number"
//             step="0.1"
//             min="0"
//             max="5"
//             name="rating"
//             value={place?.rating || ''}
//             onChange={handleChange}
//           />
//         </div>

//         <div>
//           <label>رفع الصور</label>
//           <input type="file" multiple accept="image/*" onChange={handleFileChange} />
//         </div>

//         {imagePreviews.length > 0 && (
//           <div>
//             <h4>معاينة الصور:</h4>
//             <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//               {imagePreviews.map((preview, index) => (
//                 <div key={index} style={{ position: "relative" }}>
//                   <img
//                     src={preview}
//                     alt={`معاينة ${index + 1}`}
//                     style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     style={{
//                       position: "absolute",
//                       top: 0,
//                       right: 0,
//                       background: "red",
//                       color: "white",
//                       borderRadius: "50%",
//                       width: "24px",
//                       height: "24px",
//                       border: "none"
//                     }}
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         <div style={{ marginTop: "1rem" }}>
//           <button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? "جاري الإرسال..." : "تعديل المكان"}
//           </button>
//           <button type="button" onClick={() => navigate('/admin/places')} style={{ marginLeft: '1rem' }}>
//             إلغاء
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdatePlace;




import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Image, MapPin, Clock, Phone, Globe, Star, Tag, Users } from 'lucide-react';

const UpdatePlace = () => {
  // Mock data for demonstration
  const [place, setPlace] = useState({
    name: "البتراء",
    short_description: "مدينة أثرية تاريخية في الأردن",
    detailed_description: "البتراء هي مدينة تاريخية وأثرية تقع في محافظة معان جنوب الأردن، تشتهر بعمارتها المنحوتة في الصخر الوردي وبنظام قنوات المياه القديم.",
    city: "معان",
    categories: "سياحة, تاريخ, آثار",
    suitable_for: "العائلات, المسافرين, المستكشفين",
    phone: "+962 3 215 7093",
    website: "www.petra.gov.jo",
    latitude: "30.3285",
    longitude: "35.4444",
    working_hours: "6:00 صباحًا - 6:00 مساءً",
    rating: 4.8
  });
  
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([
    "/api/placeholder/400/320",
    "/api/placeholder/400/320"
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    // Create URLs for new previews
    const newPreviews = files.map(() => "/api/placeholder/400/320");
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message
      alert("تم تحديث المكان بنجاح!");
    }, 1500);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#115173] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">لوحة الإدارة | تعديل المكان</h1>
          <div className="flex items-center gap-2">
            <button className="bg-[#022C43] hover:bg-opacity-80 text-white px-4 py-2 rounded-md flex items-center gap-2">
              <ArrowLeft size={18} />
              <span>العودة</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#115173]">تعديل بيانات المكان</h2>
            <div className="p-2 bg-[#FFD700] rounded-full text-[#022C43] font-bold">{place.rating} <Star size={16} className="inline" /></div>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b">
            <button 
              onClick={() => setActiveTab('basic')} 
              className={`py-2 px-4 font-medium ${activeTab === 'basic' ? 'border-b-2 border-[#FFD700] text-[#115173]' : 'text-gray-500'}`}
            >
              معلومات أساسية
            </button>
            <button 
              onClick={() => setActiveTab('details')} 
              className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'border-b-2 border-[#FFD700] text-[#115173]' : 'text-gray-500'}`}
            >
              تفاصيل إضافية
            </button>
            <button 
              onClick={() => setActiveTab('location')} 
              className={`py-2 px-4 font-medium ${activeTab === 'location' ? 'border-b-2 border-[#FFD700] text-[#115173]' : 'text-gray-500'}`}
            >
              الموقع والتواصل
            </button>
            <button 
              onClick={() => setActiveTab('media')} 
              className={`py-2 px-4 font-medium ${activeTab === 'media' ? 'border-b-2 border-[#FFD700] text-[#115173]' : 'text-gray-500'}`}
            >
              الصور والوسائط
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Info Tab */}
            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[#115173] font-medium mb-2">اسم المكان</label>
                  <input
                    type="text"
                    name="name"
                    value={place.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-[#115173] font-medium mb-2">الوصف المختصر</label>
                  <input
                    type="text"
                    name="short_description"
                    value={place.short_description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-[#115173] font-medium mb-2">الوصف التفصيلي</label>
                  <textarea
                    name="detailed_description"
                    value={place.detailed_description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>

                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <Tag size={16} className="inline mr-1" /> الفئات (مفصولة بفاصلة)
                  </label>
                  <input
                    type="text"
                    name="categories"
                    value={place.categories}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
                
                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <Users size={16} className="inline mr-1" /> مناسب لـ (مفصولة بفاصلة)
                  </label>
                  <input
                    type="text"
                    name="suitable_for"
                    value={place.suitable_for}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
              </div>
            </div>

            {/* Details Tab */}
            <div className={activeTab === 'details' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <Clock size={16} className="inline mr-1" /> ساعات العمل
                  </label>
                  <input
                    type="text"
                    name="working_hours"
                    value={place.working_hours}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
                
                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <Star size={16} className="inline mr-1" /> التقييم
                  </label>
                  <input
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={place.rating}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
                
                <div>
                  <label className="block text-[#115173] font-medium mb-2">المدينة</label>
                  <select 
                    name="city" 
                    value={place.city}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  >
                    <option value="عمان">عمان</option>
                    <option value="إربد">إربد</option>
                    <option value="الزرقاء">الزرقاء</option>
                    <option value="معان">معان</option>
                    <option value="العقبة">العقبة</option>
                    <option value="جرش">جرش</option>
                    <option value="البلقاء">البلقاء</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Tab */}
            <div className={activeTab === 'location' ? 'block' : 'hidden'}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <MapPin size={16} className="inline mr-1" /> خط العرض (Latitude)
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={place.latitude}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
                
                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <MapPin size={16} className="inline mr-1" /> خط الطول (Longitude)
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={place.longitude}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                  />
                </div>
                
                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <Phone size={16} className="inline mr-1" /> رقم الهاتف
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={place.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label className="block text-[#115173] font-medium mb-2">
                    <Globe size={16} className="inline mr-1" /> الموقع الإلكتروني
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={place.website}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                    dir="ltr"
                  />
                </div>
                
                <div className="col-span-2">
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="aspect-video bg-gray-300 rounded-md flex items-center justify-center">
                      <MapPin size={64} className="text-gray-500" />
                      <p className="text-gray-600">معاينة الخريطة</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Tab */}
            <div className={activeTab === 'media' ? 'block' : 'hidden'}>
              <div className="mb-6">
                <label className="block text-[#115173] font-medium mb-2">
                  <Image size={16} className="inline mr-1" /> صور المكان
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#FFD700] mb-4">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange}
                    className="hidden" 
                    id="fileInput" 
                  />
                  <label htmlFor="fileInput" className="cursor-pointer">
                    <Image size={36} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">اضغط هنا لإضافة صور جديدة</p>
                    <p className="text-xs text-gray-400">أو قم بسحب وإفلات الصور هنا</p>
                  </label>
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`صورة ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg">
              <div className="container mx-auto flex justify-between">
                <button 
                  type="button" 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-md"
                >
                  إلغاء
                </button>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`bg-[#115173] hover:bg-[#022C43] text-white px-6 py-3 rounded-md flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <span>جاري الحفظ...</span>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>حفظ التغييرات</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdatePlace;