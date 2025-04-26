import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

function StatCard({ title, value, change }) {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-right">
      <h3 className="text-md text-gray-600 font-medium">{title}</h3>
      <div className="flex items-center justify-end mt-2">
        <span className={`ml-2 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{change}</span>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <div className={`mt-2 h-1 w-full ${isPositive ? "bg-green-100" : "bg-red-100"}`}>
        <div 
          className={`h-full ${isPositive ? "bg-green-500" : "bg-red-500"}`} 
          style={{ width: `${Math.abs(parseInt(change))}%` }}
        ></div>
      </div>
    </div>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex items-start pb-4 border-b border-gray-100 last:border-0">
      <div className="w-3 h-3 mt-1.5 rounded-full bg-amber-500 ml-3"></div>
      <div className="flex-1 text-right">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <span className="text-xs text-gray-400 whitespace-nowrap mr-2">{time}</span>
    </div>
  );
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:9527/dashboard/overview");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  const totalRevenue = dashboardData.allData.totalRevenue || 0;
  const userCount = dashboardData.users.userCount;
  const placesCount = dashboardData.places.data.docs.length;
  const bookingsCount = dashboardData.allData.payments.length;
  const messagesCount = dashboardData.messages.data.length;

  const bookingGrowthData = prepareGraphData(dashboardData.allData.payments);
  const revenueByPlaceData = prepareRevenueByPlaceData(dashboardData.allData.payments, dashboardData.places.data.docs);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-600">نظرة عامة على أداء المنصة</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="إجمالي الإيرادات" value={`${totalRevenue.toLocaleString()} `} change="+5%" />
        <StatCard title="عدد المستخدمين" value={userCount.toLocaleString()} change="+2%" />
        <StatCard title="عدد الأماكن" value={placesCount.toLocaleString()} change="-1%" />
        <StatCard title="عدد الحجوزات" value={bookingsCount.toLocaleString()} change="+3%" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-2">نمو الحجوزات (آخر 6 أشهر)</h3>
        <div className="h-80">
          <Line 
            data={bookingGrowthData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  rtl: true,
                  labels: {
                    padding: 20,
                    font: {
                      family: 'Tajawal, sans-serif'
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-2">الإيرادات حسب المكان</h3>
          <div className="h-64">
            <Line 
              data={revenueByPlaceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    rtl: true
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-2">النشاط الأخير</h3>
          <div className="space-y-4">
            <ActivityItem 
              title="حجز جديد" 
              description="تم إجراء حجز جديد للمكان X" 
              time="منذ ساعتين" 
            />
            <ActivityItem 
              title="مستخدم جديد" 
              description="قام المستخدم Y بالتسجيل في المنصة" 
              time="منذ يوم" 
            />
            <ActivityItem 
              title="دفعة جديدة" 
              description="تم استلام دفعة بقيمة 500 ر.س" 
              time="منذ 3 أيام" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold text-xl mb-4 text-gray-800">الرسائل</h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">إجمالي الرسائل:</span>
          <span className="text-2xl font-bold text-amber-600">{messagesCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const prepareGraphData = (payments) => {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const monthData = months.map((month, index) => {
    const monthlyRevenue = payments
      .filter(payment => new Date(payment.date).getMonth() === index)
      .reduce((sum, payment) => sum + payment.amount, 0);
    return monthlyRevenue;
  });

  return {
    labels: months.slice(0, 6),
    datasets: [
      {
        label: 'الحجوزات',
        data: monthData.slice(0, 6),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3
      },
    ],
  };
};

const prepareRevenueByPlaceData = (payments, places) => {
  const placeNames = places.map(place => place.name);
  const revenueByPlace = placeNames.map(name => {
    const totalRevenue = payments
      .filter(payment => payment.placeName === name)
      .reduce((sum, payment) => sum + payment.amount, 0);
    return totalRevenue;
  });

  return {
    labels: placeNames,
    datasets: [
      {
        label: 'الإيرادات',
        data: revenueByPlace,
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.3
      },
    ],
  };
};

export default Dashboard;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

// ChartJS.register(
//   Title,
//   Tooltip,
//   Legend,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale
// );

// function StatCard({ title, value, change }) {
//   const isPositive = change.startsWith("+");

//   return (
//     <div className="bg-white p-4 rounded-lg shadow">
//       <h3 className="text-sm text-gray-500">{title}</h3>
//       <div className="flex items-end mt-2">
//         <span className="text-2xl font-bold">{value}</span>
//         <span className={`mr-2 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>{change}</span>
//       </div>
//     </div>
//   );
// }

// function ActivityItem({ title, description, time }) {
//   return (
//     <div className="flex items-start pb-4 border-b border-gray-100">
//       <div className="w-2 h-2 mt-2 rounded-full bg-[#FFD700] ml-3"></div>
//       <div className="flex-1">
//         <h4 className="font-medium">{title}</h4>
//         <p className="text-sm text-gray-500">{description}</p>
//       </div>
//       <span className="text-xs text-gray-400">{time}</span>
//     </div>
//   );
// }

// const Dashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await axios.get("http://localhost:9527/dashboard/overview");
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (!dashboardData) {
//     return <div>Loading...</div>;
//   }

//   const totalRevenue = dashboardData.allData.totalRevenue || 0;
//   const userCount = dashboardData.users.userCount;
//   const placesCount = dashboardData.places.data.docs.length;
//   const bookingsCount = dashboardData.allData.payments.length;
//   const messagesCount = dashboardData.messages.data.length;

//   // تحضير البيانات للمخططات البيانية
//   const bookingGrowthData = prepareGraphData(dashboardData.allData.payments);
//   const revenueByPlaceData = prepareRevenueByPlaceData(dashboardData.allData.payments, dashboardData.places.data.docs);

//   return (
//     <div>
//       <h1>Dashboard Overview</h1>
//       <div className="grid grid-cols-2 gap-4 mb-8">
//         <StatCard title="Total Revenue" value={`$${totalRevenue}`} change="+5%" />
//         <StatCard title="Total Users" value={userCount} change="+2%" />
//         <StatCard title="Total Places" value={placesCount} change="-1%" />
//         <StatCard title="Total Bookings" value={bookingsCount} change="+3%" />
//       </div>

//       <div className="mb-8">
//         <h3 className="font-semibold text-lg mb-4">Bookings Growth (Last 6 Months)</h3>
//         <Line data={bookingGrowthData} />
//       </div>

//       <div className="mb-8">
//         <h3 className="font-semibold text-lg mb-4">Revenue by Place</h3>
//         <Line data={revenueByPlaceData} />
//       </div>

//       <div>
//         <p>Number of Messages: {messagesCount}</p>
//       </div>

//       <div className="mt-8">
//         <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
//         <ActivityItem title="New Booking" description="A new booking was made for Place X." time="2 hours ago" />
//         <ActivityItem title="New User Registered" description="User Y registered on the platform." time="1 day ago" />
//       </div>
//     </div>
//   );
// };

// // تحضير البيانات للمخطط البياني (Bookings Growth)
// const prepareGraphData = (payments) => {
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const monthData = months.map((month, index) => {
//     const monthlyRevenue = payments
//       .filter(payment => new Date(payment.date).getMonth() === index)
//       .reduce((sum, payment) => sum + payment.amount, 0);
//     return monthlyRevenue;
//   });

//   return {
//     labels: months,
//     datasets: [
//       {
//         label: 'Bookings',
//         data: monthData,
//         borderColor: 'rgba(75, 192, 192, 1)',
//         fill: false,
//       },
//     ],
//   };
// };

// // تحضير البيانات للمخطط البياني (Revenue by Place)
// const prepareRevenueByPlaceData = (payments, places) => {
//   const placeNames = places.map(place => place.name);
//   const revenueByPlace = placeNames.map(name => {
//     const totalRevenue = payments
//       .filter(payment => payment.placeName === name)
//       .reduce((sum, payment) => sum + payment.amount, 0);
//     return totalRevenue;
//   });

//   return {
//     labels: placeNames,
//     datasets: [
//       {
//         label: 'Revenue by Place',
//         data: revenueByPlace,
//         borderColor: 'rgba(153, 102, 255, 1)',
//         fill: false,
//       },
//     ],
//   };
// };

// export default Dashboard;   

