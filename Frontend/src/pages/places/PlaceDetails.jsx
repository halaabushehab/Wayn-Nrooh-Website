// import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {MapPinIcon, StarIcon, Globe , HeartIcon, Clock,Ticket,  Map,CameraIcon, Share2, ChevronRight, ChevronLeft, MessageCircle,  Calendar, Info,  Compass,  ChevronUp,  MapPin ,  Zap , ExternalLink , AlertCircle , Bookmark , User ,} from "lucide-react"
import { toast } from "sonner"
import Cookies from "js-cookie"
import NearbyPlacesModal  from './detailsplaces/NearbyPlacesMap';
import SimilarPlaces from "./detailsplaces/SimilarPlaces";
import LocationMap from './detailsplaces/LocationMap';     
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import bgVideo from "../../components/img/AmmanHero.mp4";

const PlaceDetails = () => {
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userCoords, setUserCoords] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]); 
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isSimilarPlacesOpen, setIsSimilarPlacesOpen] = useState(false);
  const [relatedPlaces, setRelatedPlaces] = useState([])
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showMap, setShowMap] = useState(false);
  const [filterType, setFilterType] = useState('all');
const [reportCommentId, setReportCommentId] = useState(null);
const [reportDetails, setReportDetails] = useState('');
  // Rating states
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [ratings, setRatings] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [comment, setComment] = useState("")
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const currentPlaceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const { id } = useParams()
  const navigate = useNavigate()
  const galleryRef = useRef(null)
  const mapRef = useRef(null)

  // Scroll listener for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const storedUserId = Cookies.get("userId")
    const userCookie = Cookies.get("user")

    if (storedUserId) setUserId(storedUserId)
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie)
        if (parsedUser && parsedUser.userId && parsedUser.username) {
          setUserId(parsedUser.userId)
          setUsername(parsedUser.username)
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error)
      }
    }
  }, [])

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9527/api/places/${id}`);
        setPlace(response.data);
      } catch (err) {
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
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:9527/api/places/category/${category}`)
      .then((response) => {
        setRelatedPlaces(response.data.slice(0, 6));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching related places:", error);
        setError("حدث خطأ أثناء جلب الأماكن المشابهة. يرجى المحاولة لاحقًا.");
        setLoading(false);
      });
  }, [place]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);
 
  // rating
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const res = await fetch(`http://localhost:9527/api/ratings/${id}`);
        const data = await res.json();
        setRatings(data);

        if (data.length > 0) {
          const total = data.reduce((acc, r) => acc + r.rating, 0);
          setAverageRating((total / data.length).toFixed(1));
        } else {
          setAverageRating(0);
        }

        const updatedRatings = data.map((rating) => ({
          ...rating,
          user: {
            username: rating.userId?.username || "مجهول",
            photo: rating.userId?.photo || "http://localhost:9527/uploads/placeholder.jpg",
          },
          createdAt: new Date(rating.createdAt),
        }));
        
        setRatings(updatedRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, [id]);

  const handleRating = (star) => {
    setRating(star)
    setHover(star)
  }

  const handleSubmitRating = async (e) => {
    e.preventDefault()

    if (!userId) {
      toast.error("يجب تسجيل الدخول لإرسال التقييم")
      return
    }
    if (!rating) {
      return toast.error("الرجاء اختيار تقييم")
    }

    try {
      const response = await axios.post(`http://localhost:9527/api/ratings/`, {
        userId,
        placeId: id,
        rating,
        comment,
        username,
      })

      const newRating = {
        ...response.data.rating,
        user: { username },
      }

      setRatings([newRating, ...ratings])
      const newAverage = ((averageRating * ratings.length + rating) / (ratings.length + 1)).toFixed(1)
      setAverageRating(newAverage)

      setSubmitted(true)
      setComment("")
      toast.success("تم إرسال التقييم بنجاح!")
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast.error(`حدث خطأ: ${error.response?.data?.message || error.message}`)
    }
  }

  const resetRating = () => {
    setRating(null)
    setSubmitted(false)
  }

  const getRatingDescription = () => {
    const value = hover !== null ? hover : rating
    if (!value) return "نرحب بتقييمك!"
    const descriptions = {
      1: "نأسف لتجربتك، سنعمل على التحسين",
      2: "شكراً لصراحتك",
      3: "شكراً لتقييمك",
      4: "سعداء بأن التجربة أعجبتك",
      5: "نشكرك على هذا التقييم الرائع!",
    }
    return descriptions[value]
  }

