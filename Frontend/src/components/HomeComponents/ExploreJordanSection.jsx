// import React, { useState } from "react";
// const AddPlaceForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     short_description: "",
//     detailed_description: "",
//     city: "",
//     working_hours: "",
//     rating: "",
//     ticket_price: "",
//     best_season: "",
//     is_free: false,
//     map_link: "",
//     categories: "",
//     suitable_for: "",
//     phone: "",
//     website: "",
//     images:[],
//     gallery:[],
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,

//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };



//   const uploadToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "ml_default"); // غيّرها إذا عندك preset مختلف
//     formData.append("cloud_name", "waynroh");
  
//     try {
//       const res = await fetch("https://api.cloudinary.com/v1_1/waynroh/image/upload", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       return data.secure_url;
//     } catch (error) {
//       console.error("Upload error:", error);
//       return null;
//     }
//   };
  
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
  
//     const imageUrl = await uploadToCloudinary(file);
//     if (imageUrl) {
//       setFormData((prev) => ({
//         ...prev,
//         images: [...prev.images, imageUrl],
//       }));
//     }
//   };
//   const handleImageDelete = (urlToDelete) => {
//     setFormData((prev) => ({
//       ...prev,
//       images: prev.images.filter((url) => url !== urlToDelete),
//     }));
//   };
  
//   console.log(formData.images)
  





//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);

//     // Split inputs that expect arrays
//     const data = {
//       ...formData,
//       rating: parseFloat(formData.rating) || 0,
//       ticket_price: parseFloat(formData.ticket_price) || 0,
//       categories: formData.categories ? formData.categories.split(",").map((c) => c.trim()) : [],
//       suitable_for: formData.suitable_for ? formData.suitable_for.split(",").map((s) => s.trim()) : [],
//       images: formData.images ? images: formData.images,
//       gallery: formData.gallery ? images: formData.images,
//       contact: {
//         phone: formData.phone,
//         website: formData.website,
//       },
//       location: {
//         latitude: 0,
//         longitude: 0,
//       },
//       status: "pending",
//       isDeleted: false,
//     };

//     try {
//       const response = await fetch("http://localhost:9527/api/places/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       console.log("تم الإرسال بنجاح:", result);
//       setSubmitStatus("success");
//       // Reset form after successful submission
//       setFormData({
//         name: "",
//         short_description: "",
//         detailed_description: "",
//         city: "",
//         working_hours: "",
//         rating: "",
//         ticket_price: "",
//         best_season: "",
//         is_free: false,
//         map_link: "",
//         categories: "",
//         suitable_for: "",
//         phone: "",
//         website: "",
//         images: "",
//         gallery: "",
//       });
//     } catch (error) {
//       console.error("خطأ أثناء الإرسال:", error);
//       setSubmitStatus("error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Custom styles based on the provided color scheme
//   const colors = {
//     primary: "#115173", // Dark blue
//     accent: "#FFD700", // Gold
//     secondary: "#022C43", // Darker blue
//     white: "#FFFFFF"
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg my-40">
//       <div className="mb-8 text-center ">
//         <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>إضافة مكان جديد</h2>
//         <div className="w-24 h-1 mx-auto mt-3 rounded" style={{ backgroundColor: colors.accent }}></div>
//       </div>

//       {submitStatus === "success" && (
//         <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
//           <p className="text-green-700">تم إرسال معلومات المكان بنجاح!</p>
//         </div>
//       )}

