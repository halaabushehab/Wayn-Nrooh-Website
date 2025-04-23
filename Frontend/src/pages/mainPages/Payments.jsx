
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe('pk_test_your_publishable_key_here'); // استبدل بمفتاحك الفعلي

// // مكون فرعي لمعالجة الدفع
// const CheckoutForm = ({ place, ticketCount, total, paymentMethod }) => {
//   const stripe = useStripe();
//   const elements = useElements();
  
//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     if (!stripe || !elements) {
//       return;
//     }

//     try {
//       const { token, error } = await stripe.createToken(elements.getElement(CardElement));

//       if (error) {
//         Swal.fire({
//           title: "حدث خطأ!",
//           text: error.message,
//           icon: "error",
//           confirmButtonText: "موافق"
//         });
//         return;
//       }

//       const paymentDetails = {
//         userId: "user123",
//         placeId: place._id,
//         paymentMethod: "stripe",
//         ticketCount,
//         totalAmount: total,
//         token: token.id,
//         date: new Date().toISOString(),
//       };

//       const response = await axios.post("http://localhost:9527/api/pay", paymentDetails);

//       if (response.status === 201) {
//         Swal.fire({
//           title: "تمت العملية بنجاح!",
//           text: `تم حجز ${ticketCount} تذكرة لمكان ${place.name}.`,
//           icon: "success",
//           confirmButtonText: "حسنًا"
//         });
//       }
//     } catch (error) {
//       console.error("خطأ في الدفع:", error);
//       Swal.fire({
//         title: "حدث خطأ!",
//         text: "تعذر إتمام الدفع، يرجى المحاولة مرة أخرى.",
//         icon: "error",
//         confirmButtonText: "موافق"
//       });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement className="w-full border p-2 rounded mb-3" />
//       <button 
//         type="submit" 
//         disabled={!stripe} 
//         className="w-full bg-blue-600 text-white py-3 rounded text-lg mt-4 hover:bg-blue-700"
//       >
//         إتمام الحجز بأمان
//       </button>
//     </form>
//   );
// };

// function Pay() {
//   const { id } = useParams();
//   const [place, setPlace] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("card");
//   const [ticketCount, setTicketCount] = useState(1);
//   const [currentDate, setCurrentDate] = useState('');
  
//   const tax = 1;
//   const subtotal = place ? place.ticket_price * ticketCount : 0;
//   const total = subtotal + tax;

//   const handleTicketChange = (e) => {
//     const value = Math.max(1, parseInt(e.target.value) || 1);
//     setTicketCount(value);
//   };

//   useEffect(() => {
//     const fetchPlace = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9527/api/places/${id}`);
//         setPlace(response.data);
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

//   if (loading) return <p className="text-center text-gray-600">جارٍ تحميل البيانات...</p>;
//   if (error) return <p className="text-center text-red-600">{error}</p>;
//   if (!place) return <p className="text-center text-red-600">تعذر تحميل البيانات.</p>;

//   return (
//     <>
//       <div className="relative h-[500px] flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg"
//            style={{ backgroundImage: `url(https://i.pinimg.com/736x/00/de/6d/00de6d279a225b344fe8072720d6868c.jpg)` }}>
//         <div className="absolute inset-0 bg-black/50  rounded-lg"></div>
//         <div className="relative z-10 text-center text-white px-6 max-w-2xl">
//           <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg">تواصل معنا بشأن التذاكر والدفع</h3>
//           <p className="text-lg text-gray-200 leading-relaxed">
//             نسعد بتقديم الدعم والمساعدة لك في عملية شراء التذاكر. إذا كان لديك أي استفسارات حول خيارات الدفع أو الأسعار، لا تتردد في التواصل معنا.
//           </p>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto my-10 bg-white shadow-lg rounded-xl overflow-hidden">
//         <div className="w-full md:w-1/2 bg-cover bg-center relative"
//              style={{ backgroundImage: `url(${place.images[0]})` }}>
//           <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white p-6">
//             <h1 className="text-2xl font-bold">{place.name}</h1>
//             <p className="text-lg text-yellow-400">{place.ticket_price} دينار أردني / تذكرة</p>
//             <hr className="my-2 border-gray-500" />
//             <p>تذكرة دخول</p>
//             <p>{currentDate}</p>
//           </div>
//         </div>

