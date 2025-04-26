import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Calendar, DollarSign, Users, MapPin, Filter, Download, RefreshCw } from "lucide-react";

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [mostBookedPlace, setMostBookedPlace] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [activeTab, setActiveTab] = useState("overview");
  
  const COLORS = ['#FFD700', '#115173', '#022C43', '#00C49F', '#FF8042'];

  useEffect(() => {
    fetchPayments();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [payments, dateRange, searchTerm]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:9527/dashboard/all");
      const data = res.data.payments;

      const normalized = data.map(item => ({
        amount: Number(item.amount || item.amountUSD || 0),
        ticketCount: Number(item.ticketCount || 0),
        placeId: item.placeId || item.subscriptionCard || "",
        userName: item.userName || "",
        paymentStatus: item.payment_status || item.paymentStatus || "",
        currency: item.currency || "USD",
        date: item.createdAt || item.paymentDate || "",
        formattedDate: item.createdAt || item.paymentDate ? 
                       new Date(item.createdAt || item.paymentDate).toLocaleDateString('ar-EG') : "غير متوفر"
      }));

      setPayments(normalized);
      setFilteredPayments(normalized);
      calculateStats(normalized);
    } catch (err) {
      console.error(err);
      alert("فشل تحميل بيانات الدفع. يرجى المحاولة مرة أخرى لاحقًا.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalAmount = data.reduce((acc, item) => acc + item.amount, 0);
    setTotalAmount(totalAmount);

    const totalTickets = data.reduce((acc, item) => acc + item.ticketCount, 0);
    setTotalTickets(totalTickets);

    const placeCount = {};
    data.forEach(item => {
      if (item.placeId) {
        placeCount[item.placeId] = (placeCount[item.placeId] || 0) + item.ticketCount;
      }
    });
    
    if (Object.keys(placeCount).length > 0) {
      const mostBookedId = Object.keys(placeCount).reduce((a, b) => 
        placeCount[a] > placeCount[b] ? a : b, "");
    
      axios.get(`http://localhost:9527/api/places/${mostBookedId}`)
      .then(response => {
          console.log("Response data:", response.data);
          setMostBookedPlace(response.data.name);
        })
        .catch(error => {
          console.error("Error fetching place:", error);
          setMostBookedPlace("N/A");
        });
    
    } else {
      setMostBookedPlace("N/A");
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];
    
    // Apply date range filter
    if (dateRange !== "all") {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(item => {
          const paymentDate = new Date(item.date);
          return paymentDate >= startDate;
        });
      }
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        (item.userName && item.userName.toLowerCase().includes(term)) ||
        (item.userName && item.placeId.toLowerCase().includes(term)) ||
        (item.paymentStatus && item.paymentStatus.toLowerCase().includes(term))
      );
    }
    
    setFilteredPayments(filtered);
    calculateStats(filtered);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "اسم المستخدم,المبلغ,عدد التذاكر,الحالة,التاريخ\n"
      + filteredPayments.map(item => 
          `${item.userName || "غير متوفر"},${item.amount.toFixed(2)},${item.ticketCount},${item.paymentStatus},${item.formattedDate}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "تقرير_المدفوعات.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const prepareChartData = () => {
    if (filteredPayments.length === 0) return [];
    
    // For bar chart - top users by amount
    if (chartType === "bar") {
      const userSums = {};
      filteredPayments.forEach(item => {
        if (item.userName) {
          userSums[item.userName] = (userSums[item.userName] || 0) + item.amount;
        }
      });
      
      return Object.keys(userSums)
        .map(name => ({ name, amount: userSums[name] }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10); // Top 10 users
    }
    
    // For pie chart - tickets by place
 if (chartType === "pie") {
  const placeCount = {};
  filteredPayments.forEach(item => {
    if (item.userName) {
      placeCount[item.userName] = (placeCount[item.userName] || 0) + item.ticketCount;
    }
  });
  
  return Object.keys(placeCount)
    .map(name => ({ name, value: placeCount[name] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 places
}

    
    return [];
  };

  const renderStatCard = (icon, title, value, color) => (
    <motion.div 
      className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center`}
      whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <div className={`rounded-xl p-3 ml-4 ${color} text-white`}>
        {icon}
      </div>
      <div className="text-right">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h2>
        <p className="text-2xl font-bold text-[#022C43]">{value}</p>
      </div>
    </motion.div>
  );

  const renderLoadingState = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#022C43]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#FFD700] border-solid mb-4"></div>
      <p className="text-lg">جاري تحميل بيانات لوحة التحكم...</p>
    </div>
  );

  const renderCharts = () => (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      <div className="flex flex-col md:flex-row-reverse md:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#022C43] mb-2 md:mb-0 text-right">
          {chartType === "bar" ? "أعلى المستخدمين حسب قيمة الدفع" : "توزيع التذاكر حسب المكان"}
        </h2>
        <div className="flex space-x-reverse space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setChartType("bar")} 
            className={`px-3 py-1 rounded-lg text-sm font-medium ${chartType === "bar" ? "bg-[#115173] text-white" : "text-gray-600 hover:text-[#022C43]"}`}
          >
            رسم بياني
          </button>
          <button 
            onClick={() => setChartType("pie")} 
            className={`px-3 py-1 rounded-lg text-sm font-medium ${chartType === "pie" ? "bg-[#115173] text-white" : "text-gray-600 hover:text-[#022C43]"}`}
          >
            رسم دائري
          </button>
        </div>
      </div>
      
      <div className="h-80">
        {chartType === "bar" && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prepareChartData()}>
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#022C43'
                }} 
              />
              <Bar dataKey="amount" fill="#FFD700" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {chartType === "pie" && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={prepareChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {prepareChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#022C43'
                }} 
              />
              <Legend layout="vertical" align="left" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );

  const renderTable = () => (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 1 }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[#022C43] border-collapse">
          <thead className="bg-[#115173]">
            <tr>
              <th className="py-3 px-4 text-right text-white font-medium">اسم المستخدم</th>
              <th className="py-3 px-4 text-right text-white font-medium">المبلغ</th>
              <th className="py-3 px-4 text-right text-white font-medium">عدد التذاكر</th>
              <th className="py-3 px-4 text-right text-white font-medium">المكان</th>
              <th className="py-3 px-4 text-right text-white font-medium">الحالة</th>
              <th className="py-3 px-4 text-right text-white font-medium">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((item, idx) => (
                <motion.tr 
                  key={idx} 
                  className="border-b border-gray-100 hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx, duration: 0.3 }}
                >
                  <td className="py-3 px-4 text-right">{item.userName || "غير متوفر"}</td>
                  <td className="py-3 px-4 text-right font-medium">${item.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">{item.ticketCount}</td>
                  <td className="py-3 px-4 text-right">{item.placeId || "غير متوفر"}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.paymentStatus === "completed" || item.paymentStatus === "success" ? 
                      "bg-green-100 text-green-800" : 
                      item.paymentStatus === "pending" ? 
                      "bg-yellow-100 text-yellow-800" : 
                      "bg-red-100 text-red-800"
                    }`}>
                      {item.paymentStatus === "completed" ? "مكتمل" : 
                       item.paymentStatus === "pending" ? "قيد الانتظار" : 
                       item.paymentStatus === "success" ? "ناجح" : item.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-500">{item.formattedDate}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">لا توجد مدفوعات تطابق عوامل التصفية الخاصة بك</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  if (loading) {
    return renderLoadingState();
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <header className="bg-white py-6 px-8 shadow-sm border-b border-gray-100">
        <motion.div 
          className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-right">
            <h1 className="text-2xl font-bold text-[#022C43]">لوحة تحكم المدفوعات</h1>
            <p className="text-gray-500">تتبع وتحليل معاملات الدفع</p>
          </div>
          <div className="flex items-center space-x-reverse space-x-3">
            <button 
              onClick={fetchPayments}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#022C43] hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw size={16} className="ml-2" />
              تحديث
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-yellow-500 transition-colors shadow-sm font-medium"
            >
              <Download size={16} className="ml-2" />
              تصدير CSV
            </button>
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        {/* Filters Section */}
        <motion.div 
          className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-6">
            <div className="flex items-center">
              <Filter size={20} className="ml-2 text-[#115173]" />
              <h2 className="text-lg font-semibold text-[#022C43]">الفلاتر</h2>
            </div>
            <div className="flex flex-col md:flex-row-reverse gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ابحث بالاسم، المكان أو الحالة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] w-full text-right"
                />
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] text-[#022C43] text-right"
              >
                <option value="all">كل الوقت</option>
                <option value="today">اليوم</option>
                <option value="week">آخر 7 أيام</option>
                <option value="month">آخر 30 يوم</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 font-medium relative ${activeTab === "overview" ? 
                "text-[#115173]" : 
                "text-gray-500 hover:text-[#022C43]"}`}
            >
              نظرة عامة
              {activeTab === "overview" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFD700]"
                  layoutId="tabIndicator"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`px-6 py-3 font-medium relative ${activeTab === "payments" ? 
                "text-[#115173]" : 
                "text-gray-500 hover:text-[#022C43]"}`}
            >
              تفاصيل المدفوعات
              {activeTab === "payments" && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFD700]"
                  layoutId="tabIndicator"
                />
              )}
            </button>
          </div>
        </motion.div>

        {activeTab === "overview" ? (
          <>
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, staggerChildren: 0.1 }}
            >
              {renderStatCard(
                <DollarSign size={20} />, 
                "إجمالي المبلغ", 
                `${totalAmount.toFixed(2)} $`, 
                "bg-[#115173]"
              )}
              {renderStatCard(
                <Users size={20} />, 
                "إجمالي التذاكر", 
                totalTickets, 
                "bg-[#022C43]"
              )}
              {renderStatCard(
                <MapPin size={20} />, 
                "أكثر الأماكن حجزًا", 
                mostBookedPlace, 
                "bg-[#FFD700]"
              )}
            </motion.div>

            {/* Charts */}
            {renderCharts()}
          </>
        ) : (
          renderTable()
        )}
      </div>
    </div>
  );
};

export default PaymentsDashboard;