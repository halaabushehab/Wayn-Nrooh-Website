
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
  
//     if (images && images.length > 0) {
//       images.forEach((image) => {
//         data.append('images', image); // تأكد من استخدام 'images' (جمع) إذا كان multer يستخدم .array()
//       });
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
import { FaCamera, FaMapMarkerAlt, FaClock, FaStar, FaTicketAlt, FaCalendarAlt, FaPhone, FaGlobe } from "react-icons/fa";

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
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // إنشاء معاينات للصور
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
  
    // التحقق من الصحة
    if (!formData.name || !formData.city || !formData.short_description) {
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    
    for (const key in formData) {
      data.append(key, formData[key]);
    }
  
    data.append("categories", JSON.stringify(formData.categories.split(",").map((c) => c.trim())));
    data.append("suitable_for", JSON.stringify(formData.suitable_for.split(",").map((s) => s.trim())));
  
    data.append("contact", JSON.stringify({
      phone: formData.phone,
      website: formData.website,
    }));
  
    if (images.length > 0) {
      images.forEach((image) => {
        data.append('images', image);
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
      
      // إعادة تعيين النموذج
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
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-b from-white to-[#f5f9fa] rounded-2xl shadow-xl my-10 border border-[#e1e8eb]">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-[#115173] mb-3 relative inline-block">
          إضافة مكان جديد
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-[#f5f9fa]"></span>
        </h2>
        <p className="text-[#5a7d9a]">شاركنا بمعلومات عن أماكن رائعة في الأردن</p>
      </div>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          تم إرسال معلومات المكان بنجاح!
        </div>
      )}
      
      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          حدث خطأ أثناء الإرسال. يرجى التأكد من تعبئة جميع الحقول المطلوبة.
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* القسم الأول: المعلومات الأساسية */}
        <div className="space-y-5">
          {/* اسم المكان */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43] flex items-center">
              <FaMapMarkerAlt className="ml-2 text-[#FFD700]" />
              اسم المكان *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              required
            />
          </div>

          {/* وصف قصير */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43]">وصف قصير *</label>
            <textarea
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              rows={3}
              required
            />
          </div>

          {/* المدينة */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43]">المدينة *</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              required
            >
              <option value="">اختر المدينة</option>
              <option value="عمان">عمان</option>
              <option value="الزرقاء">الزرقاء</option>
              <option value="إربد">إربد</option>
              <option value="العقبة">العقبة</option>
              <option value="الكرك">الكرك</option>
              <option value="مادبا">مادبا</option>
              <option value="السلط">السلط</option>
              <option value="جرش">جرش</option>
              <option value="عجلون">عجلون</option>
              <option value="معان">معان</option>
              <option value="الطفيلة">الطفيلة</option>
              <option value="المفرق">المفرق</option>
              <option value="البتراء">البتراء</option>
              <option value="وادي رم">وادي رم</option>
            </select>
          </div>

          {/* ساعات العمل */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43] flex items-center">
              <FaClock className="ml-2 text-[#FFD700]" />
              ساعات العمل
            </label>
            <input
              type="text"
              name="working_hours"
              value={formData.working_hours}
              onChange={handleInputChange}
              placeholder="مثال: 8:00 صباحاً - 5:00 مساءً"
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
            />
          </div>

          {/* التقييم */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43] flex items-center">
              <FaStar className="ml-2 text-[#FFD700]" />
              التقييم (من 5)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
            />
          </div>
        </div>

        {/* القسم الثاني: التفاصيل الإضافية */}
        <div className="space-y-5">
          {/* سعر التذكرة */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43] flex items-center">
              <FaTicketAlt className="ml-2 text-[#FFD700]" />
              سعر التذكرة (دينار أردني)
            </label>
            <input
              type="number"
              name="ticket_price"
              value={formData.ticket_price}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
            />
          </div>

          {/* أفضل موسم */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43] flex items-center">
              <FaCalendarAlt className="ml-2 text-[#FFD700]" />
              أفضل موسم للزيارة
            </label>
            <select
              name="best_season"
              value={formData.best_season}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
            >
              <option value="">اختر الموسم</option>
              <option value="الربيع">الربيع</option>
              <option value="الصيف">الصيف</option>
              <option value="الخريف">الخريف</option>
              <option value="الشتاء">الشتاء</option>
              <option value="جميع المواسم">جميع المواسم</option>
            </select>
          </div>

          {/* هل الدخول مجاني؟ */}
          <div className="input-group flex items-center gap-3 p-3 bg-[#f8fafc] rounded-lg border border-[#e1e8eb]">
            <input
              type="checkbox"
              name="is_free"
              checked={formData.is_free}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#115173] rounded focus:ring-[#115173]"
            />
            <label className="font-medium text-[#022C43]">الدخول مجاني</label>
          </div>

          {/* رابط الخريطة */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43]">رابط الخريطة (Google Maps)</label>
            <input
              type="url"
              name="map_link"
              value={formData.map_link}
              onChange={handleInputChange}
              placeholder="https://goo.gl/maps/..."
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
            />
          </div>

          {/* التصنيفات */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43]">التصنيفات</label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleInputChange}
              placeholder="مفصولة بفواصل: تاريخي, طبيعي, ترفيهي"
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
            />
          </div>

          {/* مناسب لـ */}
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43]">مناسب لـ</label>
            <input
              type="text"
              name="suitable_for"
              value={formData.suitable_for}
              onChange={handleInputChange}
              placeholder="مفصولة بفواصل: عائلات, أفراد, أطفال"
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
            />
          </div>
        </div>

        {/* القسم الثالث: معلومات الاتصال */}
        <div className="md:col-span-2 space-y-5">
          <h3 className="text-xl font-bold text-[#115173] border-b pb-2 border-[#e1e8eb]">معلومات الاتصال</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* رقم الهاتف */}
            <div className="input-group">
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaPhone className="ml-2 text-[#FFD700]" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>

            {/* الموقع الإلكتروني */}
            <div className="input-group">
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaGlobe className="ml-2 text-[#FFD700]" />
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* القسم الرابع: الوصف التفصيلي */}
        <div className="md:col-span-2">
          <div className="input-group">
            <label className="block mb-2 font-medium text-[#022C43]">وصف تفصيلي عن المكان</label>
            <textarea
              name="detailed_description"
              value={formData.detailed_description}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#d1dbe3] rounded-lg focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              rows={6}
              placeholder="أخبرنا المزيد عن هذا المكان... تاريخه، مميزاته، الأنشطة المتاحة، وأي معلومات أخرى تود مشاركتها"
            />
          </div>
        </div>

        {/* القسم الخامس: تحميل الصور */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-[#115173] border-b pb-2 border-[#e1e8eb] mb-4">صور المكان</h3>
          
          <div className="border-2 border-dashed border-[#d1dbe3] rounded-lg p-6 text-center bg-[#f8fafc]">
            <label className="cursor-pointer flex flex-col items-center">
              <FaCamera className="text-4xl text-[#5a7d9a] mb-3" />
              <span className="block text-lg font-medium text-[#022C43] mb-1">انقر لتحميل الصور</span>
              <span className="block text-sm text-[#5a7d9a] mb-3">(يمكنك تحميل أكثر من صورة)</span>
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                className="px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#0d3c57] transition"
              >
                اختر الصور
              </button>
            </label>
          </div>
          
          {/* معاينة الصور */}
          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-[#022C43] mb-3">الصور المختارة:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`معاينة ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-[#d1dbe3]"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* زر الإرسال */}
        <div className="md:col-span-2 mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#115173] to-[#0d3c57] text-white font-bold rounded-lg hover:from-[#0d3c57] hover:to-[#115173] transition shadow-md flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الإرسال...
              </>
            ) : (
              "إرسال المكان"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlaceForm;