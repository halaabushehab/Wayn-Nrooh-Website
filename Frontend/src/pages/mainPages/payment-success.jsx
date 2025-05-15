import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        if (parsedUser.token) {
          setUser(parsedUser);
          axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
        }
      } catch (error) {
        Cookies.remove("user");
      }
    }
  }, []);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    const verifyAndProcessPayment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:9527/api/payments/verify?session_id=${sessionId}`
        );
        setPaymentInfo(data);
        
        if (user) {
          await axios.post("http://localhost:9527/api/payments/create-payment", {
            ...data,
            userEmail: user.email,
            userName: user.username,
            userId: user.userId
          });
          setSuccessMessage("تم الدفع بنجاح!");
        }
      } catch (err) {
        console.error("Payment error:", err);
      }
    };

    verifyAndProcessPayment();
  }, [searchParams, user]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f5f7fa] relative overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#FFD700]/10"></div>
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-[#115173]/10"></div>
      <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-[#022C43]/5"></div>
      
      {/* Small Payment Card */}
      <div className="relative bg-white rounded-lg shadow-md w-full max-w-xs overflow-hidden border border-[#eee] z-10">
        {/* Gold Header */}
        <div className="h-2 bg-[#FFD700]"></div>
        
        <div className="p-5">
          {/* Check Icon */}
          <div className="mx-auto mb-3 w-14 h-14 bg-[#FFD700]/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-[#FFD700]" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-bold text-center text-[#022C43] mb-1">تمت العملية</h2>
          <p className="text-center text-[#115173] text-sm mb-4">شكراً لك</p>
          
          {/* Payment Details */}
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between py-1 border-b border-[#eee]">
              <span className="text-[#115173]">المبلغ:</span>
              <span className="font-medium text-[#022C43]">
                {paymentInfo?.amountUSD} {paymentInfo?.currency}
              </span>
            </div>
            
                 <div className="flex justify-between">
                <span className="text-[#115173]">عدد التذاكر:</span>
                <span className="font-bold text-[#022C43]">{paymentInfo?.ticketCount}</span>
              </div>
              
            <div className="flex justify-between py-1">
              <span className="text-[#115173]">الحالة:</span>
              <span className="font-medium text-green-600">ناجحة</span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              className="flex-1 bg-[#022C43] text-white py-2 text-sm rounded hover:bg-[#115173] transition"
              onClick={() => window.location.href = '/'}
            >
              الرئيسية
            </button>
            <button
              className="flex-1 border border-[#022C43] text-[#022C43] py-2 text-sm rounded hover:bg-[#022C43]/10 transition"
              onClick={() => window.print()}
            >
              طباعة
            </button>
          </div>
        </div>
        
        {/* Footer */}
   <div className="px-5 py-2 text-center text-xs text-[#115173] bg-[#f9f9f9] border-t border-[#eee]">

  <div className="mt-1 text-[#0a7b50]">تمت عملية الدفع بنجاح. شكرًا لاستخدامك منصتنا.</div>
</div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

// axios.post('http://localhost:9527/api/payments/create-payment', paymentData)
//   .then(response => {
//     console.log('Payment created successfully:', response.data);
//   })
//   .catch(error => {
//     console.error('Error creating payment:', error);
//   });













// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// const PaymentSuccess = () => {
//   const [searchParams] = useSearchParams();
//   const sessionId = searchParams.get("session_id");

//   const [paymentData, setPaymentData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!sessionId) {
//       setError("لم يتم العثور على معرف الجلسة في الرابط");
//       setLoading(false);
//       return;
//     }

//     const verifyPayment = async () => {
//       try {
//         const res = await fetch(`http://localhost:9527/api/payments/verify-payment?session_id=${sessionId}`);
//         if (!res.ok) {
//           throw new Error('خطأ أثناء جلب بيانات الدفع');
//         }
//         const data = await res.json();
//         setPaymentData(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("فشل التحقق من الدفع، سيتم إعادة المحاولة بعد ثوانٍ...");
//         setTimeout(verifyPayment, 3000); // إعادة المحاولة بعد 3 ثواني
//       }
//     };

//     verifyPayment();
//   }, [sessionId]); // لاحظ أنني وضعت sessionId في الdependencies

//   if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
//   if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

//   return (
//     <div className="max-w-xl mx-auto p-6 shadow-md rounded-lg mt-12 bg-white">
//       <h1 className="text-3xl font-bold text-green-600 mb-6 text-center">تم الدفع بنجاح ✅</h1>

//       <div className="text-gray-700 space-y-3 text-lg">
//         <p><strong>اسم المكان:</strong> {paymentData.subscriptionCard}</p>
//         <p><strong>اسم المستخدم:</strong> {paymentData.username}</p>
//         <p><strong>عدد التذاكر:</strong> {paymentData.ticketCount}</p>
//         <p><strong>المبلغ المدفوع:</strong> {paymentData.amount} {paymentData.currency.toUpperCase()}</p>
//         <p><strong>طريقة الدفع:</strong> {paymentData.paymentMethod}</p>
//         <p><strong>حالة الدفع:</strong> {paymentData.paymentStatus === "paid" ? "مدفوع" : "لم يتم الدفع"}</p>
//       </div>

//       <div className="text-center mt-8">
//         <a href="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
//           العودة للصفحة الرئيسية
//         </a>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;
