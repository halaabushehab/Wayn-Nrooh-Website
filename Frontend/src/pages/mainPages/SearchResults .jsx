import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt, FaClock, FaStar } from "react-icons/fa";
import { GiModernCity } from "react-icons/gi";
import { Link } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState({
    places: [],
    articles: [],
    cities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // استخراج query من الـ URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:9527/api/places/search?query=${query}`);
        setResults(response.data.results);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) return <div className="text-center py-20">جاري البحث...</div>;
  if (error) return <div className="text-center py-20 text-red-500">حدث خطأ: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        نتائج البحث عن: "{query}"
      </h1>

      {/* نتائج الأماكن */}
      {results.places.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaMapMarkerAlt className="ml-2" /> الأماكن
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.places.map((place) => (
              <Link
                to={`/place/${place._id}`}
                key={place._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={place.images[0]}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{place.name}</h3>
                  <p className="text-gray-600 mb-2">{place.short_description}</p>
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="ml-1" />
                    <span>{place.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* نتائج المقالات */}
      {results.articles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <FaClock className="ml-2" /> المقالات
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.articles.map((article) => (
              <Link
                to={`/article/${article._id}`}
                key={article._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* نتائج المدن */}
      {results.cities.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <GiModernCity className="ml-2" /> المدن
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.cities.map((city, index) => (
              <button
                key={index}
                onClick={() => navigate(`/location?city=${city.name}`)}
                className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 transition-colors text-center"
              >
                <h3 className="font-medium">{city.name}</h3>
                <p className="text-sm text-gray-500">
                  {city.placesCount} مكان
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {results.places.length === 0 &&
        results.articles.length === 0 &&
        results.cities.length === 0 && (
          <div className="text-center py-12">
            <FaSearch className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-xl">لا توجد نتائج مطابقة للبحث</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        )}
    </div>
  );
};

export default SearchResults;