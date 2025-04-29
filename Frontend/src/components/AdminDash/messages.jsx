// "use client"

// import { useEffect, useState } from "react"
// import axios from "axios"

// export default function MessagesTab() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // "all", "read", "unread"
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [replyText, setReplyText] = useState("");

//   // جلب الرسائل من الخادم عند تحميل المكون
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get("http://localhost:9527/api/message");
//         setMessages(response.data.data || response.data);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchMessages();
//   }, []);

//   // فلترة الرسائل حسب الحالة
//   const filteredMessages = messages.filter((msg) => {
//     if (filter === "all") return true;
//     if (filter === "read") return msg.status === "Read";
//     if (filter === "unread") return msg.status === "Unread";
//     return true;
//   });

//   // دالة لتحديث حالة الرسالة كمقروءة عبر الخادم
//   const markAsRead = async (id) => {
//     try {
//       await axios.put(`http://localhost:9527/api/message/${id}`, {
//         status: "Read",
//       });
//       setMessages((prev) =>
//         prev.map((msg) => (msg._id === id ? { ...msg, status: "Read", read: true } : msg))
//       );
//     } catch (error) {
//       console.error("Error updating message status:", error);
//     }
//   };

//   // اختيار رسالة وعرضها، وتحديدها كمقروءة إذا لم تكن كذلك
//   const selectMessage = (message) => {
//     setSelectedMessage(message);
//     if (message.status !== "Read") {
//       markAsRead(message._id);
//     }
//   };

//   const sendReply = async () => {
//     if (replyText.trim() === "" || !selectedMessage) return;
//     try {
//       const res = await axios.post("http://localhost:9527/api/message/reply", {
//         messageId: selectedMessage._id, 
//         replyMessage: replyText,
//       });
//       alert(`تم إرسال الرد إلى ${selectedMessage.from}: ${replyText}`);
//       setReplyText("");
//       // إعادة تحميل الرسائل لتحديث الحالة بعد الرد
//       const updated = await axios.get("http://localhost:9527/api/message");
//       setMessages(updated.data.data || updated.data);
//     } catch (error) {
//       console.error("Error sending reply:", error);
//       alert("حدث خطأ أثناء إرسال الرد.");
//     }
//   };

//   if (loading) {
//     return <div>جارٍ التحميل...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">الرسائل</h2>