//         <div className="w-full md:w-1/2 p-6 text-gray-800">
//           <h3 className="text-xl font-bold mb-4">ملخص الحجز</h3>
//           <div className="mb-4">
//             <label className="block mb-2">عدد التذاكر:</label>
//             <input 
//               type="number" 
//               min="1" 
//               value={ticketCount} 
//               onChange={handleTicketChange}
//               className="w-full p-2 border rounded"
//             />
//           </div>
          
//           <table className="w-full text-sm mb-6">
//             <tbody>
//               <tr className="flex justify-between">
//                 <td>{place.ticket_price} دينار لكل تذكرة</td>
//                 <td>{subtotal} دينار</td>
//               </tr>
//               <tr className="flex justify-between text-blue-500">
//                 <td>الضريبة</td>
//                 <td>{tax} دينار</td>
//               </tr>
//             </tbody>
//             <tfoot>
//               <tr className="flex justify-between font-bold text-lg">
//                 <td>الإجمالي</td>
//                 <td>{total} دينار</td>
//               </tr>
//             </tfoot>
//           </table>

//           <h3 className="text-xl font-bold mb-4">معلومات الدفع</h3>
//           <label className="block mb-2">اختر طريقة الدفع:</label>
//           <div className="flex space-x-4 mb-4">
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input 
//                 type="radio" 
//                 name="payment" 
//                 value="card" 
//                 checked={paymentMethod === "card"} 
//                 onChange={() => setPaymentMethod("card")} 
//               />
//               <span>بطاقة الائتمان</span>
//             </label>
//             <label className="flex items-center space-x-2 cursor-pointer">
//               <input 
//                 type="radio" 
//                 name="payment" 
//                 value="stripe" 
//                 checked={paymentMethod === "stripe"} 
//                 onChange={() => setPaymentMethod("stripe")} 
//               />
//               <span>سترايب</span>
//             </label>
//           </div>

//           <Elements stripe={stripePromise}>
//             {paymentMethod === "stripe" && (
//               <CheckoutForm 
//                 place={place} 
//                 ticketCount={ticketCount} 
//                 total={total} 
//                 paymentMethod={paymentMethod} 
//               />
//             )}
//           </Elements>

//           {paymentMethod === "card" && (
//             <button 
//               onClick={() => Swal.fire("تنبيه", "هذه الطريقة غير متاحة حالياً، يرجى استخدام Stripe", "info")}
//               className="w-full bg-blue-600 text-white py-3 rounded text-lg mt-4 hover:bg-blue-700"
//             >
//               إتمام الحجز بأمان
//             </button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default Pay;







import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CreditCard, Calendar, Ticket, Info, AlertCircle, CheckCircle } from 'lucide-react';

const stripePromise = loadStripe('pk_test_your_publishable_key_here'); // Replace with your actual key

// Stripe checkout form component
const CheckoutForm = ({ place, ticketCount, total, paymentMethod }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { token, error } = await stripe.createToken(elements.getElement(CardElement));

      if (error) {
        Swal.fire({
          title: "حدث خطأ!",
          text: error.message,
          icon: "error",
          confirmButtonText: "موافق"
        });
        setIsProcessing(false);
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="mb-4 flex items-center">
          <CreditCard className="text-[#115173] mr-2" size={20} />
          <h3 className="font-medium text-[#022C43]">تفاصيل البطاقة</h3>
        </div>
        <CardElement 
          className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#115173] focus:border-transparent" 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#022C43',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-[#115173] text-white py-3 rounded-md text-lg font-medium transition-all hover:bg-opacity-90 flex justify-center items-center"
      >
        {isProcessing ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            جاري المعالجة...
          </span>
        ) : (
          <span className="flex items-center">
            <CheckCircle className="mr-2" size={20} />
            إتمام الحجز بأمان
          </span>
        )}
      </button>
    </form>
  );
};