//       {submitStatus === "error" && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
//           <p className="text-red-700">حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>اسم المكان</label>
//           <input 
//             name="name" 
//             value={formData.name}
//             placeholder="أدخل اسم المكان" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
//             style={{ borderColor: colors.primary, focusRing: colors.accent }} 
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>المدينة</label>
//           <input 
//             name="city" 
//             value={formData.city}
//             placeholder="المدينة" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group col-span-1 md:col-span-2">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>وصف قصير</label>
//           <input 
//             name="short_description" 
//             value={formData.short_description}
//             placeholder="وصف مختصر للمكان" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group col-span-1 md:col-span-2">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>وصف تفصيلي</label>
//           <textarea 
//             name="detailed_description" 
//             value={formData.detailed_description}
//             placeholder="وصف تفصيلي للمكان وما يتميز به" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 h-32" 
//             style={{ borderColor: colors.primary }}
//           ></textarea>
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>ساعات العمل</label>
//           <input 
//             name="working_hours" 
//             value={formData.working_hours}
//             placeholder="مثال: 09:00 - 17:00" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>تقييم</label>
//           <input 
//             name="rating" 
//             type="number" 
//             value={formData.rating}
//             min="0" 
//             max="5" 
//             step="0.1" 
//             placeholder="تقييم من 0 إلى 5" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>سعر التذكرة</label>
//           <input 
//             name="ticket_price" 
//             type="number" 
//             value={formData.ticket_price}
//             min="0" 
//             placeholder="سعر التذكرة" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>أفضل موسم للزيارة</label>
//           <select 
//             name="best_season" 
//             value={formData.best_season}
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           >
//             <option value="">اختر الموسم</option>
//             <option value="الربيع">الربيع</option>
//             <option value="الصيف">الصيف</option>
//             <option value="الخريف">الخريف</option>
//             <option value="الشتاء">الشتاء</option>
//             <option value="جميع المواسم">جميع المواسم</option>
//           </select>
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>رابط الخريطة</label>
//           <input 
//             name="map_link" 
//             value={formData.map_link}
//             type="url" 
//             placeholder="رابط الموقع على الخريطة" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>التصنيفات</label>
//           <input 
//             name="categories" 
//             value={formData.categories}
//             placeholder="تصنيفات مفصولة بفواصل (مثال: سياحي، تاريخي)" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>مناسب لـ</label>
//           <input 
//             name="suitable_for" 
//             value={formData.suitable_for}
//             placeholder="مناسب لـ (مثال: العائلات، الأطفال)" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>رقم الهاتف</label>
//           <input 
//             name="phone" 
//             value={formData.phone}
//             placeholder="رقم هاتف المكان" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group">
//           <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>الموقع الإلكتروني</label>
//           <input 
//             name="website" 
//             value={formData.website}
//             type="url" 
//             placeholder="رابط الموقع الإلكتروني" 
//             onChange={handleChange} 
//             className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
//             style={{ borderColor: colors.primary }}
//           />
//         </div>

//         <div className="input-group col-span-1 md:col-span-2">
//   <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>تحميل الصور</label>
//   <input 
//     type="file"
//     accept="image/*"
//     onChange={handleImageUpload}
//     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
//     style={{ borderColor: colors.primary }}
//   />

//   {formData.images.length > 0 && (
//     <div className="flex flex-wrap gap-4 mt-4">
//       {formData.images.map((url, index) => (
//         <div key={index} className="relative w-24 h-24 rounded overflow-hidden border shadow-sm group">
//           <img
//             src={url}
//             alt={`Uploaded ${index + 1}`}
//             className="w-full h-full object-cover"
//           />
//           <button
//             type="button"
//             onClick={() => handleImageDelete(url)}
//             className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
//             title="حذف"
//           >
//             ×
//           </button>
//         </div>
//       ))}
//     </div>
//   )}
// </div>
//         <div className="col-span-1 md:col-span-2 flex items-center space-x-3 mb-2 mt-2">
//           <input 
//             type="checkbox" 
//             name="is_free" 
//             checked={formData.is_free}
//             onChange={handleChange} 
//             className="w-5 h-5" 
//             style={{ accentColor: colors.accent }}
//           />
//           <label className="font-medium" style={{ color: colors.secondary }}>دخول مجاني</label>
//         </div>

//         <div className="col-span-1 md:col-span-2 mt-6">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full p-4 rounded-lg font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center"
//             style={{ 
//               backgroundColor: isSubmitting ? '#999' : colors.primary,
//               borderBottom: `4px solid ${colors.accent}`
//             }}
//           >
//             {isSubmitting ? "جاري الإرسال..." : "إضافة المكان"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddPlaceForm;




// import React, { useState } from "react";

// const AddPlaceForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     short_description: "",
//     detailed_description: "",
//     city: "",
//     working_hours: "",
//     rating: "",
//     ticket_price: "",
//     best_season: "",
//     is_free: false,
//     map_link: "",
//     categories: "",
//     suitable_for: "",
//     phone: "",
//     website: "",
//   });

//   const [images, setImages] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e, setFileState) => {
//     setFileState([...e.target.files]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);
  
//     const data = new FormData();
    
//     // إضافة البيانات الأخرى من formData
//     for (const key in formData) {
//       data.append(key, formData[key]);
//     }
  
//     // تحويل arrays من النصوص المنفصلة بفواصل إلى مصفوفات
//     data.append("categories", JSON.stringify(formData.categories.split(",").map((c) => c.trim())));
//     data.append("suitable_for", JSON.stringify(formData.suitable_for.split(",").map((s) => s.trim())));
  
//     data.append("contact", JSON.stringify({
//       phone: formData.phone,
//       website: formData.website,
//     }));
  
