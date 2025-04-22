// OverviewTab.jsx
import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


// مكون البطاقة الإحصائية (Stat Card)
function StatCard({ title, value, change }) {
  const isPositive = change.startsWith("+");



  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <div className="flex items-end mt-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className={`mr-2 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>{change}</span>
      </div>
    </div>
  );
}

// مكون النشاط الأخير (Activity Item)
function ActivityItem({ title, description, time }) {

  return (
    <div className="flex items-start pb-4 border-b border-gray-100">
      <div className="w-2 h-2 mt-2 rounded-full bg-[#FFD700] ml-3"></div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
}





export default function OverviewTab() {
  // ==========عدد الاماكن الي  ضافها الموضع
  const [placeCount, setPlaceCount] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [userCount, setUserCount] = useState(0); // 👈 حالة لتخزين عدد المستخدمين
 
  // جلب عدد الأماكن
  useEffect(() => {
    axios
      .get("http://localhost:9527/api/places/count")
      .then((response) => {
        setPlaceCount(response.data.count); // تعيين القيمة
      })
      .catch((error) => {
        console.error("❌ Error fetching place count:", error);
      });
  }, []);

  
 // جلب عدد المستخدمين
 useEffect(() => {
  axios
.get('http://localhost:9527/api/auth/all')
    // 👈 رابط جلب المستخدمين
    .then((response) => {
      setUserCount(response.data.userCount); // 👈 استخراج عدد المستخدمين
    })
    .catch((error) => {
      console.error("❌ Error fetching user count:", error);
    });
}, []);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">نظرة عامة</h2>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="عدد المستخدمين" value={userCount} change="+3%" /> {/* 👈 إضافة عدد المستخدمين */}
      <StatCard title="الأماكن المقترحة" value={placeCount} change="+2%" />
        <StatCard title="الحجوزات الجديدة" value="156" change="+8%" />
        <StatCard title="الإيرادات" value="$4,320" change="+15%" />
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">الزيارات الشهرية</h3>
          <div className="h-64 flex items-end space-x-2 rtl:space-x-reverse">
            {[65, 45, 75, 50, 80, 90, 70, 85, 60, 75, 95, 65].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-[#115173] rounded-t-sm" style={{ height: `${height}%` }}></div>
                <span className="text-xs mt-1">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">توزيع الزوار</h3>
          <div className="flex justify-center items-center h-64">
            <div className="relative w-48 h-48">
              {/* رسم بياني دائري مبسط */}
              <div
                className="absolute inset-0 rounded-full border-8 border-[#022C43]"
                style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 0, 50% 0)" }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-[#115173]"
                style={{ clipPath: "polygon(50% 50%, 50% 0, 0 0, 0 50%)" }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-[#053F5E]"
                style={{ clipPath: "polygon(50% 50%, 0 50%, 0 100%, 50% 100%)" }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-[#FFD700]"
                style={{ clipPath: "polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white"></div>
              </div>
            </div>
          </div>
          <div className="flex justify-around mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#022C43] rounded-full mr-1"></div>
              <span className="text-xs">جديد (40%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#115173] rounded-full mr-1"></div>
              <span className="text-xs">عائد (30%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#053F5E] rounded-full mr-1"></div>
              <span className="text-xs">إحالة (20%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#FFD700] rounded-full mr-1"></div>
              <span className="text-xs">أخرى (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* النشاط الأخير */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h3 className="text-lg font-semibold mb-4">النشاط الأخير</h3>
        <div className="space-y-4">
          <ActivityItem
            title="تم اقتراح مكان جديد"
            description="تم اقتراح شاطئ الغروب من قبل أحمد محمد"
            time="منذ 5 دقائق"
          />
          <ActivityItem
            title="حجز جديد"
            description="قام سارة علي بحجز رحلة إلى جبل سيناء"
            time="منذ 30 دقيقة"
          />
          <ActivityItem
            title="رسالة جديدة"
            description="استفسار عن أسعار الرحلات من محمود خالد"
            time="منذ ساعة"
          />
          <ActivityItem
            title="دفع جديد"
            description="تم استلام دفعة بقيمة $120 من ليلى أحمد"
            time="منذ 3 ساعات"
          />
        </div>
      </div>
    </div>
  );
}



// import { Pie, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Chart from "chart.js/auto";
// import ChartDataLabels from "chartjs-plugin-datalabels";

// Chart.register(ChartDataLabels);
// // Register necessary elements for Chart.js
// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement
// );

// const Overview = () => {
//   // State to store articles
//   const [articles, setArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");

//   const filteredArticles = articles.filter(
//     (article) =>
//       article.title && article.title.includes(searchTerm) &&
//       (filterStatus === "" || article.status === filterStatus)
//   );

//   const filteredArticlesView = articles.filter(
//     (article) => article.status === "Published"
//   );

//   // Fetch data from Firebase using Axios
//   useEffect(() => {
//     axios
//       .get("http://localhost:9527/api/auth/all")
//       .then((response) => {
//         // Convert Firebase data to array (as it comes as an object)
//         const fetchedArticles = [];
//         for (let key in response.data) {
//           fetchedArticles.push({
//             id: key,
//             ...response.data[key],
//           });
//         }
//         setArticles(fetchedArticles);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);

//   const [currentPage, setCurrentPage] = useState(1);
//   const articlesPerPage = 5;

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

//   // Slice articles for the current page
//   const paginatedArticles = filteredArticles.slice(
//     (currentPage - 1) * articlesPerPage,
//     currentPage * articlesPerPage
//   );

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Error while fetching data: {error.message}
//       </div>
//     );
//   }

//   // دالة لحساب عدد المقالات لكل حالة
//   const getStatusCounts = (articles) => {
//     return articles.reduce((acc, article) => {
//       acc[article.status] = (acc[article.status] || 0) + 1;
//       return acc;
//     }, {});
//   };

//   const statusCounts = getStatusCounts(articles);

//   // حساب العدد الإجمالي للمقالات
//   const totalArticles = Object.values(statusCounts).reduce(
//     (sum, count) => sum + count,
//     0
//   );

//   // بيانات الرسم البياني
//   const statusData = {
//     labels: Object.keys(statusCounts),
//     datasets: [
//       {
//         label: "Number of Articles",
//         data: Object.values(statusCounts),
//         backgroundColor: ["#053F5E", "#115173", "#FFD700"],
//         borderColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
//         borderWidth: 2,
//       },
//     ],
//   };

//   // إعدادات الرسم البياني
//   const statusOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           padding: 20,
//           font: {
//             size: 12,
//           },
//           color: "#053F5E",
//         },
//       },
//       title: {
//         display: true,
//         text: "توزيع المقالات حسب الحالة",
//         font: {
//           size: 16,
//           weight: "bold",
//         },
//         color: "#053F5E",
//         padding: {
//           top: 10,
//           bottom: 20,
//         },
//       },
//       datalabels: {
//         display: true,
//         color: "#FFFFFF",
//         formatter: (value) => {
//           const percentage = ((value / totalArticles) * 100).toFixed(1) + "%";
//           return percentage;
//         },
//         font: {
//           size: 14,
//           weight: "bold",
//         },
//       },
//     },
//   };

//   // Second chart data (views count for each article)
//   const viewsData = {
//     labels: filteredArticlesView.map((article) =>
//       article.title.length > 15
//         ? article.title.substring(0, 15) + "..."
//         : article.title
//     ),
//     datasets: [
//       {
//         label: "عدد المشاهدات",
//         data: filteredArticlesView.map((article) => article.views),
//         backgroundColor: "#115173",
//         borderColor: "#FFFFFF",
//         borderWidth: 1,
//       },
//     ],
//   };

//   // Second chart options
//   const viewsOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           padding: 20,
//           font: {
//             size: 12,
//           },
//           color: "#053F5E",
//         },
//       },
//       title: {
//         display: true,
//         text: "عدد المشاهدات لكل مقالة",
//         font: {
//           size: 16,
//           weight: "bold",
//         },
//         color: "#053F5E",
//         padding: {
//           top: 10,
//           bottom: 20,
//         },
//       },
//     },
//     scales: {
//       x: {
//         ticks: {
//           font: {
//             size: 10,
//           },
//           color: "#053F5E",
//           maxRotation: 45,
//           minRotation: 45,
//         },
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           color: "#053F5E",
//         },
//         grid: {
//           color: "rgba(5, 63, 94, 0.1)",
//         },
//       },
//     },
//   };

//   return (
//     <div className="bg-white min-h-screen">
//       <div className="flex flex-col md:flex-row gap-6 lg:pl-90 lg:gap-20 items-center justify-center lg:justify-end p-6 lg:px-25">
//         {/* First chart: Article distribution by status */}
//         <div className="w-full md:w-1/2 max-w-xl bg-white p-6 rounded-lg shadow-lg border border-gray-100">
//           <h2 className="text-xl text-[#053F5E] font-bold text-center mb-4">
//             حالة المقالات
//           </h2>
//           <div className="h-64">
//             <Pie data={statusData} options={statusOptions} />
//           </div>
//         </div>

//         {/* Second chart: Views count for each article */}
//         <div className="w-full md:w-1/2 max-w-xl bg-white p-6 rounded-lg shadow-lg border border-gray-100">
//           <h2 className="text-xl font-bold text-center mb-4 text-[#053F5E]">
//             إحصائيات المشاهدات
//           </h2>
//           <div className="h-64">
//             <Bar data={viewsData} options={viewsOptions} />
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col px-4 items-center lg:pl-30 xl:pl-4 lg:items-end w-[100%] justify-center">
//         {/* Table */}
//         <div className="w-full my-10 max-w-[84%] overflow-x-auto bg-white p-4 rounded-lg shadow-lg border border-gray-100">
//           {/* Search & Filter Controls */}
//           <div className="mb-6 flex flex-col md:flex-row gap-4">
//             <input
//               type="text"
//               placeholder="بحث حسب العنوان..."
//               className="border border-gray-300 p-3 rounded-lg w-full md:w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#115173] transition-all"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <select
//               className="border border-gray-300 p-3 rounded-lg w-full md:w-1/4 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#115173] transition-all"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="">جميع الحالات</option>
//               <option value="Published">منشور</option>
//               <option value="Pending">قيد الانتظار</option>
//               <option value="Rejected">مرفوض</option>
//             </select>
//           </div>

//           {/* Table for medium screens and larger */}
//           <table className="w-full text-sm text-left text-gray-700 hidden lg:table border-collapse">
//             <thead className="text-xs uppercase bg-[#053F5E] text-white border-b border-[#053F5E]">
//               <tr className="h-[60px]">
//                 <th scope="col" className="px-6 py-3 font-medium">
//                   #
//                 </th>
//                 <th scope="col" className="px-6 py-3 font-medium">
//                   عنوان المقالة
//                 </th>
//                 <th scope="col" className="px-6 py-3 font-medium">
//                   الحالة
//                 </th>
//                 <th scope="col" className="px-6 py-3 font-medium">
//                   عدد المشاهدات
//                 </th>
//                 <th scope="col" className="px-6 py-3 font-medium">
//                   المؤلف
//                 </th>
//                 <th scope="col" className="px-6 py-3 font-medium">
//                   تاريخ النشر
//                 </th>
//                 <th scope="col" className="px-6 py-3 font-medium">
//                   عدد الإعجابات
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedArticles.map((article, index) => (
//                 <tr
//                   key={index}
//                   className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   <td className="px-6 py-4">
//                     {(currentPage - 1) * articlesPerPage + index + 1}
//                   </td>
//                   <td className="px-6 py-4 font-semibold text-gray-800">
//                     {article.title}
//                   </td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
//                         article.status === "Published"
//                           ? "bg-[#115173] text-white"
//                           : article.status === "Pending"
//                           ? "bg-[#FFD700] text-[#053F5E]"
//                           : "bg-[#053F5E] text-white"
//                       }`}
//                     >
//                       {article.status === "Published" ? "منشور" : 
//                        article.status === "Pending" ? "قيد الانتظار" : "مرفوض"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">{article.views}</td>
//                   <td className="px-6 py-4">{article.author} </td>
//                   <td className="px-6 py-4">
//                     {new Date(article.publishDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4">{article.likes}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Responsive Cards for Small Screens */}
//           <div className="lg:hidden space-y-6">
//             {paginatedArticles.map((article, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="font-semibold text-gray-700">
//                     #{(currentPage - 1) * articlesPerPage + index + 1}
//                   </span>
//                   <span
//                     className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
//                       article.status === "Published"
//                         ? "bg-[#115173] text-white"
//                         : article.status === "Pending"
//                         ? "bg-[#FFD700] text-[#053F5E]"
//                         : "bg-[#053F5E] text-white"
//                     }`}
//                   >
//                     {article.status === "Published" ? "منشور" : 
//                      article.status === "Pending" ? "قيد الانتظار" : "مرفوض"}
//                   </span>
//                 </div>
//                 <div className="mb-4">
//                   <p className="text-lg font-bold text-gray-800">
//                     {article.title}
//                   </p>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
//                   <div>
//                     <span className="font-semibold">المشاهدات:</span>{" "}
//                     {article.views}
//                   </div>
//                   <div>
//                     <span className="font-semibold">المؤلف:</span>{" "}
//                     {article.author}
//                   </div>
//                   <div>
//                     <span className="font-semibold">تاريخ النشر:</span>{" "}
//                     {new Date(article.publishDate).toLocaleDateString()}
//                   </div>
//                   <div>
//                     <span className="font-semibold">الإعجابات:</span>{" "}
//                     {article.likes}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination Component */}
//           <div className="flex justify-center items-center mt-8 space-x-2">
//             <button
//               className="px-4 py-2 bg-[#053F5E] text-white rounded-md hover:bg-[#115173] transition-colors duration-200"
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               السابق
//             </button>

//             {/* Display only 5 pages at a time */}
//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .slice(
//                 Math.max(0, currentPage - 3),
//                 Math.min(totalPages, currentPage + 1)
//               )
//               .map((page) => (
//                 <button
//                   key={page}
//                   className={`px-4 py-2 rounded-md ${
//                     currentPage === page
//                       ? "bg-[#FFD700] text-[#053F5E] font-bold"
//                       : "bg-[#115173] text-white hover:bg-[#053F5E]"
//                   } transition-colors duration-200`}
//                   onClick={() => handlePageChange(page)}
//                 >
//                   {page}
//                 </button>
//               ))}

//             <button
//               className="px-4 py-2 bg-[#053F5E] text-white rounded-md hover:bg-[#115173] transition-colors duration-200"
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               التالي
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Overview;