function Pay() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-center min-h-[60vh]">
      <AlertCircle className="mr-2" size={20} />
      <p>{error}</p>
    </div>
  );
  
  if (!place) return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-center min-h-[60vh]">
      <AlertCircle className="mr-2" size={20} />
      <p>تعذر تحميل البيانات.</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center bg-cover bg-center rounded-lg overflow-hidden shadow-lg mb-10"
           style={{ backgroundImage: `url(https://i.pinimg.com/736x/00/de/6d/00de6d279a225b344fe8072720d6868c.jpg)` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#022C43]/80 to-[#115173]/70"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            احجز تذكرتك الآن
          </h1>
          <div className="h-1 w-24 bg-[#FFD700] mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
            نسعد بتقديم الدعم والمساعدة لك في عملية شراء التذاكر. استمتع بتجربة حجز سهلة وآمنة.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Left Column - Place Details */}
          <div className="w-full lg:w-5/12 order-2 lg:order-1">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <div className="h-64 bg-cover bg-center relative"
                   style={{ backgroundImage: `url(${place.images[0]})` }}>
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
                    <span className="font-medium text-gray-700">سعر التذكرة</span>
                  </div>
                  <span className="text-xl font-bold text-[#115173]">{place.ticket_price} دينار</span>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">معلومات المكان</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {place.description || 'استمتع بزيارة هذا المكان الرائع واكتشف المزيد من المعالم والأنشطة المميزة.'}
                  </p>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mt-4">
                  <Info className="text-[#115173] mr-2" size={16} />
                  <p>يرجى إحضار بطاقة الهوية عند الحضور</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Payment Form */}
          <div className="w-full lg:w-7/12 order-1 lg:order-2">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-[#022C43] mb-6">إتمام الحجز</h2>
              
              {/* Ticket Selection */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">عدد التذاكر</label>
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
              
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h3 className="font-medium text-[#022C43] mb-4">ملخص الطلب</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{ticketCount} × تذكرة ({place.ticket_price} دينار)</span>
                    <span className="font-medium">{subtotal} دينار</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">الضريبة</span>
                    <span className="font-medium">{tax} دينار</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-bold text-[#022C43]">الإجمالي</span>
                  <span className="font-bold text-xl text-[#115173]">{total} دينار</span>
                </div>
              </div>
              
              {/* Payment Method Selection */}
              <div className="mb-8">
                <h3 className="font-medium text-[#022C43] mb-4">اختر طريقة الدفع</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                      paymentMethod === "stripe" 
                        ? "border-[#115173] bg-[#115173]/5" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("stripe")}
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
                      <p className="text-xs text-gray-500 mt-1">الدفع الآمن عبر سترايب</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
                      paymentMethod === "card" 
                        ? "border-[#115173] bg-[#115173]/5" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("card")}
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
                      <span className="font-medium text-[#022C43]">بطاقة الائتمان</span>
                      <p className="text-xs text-gray-500 mt-1">الدفع المباشر ببطاقة الائتمان</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Form */}
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
                  onClick={() => Swal.fire({
                    title: "تنبيه",
                    text: "هذه الطريقة غير متاحة حالياً، يرجى استخدام Stripe",
                    icon: "info",
                    confirmButtonText: "حسناً",
                    confirmButtonColor: "#115173"
                  })}
                  className="w-full bg-[#115173] text-white py-3 rounded-md text-lg font-medium transition-all hover:bg-opacity-90 flex justify-center items-center"
                >
                  <CheckCircle className="mr-2" size={20} />
                  إتمام الحجز بأمان
                </button>
              )}
              
              {/* Security Note */}
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-1 text-[#115173]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <span>جميع المعاملات مشفرة وآمنة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pay;
