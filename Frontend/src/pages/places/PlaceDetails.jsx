
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  MapPinIcon, StarIcon,  HeartIcon, Clock,Ticket,  Map,CameraIcon, Share2, ChevronRight, ChevronLeft, MessageCircle,  Calendar, Info,  Compass,  ChevronUp,  MapPin ,  Zap , ExternalLink , AlertCircle , Bookmark , User ,} from "lucide-react"
import { toast } from "sonner"
import Cookies from "js-cookie"

const categoryImages = {
  متاحف: "https://i.pinimg.com/736x/97/1c/12/971c12d6c4e11ce77db2c039e73bb0b5.jpg",
  تسوق: "https://i.pinimg.com/736x/bb/16/5e/bb165e49947484ef6a8fa1849eae53e0.jpg",
  اثري: "https://i.pinimg.com/736x/df/51/0b/df510b0f6a90123515b2e77d1ef45416.jpg",
  مطاعم: "https://i.pinimg.com/736x/ab/8a/56/ab8a56a21f7caa5db083ff5b0f5b63f3.jpg",
  تعليمي: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2NA1I289e4ZIaBhycEYZ3Iq1KVD307uTzkg&s",
  ترفيه: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2NA1I289e4ZIaBhycEYZ3Iq1KVD307uTzkg&s",
  منتزهات: "https://www.7iber.com/wp-content/uploads/2015/05/Daheyet-Al-Hussein-Park-001.jpg",
}

const PlaceDetails = () => {
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedPlaces, setRelatedPlaces] = useState([])
  const [nearbyPlaces, setNearbyPlaces] = useState([])
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Rating states
  const [rating, setRating] = useState(null)
  const [hover, setHover] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [ratings, setRatings] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [comment, setComment] = useState("")

  const { id } = useParams()
  const navigate = useNavigate()
  const galleryRef = useRef(null)

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
        const response = await axios.get(`http://localhost:9527/api/places/${id}`)
        setPlace(response.data)

        // Fetch ratings for this place
        const ratingsResponse = await axios.get(`http://localhost:9527/api/ratings/${id}`)
        setRatings(ratingsResponse.data.ratings || [])
        setAverageRating(ratingsResponse.data.average || 0)
      } catch (err) {
        console.error("Error fetching place details:", err)
        setError("حدث خطأ أثناء جلب البيانات.")
      } finally {
        setLoading(false)
      }
    }

    fetchPlaceDetails()
  }, [id])

  useEffect(() => {
    if (!place || !place.categories || place.categories.length === 0) return

    const category = encodeURIComponent(place.categories[0])
    axios
      .get(`http://localhost:9527/api/places/category/${category}`)
      .then((response) => {
        setRelatedPlaces(response.data.slice(0, 6))
      })
      .catch((error) => console.error("Error fetching related places:", error))
  }, [place])

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

      // Update local state
      const newRating = {
        ...response.data.rating,
        user: { username },
      }

      setRatings([newRating, ...ratings])

      // Calculate new average
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
    if (place.is_free) {
      toast.warning("لا يوجد حاجة لحجز تذاكر لهذا الموقع، يمكنك الذهاب مباشرة!")
    } else {
      navigate(`/pay/${place._id}`)
    }
  }

  const handleNearbyPlaces = () => {
    if (!navigator.geolocation) {
      return toast.error("متصفحك لا يدعم تحديد الموقع الجغرافي")
    }

    toast.loading("جاري تحديد موقعك...")
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude
        const userLng = position.coords.longitude

        try {
          const res = await axios.get("http://localhost:9527/api/places/nearby", {
            params: {
              lat: userLat,
              lng: userLng,
            },
          })

          setNearbyPlaces(res.data)
          toast.success("تم العثور على أماكن قريبة!")

          const section = document.getElementById("nearby-places")
          if (section) section.scrollIntoView({ behavior: "smooth" })
        } catch (error) {
          console.error("Error fetching nearby places:", error)
          toast.error("حدث خطأ أثناء جلب الأماكن القريبة")
        }
      },
      () => {
        toast.error("تعذر تحديد موقعك الجغرافي")
      },
    )
  }

  const getCategoryImage = (category) => {
    return categoryImages[category] || categoryImages["متاحف"]
  }

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300
      galleryRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const sharePlace = () => {
    if (navigator.share) {
      navigator
        .share({
          title: place.name,
          text: place.short_description,
          url: window.location.href,
        })
        .then(() => toast.success("تم مشاركة المكان بنجاح!"))
        .catch((error) => console.error("Error sharing:", error))
    } else {
      // Fallback
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("تم نسخ الرابط إلى الحافظة"))
        .catch(() => toast.error("فشل نسخ الرابط"))
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin absolute top-2 left-2"></div>
        </div>
        <p className="text-indigo-800 font-medium mt-24 animate-pulse">جاري تحميل المعلومات...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-r-4 border-red-500 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Info className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">عذراً</h2>
          <p className="text-lg text-center text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            العودة للخلف
          </button>
        </div>
      </div>
    )

  if (!place)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Info className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">لم يتم العثور على المكان</h2>
          <p className="text-gray-600 text-center mb-6">يبدو أن المكان الذي تبحث عنه غير موجود أو تم حذفه.</p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            العودة للرئيسية
          </button>
        </div>
      </div>
    )

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
<div
  className="relative h-[85vh] bg-cover bg-center flex items-end"
  style={{
    backgroundImage: `url(${place.images?.[0]})`,
    backgroundAttachment: "fixed",
  }}
