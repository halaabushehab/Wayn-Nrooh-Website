// "use client"

// import { useState } from "react"

// export default function BookingsTab() {
//   const [bookings, setBookings] = useState([
//     {
//       id: 1,
//       customer: "سارة علي",
//       destination: "جبل سيناء",
//       date: "2023-07-15",
//       people: 2,
//       status: "confirmed",
//       paid: true,
//     },
//     {
//       id: 2,
//       customer: "محمود خالد",
//       destination: "شرم الشيخ",
//       date: "2023-07-20",
//       people: 4,
//       status: "pending",
//       paid: false,
//     },
//     {
//       id: 3,
//       customer: "ليلى أحمد",
//       destination: "الأقصر",
//       date: "2023-08-05",
//       people: 1,
//       status: "confirmed",
//       paid: true,
//     },
//     {
//       id: 4,
//       customer: "أحمد محمد",
//       destination: "الغردقة",
//       date: "2023-08-12",
//       people: 3,
//       status: "cancelled",
//       paid: false,
//     },
//   ])

//   const confirmBooking = (id) => {
//     setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: "confirmed" } : booking)))
//   }

//   const cancelBooking = (id) => {
//     setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: "cancelled" } : booking)))
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">الحجوزات</h2>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 العميل
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 الوجهة
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 التاريخ
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 عدد الأشخاص
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 الحالة
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدفع</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 الإجراءات
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {bookings.map((booking) => (
//               <tr key={booking.id}>
//                 <td className="px-6 py-4 whitespace-nowrap">{booking.customer}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{booking.destination}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{booking.date}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">{booking.people}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       booking.status === "confirmed"
//                         ? "bg-green-100 text-green-800"
//                         : booking.status === "cancelled"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {booking.status === "confirmed" ? "مؤكد" : booking.status === "cancelled" ? "ملغي" : "قيد الانتظار"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       booking.paid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}
//                   >
//                     {booking.paid ? "مدفوع" : "غير مدفوع"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   {booking.status === "pending" && (
//                     <div className="flex space-x-2 rtl:space-x-reverse">
//                       <button
//                         onClick={() => confirmBooking(booking.id)}
//                         className="text-green-600 hover:text-green-900"
//                       >
//                         تأكيد
//                       </button>
//                       <button onClick={() => cancelBooking(booking.id)} className="text-red-600 hover:text-red-900">
//                         إلغاء
//                       </button>
//                     </div>
//                   )}
//                   {booking.status !== "pending" && <button className="text-[#115173] hover:text-[#022C43]">عرض</button>}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, Clock, Search, Filter, Download } from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:9527/api/payments");
        let payments = response.data.payments || [];
  
        const updatedPayments = await Promise.all(payments.map(async (payment) => {
          if (!payment.subscriber || !payment.subscriptionCard) {
            const subscriberResponse = await axios.get(`http://localhost:9527/api/users/${payment.subscriberId}`);
            const destinationResponse = await axios.get(`http://localhost:9527/api/destinations/${payment.subscriptionCardId}`);
            return {
              ...payment,
              subscriber: subscriberResponse.data || { name: "غير متوفر" },
              subscriptionCard: destinationResponse.data || { name: "غير متوفر" }
            };
          }
          return payment;
        }));
  
        setBookings(updatedPayments);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  
  const confirmBooking = (id) => {
    setBookings(bookings.map(booking => 
      booking._id === id ? { ...booking, payment_status: 'completed' } : booking
    ));
  };

  const cancelBooking = (id) => {
    setBookings(bookings.map(booking => 
      booking._id === id ? { ...booking, payment_status: 'cancelled' } : booking
    ));
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.subscriber?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.subscriptionCard?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      booking.payment_status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الحجوزات</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن حجز..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغى</option>
          </select>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#053F5E] text-white rounded-lg hover:bg-[#022C43] transition-colors">
            <Filter className="h-5 w-5" />
            <span>تصفية</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#053F5E]"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">العميل</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">الوجهة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">تاريخ الحجز</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">عدد الأشخاص</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">المبلغ</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#053F5E] rounded-full flex items-center justify-center text-white font-medium">
                            {booking.subscriber?.name?.charAt(0) || "?"}
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.subscriber?.name || "غير متوفر"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.subscriber?.email || "لا يوجد بريد"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.subscriptionCard?.name || "غير متوفر"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.subscriptionCard?.location || "غير معروف"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.createdAt).toLocaleDateString('ar-EG')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleTimeString('ar-EG')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.ticketCount || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.amount ? `${booking.amount} ر.س` : "غير محدد"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {booking.payment_status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                          ) : booking.payment_status === 'cancelled' ? (
                            <XCircle className="h-5 w-5 text-red-500 mr-1" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            booking.payment_status === 'completed' ? 'text-green-600' :
                            booking.payment_status === 'cancelled' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {booking.payment_status === 'completed' ? 'مكتمل' : 
                             booking.payment_status === 'cancelled' ? 'ملغى' : 'قيد الانتظار'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.payment_status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmBooking(booking._id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>تأكيد</span>
                            </button>
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>إلغاء</span>
                            </button>
                          </div>
                        ) : (
                          <button className="px-3 py-1 bg-[#053F5E] text-white rounded-md hover:bg-[#022C43] transition-colors flex items-center gap-1">
                            <span>عرض التفاصيل</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Search className="h-12 w-12 mb-4 text-gray-300" />
                        <p className="text-lg">لا توجد حجوزات متطابقة مع بحثك</p>
                        <p className="text-sm mt-2">حاول تغيير كلمات البحث أو معايير التصفية</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredBookings.length > 0 && (
        <div className="flex justify-between items-center bg-white px-6 py-3 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">
            عرض <span className="font-medium">{filteredBookings.length}</span> من <span className="font-medium">{bookings.length}</span> حجز
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#053F5E] text-white rounded-lg hover:bg-[#022C43] transition-colors">
            <Download className="h-5 w-5" />
            <span>تصدير البيانات</span>
          </button>
        </div>
      )}
    </div>
  );
}