const handleClick = () => {
  if (!userId) {
    toast.error("يرجى تسجيل الدخول أولاً لحجز التذاكر.");
    return;
  }

  if (place.is_free || place.ticket_price === 0 || place.ticket_price === "0") {
    toast.warning("لا يوجد حاجة لحجز تذاكر لهذا الموقع، يمكنك الذهاب مباشرة!");
  } else {
    navigate(`/pay/${place._id}`);
  }
};
  
  const handleNearbyPlaces = async () => {
    if (!place?.location?.latitude || !place?.location?.longitude) {
      toast.error("لا تتوفر إحداثيات لهذا المكان.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:9527/api/places/nearby?lat=${place.location.latitude}&lng=${place.location.longitude}&maxDistance=2`
      );

      const extractedPlaces = response.data.nearbyPlaces.map((place) => ({
        id: place._id,
        name: place.name || "مكان بدون اسم",
        lat: place.location.latitude,
        lng: place.location.longitude,
        type: place.categories?.[0] || "غير محدد",
        distanceText: place.distanceText || "",
      }));

      setNearbyPlaces(extractedPlaces);
      setShowMap(true);
    } catch (err) {
      console.error("فشل في جلب الأماكن:", err);
      toast.error("حدث خطأ أثناء جلب الأماكن القريبة.");
    } finally {
      setLoading(false);
    }
  };


const getUserLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setShowNearbyPlaces(true); // move this inside the success callback
    },
    (error) => {
      console.error("Location error:", error);
      alert("لم نتمكن من تحديد موقعك.");
    }
  );
};



  const handleReportSubmit = async () => {
  try {
    const reportReason = document.querySelector('input[name="reportReason"]:checked')?.value;
    
    if (!reportReason) {
      toast.error("الرجاء اختيار سبب الإبلاغ");
      return;
    }

    const response = await axios.post('http://localhost:9527/api/reports', {
      commentId: reportCommentId,
      userId,
      reason: reportReason,
      details: reportDetails,
    });

    toast.success("تم إرسال البلاغ بنجاح. شكراً لمساهمتك في تحسين الجودة.");
    setReportCommentId(null);
    setReportDetails('');
  } catch (error) {
    console.error("Error submitting report:", error);
    toast.error("حدث خطأ أثناء إرسال البلاغ. يرجى المحاولة لاحقاً.");
  }
};


  const handleToggleSimilarPlaces = () => {
    setIsSimilarPlacesOpen((prev) => !prev);
  };

  const sharePlace = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.short_description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('خطأ في المشاركة:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ الرابط إلى الحافظة!");
      } catch (err) {
        console.error('Failed to copy:', err);
        toast.error("تعذر نسخ الرابط، يرجى المحاولة يدوياً");
      }
    }
  };

  const filteredPlaces = filterType === 'all' 
    ? nearbyPlaces 
    : nearbyPlaces.filter(p => p.type === filterType);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-50 to-indigo-50">
      <div className="relative">
        <div className="w-20 h-20 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin absolute top-2 left-2"></div>
      </div>
      <p className="text-indigo-800 font-medium mt-24 animate-pulse">جاري تحميل المعلومات...</p>
    </div>
  );

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!place) return <div className="text-center py-20">لم يتم العثور على المكان</div>;

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-[#022C43] w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-[#115173] transition-all duration-300 hover:shadow-xl"
        >
          <ChevronUp className="w-6 h-6 text-[#FFD700]" />
        </button>
      </div>

      {/* Hero Section with Parallax */}
{/* <div
  className="relative h-[50vh] bg-cover bg-center flex items-end"
  style={{
    backgroundImage: `url(https://i.pinimg.com/736x/ea/6c/d1/ea6cd10471ad18d5d77654d25f7d1007.jpg)`, // تأكد أن `place.image` هو رابط الصورة
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
  dir="rtl"
>
  <div className="absolute inset-0 bg-gradient-to-b from-[#115173]/20 via-[#115173]/20 to-[#022C43]/20 bg-[#115173]/20"></div>

  <div className="container mx-auto px-8 md:px-16 pb-16 relative z-10 text-right">
<div className="max-w-2xl mx-auto text-center">
  <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-snug">
    اكتشف سحر الوجهات المميزة بتفاصيل لا تُنسى
  </h1>
  <p className="text-base md:text-lg text-white/90 leading-relaxed">
    نأخذك في جولة فريدة من نوعها لاكتشاف أبرز المعالم لتخطط لمغامرتك القادمة بكل سهولة.
  </p>
</div>


  </div>
</div> */}
    <section className="relative w-full h-[50vh] flex items-center justify-center mb-20">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
  
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#115173]/70 via-[#022C43]/60 to-[#022C43]/90" />
  
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-6 right-6 w-28 h-28 border-t-4 border-r-4 border-[#FFD700] rounded-tr-3xl animate-pulse"></div>
          <div className="absolute bottom-6 left-6 w-28 h-28 border-b-4 border-l-4 border-[#FFD700] rounded-bl-3xl animate-pulse"></div>
        </div>
  
<div className="relative z-10 text-center px-4 max-w-3xl mx-auto animate-fade-in-up">
  <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-xl tracking-wide">
    اكتشف سحر الوجهات المميزة بتفاصيل لا تُنسى
  </h1>
  <p className="text-base md:text-lg text-white/90 mb-8 leading-relaxed">
    نأخذك في جولة فريدة من نوعها لاكتشاف أبرز المعالم لتخطط لمغامرتك القادمة بكل سهولة.
  </p>
</div>

      </section>


<div class="text-center mt-8 mb-12">
  <h2 class="text-2xl md:text-4xl font-bold text-[#022C43] mb-3 animate-fadeIn">
    <span class="text-[#115173]">{place.name}</span>
  </h2>
  <div class="w-20 h-1 bg-[#FFD700] mx-auto mb-4"></div>
  <p class="text-base md:text-lg text-[#022C43] max-w-lg mx-auto leading-relaxed">
    {place.short_description}
  </p>
</div>




      {/* Main Content */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Gallery and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Gallery Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#022C43] flex items-center">
                      معرض الصور
                    </h2>
                  </div>

                  <div className="relative mb-6 rounded-xl overflow-hidden aspect-video group">
                    <img
                      src={place.images?.[activeImageIndex] || place.images?.[0]}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#022C43]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 w-full">
                        <p className="text-white font-medium truncate">
                          {place.name} - صورة {activeImageIndex + 1}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto hide-scrollbar" ref={galleryRef}>
                    <div className="flex space-x-3 rtl:space-x-reverse min-w-max">
                      {place.images?.map((img, idx) => (
                        <div
                          key={idx}
                          className={`cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                            activeImageIndex === idx
                              ? "ring-2 ring-[#115173] shadow-md"
                              : "hover:ring-1 hover:ring-gray-200"
                          }`}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`${place.name} - ${idx + 1}`}
                            className="w-32 h-24 object-cover hover:opacity-90 transition"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#022C43] flex items-center">
                      وصف المكان
                    </h2>
                  </div>
                  <div
                    className={`relative ${!showFullDescription && place.detailed_description?.length > 300 ? "max-h-40 overflow-hidden" : ""}`}
                  >
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{place.detailed_description}</p>
                    {!showFullDescription && place.detailed_description?.length > 300 && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
                    )}
                  </div>
                  {place.detailed_description?.length > 300 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mt-4 text-[#115173] hover:text-[#022C43] font-medium flex items-center"
                    >
                      {showFullDescription ? "عرض أقل" : "عرض المزيد"}
                      <ChevronLeft
                        className={`w-5 h-5 mr-1 transition-transform duration-300 ${showFullDescription ? "rotate-90" : "-rotate-90"}`}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* Ratings and Reviews Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#022C43] flex items-center">
                      <MessageCircle className="w-6 h-6 mr-2 text-[#115173]" />
                      آراء الزوار
                    </h2>
                    <div className="flex items-center bg-[#115173]/10 px-3 py-1.5 rounded-full">
                      <StarIcon className="w-5 h-5 text-[#115173] fill-[#115173]" />
                      <span className="ms-1 text-[#022C43] font-semibold">{averageRating}</span>
                      <span className="ms-1 text-[#115173]/70 text-sm">({ratings.length})</span>
                    </div>
                  </div>

                  {/* Rating Summary */}
                  <div className="bg-[#115173]/5 rounded-xl p-6 mb-8 border border-[#115173]/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-[#022C43] mb-2">{averageRating}</div>
                        <div className="flex justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={`w-6 h-6 ${star <= Math.round(averageRating) ? "text-[#FFD700] fill-[#FFD700]" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-[#115173] text-sm">بناءً على {ratings.length} تقييمات</p>
                      </div>

                      <div className="flex-1 space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = ratings.filter((r) => Math.round(r.rating) === star).length
                          const percentage = ratings.length > 0 ? (count / ratings.length) * 100 : 0

                          return (
                            <div key={star} className="flex items-center gap-3">
                              <div className="flex items-center w-10">
                                <span className="text-sm font-medium text-[#022C43]">{star}</span>
                                <StarIcon className="w-4 h-4 text-[#FFD700] fill-[#FFD700] ml-1" />
                              </div>
                              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#115173] rounded-full"
                                  style={{ width: `${percentage}%`, transition: "width 1s ease-in-out" }}
                                ></div>
                              </div>
                              <span className="text-xs text-[#115173] w-8">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-5">
{ratings.length > 0 ? (
  ratings.map((review, index) => (
    <div
      key={index}
      className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow duration-300 bg-white relative"
    >
      {/* زر الإبلاغ */}
      {userId && (
        <div className="absolute top-3 left-3">
          <button 
            onClick={() => setReportCommentId(review._id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="الإبلاغ عن التعليق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <img
            src={review.user.photo}
            alt={review.user.username}
            className="w-10 h-10 rounded-full"
          />
          <div className="mr-3">
            <h4 className="font-medium text-[#022C43]">{review.user?.username || "مستخدم"}</h4>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-4 h-4 ${star <= review.rating ? "text-[#FFD700] fill-[#FFD700]" : "text-gray-300"}`}
                />
              ))}
              <span className="text-gray-500 text-xs mr-2">
                {new Date(review.createdAt).toLocaleDateString("ar-EG")}
              </span>
            </div>
          </div>
        </div>
      </div>
      {review.comment && (
        <p className="text-gray-700 mt-3 bg-gray-50 p-3 rounded-lg text-sm leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  ))
) : (
  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-500 font-medium">لا توجد تقييمات حتى الآن. كن أول من يقيم!</p>
  </div>
)}

{/* نافذة الإبلاغ عن التعليق */}
{reportCommentId && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
      <h3 className="text-xl font-bold text-[#022C43] mb-4">الإبلاغ عن تعليق</h3>
      <p className="text-gray-700 mb-4">ما سبب الإبلاغ عن هذا التعليق؟</p>
      
      <div className="space-y-2 mb-4">
        <label className="flex items-center space-x-3 rtl:space-x-reverse">
          <input type="radio" name="reportReason" value="spam" className="form-radio text-[#115173]" />
          <span>محتوى غير مرغوب أو إعلاني</span>
        </label>
        <label className="flex items-center space-x-3 rtl:space-x-reverse">
          <input type="radio" name="reportReason" value="abuse" className="form-radio text-[#115173]" />
          <span>إساءة أو لغة غير لائقة</span>
        </label>
        <label className="flex items-center space-x-3 rtl:space-x-reverse">
          <input type="radio" name="reportReason" value="false" className="form-radio text-[#115173]" />
          <span>معلومات خاطئة</span>
        </label>
        <label className="flex items-center space-x-3 rtl:space-x-reverse">
          <input type="radio" name="reportReason" value="other" className="form-radio text-[#115173]" />
          <span>سبب آخر</span>
        </label>
      </div>

      <textarea
        placeholder="يمكنك إضافة تفاصيل إضافية (اختياري)"
        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#115173] focus:border-transparent transition-all duration-300 text-sm"
        rows="3"
        value={reportDetails}
        onChange={(e) => setReportDetails(e.target.value)}
      />

      <div className="flex justify-end space-x-3 rtl:space-x-reverse mt-4">
        <button
          onClick={() => setReportCommentId(null)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={handleReportSubmit}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          إرسال البلاغ
        </button>
      </div>
    </div>
  </div>
)}
                  </div>

                  {/* Rating Form */}
                  {userId && (
                    <div id="rating-form" className="mt-8 pt-6 border-t border-gray-100">
                      <h3 className="text-xl font-bold text-[#022C43] mb-4 flex items-center">
                        <StarIcon className="w-5 h-5 mr-2 text-[#115173]" />
                        أضف تقييمك
                      </h3>

                      {!submitted ? (
                        <form onSubmit={handleSubmitRating} className="bg-[#115173]/5 p-5 rounded-xl border border-[#115173]/10">
                          <div className="flex justify-center mb-4 gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => handleRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                                className="focus:outline-none transition-transform"
                              >
                                <StarIcon
                                  className={`h-8 w-8 transition-all duration-300 ${
                                    (hover !== null ? star <= hover : star <= (rating || 0))
                                      ? "fill-[#FFD700] text-[#FFD700] scale-110"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>

                          <div className="text-center min-h-[1.5rem] mb-4">
                            <p
                              className={`text-sm font-medium ${hover !== null || rating !== null ? "text-[#115173]" : "text-gray-500"}`}
                            >
                              {getRatingDescription()}
                            </p>
                          </div>

                          <textarea
                            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#115173] focus:border-transparent transition-all duration-300 text-sm"
                            placeholder="شاركنا تجربتك (اختياري)"
                            rows="3"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />

                          <button
                            type="submit"
                            className="mt-4 w-full bg-[#115173] hover:bg-[#022C43] 
                                      text-white font-medium py-2.5 px-4 rounded-lg transition duration-300"
                          >
                            إرسال التقييم
                          </button>
                        </form>
                      ) : (
                        <div className="text-center py-8 bg-[#115173]/5 rounded-xl border border-[#115173]/10">
                          <div className="w-14 h-14 bg-[#115173]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <StarIcon className="w-6 h-6 text-[#115173] fill-[#115173]" />
                          </div>
                          <p className="text-[#022C43] font-medium mb-3">شكراً لتقييمك!</p>
                          <button
                            onClick={resetRating}
                            className="text-[#115173] hover:text-[#022C43] font-medium underline text-sm"
                          >
                            أضف تعليق آخر
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Place Info Card */}
                <div className="bg-gray-100 text-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-400/10 rounded-full -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-300/20 rounded-full -ml-16 -mb-16"></div>

                  <h3 className="text-xl font-bold mb-6 pb-4 border-b border-gray-300 relative z-10 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-yellow-500" />
                    معلومات المكان
                  </h3>

                  <div className="space-y-5 relative z-10">
                    {/* Price */}
                    <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                      <div className="bg-yellow-400 p-2 rounded-lg mr-3">
                        <Ticket className="w-5 h-5 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="text-gray-600 text-sm mb-1">سعر التذكرة</h4>
                        <p className="font-semibold text-lg">
                          {place.is_free ? (
                            <span className="text-yellow-500">مجاني</span>
                          ) : (
                            <span>{place.ticket_price} <span className="text-yellow-500">دينار</span></span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                      <div className="bg-yellow-400 p-2 rounded-lg mr-3">
                        <Clock className="w-5 h-5 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="text-gray-600 text-sm mb-1">ساعات العمل</h4>
                        <p className="font-semibold">{place.working_hours || "يومياً 9 صباحاً - 5 مساءً"}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex flex-col sm:flex-row items-start bg-white p-3 rounded-lg border border-gray-200">
                      <div className="bg-yellow-400 p-2 rounded-lg mr-0 sm:mr-3 mb-3 sm:mb-0 sm:w-12 sm:h-12">
                        <MapPin className="w-6 h-6 text-gray-800" />
                      </div>

                      <div className="w-full">
                        <h4 className="text-gray-600 text-sm mb-1">الموقع</h4>
                        <p className="font-semibold">{place.city || "الأردن"}</p>

                        {place.location && (
                          <>
                            <LocationMap
                              latitude={place.location.latitude}
                              longitude={place.location.longitude}
                              className="mt-3 h-40 rounded-lg"
                            />

                            <a
                              href={`https://www.google.com/maps?q=${place.location.latitude},${place.location.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-yellow-500 text-xs mt-2 inline-flex items-center hover:underline"
                            >
                              عرض على Google Maps
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Season */}
                    <div className="flex items-start bg-white p-3 rounded-lg border border-gray-200">
                      <div className="bg-yellow-400 p-2 rounded-lg mr-3">
                        <Calendar className="w-5 h-5 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="text-gray-600 text-sm mb-1">الموسم المناسب</h4>
                        <p className="font-semibold">{place.season || "طوال العام"}</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handleClick}
                    className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 
                              text-gray-800 font-bold py-3 px-4 rounded-lg transition duration-300 
                              flex items-center justify-center shadow-md hover:shadow-lg relative z-10"
                  >
                    <Ticket className="w-5 h-5 ml-2" />
                    {place.is_free ? "الدخول مجاني" : "احجز تذكرتك الآن"}
                  </button>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#022C43] mb-6 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-[#115173]" />
                      خيارات سريعة
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Nearby Places */}
                      <button
                        onClick={handleNearbyPlaces}
                        disabled={loading}
                        className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 hover:bg-[#115173]/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
                          <Map className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
                        </div>
                        <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">
                          {loading ? 'جاري البحث...' : 'الأماكن القريبة'}
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={sharePlace}
                        className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 hover:bg-[#115173]/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
                          <Share2 className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
                        </div>
                        <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">
                          مشاركة
                        </span>
                      </button>

                      {/* Similar Places */}
                      <button
                        onClick={handleToggleSimilarPlaces}
                        className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 hover:bg-[#115173]/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
                          <Compass className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
                        </div>
                        <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">
                          أماكن مشابهة
                        </span>
                      </button>
     <button 
        onClick={getUserLocation}
                        className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 hover:bg-[#115173]/5 transition-all duration-300"
      >
                                <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">

        <MapPin className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
        </div>
       
        <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">عرض الأماكن القريبة مني</span>
      </button>

      {showNearbyPlaces && userLocation && (
        <NearbyPlacesModal 
          userLocation={userLocation} 
          onClose={() => setShowNearbyPlaces(false)} 
        />
      )}
                      {/* Website */}
                      {place?.contact?.website && (
                        <a
                          href={place.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 hover:bg-[#115173]/5 transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
                            <Globe className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
                          </div>
                          <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">
                            الموقع الإلكتروني
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact/Important Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#022C43] mb-4 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-[#115173]" />
                      معلومات مهمة
                    </h3>

                    <div className="space-y-3">
                      {place.important_info && (
                        <div className="flex items-start">
                          <div className="bg-[#FFD700]/10 p-2 rounded-lg mr-3">
                            <Info className="w-4 h-4 text-[#115173]" />
                          </div>
                          <p className="text-sm text-gray-700">{place.important_info}</p>
                        </div>
                      )}

                      <div className="flex items-start">
                        <div className="bg-[#FFD700]/10 p-2 rounded-lg mr-3">
                          <Clock className="w-4 h-4 text-[#115173]" />
                        </div>
                        <p className="text-sm text-gray-700">مدة الزيارة المتوقعة: {place.visit_duration || "1-2 ساعات"}</p>
                      </div>

                      <div className="flex items-start">
                        <div className="bg-[#FFD700]/10 p-2 rounded-lg mr-3">
                          <User className="w-4 h-4 text-[#115173]" />
                        </div>
                        <p className="text-sm text-gray-700">مناسب ل: {place.suitable_for || "جميع أفراد العائلة"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Places Popup */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-[#022C43] p-4 text-white">
              <h3 className="text-lg font-semibold">
                الأماكن القريبة من {place.name}
              </h3>
              <button 
                onClick={() => setShowMap(false)} 
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="إغلاق"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <div className="w-full md:w-3/5 h-96 md:h-auto">
                <MapContainer
                  center={[place.location.latitude, place.location.longitude]}
                  zoom={14}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Marker للمكان الحالي */}
                  <Marker 
                    position={[place.location.latitude, place.location.longitude]} 
                    icon={currentPlaceIcon}
                  >
                    <Popup>
                      <div className="font-bold text-red-600">{place.name}</div>
                      <div>أنت هنا</div>
                    </Popup>
                  </Marker>

                  {/* Markers للأماكن القريبة */}
                  {filteredPlaces.map((p) => (
                    <Marker 
                      key={p.id} 
                      position={[p.lat, p.lng]} 
                      icon={customIcon}
                    >
                      <Popup>
                        <div className="font-bold">{p.name}</div>
                        <div className="text-sm">{p.type}</div>
                        <div className="text-xs text-gray-500">{p.distanceText}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* قائمة الأماكن - تأخذ 40% من المساحة */}
              <div className="w-full md:w-2/5 overflow-y-auto p-4 bg-gray-50">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  <button 
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filterType === 'all' ? 'bg-[#022C43] text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    الكل ({nearbyPlaces.length})
                  </button>
                  {Array.from(new Set(nearbyPlaces.map(p => p.type))).map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filterType === type ? 'bg-[#115173] text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {type} ({nearbyPlaces.filter(p => p.type === type).length})
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3">
                  {filteredPlaces.length > 0 ? (
                    filteredPlaces.map((p) => (
                      <div 
                        key={p.id} 
                        className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                        onClick={() => {
                          if (mapRef.current) {
                            mapRef.current.flyTo([p.lat, p.lng], 15);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-[#115173]">{p.name}</h5>
                            <p className="text-sm text-gray-600">{p.type}</p>
                          </div>
                          <span className="text-xs bg-[#022C43]/10 text-[#022C43] px-2 py-1 rounded">
                            {p.distanceText}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد أماكن قريبة تطابق الفلتر المحدد
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-3 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                الإحداثيات: {place.location.latitude.toFixed(6)}, {place.location.longitude.toFixed(6)}
              </div>
              <button 
                onClick={() => setShowMap(false)} 
                className="px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#0a3a52] transition-colors"
              >
                إغلاق الخريطة
              </button>
            </div>
          </div>
        </div>
      )}

   

      {showNearbyPlaces && userLocation && (
        <NearbyPlacesModal 
          userLocation={userLocation} 
          onClose={() => setShowNearbyPlaces(false)} 
        />
      )}

      {/* Similar Places Modal */}
      {isSimilarPlacesOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleToggleSimilarPlaces}></div>

          <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-xl z-[1001] max-h-[75vh] overflow-y-auto">
            <button
              onClick={handleToggleSimilarPlaces}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
            <div className="p-6">
              <SimilarPlaces category={place?.categories?.[0]} currentPlaceId={place._id} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlaceDetails