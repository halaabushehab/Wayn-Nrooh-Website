// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import Cookies from "js-cookie";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const [paymentInfo, setPaymentInfo] = useState(null);
//   const [user, setUser] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [hasSentPayment, setHasSentPayment] = useState(false);

//   useEffect(() => {
//     const userCookie = Cookies.get("user");
//     if (userCookie) {
//       try {
//       const parsedUser = JSON.parse(userCookie);
// if (parsedUser.token) {
//   setUser(parsedUser);
//   axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
// }

//       } catch (error) {
//         Cookies.remove("user");
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const sessionId = searchParams.get("session_id");
//     if (!sessionId || !user || hasSentPayment) return;

//   const verifyAndProcessPayment = async () => {
//   try {
//     // Step 1: Verify payment with Stripe
//     const { data } = await axios.get(
//       `http://localhost:9527/api/payments/verify?session_id=${sessionId}`
//     );
    
//     setPaymentInfo(data);
// const paymentPayload = {
//   stripePaymentId: data.stripePaymentId || '',
//   stripeChargeId: data.stripeChargeId || '',
//   userEmail: data.userEmail || (user && user.email) || '',
//   userName: data.userName || (user && user.name) || '',
//   amountUSD: parseFloat(data.amountUSD) || 0,
//   amountJOD: data.amountJOD || (parseFloat(data.amountUSD) / 1.41) || 0,
//   currency: data.currency || 'usd',
//   paymentStatus: data.paymentStatus || 'unknown',
//   cardBrand: data.cardBrand || 'unknown',
//   cardLast4: data.cardLast4 || '0000',
//   country: data.country || '',
//   ticketCount: data.ticketCount || 1,
//   placeId: data.placeId || '',
//   userId: user ? user._id || '' : ''
// };



// console.log("📦 Payment Payload:", paymentPayload);
// await axios.post('http://localhost:9527/api/payments/create-payment', paymentPayload);

//     setSuccessMessage("تم الدفع بنجاح!");
//     setHasSentPayment(true);
    
//   } catch (err) {
//     console.error("❌ Payment processing error:", err);
//     setSuccessMessage("حدث خطأ أثناء معالجة الدفع");
//   }
// };

//     verifyAndProcessPayment();
//   }, [searchParams, user, hasSentPayment]);

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f7fa] relative overflow-hidden">
//       {/* Decorative Circles */}
//       <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#FFD700]/10"></div>
//       <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#115173]/10"></div>
//       <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-[#022C43]/5"></div>
      
//       {/* Payment Card */}
//       <div className="relative bg-white rounded-lg shadow-md w-full max-w-xs overflow-hidden border border-[#eee] z-10">
//         {/* Gold Header */}
//         <div className="h-2 bg-[#FFD700]"></div>
        
//         <div className="p-5">
//           {/* Check Icon */}
//           <div className="mx-auto mb-3 w-14 h-14 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
//             <svg className="w-8 h-8 text-[#FFD700]" viewBox="0 0 24 24">
//               <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
//             </svg>
//           </div>
          
//           {/* Title */}
//           <h2 className="text-xl font-bold text-center text-[#022C43] mb-1">
//             {successMessage || "جارٍ معالجة الدفع..."}
//           </h2>
//           <p className="text-center text-[#115173] text-sm mb-4">شكراً لك</p>
          
//           {/* Payment Details */}
//        {paymentInfo && (
//   <div className="space-y-2 text-sm mb-4">
//     <div className="flex justify-between py-1 border-b border-[#eee]">
//       <span className="text-[#115173]">المبلغ بالدولار:</span>
//       <span className="font-medium text-[#022C43]">
//         {paymentInfo.amountUSD} {paymentInfo.currency}
//       </span>
//     </div>
    
//     <div className="flex justify-between py-1 border-b border-[#eee]">
//       <span className="text-[#115173]">المبلغ بالدينار:</span>
//       <span className="font-medium text-[#022C43]">
//         {paymentInfo.amountJOD ? paymentInfo.amountJOD.toFixed(2) : (paymentInfo.amountUSD / 1.41).toFixed(2)} JOD
//       </span>
//     </div>
    
//     <div className="flex justify-between">
//       <span className="text-[#115173]">عدد التذاكر:</span>
//       <span className="font-bold text-[#022C43]">{paymentInfo.ticketCount}</span>
//     </div>
    
//     <div className="flex justify-between py-1">
//       <span className="text-[#115173]">الحالة:</span>
//       <span className="font-medium text-green-600">ناجحة</span>
//     </div>
//   </div>
// )}
//           {/* Buttons */}
//           <div className="flex space-x-2">
//             <button
//               className="flex-1 bg-[#022C43] text-white py-2 text-sm rounded hover:bg-[#115173] transition"
//               onClick={() => window.location.href = '/'}
//             >
//               الرئيسية
//             </button>
//             <button
//               className="flex-1 border border-[#022C43] text-[#022C43] py-2 text-sm rounded hover:bg-[#022C43]/10 transition"
//               onClick={() => window.print()}
//               disabled={!paymentInfo}
//             >
//               طباعة
//             </button>
//           </div>
//         </div>
        
//         {/* Footer */}
//         <div className="px-5 py-2 text-center text-xs text-[#115173] bg-[#f9f9f9] border-t border-[#eee]">
//           <div className="mt-1 text-[#0a7b50]">
//             {paymentInfo 
//               ? "تمت عملية الدفع بنجاح. شكرًا لاستخدامك منصتنا."
//               : "جارٍ التحقق من حالة الدفع..."}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;




import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(true);

  // تحميل المستخدم من الكوكيز
  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          console.log("Loading user from cookies:", parsedUser);
    
          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              email: parsedUser.email,
              isAdmin: parsedUser.isAdmin || false,
            });
    
            axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
    };

    loadUserFromCookies();
  }, []);

  // التحقق من الدفع وإرسال البيانات للباك إند
  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("لم يتم العثور على معرف الجلسة في الرابط");
      setLoading(false);
      return;
    }

    const verifyAndProcessPayment = async () => {
      try {
        // الخطوة 1: التحقق من الدفع مع Stripe
        const verifyResponse = await axios.get(
          `http://localhost:9527/api/payments/verify?session_id=${sessionId}`
        );
        const paymentData = verifyResponse.data;
    
        console.log("Payment verification successful:", paymentData);
        setPaymentInfo(paymentData);
    
        // استخراج معرفات الدفع
        const stripePaymentId = paymentData.stripePaymentId;
        const stripeChargeId = paymentData.stripeChargeId;
    
        // الخطوة 2: إرسال بيانات الدفع إلى قاعدة البيانات
        if (user) {
          const paymentRecord = {
            stripePaymentId: stripePaymentId || 'defaultPaymentId',
            stripeChargeId: stripeChargeId || 'defaultChargeId',
            userEmail: user.email,
            userName: user.username,
            userId: user.userId,
            amountUSD: paymentData.amountUSD,
            cardBrand: paymentData.cardBrand || 'Unknown',
            cardLast4: paymentData.cardLast4 || '0000',
            country: paymentData.country || 'Unknown',
            currency: paymentData.currency,
            paymentStatus: paymentData.paymentStatus,
            placeId: paymentData.placeId,
            ticketCount: paymentData.ticketCount,
          };
    
          console.log(paymentRecord);
    
          const createResponse = await axios.post(
            "http://localhost:9527/api/payments/create-payment",
            paymentRecord
          );
          if (createResponse.status === 201) {
            console.log("Payment record created:", createResponse.data);
            setSuccessMessage("تم حفظ معلومات الدفع بنجاح!");
          } else {
            setError("حدث خطأ أثناء تخزين البيانات.");
          }
        }
      } catch (err) {
        console.error("Payment processing error:", err);
        setError(err.response?.data?.message || "فشلت عملية معالجة الدفع");
      } finally {
        setLoading(false);
      }
    };
    
    verifyAndProcessPayment();
  }, [searchParams, user]);

  // تأثير الكونفيتي
  const Confetti = () => {
    useEffect(() => {
      // إزالة الكونفيتي بعد 5 ثوان
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }, []);
    
    if (!showConfetti) return null;
    
    return (
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-10 ">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i}
            className={`absolute animate-confetti-fall`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `-5%`,
              animationDuration: `${Math.random() * 3 + 3}s`,
              animationDelay: `${Math.random() * 2}s`,
              backgroundColor: [`#FFD700`, `#022C43`, `#115173`, `#FF6B6B`, `#4ECDC4`][Math.floor(Math.random() * 5)],
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    );
  };

  // عنصر التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <div className="text-center p-8 bg-white/70 backdrop-blur-md rounded-xl shadow-lg">
          <div className="relative w-24 h-24 mx-auto">
            <div className="w-24 h-24 rounded-full border-t-4 border-r-4 border-[#022C43] animate-spin"></div>
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-b-4 border-l-4 border-[#115173] opacity-70 animate-pulse"></div>
          </div>
          <p className="mt-6 text-[#022C43] font-medium text-lg animate-pulse">جاري التحقق من عملية الدفع...</p>
        </div>
      </div>
    );
  }

  // عنصر الخطأ
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 px-4">
        <div className="bg-white/90 backdrop-blur-md border border-red-200 p-8 md:p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-500/10 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-4">عذراً، حدث خطأ</h2>
          <p className="text-gray-700 mb-8 text-lg">{error}</p>
          <button
            className="bg-gradient-to-r from-[#022C43] to-[#115173] text-white py-3 px-8 rounded-xl hover:shadow-lg hover:opacity-90 transition duration-300 text-lg shadow-md"
            onClick={() => window.location.href = '/'}
          >
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    );
  }

  // عنصر النجاح
  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-20">
      {loading ? null : <Confetti />}
      
      <div className="bg-white/80 backdrop-blur-md border border-[#022C43]/10 p-6 md:p-10 rounded-3xl shadow-xl max-w-md w-full my-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        {/* زخرفة الخلفية */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-500/10 rounded-full"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-green-500/10 rounded-full"></div>
        
        {/* رسالة النجاح */}
        {successMessage && (
          <div className="mb-6 bg-[#FFD700]-50/80 backdrop-blur-sm border border-green-200 text-[#022C43] px-4 py-3 rounded-xl relative animate-fadeIn">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* رأس الصفحة */}
        <div className="text-center mb-8 relative z-10">
          <div className="relative mx-auto mb-5">
            {/* <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <svg 
                className="w-14 h-14 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div> */}
            {/* <div className="absolute -top-2 -right-2 -bottom-2 -left-2 bg-[#FFD700] rounded-full animate-pulse"></div> */}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#022C43] animate-fadeIn">تم الدفع بنجاح!</h2>
          <p className="text-[#115173] text-lg md:text-xl">شكرًا لاستخدامك موقعنا</p>
          <div className="h-1.5 w-32 bg-gradient-to-r from-[#022C43] to-[#115173] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* تفاصيل المعاملة */}
        <div className="bg-[#f8fafc]/70 backdrop-blur-sm p-6 rounded-2xl border border-[#022C43]/10 mb-8 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-[#022C43] border-b border-[#022C43]/10 pb-2">تفاصيل المعاملة</h3>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-white/50 rounded-xl p-3 transition-all duration-200 hover:bg-white/80">
              <p className="text-[#115173] font-medium mb-1 md:mb-0">قيمة الدفع:</p>
              <p className="font-bold text-xl text-[#022C43]">
                {paymentInfo?.amountUSD} {paymentInfo?.currency}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-white/50 rounded-xl p-3 transition-all duration-200 hover:bg-white/80">
              <p className="text-[#115173] font-medium mb-1 md:mb-0">عدد التذاكر:</p>
              <p className="font-bold text-xl bg-[#022C43]/10 px-4 py-1 rounded-lg">
                {paymentInfo?.ticketCount}
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/50 rounded-xl p-3 transition-all duration-200 hover:bg-white/80">
              <p className="text-[#115173] font-medium mb-1 md:mb-0">تاريخ الدفع:</p>
              <p className="font-bold text-lg">
               {new Date().toLocaleDateString('en-SA')}
              </p>
            </div>
          </div>
        </div>

        {/* طريقة الدفع - إذا كانت متوفرة */}
        {paymentInfo?.cardBrand && (
          <div className="bg-[#f8fafc]/70 backdrop-blur-sm p-6 rounded-2xl border border-[#022C43]/10 mb-8">
            <h3 className="text-xl font-semibold mb-3 text-[#022C43] border-b border-[#022C43]/10 pb-2">بيانات الدفع</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#115173] font-medium mb-1">بطاقة:</p>
                <div className="flex items-center">
                  <p className="font-bold">{paymentInfo?.cardBrand}</p>
                  <p className="mr-2 text-gray-600">**** {paymentInfo?.cardLast4}</p>
                </div>
              </div>
              
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {paymentInfo?.cardBrand?.toLowerCase() === 'visa' ? (
                  <span className="font-bold text-blue-800">VISA</span>
                ) : paymentInfo?.cardBrand?.toLowerCase() === 'mastercard' ? (
                  <span className="font-bold text-red-600">MC</span>
                ) : (
                  <span className="font-bold text-gray-800">CARD</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* الأزرار */}
        <div className="flex flex-col space-y-4">
          <button
            className="w-full bg-gradient-to-r from-[#022C43] to-[#115173] text-white py-3.5 px-6 rounded-xl hover:shadow-lg transition duration-300 flex items-center justify-center font-medium text-lg shadow-md"
            onClick={() => window.location.href = '/'}
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            العودة إلى الصفحة الرئيسية
          </button>
          
          <button
            className="w-full bg-white text-[#022C43] border-2 border-[#022C43] py-3.5 px-6 rounded-xl hover:bg-[#022C43]/5 transition duration-300 flex items-center justify-center font-medium text-lg"
            onClick={() => window.print()}
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            طباعة الإيصال
          </button>
        </div>
        
        {/* رقم الترتيب والتاريخ */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>رقم المعاملة: {1232}</p>
        </div>
      </div>
    </div>
  );
};

// إضافة الأنيميشن المخصص للكونفيتي
const styles = document.createElement('style');
styles.innerHTML = `
  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .animate-confetti-fall {
    animation: confetti-fall linear forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }
`;
document.head.appendChild(styles);

export default PaymentSuccess;