//     if (images) {
//       data.append("image", images); 
//     }
  
//     try {
//       const response = await fetch("http://localhost:9527/api/places/", {
//         method: "POST",
//         body: data,
//       });
  
//       if (!response.ok) {
//         throw new Error("فشل في إرسال البيانات");
//       }
  
//       const result = await response.json();
//       console.log("تم الإرسال بنجاح:", result);
//       setSubmitStatus("success");
//       setFormData({
//         name: "",
//         short_description: "",
//         detailed_description: "",
//         city: "",
//         working_hours: "",
//         rating: "",
//         ticket_price: "",
//         best_season: "",
//         is_free: false,
//         map_link: "",
//         categories: "",
//         suitable_for: "",
//         phone: "",
//         website: "",
//       });
//       setImages(null);  // إعادة تعيين الصور بعد الإرسال
//     } catch (error) {
//       console.error("خطأ أثناء الإرسال:", error);
//       setSubmitStatus("error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   return (
//     <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg my-40">
//       <h2 className="text-3xl font-bold text-center text-[#115173] mb-6">إضافة مكان جديد</h2>
//       <div className="w-24 h-1 mx-auto bg-[#FFD700] mb-6 rounded"></div>

//       {submitStatus === "success" && (
//         <div className="mb-6 p-4 bg-green-100 text-green-800 border-l-4 border-green-500 rounded">
//           تم إرسال معلومات المكان بنجاح!
//         </div>
//       )}
//       {submitStatus === "error" && (
//         <div className="mb-6 p-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded">
//           حدث خطأ أثناء الإرسال. حاول مرة أخرى.
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {/* Text inputs */}
//         {[
//           { name: "name", label: "اسم المكان" },
//           { name: "short_description", label: "وصف قصير" },
//           { name: "detailed_description", label: "وصف تفصيلي", type: "textarea" },
//           { name: "city", label: "المدينة" },
//           { name: "working_hours", label: "ساعات العمل" },
//           { name: "rating", label: "التقييم", type: "number" },
//           { name: "ticket_price", label: "سعر التذكرة", type: "number" },
//           { name: "map_link", label: "رابط الخريطة" },
//           { name: "categories", label: "التصنيفات (مفصولة بفواصل)" },
//           { name: "suitable_for", label: "مناسب لـ (مفصول بفواصل)" },
//           { name: "phone", label: "رقم الهاتف" },
//           { name: "website", label: "الموقع الإلكتروني" },
//         ].map(({ name, label, type = "text" }) => (
//           <div key={name} className={`input-group ${name === "detailed_description" ? "col-span-2" : ""}`}>
//             <label className="block mb-1 font-medium text-[#022C43]">{label}</label>
//             {type === "textarea" ? (
//               <textarea
//                 name={name}
//                 value={formData[name]}
//                 onChange={handleInputChange}
//                 className="w-full p-3 border rounded-lg"
//                 rows={4}
//               />
//             ) : (
//               <input
//                 type={type}
//                 name={name}
//                 value={formData[name]}
//                 onChange={handleInputChange}
//                 className="w-full p-3 border rounded-lg"
//               />
//             )}
//           </div>
//         ))}

//         {/* Best season */}
//         <div className="input-group">
//           <label className="block mb-1 font-medium text-[#022C43]">أفضل موسم</label>
//           <select
//             name="best_season"
//             value={formData.best_season}
//             onChange={handleInputChange}
//             className="w-full p-3 border rounded-lg"
//           >
//             <option value="">اختر الموسم</option>
//             <option value="الربيع">الربيع</option>
//             <option value="الصيف">الصيف</option>
//             <option value="الخريف">الخريف</option>
//             <option value="الشتاء">الشتاء</option>
//             <option value="جميع المواسم">جميع المواسم</option>
//           </select>
//         </div>

//         {/* is_free checkbox */}
//         <div className="input-group flex items-center gap-2 mt-6">
//           <input
//             type="checkbox"
//             name="is_free"
//             checked={formData.is_free}
//             onChange={handleInputChange}
//           />
//           <label className="font-medium text-[#022C43]">هل الدخول مجاني؟</label>
//         </div>

//         {/* Images upload */}
//         <input
//   type="file"
//   name="image"   // ✨✨✨
//   multiple
//   accept="image/*"
//   onChange={(e) => handleFileChange(e, setImages)}
//   className="w-full p-3 border rounded-lg"
// />



