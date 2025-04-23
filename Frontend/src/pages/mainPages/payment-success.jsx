import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    const fetchPaymentDetails = async () => {
      try {
        const res = await fetch(
          `http://localhost:9527/api/payments/verifyPayment?session_id=${sessionId}`
        );
        const data = await res.json();
        setPaymentInfo(data.payment);
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };

    if (sessionId) {
      fetchPaymentDetails();
    }
  }, [searchParams]);

  return (
    <div>
    {paymentInfo ? (
      <div>
        <h2>تم الدفع بنجاح!</h2>
        <p>المكان: {paymentInfo.subscriptionCard}</p>
        <p>المبلغ: ${paymentInfo.amount}</p>
        <p>عدد التذاكر: {paymentInfo.ticketCount}</p>
      </div>
    ) : (
      <p>جارٍ التحقق من الدفع...</p>
    )}
  </div>
  );
};

export default PaymentSuccess;
