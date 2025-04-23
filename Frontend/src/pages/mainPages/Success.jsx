src/pages/Success.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

const Success = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = new URLSearchParams(useLocation().search);
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (!sessionId) return;
    const fetchPayment = async () => {
      try {
        const res = await axios.get(`http://localhost:9527/api/payments/${sessionId}`);
        setPayment(res.data.payment);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [sessionId]);

  if (loading) return <div className="flex justify-center p-6">جارٍ التحقق من الدفع...</div>;
  if (!payment) return <div className="text-red-600 p-6">لم يتم العثور على تفاصيل الدفع.</div>;

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-2xl text-green-600 font-bold mb-4">تمت عملية الدفع بنجاح!</h2>
      <p>قيمة الدفع: {payment.amount} USD</p>
      <p>مكان الزيارة: {payment.placeName}</p>
      <p>عدد التذاكر: {payment.ticketCount}</p>
      <button
        onClick={() => window.location.href = '/'}
        className="mt-6 px-4 py-2 bg-[#115173] text-white rounded-md hover:bg-[#022C43]"
      >العودة للرئيسية</button>
    </div>
  );
};

export default Success;