//         {/* Submit */}
//         <div className="col-span-2 mt-6">
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full py-3 bg-[#115173] text-white font-bold rounded-lg hover:bg-[#0d3c57] transition"
//           >
//             {isSubmitting ? "جاري الإرسال..." : "إرسال"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddPlaceForm;






import React, { useState } from "react";

const AddPlaceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    detailed_description: "",
    city: "",
    working_hours: "",
    rating: "",
    ticket_price: "",
    best_season: "",
    is_free: false,
    map_link: "",
    categories: "",
    suitable_for: "",
    phone: "",
    website: "",
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, setFileState) => {
    setFileState([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
  
    const data = new FormData();
    
    // إضافة البيانات الأخرى من formData
    for (const key in formData) {
      data.append(key, formData[key]);
    }
  
    // تحويل arrays من النصوص المنفصلة بفواصل إلى مصفوفات
    data.append("categories", JSON.stringify(formData.categories.split(",").map((c) => c.trim())));
    data.append("suitable_for", JSON.stringify(formData.suitable_for.split(",").map((s) => s.trim())));
  
    data.append("contact", JSON.stringify({
      phone: formData.phone,
      website: formData.website,
    }));
  
    if (images && images.length > 0) {
      images.forEach((image) => {
        data.append('images', image); // تأكد من استخدام 'images' (جمع) إذا كان multer يستخدم .array()
      });
    }

  
    try {
      const response = await fetch("http://localhost:9527/api/places/", {
        method: "POST",
        body: data,
      });
  
      if (!response.ok) {
        throw new Error("فشل في إرسال البيانات");
      }
  
      const result = await response.json();
      console.log("تم الإرسال بنجاح:", result);
      setSubmitStatus("success");
      setFormData({
        name: "",
        short_description: "",
        detailed_description: "",
        city: "",
        working_hours: "",
        rating: "",
        ticket_price: "",
        best_season: "",
        is_free: false,
        map_link: "",
        categories: "",
        suitable_for: "",
        phone: "",
        website: "",
      });
      setImages(null);  // إعادة تعيين الصور بعد الإرسال
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg my-40">
      <h2 className="text-3xl font-bold text-center text-[#115173] mb-6">إضافة مكان جديد</h2>
      <div className="w-24 h-1 mx-auto bg-[#FFD700] mb-6 rounded"></div>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 border-l-4 border-green-500 rounded">
          تم إرسال معلومات المكان بنجاح!
        </div>
      )}
      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded">
          حدث خطأ أثناء الإرسال. حاول مرة أخرى.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Text inputs */}
        {[
          { name: "name", label: "اسم المكان" },
          { name: "short_description", label: "وصف قصير" },
          { name: "detailed_description", label: "وصف تفصيلي", type: "textarea" },
          { name: "city", label: "المدينة" },
          { name: "working_hours", label: "ساعات العمل" },
          { name: "rating", label: "التقييم", type: "number" },
          { name: "ticket_price", label: "سعر التذكرة", type: "number" },
          { name: "map_link", label: "رابط الخريطة" },
          { name: "categories", label: "التصنيفات (مفصولة بفواصل)" },
          { name: "suitable_for", label: "مناسب لـ (مفصول بفواصل)" },
          { name: "phone", label: "رقم الهاتف" },
          { name: "website", label: "الموقع الإلكتروني" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name} className={`input-group ${name === "detailed_description" ? "col-span-2" : ""}`}>
            <label className="block mb-1 font-medium text-[#022C43]">{label}</label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                rows={4}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
            )}
          </div>
        ))}

        {/* Best season */}
        <div className="input-group">
          <label className="block mb-1 font-medium text-[#022C43]">أفضل موسم</label>
          <select
            name="best_season"
            value={formData.best_season}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">اختر الموسم</option>
            <option value="الربيع">الربيع</option>
            <option value="الصيف">الصيف</option>
            <option value="الخريف">الخريف</option>
            <option value="الشتاء">الشتاء</option>
            <option value="جميع المواسم">جميع المواسم</option>
          </select>
        </div>

        {/* is_free checkbox */}
        <div className="input-group flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            name="is_free"
            checked={formData.is_free}
            onChange={handleInputChange}
          />
          <label className="font-medium text-[#022C43]">هل الدخول مجاني؟</label>
        </div>

        {/* Images upload */}
        <input
  type="file"
  name="image"   // ✨✨✨
  multiple
  accept="image/*"
  onChange={(e) => handleFileChange(e, setImages)}
  className="w-full p-3 border rounded-lg"
/>



        {/* Submit */}
        <div className="col-span-2 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#115173] text-white font-bold rounded-lg hover:bg-[#0d3c57] transition"
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlaceForm;
