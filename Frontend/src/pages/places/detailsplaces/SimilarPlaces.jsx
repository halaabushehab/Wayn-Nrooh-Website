import React, { useState, useEffect } from "react";
import axios from "axios";

const SimilarPlaces = ({ category }) => {
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:9527/api/places/category/${encodeURIComponent(category)}`)
      .then((response) => {
        setRelatedPlaces(response.data.slice(0, 6));
        setLoading(false);
      })
      .catch((error) => {
        setError("حدث خطأ أثناء جلب الأماكن المشابهة.");
        setLoading(false);
      });
  }, [category]);

  if (loading) return <p>جاري تحميل الأماكن المشابهة...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {relatedPlaces.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {relatedPlaces.map((place) => (
            <li
              key={place.id || place._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{place.name}</h3>
              <p className="text-sm text-gray-600">{place.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>لا توجد أماكن مشابهة لعرضها.</p>
      )}
    </div>
  );
};

export default SimilarPlaces;
