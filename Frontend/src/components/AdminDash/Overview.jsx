import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale
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
  const [placesCount, setPlacesCount] = useState(0);
  // const [recentActivities, setRecentActivities] = useState([]);
  const [latestPlace, setLatestPlace] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const dashboardResponse = await axios.get("http://localhost:9527/dashboard/overview");
      setDashboardData(dashboardResponse.data);

      const placesResponse = await axios.get("http://localhost:9527/api/places/count");
      setPlacesCount(placesResponse.data.count);

      // const activitiesResponse = await axios.get("http://localhost:9527/api/activities/recent");
      // setRecentActivities(activitiesResponse.data);

      const ratingsResponse = await axios.get('http://localhost:9527/api/ratings/total/count');
      console.log("Ratings response:", ratingsResponse.data);
      setRatingCount(ratingsResponse.data.totalRatings); // أو adjust حسب الاستجابة

      const latestPlaceResponse = await axios.get('http://localhost:9527/api/places?page=1&limit=1&sort=-createdAt');
      if (latestPlaceResponse.data.data.docs.length > 0) {
        setLatestPlace(latestPlaceResponse.data.data.docs[0]);
      }
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
  const bookingsCount = dashboardData.allData.payments.length;
  const messagesCount = dashboardData.messages.data.length;

  const userStatsData = prepareUserStatsData(dashboardData.users);
  const revenueByPlaceData = prepareRevenueByPlaceData(dashboardData.allData.payments, dashboardData.places.data.docs);

  return (
    <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>
        <p className="text-gray-600">نظرة عامة على أداء المنصة</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="عدد المستخدمين" value={userCount.toLocaleString()} change="+2%" />
        <StatCard title="عدد الأماكن" value={placesCount.toLocaleString()} change="+10%" />
        <StatCard title="عدد الحجوزات" value={bookingsCount.toLocaleString()} change="+3%" />
              <StatCard title="إجمالي التقييمات" value={ratingCount.toLocaleString()} change="+4%" />

      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="font-semibold text-xl mb-6 text-gray-800 border-b pb-2">إحصائيات المستخدمين</h3>
        <div className="h-80 flex justify-center">
          <Pie 
            data={userStatsData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                  rtl: true,
                  labels: {
                    padding: 20,
                    font: {
                      family: 'Tajawal, sans-serif'
                    }
                  }
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
            <Pie 
              data={revenueByPlaceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    rtl: true
                  }
                }
              }}
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

const prepareUserStatsData = (usersData) => {
  const userTypes = {
    'مسؤولين': usersData.adminsCount || 2,
    'مستخدمين عاديين': usersData.normalUsersCount || 15,
    'مزودي خدمات': usersData.providersCount || 8
  };

  const backgroundColors = [
    'rgba(25, 81, 115, 0.7)',
    'rgba(255, 215, 20, 0.7)',
    'rgba(0, 44, 67, 0.7)'
  ];

  const borderColors = [
    'rgba(17, 81, 115, 1)',
    'rgba(255, 215, 0, 1)',
    'rgba(2, 44, 67, 1)'
  ];

  return {
    labels: Object.keys(userTypes),
    datasets: [
      {
        label: 'عدد المستخدمين',
        data: Object.values(userTypes),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }
    ]
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

  const backgroundColors = [
    'rgba(17, 81, 115, 1)',     
    'rgba(255, 215, 0, 1)',     
    'rgba(2, 44, 67, 1)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(54, 162, 235, 0.7)'
  ];

  const borderColors = [
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)'
  ];

  return {
    labels: placeNames,
    datasets: [
      {
        label: 'الإيرادات',
        data: revenueByPlace,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }
    ]
  };
};

export default Dashboard;