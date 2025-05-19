import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from "react-icons/fa";

const SeasonalPopup = ({ setShowPopup }) => {
  const [topPlace, setTopPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopBookedPlace = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:9527/api/payments/stats/top-booked");
        const top = res.data.topPlaces?.[0];

        if (top) {
          try {
            const placeDetails = await axios.get(`http://localhost:9527/api/places/${top.placeId}`);
            setTopPlace({
              ...top,
              ...placeDetails.data,
              placeImage: placeDetails.data.images?.[0] || getDefaultImage()
            });
          } catch (err) {
            console.error("Error fetching place details:", err);
            setTopPlace({
              ...top,
              placeImage: getDefaultImage(),
              error: true
            });
          }
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching top booked places:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTopBookedPlace();
  }, []);

  const getDefaultImage = () => {
    const defaultImages = [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  const handleBackgroundClick = () => setShowPopup(false);
  const handleContentClick = (e) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-opacity-30 z-50 flex justify-center items-center"
      onClick={handleBackgroundClick}
    >
      <div
        onClick={handleContentClick}
        className="relative w-full max-w-4xl h-[40vh] bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl border-4 border-[#FFD700]"
        style={{ backgroundImage: `url(${topPlace?.images[0]})` }}
      >
        <div className="absolute inset-0 bg-opacity-60 p-8 flex flex-col justify-center items-center text-white text-center">
          <button
            aria-label="Close popup"
            onClick={() => setShowPopup(false)}
            className="absolute top-4 left-4 text-white text-3xl font-bold hover:text-[#FFD700]-500 transition"
          >
            &times;
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-l-[#FFD700] rounded-full animate-spin mb-4"></div>
              <p className="text-white">Loading data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-5 rounded-xl max-w-md">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-[#FFD700] text-white px-4 py-2 rounded hover:bg-red-500"
              >
                Try Again
              </button>
            </div>
          ) : topPlace ? (
            <>
              <h2 className="text-3xl font-bold mb-3">#1 Most Booked Place This Season</h2>
              <h3 className="text-2xl font-semibold mb-2">{topPlace.name}</h3>
              <p className="max-w-xl text-sm mb-6">{topPlace.short_description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold">
                {/* You can add icons or info here as needed */}
              </div>
              <div className="mt-6 bg-white text-[#2C3E50] px-5 py-3 rounded-xl shadow">
                🎁 Get 15% off when you book more than one place this season!
              </div>
            </>
          ) : (
            <p className="text-white text-lg">No offers available at the moment</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonalPopup;
