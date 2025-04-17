import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import axios from 'axios';




function pay() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [currentDate, setCurrentDate] = useState('');
  // const [totalAmount, setTotalAmount] = useState(place.price * 2 - 2 + 1);
  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    paypalEmail: "",
    zaincashPhone: "",
  });

  // دالة لتحديث قيمة المدخلات
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClickOn = async () => {
    if (!place) return;
  
    try {
      const paymentDetails = {
        userId: "user123", // استبدل بـ userId الحقيقي
        placeId: place._id, 
        paymentMethod,
        ticketCount,
        totalAmount: total,
        paymentData,
        date: new Date().toISOString(),
      };
  
      const response = await axios.post("http://your-backend-url/api/pay", paymentDetails);
  
      if (response.status === 201) {
        Swal.fire({
          title: "تمت العملية بنجاح!",
          text: `تم حجز ${ticketCount} تذكرة لمكان ${place.name}. سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني.`,
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

// number =================
const [ticketCount, setTicketCount] = useState(1);

const handleTicketChange = (e) => {
  const value = Math.max(1, parseInt(e.target.value) || 1); // لا يسمح بالقيم السالبة أو الفارغة
  setTicketCount(value);
};

const tax = 1; // الضريبة ثابتة
const subtotal = place ? place.price * ticketCount : 0;
const total = subtotal + tax;
// number =================


  useEffect(() => {
    // الحصول على التاريخ والوقت الحالي
    const date = new Date();

    // تنسيق التاريخ بالشكل المطلوب (على سبيل المثال: "الجمعة، 16 فبراير 2025")
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', locale: 'ar-JO' };
    const formattedDate = date.toLocaleDateString('ar-JO', options);
    
    setCurrentDate(formattedDate);
  }, []);



  useEffect(() => {
    fetch(`http://localhost:9527/places/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlace(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("خطأ في جلب البيانات:", error);
        setLoading(false);
      });
  }, [id]);

  const handleClick = () => {
    if (place.is_free) {
      alert("لا يوجد حاجة لحجز تذاكر لهذا الموقع، يمكنك الذهاب مباشرة!");
    } else {
      window.location.href = `/pay/${place._id}`;
    }
  };

  if (loading) return <p className="text-center text-gray-600">جارٍ تحميل البيانات...</p>;
  if (!place) return <p className="text-center text-red-600">تعذر تحميل البيانات.</p>;

  return (
    <>
      <div
        className="relative h-[500px] flex items-center justify-center bg-cover bg-center rounded-lg shadow-lg"
        style={{ backgroundImage: `url(${place.image})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-2xl">
          <h3 className="text-4xl font-extrabold mb-4 drop-shadow-lg">تواصل معنا بشأن التذاكر والدفع</h3>
          <p className="text-lg text-gray-200 leading-relaxed">
            نسعد بتقديم الدعم والمساعدة لك في عملية شراء التذاكر. إذا كان لديك أي استفسارات حول خيارات الدفع أو الأسعار، لا تتردد في التواصل معنا.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto my-10 bg-white shadow-lg rounded-xl overflow-hidden">
        {/* مكان العرض */}
        <div
          className="w-full md:w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${place.image})` }}
        >
          <div className="absolute bottom-0 w-full bg-black bg-opacity-70 text-white p-6">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            <p className="text-lg text-yellow-400">{place.price} دينار أردني / تذكرة</p>
            <hr className="my-2 border-gray-500" />
            <p>تذكرة دخول  </p>
            <p>{currentDate}</p>
          </div>
        </div>

        {/* الدفع */}
        <div className="w-full md:w-1/2 p-6 text-gray-800">
          <h3 className="text-xl font-bold mb-4">ملخص الحجز</h3>
          <table className="w-full text-sm">
      <tbody>
        <tr className="flex justify-between">
          <td>
            {place.price} دينار لكل تذكرة
            <div className="mt-1">
              <input
                type="number"
                value={ticketCount}
                onChange={handleTicketChange}
                className="w-16 border rounded px-2 py-1 text-center"
                min="1"
              />
              <span className="ml-2">تذاكر</span>
            </div>
          </td>
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

          {/* خيارات الدفع */}
          <h3 className="text-xl font-bold mb-4">معلومات الدفع</h3>
          <label className="block mb-2">اختر طريقة الدفع:</label>
          <div className="flex space-x-4 mb-4">
            {[
              { id: "card", label: "بطاقة الائتمان" },
              { id: "stripe", label: " سترايب " },
              { id: "zaincash", label: "زين كاش" }
            ].map(({ id, label }) => (
              <label key={id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={id}
                  checked={paymentMethod === id}
                  onChange={() => setPaymentMethod(id)}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {/* بيانات الدفع حسب الطريقة المختارة */}
          {paymentMethod === "card" && (
            <div>
              <label className="block">الاسم على بطاقة الائتمان</label>
              <input className="w-full border p-2 rounded mb-3" type="text" placeholder="الاسم الكامل" />
              <label className="block">رقم بطاقة الائتمان</label>
              <input className="w-full border p-2 rounded mb-3" type="text" placeholder="**** **** **** ****" />
            </div>
          )}

          {paymentMethod === "Stripe " && (
            <div>
              <label className="block">البريد الإلكتروني لحساب باي بال</label>
              <input className="w-full border p-2 rounded mb-3" type="email" placeholder="example@Stripe .com" />
            </div>
          )}

          {paymentMethod === "zaincash" && (
            <div>
              <label className="block">رقم الهاتف المرتبط بحساب زين كاش</label>
              <input className="w-full border p-2 rounded mb-3" type="text" placeholder="رقم الهاتف" />
            </div>
          )}

          <button     onClick={handleClickOn}  className="w-full bg-blue-600 text-white py-3 rounded text-lg mt-4 hover:bg-blue-700">
            إتمام الحجز بأمان
          </button>
        </div>
      </div>
    </>
  );
}

export default pay;




















// import React, { useState, useEffect } from "react";
// import { useLocation, useSearchParams } from "react-router-dom";
// import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { toast } from 'react-toastify';
// // Error Boundary للتعامل مع الأخطاء داخل مكون PayPalButtons
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }
//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }
//   componentDidCatch(error, errorInfo) {
//     console.error("ErrorBoundary caught an error", error, errorInfo);
//   }
//   render() {
//     if (this.state.hasError) {
//       return (
//         <h2 className="text-red-600">
//           حدث خطأ أثناء تحميل معالج الدفع. يرجى المحاولة لاحقاً.
//         </h2>
//       );
//     }
//     return this.props.children;
//   }
// }

// const customColors = {
//   primary: "#61090b",
//   dark: "#000000",
//   text: "#000000", // نص أسود
//   lightGray: "#f3f4f6",
//   mediumGray: "#9ca3af",
//   darkGray: "#1f2937",
// };

// const PaymentPage = () => {
//   const [user, setUser] = useState(null);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("paypal");

//   const location = useLocation();
//   const [searchParams] = useSearchParams();

//   // الحصول على بيانات خطة الاشتراك من location.state أو من معطيات URL
//   const planData = location.state || {
//     id: searchParams.get("id"),
//     title: searchParams.get("title"),
//     price: searchParams.get("price"),
//     duration: searchParams.get("duration"),
//     features: searchParams.get("features")
//       ? searchParams.get("features").split(",")
//       : [],
//   };
//   const { id, title, price, duration, features } = planData;


//   useEffect(() => {
//     // const fetchUserProfile = async () => {
//     //   try {
//     //     const response = await axios.get("http://localhost:5000/api/users/gituserpayment", {
//     //       withCredentials: true,
//     //     });
//     //     console.log("✅ User profile fetched:", response.data);
//     //     setUser(response.data.user);
//     //   } catch (error) {
//     //     console.error("❌ Error fetching profile:", error.response?.data || error.message);
//     //   }
//     // };
// const fetchUserProfile = async () => {
//   try {
//     // 🔥 1️⃣ Retrieve the token from localStorage
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("❌ No token found in localStorage");
//       return;
//     }

//     // 🔥 2️⃣ Decode the token to extract user ID
//     const decodedToken = jwtDecode(token); // Extracts { userId: "67d44acc1bdee5c049d5519e", iat: ..., exp: ... }

//     if (!decodedToken.userId) {
//       console.error("❌ No user ID found in token");
//       return;
//     }

//     console.log("✅ Extracted User ID from token:", decodedToken.userId);

//     // 🔥 3️⃣ Fetch user profile using token (No need to send user ID in request)
//     const response = await axios.get(
//       "http://localhost:5000/api/users/profile",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`, // Send token in headers
//         },
//       }
//     );

//     console.log("✅ User profile fetched:", response.data);
//     setUser(response.data.user);
//   } catch (error) {
//     console.error(
//       "❌ Error fetching profile:",
//       error.response?.data || error.message
//     );
//   }
// };
//     fetchUserProfile();
//   }, []);


//   const paypalClientId =
//     "AU5e_yUL8prhNgnKaZSZzhXsTmTOlWeDW5YsAg3JIjdWJjehIpyy7wLKYjfakSXoUrPaP07FroujGFne"; 
//   const initialOptions = {
//     "client-id": paypalClientId,
//     components: "buttons",
//     currency: "USD",
//     intent: "capture",
//   };

  
//   const sendPaymentData = async (paymentDetails) => {
//     try {
//       const requestBody = {
//         subscriber_id: user?._id || user?.id,
//         subscriptionCard_id: id,
//         payment_method: "Credit Card",
//       };

//       const response = await axios.post("http://localhost:5000/api/payment", requestBody, {
//         withCredentials: true,
//       });
//       console.log("Payment data sent successfully:", response.data);
//       toast.success("Payment recorded successfully!");
//     } catch (error) {
//       console.error("Error while sending payment data:", error);
//       toast.error("Failed to record payment. Please try again.");
//     }
//   };

//   const handleApprove = (data, actions) => {
//     return actions.order.capture().then((details) => {
//       console.log("Payment completed:", details);
//       sendPaymentData(details);
//       toast.success("Payment successful!");
//     });
//   };
  

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: customColors.lightGray }}>
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           <h1 className="text-3xl font-bold text-center mb-8" style={{ color: customColors.primary }}>
//             Complete Payment
//           </h1>
//           {/* تخطيط بعمودين: العمود الأيسر والعمود الأيمن */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* العمود الأيسر: معلومات المستخدم وتفاصيل خطة الاشتراك */}
//             <div className="space-y-6">
//               {/* بطاقة معلومات المستخدم */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold border-b pb-4 mb-4" style={{ color: customColors.primary }}>
//                   User Information
//                 </h2>
//                 {user ? (
//                   <div className="space-y-4 text-black">
//                     <div className="flex justify-between">
//                       <span className="font-medium">Username:</span>
//                       <span>{user.username}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="font-medium">Email:</span>
//                       <span>{user.email}</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-gray-800">Please login to complete the payment.</p>
//                 )}
//               </div>
//               {/* بطاقة تفاصيل خطة الاشتراك */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-xl font-bold border-b pb-4 mb-4" style={{ color: customColors.primary }}>
//                   Subscription Plan Details
//                 </h2>
//                 <div className="space-y-4 text-black">
//                   <div className="flex justify-between">
//                     <span className="font-medium">Plan:</span>
//                     <span>{title}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Price:</span>
//                     <span>{price}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Duration:</span>
//                     <span>{duration}</span>
//                   </div>
//                   <div>
//                     <span className="font-medium">Features:</span>
//                     <ul className="mt-2">
//                       {features && features.length > 0 ? (
//                         features.map((feature, index) => (
//                           <li key={index} className="flex items-center text-black">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               viewBox="0 0 20 20"
//                               className="w-5 h-5 fill-current text-green-600 mr-2"
//                             >
//                               <path d="M7.293 13.293l-3-3a1 1 0 011.414-1.414L8 12.586l8.293-8.293a1 1 0 111.414 1.414l-9 9a1 1 0 01-1.414 0z" />
//                             </svg>
//                             {feature}
//                           </li>
//                         ))
//                       ) : (
//                         <li className="text-gray-500">No features available.</li>
//                       )}
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* العمود الأيمن: معلومات الدفع */}
//             <div className="bg-white rounded-lg shadow-md p-6 text-black">
//               <h2 className="text-xl font-bold border-b pb-4 mb-6" style={{ color: customColors.primary }}>
//                 Payment Information
//               </h2>
//               <div className="mb-6">
//                 <div className="flex items-center space-x-4 mb-4">
//                   <input
//                     type="radio"
//                     id="paypal"
//                     name="paymentMethod"
//                     className="h-5 w-5"
//                     checked={selectedPaymentMethod === "paypal"}
//                     onChange={() => setSelectedPaymentMethod("paypal")}
//                     style={{ accentColor: customColors.primary }}
//                   />
//                   <label htmlFor="paypal" className="flex items-center text-black">
//                     <span className="mr-2">PayPal</span>
//                     <img src="data:image/png;base64,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" alt="PayPal" className="h-8" />
//                   </label>
//                 </div>
//                 <div className="flex items-center space-x-4 mb-4">
//                   <input
//                     type="radio"
//                     id="credit-card"
//                     name="paymentMethod"
//                     className="h-5 w-5"
//                     checked={selectedPaymentMethod === "credit-card"}
//                     onChange={() => setSelectedPaymentMethod("credit-card")}
//                     style={{ accentColor: customColors.primary }}
//                   />
//                   <label htmlFor="credit-card" className="flex items-center text-black">
//                     <span className="mr-2">Visa</span>
//                     <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjXEU_gvHUQSBFi_KEJVyM1gC-q_fFDYriIg&s" alt="Credit Cards" className="h-8" />
//                   </label>
//                 </div>
//               </div>

//               {selectedPaymentMethod === "paypal" && (
//                 <div className="border-2 border-gray-300 rounded-lg p-5 bg-white">
//                   <PayPalScriptProvider options={initialOptions}>
//                     <ErrorBoundary>
//                       <PayPalButtons
//                         createOrder={(data, actions) =>
//                           actions.order.create({
//                             purchase_units: [
//                               {
//                                 amount: { value: price.replace("$", "") },
//                               },
//                             ],
//                           })
//                         }
//                         onApprove={(data, actions) =>
//                           actions.order.capture().then((details) => {
//                             console.log("Payment completed:", details);
//                             sendPaymentData(details);
//                             alert("Payment successful!");
//                           })
//                         }
//                         onError={(err) => {
//                           console.error("PayPal error:", err);
//                           alert("Payment failed. Please try again.");
//                         }}
//                         style={{ layout: "vertical" }}
//                       />
//                     </ErrorBoundary>
//                   </PayPalScriptProvider>
//                 </div>
//               )}

//               {selectedPaymentMethod === "credit-card" && (
//                 <div className="border-2 border-gray-300 rounded-lg p-5 bg-white">
//                   <div className="grid grid-cols-1 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Card Number</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
//                         style={{ borderColor: customColors.primary }}
//                         maxLength={16}
//                         placeholder="0000 0000 0000 0000"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-gray-700 mb-2">Expiration Date</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
//                           style={{ borderColor: customColors.primary }}
//                           placeholder="MM/YY"

//                         />
//                       </div>
//                       <div>
//                         <label className="block text-gray-700 mb-2">Security Code (CVV)</label>
//                         <input
//                           type="text"
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
//                           style={{ borderColor: customColors.primary }}
//                           placeholder="123"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Cardholder Name</label>
//                       <input
//                         type="text"
//                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
//                         style={{ borderColor: customColors.primary }}
//                       />
//                     </div>
//                     <button
//                       onClick={sendPaymentData}
//                       className="text-white py-3 px-6 rounded-lg font-bold mt-4 transition duration-300 hover:opacity-90"
//                       style={{ backgroundColor: customColors.primary }}
//                     >
//                       Complete Payment
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <div className="mt-6 text-sm text-gray-600 flex items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-2 text-gray-500"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 All transactions are secure and encrypted with SSL technology
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Footer يمكن إضافته هنا */}
//     </div>
//   );
// };

// export default PaymentPage;



