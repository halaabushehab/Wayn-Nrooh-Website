import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminComments = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const [reportedComments, setReportedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // جلب التعليقات المعلقة (Pending)
  const fetchPendingComments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/comments/pending');
      console.log("Pending Comments Response:", response.data); // طباعة البيانات المستلمة
      setPendingComments(response.data);
    } catch (error) {
      console.error('حدث خطأ أثناء جلب التعليقات المعلقة', error);
    }
  };

  // جلب التعليقات المبلغ عنها (Reported)
  const fetchReportedComments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/comments/reported');
      console.log("Reported Comments Response:", response.data); // طباعة البيانات المستلمة
      setReportedComments(response.data);
    } catch (error) {
      console.error('حدث خطأ أثناء جلب التعليقات المبلغ عنها', error);
    }
  };

  // جلب جميع البيانات
  const fetchAllComments = async () => {
    setLoading(true);
    await fetchPendingComments();
    await fetchReportedComments();
    setLoading(false);
  };

  useEffect(() => {
    fetchAllComments();
  }, []);

  // تحديث حالة التعليق (موافقة أو رفض)
  const handleUpdateStatus = async (commentId, status) => {
    const confirmMessage = status === "approved" 
      ? "هل أنت متأكد من الموافقة على هذا التعليق؟" 
      : "هل أنت متأكد من رفض هذا التعليق؟";

    if (window.confirm(confirmMessage)) {
      setUpdating(true);
      try {
        await axios.put(`http://localhost:5000/api/comments/approve/${commentId}`, { status });

        // تحديث القوائم بعد تغيير الحالة
        setPendingComments((prev) => prev.filter((comment) => comment._id !== commentId));
        setReportedComments((prev) => prev.filter((comment) => comment._id !== commentId));

        alert(`تم ${status === "approved" ? "الموافقة" : "الرفض"} على التعليق بنجاح`);
      } catch (error) {
        console.error('حدث خطأ أثناء تحديث حالة التعليق', error);
        alert('حدث خطأ أثناء تحديث حالة التعليق');
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f9f9fb]">
        <div className="text-center">
          <p className="text-[#383838]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f9f9fb] p-4 font-sans">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#383838] bg-white py-4 rounded-lg shadow-md border-b-4 border-red-600">
            إدارة التعليقات
          </h2>
          <button
            onClick={fetchAllComments}
            className="mt-4 bg-[#51a31d] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#51a31d]"
          >
            تحديث القوائم
          </button>
        </div>

        {/* قسم التعليقات المعلقة (Pending) */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-[#383838] mb-4">التعليقات المعلقة</h3>
          <div className="space-y-6">
            {pendingComments.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-[#383838]">
                لا توجد تعليقات معلقة في الوقت الحالي
              </div>
            ) : (
              pendingComments.map((comment) => (
                <div 
                  key={comment._id} 
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                  dir="rtl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-bold text-[#383838]">{comment.userId?.name}</p>
                    <span className="bg-yellow-100 text-yellow-500 text-xs px-2 py-1 rounded-full">قيد الانتظار</span>
                  </div>
                  <p className="text-[#383838] mb-4 border-r-4 border-[#7585ff] pr-3 py-2">{comment.content}</p>
                  <p className="text-sm text-gray-500 mb-4">{new Date(comment.createdAt).toLocaleString('ar-SA')}</p>
                  {comment.articleId && (
                    <p className="text-sm text-gray-500 mb-4">المقال: {comment.articleId?.title}</p>
                  )}
                  <div className="flex justify-end space-x-0 space-x-reverse space-y-0 mt-4 rtl">
                    <button
                      onClick={() => handleUpdateStatus(comment._id, "rejected")}
                      className="bg-[#383838] text-white px-5 py-2 rounded-r-lg transition duration-300 hover:bg-red-600 ml-1"
                      disabled={updating}
                    >
                      {updating ? 'جاري التحديث...' : 'رفض'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(comment._id, "approved")}
                      className="bg-[#51a31d] text-white px-5 py-2 rounded-l-lg transition duration-300 hover:bg-green-600"
                      disabled={updating}
                    >
                      {updating ? 'جاري التحديث...' : 'موافقة'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* قسم التعليقات المبلغ عنها (Reported) */}
        <div>
          <h3 className="text-xl font-bold text-[#383838] mb-4">التعليقات المبلغ عنها</h3>
          <div className="space-y-6">
            {reportedComments.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-[#383838]">
                لا توجد تعليقات مبلغ عنها في الوقت الحالي
              </div>
            ) : (
              reportedComments.map((comment) => (
                <div 
                  key={comment._id} 
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                  dir="rtl"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-bold text-[#383838]">{comment.userId?.name}</p>
                    <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">تم الإبلاغ</span>
                  </div>
                  <p className="text-[#383838] mb-4 border-r-4 border-[#7585ff] pr-3 py-2">{comment.content}</p>
                  <p className="text-sm text-gray-500 mb-4">{new Date(comment.createdAt).toLocaleString('ar-SA')}</p>
                  {comment.articleId && (
                    <p className="text-sm text-gray-500 mb-4">المقال: {comment.articleId?.title}</p>
                  )}
                  {comment.reportReason && (
                    <p className="text-sm text-red-500 mb-4">سبب الإبلاغ: {comment.reportReason}</p>
                  )}
                  <div className="flex justify-end space-x-0 space-x-reverse space-y-0 mt-4 rtl">
                    <button
                      onClick={() => handleUpdateStatus(comment._id, "rejected")}
                      className="bg-[#383838] text-white px-5 py-2 rounded-r-lg transition duration-300 hover:bg-red-600 ml-1"
                      disabled={updating}
                    >
                      {updating ? 'جاري التحديث...' : 'رفض'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(comment._id, "approved")}
                      className="bg-[#51a31d] text-white px-5 py-2 rounded-l-lg transition duration-300 hover:bg-green-600"
                      disabled={updating}
                    >
                      {updating ? 'جاري التحديث...' : 'موافقة'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComments;