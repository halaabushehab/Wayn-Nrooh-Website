// import { useParams } from "react-router-dom";
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Calendar, Ticket, Info, AlertCircle } from 'lucide-react';
// import Cookies from "js-cookie";

// const stripePromise = loadStripe('pk_test_your_publishable_key_here'); // Replace with actual publishable key
// const Pay = () => {
//   const { id } = useParams();
//   const [place, setPlace] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("stripe");
//   const [ticketCount, setTicketCount] = useState(1);
//   const [currentDate, setCurrentDate] = useState('');
//   const [user, setUser] = useState(null);  // لتخزين بيانات المستخدم
//   const [placeId, setPlaceId] = useState('');  // لتخزين placeId
//   const [selectedPlaceId, setSelectedPlaceId] = useState(null);
//   const [selectedTicketCount, setSelectedTicketCount] = useState(1); // أو القيمة الافتراضية المطلوبة

//   const tax = 1;
//   const subtotal = place ? place.ticket_price * ticketCount : 0;
//   const total = subtotal + tax;

//   const handleTicketChange = (e) => {
//     const value = Math.max(1, parseInt(e.target.value) || 1);
//     setTicketCount(value);
//     setSelectedTicketCount(count);
//   };

//   useEffect(() => {
//     const loadUserFromCookies = () => {
//       const userCookie = Cookies.get("user");
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie);
//           console.log("🧖 Loading user from cookies:", parsedUser);

//           if (parsedUser.token) {
//             setUser({
//               username: parsedUser.username,
//               userId: parsedUser.userId,
//               isAdmin: parsedUser.isAdmin || false,
//             });

//             axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
//           }
//         } catch (error) {
//           console.error("Error parsing user cookie:", error);
//           Cookies.remove("user");
//         }
//       }
//       setLoading(false); // Finished loading user
//     };

//     loadUserFromCookies();
//   }, []);

//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9527/api/places/${id}`);
//         console.log("Place data fetched:", response.data); // سجل البيانات التي تم جلبها
//         setPlace(response.data); // تعيين المكان
//         setSelectedPlaceId(response.data._id); // تعيين placeId من _id
//       } catch (err) {
//         setError("تعذر تحميل البيانات. يرجى المحاولة مرة أخرى.");
//         console.error("خطأ في جلب البيانات:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPlace();
//   }, [id]);

//   useEffect(() => {
//     const date = new Date();
//     const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     const formattedDate = date.toLocaleDateString('ar-JO', options);
//     setCurrentDate(formattedDate);
//   }, []);

//   // const handlePayment = async () => {
//   //   if (!user) {
//   //     console.log("User is not logged in.");
//   //     return; // تأكد من أن المستخدم مسجل الدخول
//   //   }

//   //   const placeId = selectedPlaceId;  // تأكد من تعيين الـ placeId بشكل صحيح
//   //   const ticketCount = selectedTicketCount;  // تأكد من تعيين الـ ticketCount بشكل صحيح

//   //   if (!placeId || !ticketCount || ticketCount <= 0) {
//   //     console.log("Invalid placeId or ticketCount");
//   //     return; // إذا كانت القيم غير صالحة، لا ترسل الطلب
//   //   }

//   //   try {
//   //     const response = await axios.post('http://localhost:9527/api/payments/pay', {
//   //       userId: user.userId,  // معرف المستخدم من الكوكيز
//   //       placeId: placeId,  // معرف المكان الذي تم تحميله
//   //       ticketCount: ticketCount,  // عدد التذاكر المحددة
//   //     });

//   //     console.log("Payment response:", response.data);
//   //     // بعد النجاح، يمكنك توجيه المستخدم إلى صفحة الدفع أو القيام بأي إجراء آخر
//   //   } catch (error) {
//   //     console.error("Payment error:", error);
//   //   }
//   // };

// const handlePayment = async () => {
//   if (!user) {
//     console.log("User is not logged in.");
//     setSelectedPlaceId(placeId);

//     return; // تأكد أن المستخدم مسجل الدخول
//   }

//   const placeId = selectedPlaceId;
//   const ticketCount = selectedTicketCount;

//   if (!placeId || !ticketCount || ticketCount <= 0) {
//     console.log("Invalid placeId or ticketCount");
//     return; // إذا كانت القيم غير صالحة، لا ترسل الطلب
//   }

//   try {
//     // إرسال الطلب إلى الـ API
//     const response = await axios.post('http://localhost:9527/api/payments/pay', {
//       userId: user.userId, // تأكد من أنك ترسل الـ userId بشكل صحيح
//       placeId: placeId, // تأكد من أنك ترسل الـ placeId بشكل صحيح
//       ticketCount: ticketCount, // تأكد من أنك ترسل الـ ticketCount بشكل صحيح
//     });

//     console.log("Payment response:", response.data);
//     // بعد النجاح، افتح رابط Stripe في نافذة جديدة
//     if (response.data.url) {
//       window.open(response.data.url, '/payment-success'); // فتح الرابط في نافذة جديدة
//     } else {
//       console.log("Payment URL not found.");
//     }
//   } catch (error) {
//     console.error("Payment error:", error);
//   }
// };

//   if (loading) return (
//     <div className="flex justify-center items-center min-h-[60vh]">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
//     </div>
//   );

//   if (error || !place) return (
//     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-center min-h-[60vh]">
//       <p>{error || 'تعذر تحميل البيانات.'}</p>
//     </div>
//   );

//   return (
//     <div className="bg-white min-h-screen">
//       <div className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-10"
//         style={{ backgroundImage: `url(https://i.pinimg.com/736x/00/de/6d/00de6d279a225b344fe8072720d6868c.jpg)` }}>
//         <div className="absolute inset-0 bg-gradient-to-r from-[#022C43]/80 to-[#115173]/70"></div>
//         <div className="relative z-10 text-center text-white px-6 max-w-3xl">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">احجز تذكرتك الآن</h1>
//           <div className="h-1 w-24 bg-[#FFD700] mx-auto mb-6"></div>
//           <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
//             نسعد بتقديم الدعم والمساعدة لك في عملية شراء التذاكر. استمتع بتجربة حجز سهلة وآمنة.
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 pb-16">
//         <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
//           <div className="w-full lg:w-5/12 order-2 lg:order-1">
//             <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
//               <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${place.images[0]})` }}>
//                 <div className="absolute inset-0 bg-gradient-to-t from-[#022C43] to-transparent"></div>
//                 <div className="absolute bottom-0 w-full p-6 text-white">
//                   <h2 className="text-2xl font-bold">{place.name}</h2>
//                   <div className="flex items-center mt-2">
//                     <Calendar className="text-[#FFD700] mr-2" size={16} />
//                     <p className="text-sm text-gray-200">{currentDate}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
//                   <div className="flex items-center">
//                     <Ticket className="text-[#115173] mr-2" size={20} />
//                     <span className="font-medium text-gray-700">سعر التذكرة</span>
//                   </div>
//                   <span className="text-xl font-bold text-[#115173]">{place.ticket_price} دينار</span>
//                 </div>
//                 <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                   <h3 className="font-medium text-gray-700 mb-2">معلومات المكان</h3>
//                   <p className="text-sm text-gray-600 leading-relaxed">
//                     {place.description || 'استمتع بزيارة هذا المكان الرائع واكتشف المزيد من المعالم والأنشطة المميزة.'}
//                   </p>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600 mt-4">
//                   <Info className="text-[#115173] mr-2" size={16} />
//                   <p>يرجى إحضار بطاقة الهوية عند الحضور</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="w-full lg:w-7/12 order-1 lg:order-2">
//             <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
//               <h2 className="text-2xl font-bold text-[#022C43] mb-6">إتمام الحجز</h2>
//               <div className="mb-8">
//                 <label className="block text-gray-700 font-medium mb-2">عدد التذاكر</label>
//                 <div className="flex items-center">
//                   <button onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} className="bg-gray-100 text-gray-600 hover:bg-gray-200 h-10 w-10 rounded-l-md flex items-center justify-center">-</button>
//                   <input type="number" min="1" value={ticketCount} onChange={handleTicketChange} className="h-10 w-16 text-center border-y border-gray-300 focus:outline-none" />
//                   <button onClick={() => setTicketCount(ticketCount + 1)} className="bg-gray-100 text-gray-600 hover:bg-gray-200 h-10 w-10 rounded-r-md flex items-center justify-center">+</button>
//                 </div>
//               </div>
//               <div className="bg-gray-50 rounded-lg p-4 mb-8">
//                 <h3 className="font-medium text-[#022C43] mb-4">ملخص الطلب</h3>
//                 <div className="space-y-2 mb-4">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">{ticketCount} × تذكرة ({place.ticket_price} دينار)</span>
//                     <span className="font-medium">{subtotal} دينار</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">الضريبة</span>
//                     <span className="font-medium">{tax} دينار</span>
//                   </div>
//                 </div>
//                 <div className="border-t border-gray-200 pt-4 flex justify-between">
//                   <span className="font-bold text-[#022C43]">الإجمالي</span>
//                   <span className="font-bold text-xl text-[#115173]">{total} دينار</span>
//                 </div>
//               </div>
//               <div className="mb-8">
//                 <h3 className="font-medium text-[#022C43] mb-4">اختر طريقة الدفع</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div onClick={() => setPaymentMethod("stripe")} className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${paymentMethod === "stripe" ? "border-[#115173] bg-[#115173]/5" : "border-gray-200 hover:border-gray-300"}`}>
//                     <input type="radio" name="payment" value="stripe" checked={paymentMethod === "stripe"} onChange={() => setPaymentMethod("stripe")} className="mr-2 accent-[#115173]" />
//                     <div>
//                       <span className="font-medium text-[#022C43]">سترايب</span>
//                       <p className="text-xs text-gray-500 mt-1">الدفع الآمن عبر سترايب</p>
//                     </div>
//                   </div>
//                   <div onClick={() => setPaymentMethod("card")} className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${paymentMethod === "card" ? "border-[#115173] bg-[#115173]/5" : "border-gray-200 hover:border-gray-300"}`}>
//                     <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="mr-2 accent-[#115173]" />
//                     <div>
//                       <span className="font-medium text-[#022C43]">بطاقة بنكية</span>
//                       <p className="text-xs text-gray-500 mt-1">الدفع باستخدام البطاقة البنكية</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <button
//   onClick={handlePayment }
//   className="w-full bg-[#115173] hover:bg-[#0e3d5c] text-white font-semibold py-3 rounded-lg transition duration-200"
// >
//   إتمام الدفع
// </button>            </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Pay;

