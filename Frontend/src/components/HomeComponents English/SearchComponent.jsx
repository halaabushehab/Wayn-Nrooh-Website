import React, { useState } from "react";

const RefinedSearchComponent = ({ setSearchResults }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hovering, setHovering] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    price: "",
  });

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSelect = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
    setOpenDropdown(null);
  };

  const handleSearch = async () => {
    setSearchResults(data);
console.log("✅ البيانات بعد التحديث:", data);
    const queryParams = new URLSearchParams(filters).toString();
    const url = `http://localhost:9527/api/places?${queryParams}`;

    console.log("🔍 البحث باستخدام الرابط:", url); // ✅ طباعة الرابط لمعرفة القيم المرسلة

    try {
      const response = await fetch(url);

      console.log("📩 استجابة السيرفر:", response.status); // ✅ هل الاستجابة ناجحة؟

      if (!response.ok) {
        console.error("❌ خطأ في البحث:", response.statusText);
        return;
      }

      const data = await response.json();

      console.log("📊 النتائج المستلمة:", data); // ✅ عرض البيانات المستلمة

      setSearchResults(data);
    } catch (error) {
      console.error("❌ حدث خطأ أثناء البحث:", error.message);
    }
  };

  return (
    <div 
      className="relative p-6 rounded-lg w-full max-w-3xl mx-auto overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        background: hovering 
          ? 'linear-gradient(135deg, #115173, rgba(10, 30, 60, 0.2))' 
          : 'linear-gradient(135deg, #115173, rgba(10, 30, 60, 0.2))',
        backdropFilter: 'blur(5px)',
        transition: 'all 0.4s ease-in-out'
      }}
    >
      <h2 className="text-[#022C43] text-xl font-bold mb-4 text-right">ما الذي تبحث عنه؟</h2>

      <div className="space-y-3">
        {/* اختيار المدينة */}
        <div className="relative">
          <button type="button" onClick={() => toggleDropdown('destination')} className="w-full p-3 rounded-md text-right bg-white text-[#022C43]">
            <span className="flex items-center justify-between">
              <span>{filters.city || "اختر وجهتك"}</span>
            </span>
          </button>
          {openDropdown === 'destination' && (
            <ul className="absolute left-0 w-full bg-white rounded-md shadow-lg mt-1 z-50">
              {["عمان", "الزرقاء", "إربد"].map((city) => (
                <li key={city} onClick={() => handleSelect('city', city)} className="p-2 hover:bg-blue-50 cursor-pointer text-right text-[#022C43]">{city}</li>
              ))}
            </ul>
          )}
        </div>

        {/* اختيار الفئة */}
        <div className="relative">
          <button type="button" onClick={() => toggleDropdown('category')} className="w-full p-3 rounded-md text-right bg-white text-[#022C43]">
            <span className="flex items-center justify-between">
              <span>{filters.category || "جميع التصنيفات"}</span>
            </span>
          </button>
          {openDropdown === 'category' && (
            <ul className="absolute left-0 w-full bg-white rounded-md shadow-lg mt-1 z-50">
              {[
                "العائلات", "محبي التاريخ", "المغامرين", "الأطفال", 
                "محبي التسوق", "محبي الطبيعة", "عشاق السيارات", 
                "الطلاب", "المستكشفين", "محبي الفنون", "محبي الرياضة", 
                "السياح", "الأصدقاء", "الباحثون عن الترفيه", "الباحثون عن الهدوء"
              ].map((category) => (
                <li key={category} onClick={() => handleSelect('category', category)} className="p-2 hover:bg-blue-50 cursor-pointer text-right text-[#022C43]">{category}</li>
              ))}
            </ul>
          )}
        </div>

        {/* اختيار السعر */}
        <div className="relative">
          <button type="button" onClick={() => toggleDropdown('price')} className="w-full p-3 rounded-md text-right bg-white text-[#022C43]">
            <span className="flex items-center justify-between">
              <span>{filters.price || "نطاق الأسعار"}</span>
            </span>
          </button>
          {openDropdown === 'price' && (
            <ul className="absolute left-0 w-full bg-white rounded-md shadow-lg mt-1 z-50">
              {["مجانا", "أقل من 5 دينار", "أكثر من 5 دينار"].map((price) => (
                <li key={price} onClick={() => handleSelect('price', price)} className="p-2 hover:bg-blue-50 cursor-pointer text-right text-[#022C43]">{price}</li>
              ))}
            </ul>
          )}
        </div>

        {/* زر البحث */}
        <button type="button" onClick={handleSearch} className="w-full bg-yellow-400 text-black py-3 rounded-md font-medium hover:bg-yellow-500">
          بحث
        </button>
      </div>
    </div>
  );
};

export default RefinedSearchComponent;
