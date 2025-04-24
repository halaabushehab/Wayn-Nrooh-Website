import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setError("لم يتم العثور على معرف الجلسة في الرابط");
      setLoading(false);
      return;
    }

const verifyPayment = async () => {
  try {
    const res = await fetch(`http://localhost:9527/api/payments/verify?session_id=${sessionId}`);
    const data = await res.json();
    setPaymentInfo(data);
  } catch (err) {
    console.error("فشل التحقق من الدفع، سيتم إعادة المحاولة بعد ثوانٍ...");
    setTimeout(verifyPayment, 3000); // إعادة المحاولة بعد 3 ثواني
  }
};
    verifyPayment();
  }, [searchParams]);


  const sendPaymentData = async (paymentInfo) => {
    try {
      const response = await fetch("http://localhost:9527/api/payments/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discount: 0,
          currency: "USD",
          subscriber: paymentInfo.subscriberId, // حسب ما أنت حافظه عندك
          subscriptionCard: paymentInfo.subscriptionCardId,
          ticketCount: paymentInfo.ticketCount,
          amount: paymentInfo.amount,
          payment_method: "card",
          payment_status: "completed",
        }),
      });
  
      const result = await response.json();
      console.log("تم حفظ الدفع:", result);
    } catch (err) {
      console.error("فشل في إرسال بيانات الدفع:", err);
    }
  };
  

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
  
    const verifyPayment = async () => {
      try {
        const response = await fetch(`http://localhost:9527/api/payments/verify-payment?session_id=${sessionId}`);
        const data = await response.json();
  
        if (data) {
          setPaymentInfo(data);
  
          // أرسل الداتا لقاعدة البيانات
          await sendPaymentData(data);
        }
      } catch (err) {
        setError("فشل التحقق من الدفع");
      } finally {
        setLoading(false);
      }
    };
  
    if (sessionId) {
      verifyPayment();
    }
  }, [searchParams]);
  
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">جارٍ التحقق من الدفع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-bold">خطأ:</p>
        <p>{error}</p>
        <p className="mt-2">الرجاء التواصل مع الدعم الفني إذا استمرت المشكلة.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {paymentInfo ? (
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">تم الدفع بنجاح!</h2>
          <div className="space-y-3">
            <p className="flex items-center">
              <span className="font-semibold w-32">المكان:</span>
              <span>{paymentInfo.subscriptionCard || "غير محدد"}</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold w-32">المبلغ:</span>
              <span>${paymentInfo.amount}</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold w-32">عدد التذاكر:</span>
              <span>{paymentInfo.ticketCount}</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold w-32">حالة الدفع:</span>
              <span className="text-green-600">{paymentInfo.paymentStatus || "مكتمل"}</span>
            </p>
            <p className="flex items-center">
              <span className="font-semibold w-32">تاريخ الدفع:</span>
              <span>{new Date(paymentInfo.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center py-8">لا توجد معلومات دفع متاحة</p>
      )}
    </div>
  );
};

export default PaymentSuccess;