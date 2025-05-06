import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchModal = ({ isOpen, onClose, popularSearches = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // جلب الاقتراحات التلقائية عند تغيير حقل البحث
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 2) {
        try {
          // إضافة محاولات للتأكد من المعاملات المتوافقة
          const response = await axios.get("http://localhost:9527/api/places/search", {
            params: { q: searchQuery.trim(), limit: 10 },
          });
          
          // تعيين الاقتراحات التي يتم جلبها من الـ API
          setSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching suggestions:", error.response ? error.response.data : error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // التوجيه إلى صفحة البحث الخاصة بالأماكن بناءً على الاستعلام
      navigate(`/places/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
      setSearchQuery("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div
          className="bg-white rounded-xl w-full max-w-2xl z-50 p-6 shadow-2xl transform transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#022C43]">ابحث عن وجهاتك المفضلة</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-[#022C43] transition-colors p-1 rounded-full"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن مدينة، مقال، أو وجهة..."
                className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-right text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] p-2 rounded-lg hover:bg-[#FFD700]/90 transition-colors"
              >
                <FaSearch className="text-[#022C43]" />
              </button>
            </div>

            {/* عرض الاقتراحات التلقائية */}
            {suggestions.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer text-right"
                    onClick={() => {
                      setSearchQuery(item.name);
                      setSuggestions([]); // إغلاق الاقتراحات عند الاختيار
                    }}
                  >
                    {item.name} - <span className="text-gray-500">{item.type}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1.5 bg-[#F0F0F0] text-[#022C43] rounded-full text-sm hover:bg-[#115173] hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
