// import { Toaster, toast } from 'sonner';
// import { Star, Sparkles } from 'lucide-react';
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";



// export default function RatingComponent({ placeId, title = 'قيم تجربتك' }) {
//   const [userId, setUserId] = useState(null);
//   const [username, setUsername] = useState(null);
//   const [rating, setRating] = useState(null);
//   const [hover, setHover] = useState(null);
//   const [submitted, setSubmitted] = useState(false);
//   const [ratings, setRatings] = useState([]);
//   const [average, setAverage] = useState(0);
//   const [comment, setComment] = useState("");

//    // استرجاع بيانات المستخدم من الكوكيز عند التحميل
//    useEffect(() => {
//     const loadUserFromCookies = () => {
//       const userCookie = Cookies.get("user");  // استرجاع الكوكيز "user"
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie);  // محاولة تحويل الكوكيز إلى JSON
//           console.log("🔄 بيانات المستخدم من الكوكيز:", parsedUser);

//           if (parsedUser && parsedUser.userId && parsedUser.username) {
//             setUserId(parsedUser.userId);
//             setUsername(parsedUser.username);
//           }
//         } catch (error) {
//           console.error("❌ خطأ في قراءة الكوكيز:", error);
//           Cookies.remove("user");  // إذا كانت الكوكيز تالفة، احذفها
//         }
//       }
//     };

//     loadUserFromCookies();
//   }, []);  // يتم التنفيذ عند تحميل الصفحة
//   // جلب التقييمات عند تحميل الصفحة
 
 
 
//   useEffect(() => {
//     if (!placeId) return;

//     axios.get(`http://localhost:9527/api/ratings/${placeId}`)
//       .then(res => {
//         if (res.data.average === 0) {
//           setAverage(4); // تقييم افتراضي
//         } else {
//           setAverage(res.data.average);
//         }
//       })
//       .catch(err => {
//         console.error("❌ خطأ في جلب التقييم:", err);
//         setAverage(4); // fallback
//       });
//   }, [placeId]);

//   if (average === null) return null; // ما يعرض إشي أثناء التحميل






//   // دالة لتحديث التقييم عند النقر على النجوم
//   const handleRating = (star) => {
//     setRating(star);
//     setHover(star); // لتحديث حالة hover أيضًا
//   };

//   // إرسال التقييم عند الضغط على زر الإرسال
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!userId) {
//       toast.error("❌ يجب تسجيل الدخول لإرسال التقييم");
//       return;
//     }
//     if (!placeId) {
//       toast.error("❌ لا يمكن إرسال التقييم بدون معرف المكان!");
//       return;
//     }
//     if (!rating) {
//       return toast.error("❌ الرجاء اختيار تقييم");
//     }
  
//     const dataToSend = {
//       userId,
//       placeId,
//       rating,
//       comment
//     };
  
//     console.log("📌 البيانات المرسلة:", dataToSend);
  
//     try {
//       const response = await axios.post(`http://localhost:9527/api/ratings/`, dataToSend);
  
//       setRatings((prevRatings) => [...prevRatings, response.data.rating]);
//       setAverage(((average * ratings.length + rating) / (ratings.length + 1)).toFixed(1));
//       setSubmitted(true);
//       setComment("");
//       toast.success("✅ تم إرسال التقييم بنجاح!");
//     } catch (error) {
//       console.error("❌ خطأ في إرسال التقييم:", error.response?.data || error.message);
//       toast.error(`❌ حدث خطأ أثناء إرسال التقييم: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   // إعادة التقييم
//   const resetRating = () => {
//     setRating(null);
//     setSubmitted(false);
//   };

//   // وصف التقييمات
//   const getRatingDescription = () => {
//     const value = hover !== null ? hover : rating;
//     if (!value) return 'نرحب بتقييمك!';
//     const descriptions = {
//       1: 'نأسف لتجربتك، سنعمل على التحسين',
//       2: 'شكراً لصراحتك',
//       3: 'شكراً لتقييمك',
//       4: 'سعداء بأن التجربة أعجبتك',
//       5: 'نشكرك على هذا التقييم الرائع!',
//     };
//     return descriptions[value];
//   };

//   return (
//     <div dir="rtl" className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 relative overflow-hidden mx-auto flex flex-col items-center my-20">
//               <p className="text-yellow-500">
//       ⭐ {average} / 5
//     </p>
//       <Toaster position="top-center" richColors />
//       <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#115173] rounded-full opacity-20"></div>
//       <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#115173] rounded-full opacity-20"></div>

//       <div className="relative z-10">
//         <div className="flex items-center mb-4 gap-2">
//           <Sparkles className="text-[#115173] h-5 w-5" />
//           <h2 className="text-xl font-bold text-[#022C43]">{title}</h2>
//         </div>

//         <div className="flex justify-center mb-4 gap-1">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <button
//               key={star}
//               onClick={() => handleRating(star)}
//               onMouseEnter={() => setHover(star)}
//               onMouseLeave={() => setHover(null)}
//               className="focus:outline-none transition-transform"
//             >
//               <Star
//                 className={`h-8 w-8 transition-all duration-200 ${
//                   (hover !== null ? star <= hover : star <= (rating || 0))
//                     ? 'fill-[#FFD700] text-[#FFD700] scale-105'
//                     : 'text-[#444444] opacity-40'
//                 }`}
//               />
//             </button>
//           ))}
//         </div>

//         <div className="text-center min-h-[1.5rem]">
//           <p className={`text-sm font-medium transition-opacity duration-300 ${hover !== null || rating !== null ? 'text-[#115173]' : 'text-[#444444]'}`}>
//             {getRatingDescription()}
//           </p>
//         </div>

//         {!submitted ? (
//           <form onSubmit={handleSubmit} className="w-full mt-4">
//             <textarea
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#115173]"
//               placeholder="اكتب تعليقك هنا (اختياري)"
//               value={comment}
//               onChange={(e) => setComment(e.target.value)}
//             />
//             <button
//               type="submit"
//               className="w-full mt-3 px-3 py-2 bg-[#115173] text-white rounded-lg text-sm hover:bg-[#0E3A5A] transition"
//             >
//               إرسال التقييم
//             </button>
//           </form>
//         ) : (
//           <div className="mt-3 text-center">
//             <p className="text-[#115173] text-sm font-medium">شكراً لمشاركتنا رأيك!</p>
//             <button onClick={resetRating} className="mt-2 px-3 py-1 bg-[#115173] text-white rounded-lg text-sm hover:bg-[#0E3A5A] transition">
//               إعادة التقييم
//             </button>
 
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







