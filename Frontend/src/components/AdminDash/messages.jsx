import { useEffect, useState } from "react"
import axios from "axios"
import { Mail, MailOpen, Reply, Filter, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (filter === "read" && msg.status !== "Read") return false;
    if (filter === "unread" && msg.status !== "Unread") return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (msg.name?.toLowerCase().includes(query) || '') ||
        (msg.from?.toLowerCase().includes(query) || '') ||
        (msg.title?.toLowerCase().includes(query) || '') ||
        (msg.message?.toLowerCase().includes(query) || '')
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
    if (!replyText.trim() || !selectedMessage) {
      alert("الرجاء إدخال نص الرد");
      return;
    }

    setSendingReply(true);
    try {
      const res = await axios.post("http://localhost:9527/api/message/reply", {
        messageId: selectedMessage._id, 
        replyMessage: replyText,
      });
      
      alert(`تم إرسال الرد بنجاح إلى ${selectedMessage.from}`);
      
      setReplyText("");
      const updated = await axios.get("http://localhost:9527/api/message");
      setMessages(updated.data.data || updated.data);
      
      if (selectedMessage) {
        setSelectedMessage(updated.data.data.find(m => m._id === selectedMessage._id));
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert(`حدث خطأ أثناء إرسال الرد: ${error.response?.data?.message || error.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  const closeMessageView = () => {
    setSelectedMessage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#115173]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
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
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E] text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="py-2 pr-1 bg-transparent focus:outline-none text-sm md:text-base"
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

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className={`flex flex-col md:flex-row h-[calc(100vh-180px)] md:h-[70vh]`}>
          {/* Messages List */}
          <div className={`${selectedMessage && isMobileView ? 'hidden' : 'block'} md:block w-full md:w-1/3 border-l border-gray-200 overflow-y-auto`}>
            <div className="p-3 md:p-4 border-b border-gray-200 bg-[#f8fafc] sticky top-0 z-10">
              <h3 className="font-medium text-gray-700 text-sm md:text-base">
                صندوق الوارد ({filteredMessages.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-3 md:p-4 cursor-pointer transition-colors ${
                      selectedMessage?._id === msg._id ? "bg-[#f0f7ff]" : "hover:bg-gray-50"
                    } ${msg.status === "Unread" ? "bg-blue-50" : ""}`}
                    onClick={() => selectMessage(msg)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {msg.status === "Unread" ? (
                            <Mail className="h-4 w-4 text-blue-500" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-gray-400" />
                          )}
                          <p className={`truncate font-medium text-sm md:text-base ${
                            msg.status === "Unread" ? "text-gray-900" : "text-gray-600"
                          }`}>
                            {msg.from}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate mt-1">{msg.title}</p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {msg.message.substring(0, isMobileView ? 30 : 60)}...
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 whitespace-nowrap">
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
                <div className="p-6 text-center text-gray-500">
                  <Search className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm md:text-base">لا توجد رسائل متطابقة مع بحثك</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className={`${!selectedMessage && isMobileView ? 'hidden' : 'block'} flex-1 flex flex-col border-t md:border-t-0 border-gray-200`}>
            {selectedMessage ? (
              <>
                <div className="p-3 md:p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                  <button 
                    onClick={closeMessageView}
                    className="md:hidden p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-500" />
                  </button>
                  <div className="flex-1 ml-2">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 truncate">
                      {selectedMessage.title}
                    </h3>
                    <div className="text-xs md:text-sm text-gray-500 mt-1">
                      من: <span className="font-medium">{selectedMessage.from}</span>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {new Date(selectedMessage.createdAt).toLocaleString('ar-EG')}
                  </div>
                </div>
                
                <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-white">
                  <div className="prose max-w-none text-sm md:text-base">
                    <p className="whitespace-pre-line">{selectedMessage.message}</p>
                  </div>
                  
                  {selectedMessage.adminReply && (
                    <div className="mt-4 md:mt-8 p-3 md:p-4 border border-gray-200 rounded-lg bg-gray-50">
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
                
                <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
                  <textarea
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#053F5E] focus:border-[#053F5E] text-sm md:text-base"
                    rows="3"
                    placeholder="اكتب ردك هنا..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                  <div className="mt-2 md:mt-3 flex justify-end">
                    <button
                      className={`px-3 md:px-4 py-1 md:py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base ${
                        sendingReply 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-[#115173] hover:bg-[#053F5E] text-white'
                      }`}
                      onClick={sendReply}
                      disabled={sendingReply}
                    >
                      <Reply className="h-4 w-4 md:h-5 md:w-5" />
                      {sendingReply ? 'جاري الإرسال...' : 'إرسال الرد'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6 md:p-8">
                <MailOpen className="h-10 w-10 md:h-12 md:w-12 text-gray-300 mb-3 md:mb-4" />
                <p className="text-base md:text-lg">اختر رسالة لعرضها</p>
                <p className="text-xs md:text-sm mt-1 md:mt-2 text-center">
                  اضغط على أي رسالة من القائمة لقراءتها والرد عليها
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}