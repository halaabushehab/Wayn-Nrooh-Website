
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_your_publishable_key_here'); // استبدل بمفتاحك الفعلي

// مكون فرعي لمعالجة الدفع
const CheckoutForm = ({ place, ticketCount, total, paymentMethod }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    try {
      const { token, error } = await stripe.createToken(elements.getElement(CardElement));

      if (error) {
        Swal.fire({
          title: "حدث خطأ!",
          text: error.message,
          icon: "error",
          confirmButtonText: "موافق"
        });
        return;
      }

      const paymentDetails = {
        userId: "user123",
        placeId: place._id,
        paymentMethod: "stripe",
        ticketCount,
        totalAmount: total,
        token: token.id,
        date: new Date().toISOString(),
      };

      const response = await axios.post("http://localhost:9527/api/pay", paymentDetails);

      if (response.status === 201) {
        Swal.fire({
          title: "تمت العملية بنجاح!",
          text: `تم حجز ${ticketCount} تذكرة لمكان ${place.name}.`,
          icon: "success",
          confirmButtonText: "حسنًا"
        });
      }
    } catch (error) {
      console.error("خطأ في الدفع:", error);
      Swal.fire({
        title: "حدث خطأ!",
        text: "تعذر إتمام الدفع، يرجى المحاولة مرة أخرى.",
        icon: "error",
        confirmButtonText: "موافق"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="w-full border p-2 rounded mb-3" />
      <button 
        type="submit" 
        disabled={!stripe} 
        className="w-full bg-blue-600 text-white py-3 rounded text-lg mt-4 hover:bg-blue-700"
      >
        إتمام الحجز بأمان
      </button>
    </form>
  );
};

function Pay() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [ticketCount, setTicketCount] = useState(1);
  const [currentDate, setCurrentDate] = useState('');
  
  const tax = 1;
  const subtotal = place ? place.ticket_price * ticketCount : 0;
  const total = subtotal + tax;

  const handleTicketChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setTicketCount(value);
  };

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:9527/api/places/${id}`);
        setPlace(response.data);
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
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('ar-JO', options);
    setCurrentDate(formattedDate);
  }, []);

  if (loading) return <p className="text-center text-gray-600">جارٍ تحميل البيانات...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!place) return <p className="text-center text-red-600">تعذر تحميل البيانات.</p>;

  return (
    <>
      <div className="relative h-[500px] flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg"
           style={{ backgroundImage: `url(https://i.pinimg.com/736x/00/de/6d/00de6d279a225b344fe8072720d6868c.jpg)` }}>
        <div className="absolute inset-0 bg-black/50  rounded-lg"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-2xl">
          <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg">تواصل معنا بشأن التذاكر والدفع</h3>
          <p className="text-lg text-gray-200 leading-relaxed">
            نسعد بتقديم الدعم والمساعدة لك في عملية شراء التذاكر. إذا كان لديك أي استفسارات حول خيارات الدفع أو الأسعار، لا تتردد في التواصل معنا.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto my-10 bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-cover bg-center relative"
             style={{ backgroundImage: `url(${place.images[0]})` }}>
          <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white p-6">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            <p className="text-lg text-yellow-400">{place.ticket_price} دينار أردني / تذكرة</p>
            <hr className="my-2 border-gray-500" />
            <p>تذكرة دخول</p>
            <p>{currentDate}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 text-gray-800">
          <h3 className="text-xl font-bold mb-4">ملخص الحجز</h3>
          <div className="mb-4">
            <label className="block mb-2">عدد التذاكر:</label>
            <input 
              type="number" 
              min="1" 
              value={ticketCount} 
              onChange={handleTicketChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <table className="w-full text-sm mb-6">
            <tbody>
              <tr className="flex justify-between">
                <td>{place.ticket_price} دينار لكل تذكرة</td>
                <td>{subtotal} دينار</td>
              </tr>
              <tr className="flex justify-between text-blue-500">
                <td>الضريبة</td>
                <td>{tax} دينار</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="flex justify-between font-bold text-lg">
                <td>الإجمالي</td>
                <td>{total} دينار</td>
              </tr>
            </tfoot>
          </table>

          <h3 className="text-xl font-bold mb-4">معلومات الدفع</h3>
          <label className="block mb-2">اختر طريقة الدفع:</label>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="payment" 
                value="card" 
                checked={paymentMethod === "card"} 
                onChange={() => setPaymentMethod("card")} 
              />
              <span>بطاقة الائتمان</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" 
                name="payment" 
                value="stripe" 
                checked={paymentMethod === "stripe"} 
                onChange={() => setPaymentMethod("stripe")} 
              />
              <span>سترايب</span>
            </label>
          </div>

          <Elements stripe={stripePromise}>
            {paymentMethod === "stripe" && (
              <CheckoutForm 
                place={place} 
                ticketCount={ticketCount} 
                total={total} 
                paymentMethod={paymentMethod} 
              />
            )}
          </Elements>

          {paymentMethod === "card" && (
            <button 
              onClick={() => Swal.fire("تنبيه", "هذه الطريقة غير متاحة حالياً، يرجى استخدام Stripe", "info")}
              className="w-full bg-blue-600 text-white py-3 rounded text-lg mt-4 hover:bg-blue-700"
            >
              إتمام الحجز بأمان
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Pay;