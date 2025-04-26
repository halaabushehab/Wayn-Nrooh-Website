import React, { useState } from "react";
import { FaCamera, FaMapMarkerAlt, FaClock, FaStar, FaTicketAlt, FaCalendarAlt, FaPhone, FaGlobe } from "react-icons/fa";

const AdminAddPlaceForm = () => {
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
        throw new Error("Failed to submit data");
      }
  
      const result = await response.json();
      console.log("Submission successful:", result);
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
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md my-8 border border-gray-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#022C43] mb-2">
          إضافة مكان  جديد  
        </h2>
        <p className="text-[#115173]">إدارة المحتوى | إضافة أماكن جديدة للموقع</p>
      </div>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          تمت إضافة المكان بنجاح!
        </div>
      )}
      
      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          حدث خطأ! يرجى التأكد من تعبئة جميع الحقول المطلوبة.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e1e8eb]">
          <h3 className="text-xl font-semibold text-[#022C43] mb-4 pb-2 border-b border-[#e1e8eb]">
            المعلومات الأساسية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Place Name */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaMapMarkerAlt className="ml-2 text-[#115173]" />
                اسم المكان *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43]">
                المدينة *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
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

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-[#022C43]">
                وصف مختصر *
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e1e8eb]">
          <h3 className="text-xl font-semibold text-[#022C43] mb-4 pb-2 border-b border-[#e1e8eb]">
            التفاصيل
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Working Hours */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaClock className="ml-2 text-[#115173]" />
                ساعات العمل
              </label>
              <input
                type="text"
                name="working_hours"
                value={formData.working_hours}
                onChange={handleInputChange}
                placeholder="مثال: 8:00 صباحاً - 5:00 مساءً"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaStar className="ml-2 text-[#115173]" />
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
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>

            {/* Ticket Price */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaTicketAlt className="ml-2 text-[#115173]" />
                سعر التذكرة (دينار أردني)
              </label>
              <input
                type="number"
                name="ticket_price"
                value={formData.ticket_price}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>

            {/* Best Season */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaCalendarAlt className="ml-2 text-[#115173]" />
                أفضل موسم للزيارة
              </label>
              <select
                name="best_season"
                value={formData.best_season}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              >
                <option value="">اختر الموسم</option>
                <option value="الربيع">الربيع</option>
                <option value="الصيف">الصيف</option>
                <option value="الخريف">الخريف</option>
                <option value="الشتاء">الشتاء</option>
                <option value="جميع المواسم">جميع المواسم</option>
              </select>
            </div>

            {/* Is Free */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-300">
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#115173] rounded focus:ring-[#115173]"
              />
              <label className="font-medium text-[#022C43]">الدخول مجاني</label>
            </div>

            {/* Map Link */}
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-[#022C43]">
                رابط الخريطة (Google Maps)
              </label>
              <input
                type="url"
                name="map_link"
                value={formData.map_link}
                onChange={handleInputChange}
                placeholder="https://goo.gl/maps/..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e1e8eb]">
          <h3 className="text-xl font-semibold text-[#022C43] mb-4 pb-2 border-b border-[#e1e8eb]">
            التصنيفات
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categories */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43]">
                التصنيفات
              </label>
              <input
                type="text"
                name="categories"
                value={formData.categories}
                onChange={handleInputChange}
                placeholder="مفصولة بفواصل: تاريخي, طبيعي, ترفيهي"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>

            {/* Suitable For */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43]">
                مناسب لـ
              </label>
              <input
                type="text"
                name="suitable_for"
                value={formData.suitable_for}
                onChange={handleInputChange}
                placeholder="مفصولة بفواصل: عائلات, أفراد, أطفال"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e1e8eb]">
          <h3 className="text-xl font-semibold text-[#022C43] mb-4 pb-2 border-b border-[#e1e8eb]">
            معلومات الاتصال
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaPhone className="ml-2 text-[#115173]" />
                رقم الهاتف
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block mb-2 font-medium text-[#022C43] flex items-center">
                <FaGlobe className="ml-2 text-[#115173]" />
                الموقع الإلكتروني
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Detailed Description Section */}
        <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e1e8eb]">
          <h3 className="text-xl font-semibold text-[#022C43] mb-4 pb-2 border-b border-[#e1e8eb]">
            الوصف التفصيلي
          </h3>
          
          <div>
            <textarea
              name="detailed_description"
              value={formData.detailed_description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent"
              rows={6}
              placeholder="أخبرنا المزيد عن هذا المكان... تاريخه، مميزاته، الأنشطة المتاحة، وأي معلومات أخرى تود مشاركتها"
            />
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-[#f8fafc] p-6 rounded-lg border border-[#e1e8eb]">
          <h3 className="text-xl font-semibold text-[#022C43] mb-4 pb-2 border-b border-[#e1e8eb]">
            صور المكان
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
            <label className="cursor-pointer flex flex-col items-center">
              <FaCamera className="text-4xl text-[#115173] mb-3" />
              <span className="block text-lg font-medium text-[#022C43] mb-1">انقر لتحميل الصور</span>
              <span className="block text-sm text-gray-500 mb-3">(يمكنك تحميل أكثر من صورة)</span>
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
                className="px-4 py-2 bg-[#115173] text-white rounded-md hover:bg-[#0d3c57] transition"
              >
                اختر الصور
              </button>
            </label>
          </div>
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-[#022C43] mb-3">الصور المختارة:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md border border-gray-300"
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

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#115173] text-white font-bold rounded-md hover:bg-[#0d3c57] transition shadow-md flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </>
            ) : (
              "حفظ المكان"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddPlaceForm;