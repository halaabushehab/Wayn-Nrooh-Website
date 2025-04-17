import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import RatingPlace from "../../components/RatingPlace";
import { useNavigate } from "react-router-dom";
import { MapPinIcon, StarIcon, HeartIcon, Clock, Ticket, Map, CameraIcon } from "lucide-react";
import { toast } from "sonner";

const categoryImages = {
  متاحف:
    "https://i.pinimg.com/736x/97/1c/12/971c12d6c4e11ce77db2c039e73bb0b5.jpg", // متاحف
  تسوق: "https://i.pinimg.com/736x/bb/16/5e/bb165e49947484ef6a8fa1849eae53e0.jpg", // تسوق
  اثري: "https://i.pinimg.com/736x/df/51/0b/df510b0f6a90123515b2e77d1ef45416.jpg", // مكان أثري
  مطاعم:
    "https://i.pinimg.com/736x/ab/8a/56/ab8a56a21f7caa5db083ff5b0f5b63f3.jpg", // مطاعم
  تعليمي:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2NA1I289e4ZIaBhycEYZ3Iq1KVD307uTzkg&s", // تعليمي
  ترفيه:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2NA1I289e4ZIaBhycEYZ3Iq1KVD307uTzkg&s", // ترفيه
  منتزهات:
    "https://www.7iber.com/wp-content/uploads/2015/05/Daheyet-Al-Hussein-Park-001.jpg", // حدائق
};

const PlaceDetails = () => {
  const [museums, setMuseums] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        console.log("🔍 Fetching from:", `http://localhost:9527/places/${id}`);
        const response = await axios.get(`http://localhost:9527/places/${id}`);
        console.log("✅ Data received:", response.data);
        setPlace(response.data);
      } catch (err) {
        console.error(
          "❌ Error fetching place details:",
          err.response?.data || err.message
        );
        setError("حدث خطأ أثناء جلب البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [id]);

  useEffect(() => {
    if (!place || !place.categories || place.categories.length === 0) return;

    const category = encodeURIComponent(place.categories[0]);
    console.log("🔍 Fetching related places for category:", category);

    axios
      .get(`http://localhost:9527/places/category/${category}`)
      .then((response) => {
        console.log("✅ Related places data received:", response.data);
        setRelatedPlaces(response.data.slice(0, 6));
      })
      .catch((error) =>
        console.error("❌ Error fetching related places:", error)
      );
  }, [place]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-xl text-blue-600 font-semibold">جارٍ التحميل...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-red-50">
      <div className="bg-white p-8 rounded-xl shadow-lg border-r-4 border-red-500">
        <p className="text-xl text-red-600">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          العودة للخلف
        </button>
      </div>
    </div>
  );
  
  if (!place) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-xl text-gray-600">لم يتم العثور على المكان.</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  const handleClick = () => {
    if (place.is_free) {
      toast.warning("لا يوجد حاجة لحجز تذاكر لهذا الموقع، يمكنك الذهاب مباشرة!");
    } else {
      navigate(`/pay/${place._id}`);
    }
  };

  const handleNearbyPlaces = () => {
    if (!navigator.geolocation) {
      return toast.error("متصفحك لا يدعم تحديد الموقع الجغرافي");
    }
  
    toast.loading("جاري تحديد موقعك...");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
  
      try {
        const res = await axios.get("http://localhost:9527/places/nearby", {
          params: {
            lat: userLat,
            lng: userLng,
          },
        });
  
        const nearbyPlaces = res.data;
        setNearbyPlaces(nearbyPlaces);
        toast.success("تم العثور على أماكن قريبة!");
        
        // Scroll to nearby places section or show modal
        const section = document.getElementById("nearby-places");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        console.error("❌ خطأ في جلب الأماكن القريبة:", error);
        toast.error("حدث خطأ أثناء جلب الأماكن القريبة");
      }
    }, () => {
      toast.error("تعذر تحديد موقعك الجغرافي");
    });
  };

  const getCategoryImage = (category) => {
    return categoryImages[category] || categoryImages["متاحف"];
  };

  return (
    <>
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url(${place.images?.[0]})`,
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 flex flex-col justify-end">
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse mb-2">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                {place.is_free ? "مجاني" : `${place.ticket_price} دينار`}
              </span>
              <div className="flex items-center text-yellow-400">
                <StarIcon className="w-5 h-5 fill-current" />
                <span className="ms-1 text-white font-semibold">{place.rating}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">{place.name}</h1>
            <p className="text-xl text-gray-200 max-w-2xl">{place.short_description}</p>
            
            <div className="flex gap-2 mt-4 flex-wrap">
              {place.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-1.5 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <CameraIcon className="w-6 h-6 mr-2 text-blue-600" />
                  <span>معرض الصور</span>
                </h2>
                
                <div className="relative mb-4 rounded-xl overflow-hidden aspect-video">
                  <img 
                    src={place.images?.[activeImageIndex] || place.images?.[0]} 
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  
                  <button 
                    onClick={() => setShowGalleryModal(true)}
                    className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition"
                  >
                    عرض كل الصور
                  </button>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {place.images?.slice(0, 4).map((img, idx) => (
                    <div 
                      key={idx}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                        activeImageIndex === idx ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img 
                        src={img} 
                        alt={`${place.name} - ${idx+1}`}
                        className="w-full h-24 object-cover hover:opacity-90 transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">وصف المكان</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {place.detailed_description}
                </p>
              </div>
            </div>

            {/* Rating Section */}
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">قيّم زيارتك</h2>
              {place && <RatingPlace placeId={place._id} />}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-[#115173] text-white p-6 rounded-2xl shadow-xl mb-6">
                <h3 className="text-xl font-bold mb-6 text-center pb-4 border-b border-white/20">معلومات المكان</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-lg mr-3">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-gray-300 text-sm">سعر التذكرة</h4>
                      <p className="font-semibold">{place.is_free ? "مجاني" : `${place.ticket_price} دينار`}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-lg mr-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-gray-300 text-sm">ساعات العمل</h4>
                      <p className="font-semibold">{place.working_hours}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-lg mr-3">
                      <MapPinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-gray-300 text-sm">الموقع</h4>
                      <p className="font-semibold">{place.city || "الأردن"}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClick}
                  className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {place.is_free ? "الدخول مجاني" : "شراء التذكرة"}
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">خيارات إضافية</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleNearbyPlaces}
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition border border-gray-200"
                    >
                      <span className="font-medium">أماكن قريبة مني</span>
                      <MapPinIcon className="w-5 h-5 text-blue-600" />
                    </button>
                    
                    <a
                      href={place.location ? `https://www.google.com/maps?q=${place.location.latitude},${place.location.longitude}` : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition border border-gray-200"
                    >
                      <span className="font-medium">عرض على الخريطة</span>
                      <Map className="w-5 h-5 text-blue-600" />
                    </a>
                    
                    <button
                      onClick={() => {
                        const section = document.getElementById("similar-places");
                        if (section) section.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition border border-gray-200"
                    >
                      <span className="font-medium">أماكن مشابهة</span>
                      <StarIcon className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Places */}
      <section 
        className="relative py-16 md:py-24 bg-cover bg-center bg-fixed"
        id="similar-places"
        style={{
          backgroundImage: `url(${
            place?.categories?.length > 0 
              ? getCategoryImage(place.categories[0]) 
              : categoryImages["متاحف"]
          })`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-black/90 z-10"></div>

        <div className="container relative z-20 mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/10 backdrop-blur-sm text-yellow-300 px-4 py-1 rounded-full text-sm font-medium mb-4">استكشف المزيد</span>
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">أماكن مشابهة قد تعجبك</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">استكشف المزيد من الأماكن المشابهة التي قد تناسب اهتماماتك</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPlaces.length > 0 ? (
              relatedPlaces.map((relatedPlace, index) => (
                <div key={index} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105 hover:border-white/30">
                  <div className="relative">
                    <img
                      src={relatedPlace.images}
                      alt={relatedPlace.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white/50 transition">
                        <HeartIcon className="w-5 h-5 text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                          <img
                            src={relatedPlace.images}
                            alt={relatedPlace.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-white text-sm font-medium mr-2 truncate">
                          {relatedPlace.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-white">
                    <h3 className="font-bold text-lg mb-2">{relatedPlace.name}</h3>
                    <div className="flex items-center text-gray-300 mb-3">
                      <MapPinIcon className="w-4 h-4 ml-1 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {relatedPlace.short_description || "الموقع"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="bg-yellow-400/20 text-yellow-300 text-xs font-medium px-2.5 py-0.5 rounded">
                          {relatedPlace.season || "متاح"}
                        </span>
                      </div>
                      <Link
                        to={`/places/${relatedPlace._id}`}
                        className="text-blue-300 text-sm font-medium hover:text-blue-200 whitespace-nowrap hover:underline"
                      >
                        عرض التفاصيل
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-white text-lg">
                  لا توجد أماكن مشابهة متاحة حالياً.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={() => setShowGalleryModal(false)}
              className="absolute top-0 right-0 bg-white text-black w-10 h-10 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="text-xl font-bold">معرض صور {place.name}</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...place.images || [], ...(place.gallery || [])].map((src, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition">
                      <img
                        src={src}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-full object-cover"
                        onClick={() => setActiveImageIndex(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlaceDetails;