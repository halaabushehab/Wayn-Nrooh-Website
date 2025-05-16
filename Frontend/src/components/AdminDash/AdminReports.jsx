import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // تأكد من تنصيب هذه المكتبة
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

            // إضافة التوكن إلى هيدر axios بشكل عام
            axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
            console.log("Authorization header set:", axios.defaults.headers.common["Authorization"]);
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
    if (!user) return; // لا تجلب البلاغات إلا إذا تم تحميل المستخدم والتوكن

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

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة البلاغات</h1>
      
      <div className="flex gap-3 mb-6">
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          قيد الانتظار
        </button>
        <button 
          onClick={() => setFilter('reviewed')}
          className={`px-4 py-2 rounded-lg ${filter === 'reviewed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          تمت المراجعة
        </button>
        <button 
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg ${filter === 'resolved' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          تم الحل
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          لا توجد بلاغات {filter === 'pending' ? 'قيد الانتظار' : filter === 'reviewed' ? 'تمت مراجعتها' : 'تم حلها'}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">التعليق: {report.commentId.comment}</h3>
                  <p className="text-sm text-gray-600 mt-1">السبب: {getReasonText(report.reason)}</p>
                  {report.details && (
                    <p className="text-sm text-gray-600 mt-1">التفاصيل: {report.details}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    تم الإبلاغ بواسطة: {report.userId.username} في {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
                {report.status === 'pending' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleResolve(report._id, 'hide_comment')}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      إخفاء التعليق
                    </button>
                    <button 
                      onClick={() => handleResolve(report._id, 'no_action')}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                    >
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