import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Calendar, Ticket, Info, AlertCircle } from "lucide-react";
import Cookies from "js-cookie";

const stripePromise = loadStripe("pk_test_your_publishable_key_here"); // Replace with actual publishable key
const Pay = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [ticketCount, setTicketCount] = useState(1);
  const [currentDate, setCurrentDate] = useState("");
  const [user, setUser] = useState(null); // لتخزين بيانات المستخدم
  const [placeId, setPlaceId] = useState(""); // لتخزين placeId
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);


  const subtotal = place ? place.ticket_price * ticketCount : 0;
  const total = subtotal;

  const handleTicketChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setTicketCount(value);
  };

  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          console.log("🧖 Loading user from cookies:", parsedUser);

          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
            });

            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
      setLoading(false); // Finished loading user
    };

    loadUserFromCookies();
  }, []);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9527/api/places/${id}`
        );
        console.log("Place data fetched:", response.data); // سجل البيانات التي تم جلبها
        setPlace(response.data); // تعيين المكان
        setSelectedPlaceId(response.data._id); // تعيين placeId من _id
      } catch (err) {
        setError("تعذر تحميل البيانات. يرجى المحاولة مرة أخرى.");
        console.error("خطأ في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  useEffect(() => {
    const date = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString("ar-JO", options);
    setCurrentDate(formattedDate);
  }, []);

  // Add this at the top
  const [isProcessing, setIsProcessing] = useState(false);

const handlePayment = async () => {
  if (!user) {
    Swal.fire({
      icon: "error",
      title: "يجب تسجيل الدخول",
      text: "يجب عليك تسجيل الدخول قبل إتمام الدفع",
    });
    return;
  }

  setIsProcessing(true);

  try {
    const response = await axios.post(
      "http://localhost:9527/api/payments/pay",
      {
        userId: user.userId,
        placeId: selectedPlaceId,
        ticketCount: ticketCount,
        totalJOD: total, // Send JOD total
      }
    );

    if (response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error) {
    console.error("Payment error:", error);
    Swal.fire({
      icon: "error",
      title: "خطأ في الدفع",
      text: error.response?.data?.error || "حدث خطأ أثناء الدفع",
    });
  } finally {
    setIsProcessing(false);
  }
};

  // Update button in render:
  <button
    onClick={handlePayment}
    disabled={isProcessing}
    className={`payment-button ${isProcessing ? "processing" : ""}`}
  >
    {isProcessing ? "جاري المعالجة..." : "ادفع الآن"}
  </button>;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
      </div>
    );

  if (error || !place)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-center min-h-[60vh]">
        <p>{error || "تعذر تحميل البيانات."}</p>
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <div
        className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-10"
        style={{
          backgroundImage: `url(https://i.pinimg.com/736x/00/de/6d/00de6d279a225b344fe8072720d6868c.jpg)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#022C43]/80 to-[#115173]/70"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            احجز تذكرتك الآن
          </h1>
          <div className="h-1 w-24 bg-[#FFD700] mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
            نسعد بتقديم الدعم والمساعدة لك في عملية شراء التذاكر. استمتع بتجربة
            حجز سهلة وآمنة.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          <div className="w-full lg:w-5/12 order-2 lg:order-1">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <div
                className="h-64 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${place.images[0]})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#022C43] to-transparent"></div>
                <div className="absolute bottom-0 w-full p-6 text-white">
                  <h2 className="text-2xl font-bold">{place.name}</h2>
                  <div className="flex items-center mt-2">
                    <Calendar className="text-[#FFD700] mr-2" size={16} />
                    <p className="text-sm text-gray-200">{currentDate}</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <Ticket className="text-[#115173] mr-2" size={20} />
                    <span className="font-medium text-gray-700">
                      سعر التذكرة
                    </span>
                  </div>
                  <span className="text-xl font-bold text-[#115173]">
                    {place.ticket_price} دينار
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">
                    معلومات المكان
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {place.description ||
                      "استمتع بزيارة هذا المكان الرائع واكتشف المزيد من المعالم والأنشطة المميزة."}
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-4">
                  <Info className="text-[#115173] mr-2" size={16} />
                  <p>يرجى إحضار بطاقة الهوية عند الحضور</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-7/12 order-1 lg:order-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-[#022C43] mb-6">
                إتمام الحجز
              </h2>
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  عدد التذاكر
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 h-10 w-10 rounded-l-md flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={ticketCount}
                    onChange={handleTicketChange}
                    className="h-10 w-16 text-center border-y border-gray-300 focus:outline-none"
                  />
                  <button
                    onClick={() => setTicketCount(ticketCount + 1)}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 h-10 w-10 rounded-r-md flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
         <div className="bg-gray-50 rounded-lg p-4 mb-8">
  <h3 className="font-medium text-[#022C43] mb-4">ملخص الطلب</h3>
  <div className="space-y-2 mb-4">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">
        {ticketCount} × تذكرة ({place.ticket_price} دينار)
      </span>
      <span className="font-medium">{subtotal} دينار</span>
    </div>
    <div className="flex justify-between text-sm text-blue-600">
      <span className="text-gray-600">السعر بالدولار</span>
      <span className="font-medium">{(subtotal * 1.41).toFixed(2)} $</span>
    </div>
  </div>
  <div className="border-t border-gray-200 pt-4 flex justify-between">
    <span className="font-bold text-[#022C43]">الإجمالي</span>
    <div className="flex flex-col items-end">
      <span className="font-bold text-xl text-[#115173]">{total} دينار</span>
      <span className="text-sm text-blue-600">≈ {(total * 1.41).toFixed(2)} $</span>
    </div>
  </div>
</div>
              <div className="mb-8">
                <h3 className="font-medium text-[#022C43] mb-4">
                  اختر طريقة الدفع
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("stripe")}
                    className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                      paymentMethod === "stripe"
                        ? "border-[#115173] bg-[#115173]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="mr-2 accent-[#115173]"
                    />
                    <div>
                      <span className="font-medium text-[#022C43]">سترايب</span>
                      <p className="text-xs text-gray-500 mt-1">
                        الدفع الآمن عبر سترايب
                      </p>
                    </div>
                  </div>
                  {/* <div
                    onClick={() => setPaymentMethod("card")}
                    className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-[#115173] bg-[#115173]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="mr-2 accent-[#115173]"
                    />
                    <div>
                      <span className="font-medium text-[#022C43]">
                        بطاقة بنكية
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        الدفع باستخدام البطاقة البنكية
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-[#115173] hover:bg-[#0e3d5c] text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                إتمام الدفع
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;