>
  <div className="absolute inset-0 bg-gradient-to-b from-[#022C43]/70 via-[#022C43]/80 to-[#022C43]/90"></div>

  {/* Floating Category Pills */}
  <div className="absolute top-32 left-1/2 transform -translate-x-1/2 flex gap-3 flex-wrap justify-center max-w-4xl px-4">
    {place.categories.map((category, index) => (
      <span
        key={index}
        className="bg-[#115173] text-white px-5 py-2 rounded-full text-sm font-medium shadow-md
                  animate-fadeIn opacity-0"
        style={{ animationDelay: `${index * 0.1 + 0.5}s`, animationFillMode: "forwards" }}
      >
        {category}
      </span>
    ))}
  </div>

  <div className="container mx-auto px-4 py-16 relative z-10">
    <div className="max-w-4xl">
      {/* Price and Rating */}
      <div className="flex items-center space-x-3 space-x-reverse rtl:space-x-reverse mb-6">
        <span className="bg-[#FFD700] text-[#022C43] px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
          {place.is_free ? "مجاني" : `${place.ticket_price} دينار`}
        </span>
        <div className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
          <StarIcon className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
          <span className="ms-1 text-white font-semibold">{averageRating || place.rating}</span>
          <span className="ms-1 text-white/80 text-sm">({ratings.length})</span>
        </div>

        <button
          onClick={sharePlace}
          className="bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition-all duration-300"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Title and Description */}
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fadeIn">
        {place.name}
      </h1>
      <p
        className="text-xl text-white/90 max-w-2xl animate-fadeIn opacity-0 leading-relaxed"
        style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
      >
        {place.short_description}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleClick}
        className="mt-8 bg-[#115173] hover:bg-[#022C43] 
                  text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300 
                  transform hover:translate-y-[-2px] animate-fadeIn opacity-0 flex items-center"
        style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
      >
        <Ticket className="w-5 h-5 mr-2" />
        {place.is_free ? "استكشف المكان" : "احجز تذكرتك الآن"}
      </button>
    </div>
  </div>
</div>

{/* Main Content */}
<div className="bg-white">
  <div className="container mx-auto px-4 py-12">
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
                    className="border border-gray-100 rounded-xl p-5 hover:shadow-sm transition-shadow duration-300 bg-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#115173] flex items-center justify-center text-white font-bold">
                          {review.user?.username?.charAt(0) || "?"}
                        </div>
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
    <div className="bg-[#022C43] text-white p-6 rounded-xl shadow-lg border border-[#115173]/30 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD700]/10 rounded-full -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#115173]/20 rounded-full -ml-16 -mb-16"></div>
      
      <h3 className="text-xl font-bold mb-6 pb-4 border-b border-[#115173] relative z-10 flex items-center">
        <Info className="w-5 h-5 mr-2 text-[#FFD700]" />
        معلومات المكان
      </h3>

      <div className="space-y-5 relative z-10">
        {/* Price */}
        <div className="flex items-start bg-[#115173]/30 p-3 rounded-lg">
          <div className="bg-[#FFD700] p-2 rounded-lg mr-3">
            <Ticket className="w-5 h-5 text-[#022C43]" />
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-1">سعر التذكرة</h4>
            <p className="font-semibold text-lg">
              {place.is_free ? (
                <span className="text-[#FFD700]">مجاني</span>
              ) : (
                <span>{place.ticket_price} <span className="text-[#FFD700]">دينار</span></span>
              )}
            </p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start bg-[#115173]/30 p-3 rounded-lg">
          <div className="bg-[#FFD700] p-2 rounded-lg mr-3">
            <Clock className="w-5 h-5 text-[#022C43]" />
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-1">ساعات العمل</h4>
            <p className="font-semibold">{place.working_hours || "يومياً 9 صباحاً - 5 مساءً"}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start bg-[#115173]/30 p-3 rounded-lg">
          <div className="bg-[#FFD700] p-2 rounded-lg mr-3">
            <MapPin className="w-5 h-5 text-[#022C43]" />
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-1">الموقع</h4>
            <p className="font-semibold">{place.city || "الأردن"}</p>
            {place.location && (
              <a
                href={`https://www.google.com/maps?q=${place.location.latitude},${place.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFD700] text-xs mt-1 flex items-center hover:underline"
              >
                عرض على الخريطة
                <ExternalLink className="w-3 h-3 mr-1" />
              </a>
            )}
          </div>
        </div>

        {/* Season */}
        <div className="flex items-start bg-[#115173]/30 p-3 rounded-lg">
          <div className="bg-[#FFD700] p-2 rounded-lg mr-3">
            <Calendar className="w-5 h-5 text-[#022C43]" />
          </div>
          <div>
            <h4 className="text-white/80 text-sm mb-1">الموسم المناسب</h4>
            <p className="font-semibold">{place.season || "طوال العام"}</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleClick}
        className="w-full mt-6 bg-gradient-to-r from-[#FFD700] to-[#FFD700]/90 hover:from-[#FFD700]/90 hover:to-[#FFD700] 
                  text-[#022C43] font-bold py-3 px-4 rounded-lg transition duration-300 
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
            className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 
                      hover:bg-[#115173]/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
              <MapPin className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
            </div>
            <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">أماكن قريبة</span>
          </button>

          {/* Share */}
          <button
            onClick={sharePlace}
            className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 
                      hover:bg-[#115173]/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
              <Share2 className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
            </div>
            <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">مشاركة</span>
          </button>

          {/* Similar Places */}
          <button
            onClick={() => {
              const section = document.getElementById("similar-places");
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 
                      hover:bg-[#115173]/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
              <Compass className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
            </div>
            <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">أماكن مشابهة</span>
          </button>

          {/* Save */}
          <button
            onClick={() => {}}
            className="group flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-[#115173]/30 
                      hover:bg-[#115173]/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-[#115173]/10 flex items-center justify-center mb-2 group-hover:bg-[#115173]/20">
              <Bookmark className="w-5 h-5 text-[#115173] group-hover:text-[#022C43]" />
            </div>
            <span className="text-sm font-medium text-[#022C43] group-hover:text-[#115173]">حفظ</span>
          </button>
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
    </>
  )
}

export default PlaceDetails