//       {/* أزرار الفلتر */}
//       <div className="flex space-x-4">
//         <button
//           className={`px-3 py-1 ${filter === "all" ? "font-bold" : ""}`}
//           onClick={() => setFilter("all")}
//         >
//           الكل
//         </button>
//         <button
//           className={`px-3 py-1 ${filter === "read" ? "font-bold" : ""}`}
//           onClick={() => setFilter("read")}
//         >
//           مقروءة
//         </button>
//         <button
//           className={`px-3 py-1 ${filter === "unread" ? "font-bold" : ""}`}
//           onClick={() => setFilter("unread")}
//         >
//           غير مقروءة
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="grid grid-cols-1 md:grid-cols-3">
//           {/* قائمة الرسائل */}
//           <div className="md:col-span-1 border-l">
//             <div className="p-4 border-b">
//               <h3 className="font-medium">صندوق الوارد</h3>
//             </div>
//             <div className="divide-y">
//               {filteredMessages.map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`p-4 cursor-pointer hover:bg-gray-50 
//                     ${selectedMessage && selectedMessage._id === msg._id ? "bg-gray-50" : ""}
//                     ${msg.status === "Unread" ? "font-semibold text-black" : "text-gray-500"}`}
//                   onClick={() => selectMessage(msg)}
//                 >
//                   <div className="flex justify-between">
//                     <span>{msg.from}</span>
//                     <span className="text-xs">
//                       {new Date(msg.createdAt).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="text-sm truncate">
//                     {msg.title}
//                     {msg.adminReply && (
//                       <span className="ml-2 text-xs text-green-600 font-bold">
//                         (تم الرد)
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* محتوى الرسالة */}
//           <div className="md:col-span-2 flex flex-col h-[70vh]">
//             {selectedMessage ? (
//               <>
//                 <div className="p-4 border-b">
//                   <h3 className="font-medium">{selectedMessage.title}</h3>
//                   <div className="flex justify-between text-sm text-gray-500 mt-1">
//                     <span>من: {selectedMessage.from}</span>
//                     <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
//                   </div>
//                 </div>
//                 <div className="p-4 flex-1 overflow-auto">
//                   <p>{selectedMessage.message}</p>
//                   {selectedMessage.adminReply && (
//                     <div className="mt-4 p-4 border rounded bg-gray-100">
//                       <h4 className="font-medium">رد الأدمن:</h4>
//                       <p>{selectedMessage.adminReply}</p>
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-4 border-t">
//                   <textarea
//                     className="w-full p-2 border rounded-md"
//                     rows="3"
//                     placeholder="اكتب ردك هنا..."
//                     value={replyText}
//                     onChange={(e) => setReplyText(e.target.value)}
//                   ></textarea>
//                   <button
//                     className="mt-2 px-4 py-2 bg-[#115173] text-white rounded-md hover:bg-[#022C43]"
//                     onClick={sendReply}
//                   >
//                     إرسال الرد
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-500">
//                 اختر رسالة لعرضها
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react"
import axios from "axios"
import { Mail, MailOpen, Reply, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react'

export default function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:9527/api/message");
        setMessages(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    // تطبيق الفلتر حسب الحالة
    if (filter === "read" && msg.status !== "Read") return false;
    if (filter === "unread" && msg.status !== "Unread") return false;
    
    // تطبيق البحث
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        msg.name.toLowerCase().includes(query) ||
        msg.from.toLowerCase().includes(query) ||
        msg.title.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:9527/api/message/${id}`, {
        status: "Read",
      });
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, status: "Read" } : msg))
      );
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const selectMessage = (message) => {
    setSelectedMessage(message);
    if (message.status !== "Read") {
      markAsRead(message._id);
    }
  };

  const sendReply = async () => {
    if (replyText.trim() === "" || !selectedMessage) return;
    try {
      const res = await axios.post("http://localhost:9527/api/message/reply", {
        messageId: selectedMessage._id, 
        replyMessage: replyText,
      });
      alert(`تم إرسال الرد إلى ${selectedMessage.from}: ${replyText}`);
      setReplyText("");
      const updated = await axios.get("http://localhost:9527/api/message");
      setMessages(updated.data.data || updated.data);
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("حدث خطأ أثناء إرسال الرد.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Mail className="text-[#115173]" size={24} />
          <span>إدارة الرسائل</span>
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث في الرسائل..."
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="py-2 pr-1 bg-transparent focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">كل الرسائل</option>
              <option value="unread">غير المقروءة</option>
              <option value="read">المقروءة</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[70vh]">
          {/* قائمة الرسائل */}
          <div className="md:col-span-1 border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-[#f8fafc]">
              <h3 className="font-medium text-gray-700">صندوق الوارد ({filteredMessages.length})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-4 cursor-pointer transition-colors ${selectedMessage?._id === msg._id ? "bg-[#f0f7ff]" : "hover:bg-gray-50"} ${msg.status === "Unread" ? "bg-blue-50" : ""}`}
                    onClick={() => selectMessage(msg)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {msg.status === "Unread" ? (
                            <Mail className="h-4 w-4 text-blue-500" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-gray-400" />
                          )}
                          <p className={`truncate font-medium ${msg.status === "Unread" ? "text-gray-900" : "text-gray-600"}`}>
                            {msg.from}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate mt-1">{msg.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">{msg.message.substring(0, 60)}...</p>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {new Date(msg.createdAt).toLocaleDateString('ar-EG')}
                      </div>
                    </div>
                    {msg.adminReply && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          تم الرد
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2">لا توجد رسائل متطابقة مع بحثك</p>
                </div>
              )}
            </div>
          </div>

          {/* محتوى الرسالة */}
          <div className="md:col-span-2 flex flex-col border-t md:border-t-0 border-gray-200">
            {selectedMessage ? (
              <>
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{selectedMessage.title}</h3>
                      <div className="mt-1 text-sm text-gray-500">
                        من: <span className="font-medium">{selectedMessage.from}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(selectedMessage.createdAt).toLocaleString('ar-EG')}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto bg-white">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{selectedMessage.message}</p>
                  </div>
                  
                  {selectedMessage.adminReply && (
                    <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Reply className="h-4 w-4 text-[#115173]" />
                        <span>رد الإدارة</span>
                      </div>
                      <div className="mt-2 prose-sm text-gray-700 whitespace-pre-line">
                        {selectedMessage.adminReply}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E]"
                    rows="3"
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <div className="mt-3 flex justify-end">
                    <button
                      className="px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#053F5E] transition-colors flex items-center gap-2"
                      onClick={sendReply}
                    >
                      <Reply className="h-5 w-5" />
                      <span>إرسال الرد</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <MailOpen className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg">اختر رسالة لعرضها</p>
                <p className="text-sm mt-2">اضغط على أي رسالة من القائمة لقراءتها والرد عليها</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}