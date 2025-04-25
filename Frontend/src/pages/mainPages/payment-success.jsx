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
  const [successMessage, setSuccessMessage] = useState(null); // لعرض رسالة النجاح

  // Load user from cookies
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

  // Verify payment and send data to backend
  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("Session ID not found in URL");
      setLoading(false);
      return;
    }

    const verifyAndProcessPayment = async () => {
      try {
        // Step 1: Verify payment with Stripe
        const verifyResponse = await axios.get(
          `http://localhost:9527/api/payments/verify?session_id=${sessionId}`
        );
        const paymentData = verifyResponse.data;
    
        console.log("Payment verification successful:", paymentData);
        setPaymentInfo(paymentData);
    
        // استخراج stripePaymentId و stripeChargeId من بيانات الدفع
        const stripePaymentId = paymentData.stripePaymentId;
        const stripeChargeId = paymentData.stripeChargeId;
    
        // Step 2: Send payment data to our database
        if (user) {
          const paymentRecord = {
            stripePaymentId: stripePaymentId || 'defaultPaymentId', // استخدم قيمة افتراضية في حال عدم وجودها
            stripeChargeId: stripeChargeId || 'defaultChargeId',
            userEmail: user.email,
            userName: user.username,
            userId: user.userId,
            amountUSD: paymentData.amountUSD, // مثال
            cardBrand: paymentData.cardBrand || 'Unknown',
            cardLast4: paymentData.cardLast4 || '0000',
            country: paymentData.country || 'Unknown',
            currency: paymentData.currency,
            paymentStatus: paymentData.paymentStatus,
            placeId: paymentData.placeId,
            ticketCount: paymentData.ticketCount,
          };
    
          console.log(paymentRecord);  // تحقق من البيانات المرسلة
    
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
        setError(err.response?.data?.message || "Payment processing failed");
      } finally {
        setLoading(false);
      }
    };
    

    verifyAndProcessPayment();
  }, [searchParams, user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-[#f8fafc] border border-[#022C43]/20 text-[#022C43] p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <svg 
            className="w-16 h-16 text-[#FFD700] mx-auto mb-4" 
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
          <h2 className="text-2xl font-bold mb-2">تم الدفع بنجاح!</h2>
          <p className="text-[#115173]">شكرًا لاستخدامك موقعنا</p>
        </div>

        <div className="bg-white p-4 rounded-md border border-[#022C43]/10 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#115173] font-medium">قيمة الدفع:</p>
              <p>{paymentInfo?.amountUSD} {paymentInfo?.currency}</p>
            </div>
            <div>
              <p className="text-[#115173] font-medium">عدد التذاكر:</p>
              <p>{paymentInfo?.ticketCount}</p>
            </div>
            <div>
              <p className="text-[#115173] font-medium">طريقة الدفع:</p>
              <p>{paymentInfo?.cardBrand} •••• {paymentInfo?.cardLast4}</p>
            </div>
            <div>
              <p className="text-[#115173] font-medium">حالة الدفع:</p>
              <p className="text-green-600 font-medium">{paymentInfo?.paymentStatus}</p>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-[#022C43] text-white py-2 px-4 rounded-md hover:bg-[#115173] transition duration-200"
          onClick={() => window.location.href = '/'}
        >
          العودة إلى الصفحة الرئيسية
        </button>
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
