import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlaceCard } from "../../components/HomeComponents/PlaceCard";

const SearchResultsPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const [results, setResults] = useState({
    places: [],
    articles: [],
    cities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("places");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      console.log("كلمة البحث:", query); // ✅ تأكيد وصول الكلمة
  
      if (!query) {
        setError("الرجاء إدخال كلمة البحث");
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:9527/=/api/search/main-search", {
          params: { 
            query: query,
            page: pagination.page,
            limit: pagination.limit
          }
        });
  
        console.log("نتائج البحث:", response.data); // ✅ للتأكد من البيانات الراجعة
        setResults(response.data); // ✅ لازم تحدّثي النتائج هنا
      } catch (err) {
        setError("حدث خطأ أثناء جلب نتائج البحث");
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchResults();
  }, [query, pagination.page]);
  

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!query) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-[#022C43]">الرجاء إدخال كلمة البحث</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#022C43]">
        نتائج البحث عن: <span className="text-[#FFD700]">{query}</span>
      </h1>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === "places" ? "text-[#FFD700] border-b-2 border-[#FFD700]" : "text-gray-500"}`}
          onClick={() => setActiveTab("places")}
        >
          الأماكن ({results.places.length})
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "articles" ? "text-[#FFD700] border-b-2 border-[#FFD700]" : "text-gray-500"}`}
          onClick={() => setActiveTab("articles")}
        >
          المقالات ({results.articles.length})
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === "cities" ? "text-[#FFD700] border-b-2 border-[#FFD700]" : "text-gray-500"}`}
          onClick={() => setActiveTab("cities")}
        >
          المدن ({results.cities.length})
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700]"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          {activeTab === "places" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.places.length > 0 ? (
                results.places.map((place) => (
                  <PlaceCard key={place._id} place={place} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  لا توجد أماكن مطابقة للبحث
                </p>
              )}
            </div>
          )}
          
          {activeTab === "articles" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.articles.length > 0 ? (
                results.articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  لا توجد مقالات مطابقة للبحث
                </p>
              )}
            </div>
          )}
          
          {activeTab === "cities" && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.cities.length > 0 ? (
                results.cities.map((city, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/places?city=${encodeURIComponent(city.name)}`)}
                  >
                    <h3 className="font-semibold text-lg text-[#022C43]">{city.name}</h3>
                    <p className="text-gray-600">{city.placesCount} أماكن</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  لا توجد مدن مطابقة للبحث
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;