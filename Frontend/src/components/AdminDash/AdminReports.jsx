// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie'; // تأكد من تنصيب هذه المكتبة
// import { toast } from 'sonner';

// const AdminReports = () => {
//   const [user, setUser] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('pending');

//   useEffect(() => {
//     const loadUserFromCookies = () => {
//       const userCookie = Cookies.get("user");
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie);
//           if (parsedUser.token) {
//             setUser({
//               username: parsedUser.username,
//               userId: parsedUser.userId,
//               isAdmin: parsedUser.isAdmin || false,
//               photo: parsedUser.photo || "",
//             });

//             // إضافة التوكن إلى هيدر axios بشكل عام
//             axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
//             console.log("Authorization header set:", axios.defaults.headers.common["Authorization"]);
//           }
//         } catch (error) {
//           console.error("Error parsing user cookie:", error);
//           Cookies.remove("user");
//         }
//       }
//     };
//     loadUserFromCookies();
//   }, []);

//   useEffect(() => {
//     if (!user) return; // لا تجلب البلاغات إلا إذا تم تحميل المستخدم والتوكن

//     const fetchReports = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(`http://localhost:9527/api/reports?status=${filter}`);
//         setReports(response.data);
//       } catch (error) {
//         console.error("Error fetching reports:", error);
//         toast.error("حدث خطأ أثناء جلب البلاغات");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, [filter, user]);

//   const handleResolve = async (reportId, action) => {
//     try {
//       await axios.put(
//         `http://localhost:9527/api/reports/${reportId}/resolve`,
//         { action }
//       );
//       toast.success("تم تحديث حالة البلاغ بنجاح");
//       setReports(reports.filter(r => r._id !== reportId));
//     } catch (error) {
//       console.error("Error resolving report:", error);
//       toast.error("حدث خطأ أثناء تحديث حالة البلاغ");
//     }
//   };

//   if (loading) return <div>جاري التحميل...</div>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">إدارة البلاغات</h1>
      
//       <div className="flex gap-3 mb-6">
//         <button 
//           onClick={() => setFilter('pending')}
//           className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//         >
//           قيد الانتظار
//         </button>
//         <button 
//           onClick={() => setFilter('reviewed')}
//           className={`px-4 py-2 rounded-lg ${filter === 'reviewed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//         >
//           تمت المراجعة
//         </button>
//         <button 
//           onClick={() => setFilter('resolved')}
//           className={`px-4 py-2 rounded-lg ${filter === 'resolved' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//         >
//           تم الحل
//         </button>
//       </div>

//       {reports.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           لا توجد بلاغات {filter === 'pending' ? 'قيد الانتظار' : filter === 'reviewed' ? 'تمت مراجعتها' : 'تم حلها'}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {reports.map(report => (
//             <div key={report._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="font-bold">التعليق: {report.commentId.comment}</h3>
//                   <p className="text-sm text-gray-600 mt-1">السبب: {getReasonText(report.reason)}</p>
//                   {report.details && (
//                     <p className="text-sm text-gray-600 mt-1">التفاصيل: {report.details}</p>
//                   )}
//                   <p className="text-xs text-gray-500 mt-2">
//                     تم الإبلاغ بواسطة: {report.userId.username} في {new Date(report.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//                 {report.status === 'pending' && (
//                   <div className="flex gap-2">
//                     <button 
//                       onClick={() => handleResolve(report._id, 'hide_comment')}
//                       className="px-3 py-1 bg-red-500 text-white rounded text-sm"
//                     >
//                       إخفاء التعليق
//                     </button>
//                     <button 
//                       onClick={() => handleResolve(report._id, 'no_action')}
//                       className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
//                     >
//                       لا يوجد إجراء
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// function getReasonText(reason) {
//   const reasons = {
//     spam: 'محتوى غير مرغوب أو إعلاني',
//     abuse: 'إساءة أو لغة غير لائقة',
//     false: 'معلومات خاطئة',
//     other: 'سبب آخر'
//   };
//   return reasons[reason] || reason;
// }

// export default AdminReports;


import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

const AdminReports = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
              photo: parsedUser.photo || "",
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

  useEffect(() => {
    if (!user) return;

    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:9527/api/reports?status=${filter}`);
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("حدث خطأ أثناء جلب البلاغات");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filter, user]);

  const handleResolve = async (reportId, action) => {
    try {
      await axios.put(
        `http://localhost:9527/api/reports/${reportId}/resolve`,
        { action }
      );
      toast.success("تم تحديث حالة البلاغ بنجاح");
      setReports(reports.filter(r => r._id !== reportId));
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error("حدث خطأ أثناء تحديث حالة البلاغ");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-right">إدارة البلاغات</h1>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filter === 'pending' 
              ? 'bg-[#115173] text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          قيد الانتظار
        </button>
        <button 
          onClick={() => setFilter('reviewed')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filter === 'reviewed' 
              ? 'bg-[#115173] text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          تمت المراجعة
        </button>
        <button 
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            filter === 'resolved' 
              ? 'bg-[#115173] text-white shadow-md' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          تم الحل
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            لا توجد بلاغات {filter === 'pending' ? 'قيد الانتظار' : filter === 'reviewed' ? 'تمت مراجعتها' : 'تم حلها'}
          </h3>
          <p className="mt-1 text-gray-500">
            لم يتم العثور على أي بلاغات في هذه الفئة
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {reports.map(report => (
            <div key={report._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      report.status === 'pending' ? 'bg-yellow-500' : 
                      report.status === 'reviewed' ? 'bg-[#115173]' : 'bg-green-500'
                    }`}></span>
                    <h3 className="font-bold text-lg text-gray-800 break-words">
                      التعليق: {report.commentId.comment}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        <span className="font-medium">السبب:</span> {getReasonText(report.reason)}
                      </span>
                      {report.details && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md break-words">
                          <span className="font-medium">التفاصيل:</span> {report.details}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-2">
                      <p>تم الإبلاغ بواسطة: <span className="font-medium">{report.userId.username}</span></p>
                      <p>في {new Date(report.createdAt).toLocaleString('ar-EG')}</p>
                    </div>
                  </div>
                </div>
                
                {report.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                    <button 
                      onClick={() => handleResolve(report._id, 'hide_comment')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm flex items-center justify-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      إخفاء التعليق
                    </button>
                    <button 
                      onClick={() => handleResolve(report._id, 'no_action')}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors duration-200 shadow-sm flex items-center justify-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      لا يوجد إجراء
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function getReasonText(reason) {
  const reasons = {
    spam: 'محتوى غير مرغوب أو إعلاني',
    abuse: 'إساءة أو لغة غير لائقة',
    false: 'معلومات خاطئة',
    other: 'سبب آخر'
  };
  return reasons[reason] || reason;
}

export default AdminReports;