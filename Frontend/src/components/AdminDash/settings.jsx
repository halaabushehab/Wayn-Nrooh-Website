// import React from 'react';
// import { FileText, TrendingUp, Users, ChevronRight, PieChart } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

// const Reports = () => {
  
//   const donationTrends = [
//     { month: 'يناير', donations: 5000 },
//     { month: 'فبراير', donations: 7000 },
//     { month: 'مارس', donations: 6000 },
//     { month: 'أبريل', donations: 8000 },
//     { month: 'مايو', donations: 9000 },
//   ];

//   const donorDemographics = [
//     { name: '18-24 سنة', value: 30 },
//     { name: '25-34 سنة', value: 45 },
//     { name: '35-44 سنة', value: 20 },
//     { name: '45+ سنة', value: 5 },
//   ];

//   const campaignPerformance = [
//     { name: 'حملة التعليم', donations: 12000, donors: 150 },
//     { name: 'حملة الصحة', donations: 8000, donors: 100 },
//     { name: 'حملة الإغاثة', donations: 15000, donors: 200 },
//   ];

//   const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  
//   const exportToPDF = () => {
//     const input = document.getElementById('reports-content');

//     html2canvas(input).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4'); 
//       const imgWidth = 210; 
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
//       pdf.save('reports.pdf');
//     });
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden" dir="rtl">
//       <div className="p-5 border-b border-gray-100 flex items-center justify-between">
//         <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <TrendingUp size={20} className="text-blue-600" />
//           التقارير والتحليلات
//         </h2>
//         <div className="flex items-center text-sm text-gray-500 font-medium">
//           <span>آخر تحديث اليوم</span>
//         </div>
//       </div>

//       <div id="reports-content" className="p-5">
//         {/* Donation Trends Chart */}
//         <div className="bg-gray-50 rounded-xl p-5 shadow-sm transition-all hover:shadow-md hover:bg-blue-50 border border-gray-200 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
//               <TrendingUp size={16} className="text-green-600" />
//               اتجاهات التبرعات
//             </h3>
//             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">+10% هذا الشهر</span>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={donationTrends}>
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="donations" fill="#10B981" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Donor Demographics */}
//         <div className="bg-gray-50 rounded-xl p-5 shadow-sm transition-all hover:shadow-md hover:bg-indigo-50 border border-gray-200 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
//               <Users size={16} className="text-blue-600" />
//               توزيع المتبرعين حسب العمر
//             </h3>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <RechartsPieChart>
//               <Pie
//                 data={donorDemographics}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label
//               >
//                 {donorDemographics.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </RechartsPieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Campaign Performance */}
//         <div className="bg-gray-50 rounded-xl p-5 shadow-sm transition-all hover:shadow-md hover:bg-purple-50 border border-gray-200 mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-sm font-medium text-gray-600 flex items-center gap-2">
//               <PieChart size={16} className="text-purple-600" />
//               أداء الحملات
//             </h3>
//           </div>
//           <ul className="space-y-3">
//             {campaignPerformance.map((campaign) => (
//               <li key={campaign.name} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg shadow-sm">
//                 <span className="text-gray-800 font-medium">{campaign.name}</span>
//                 <div className="flex items-center">
//                   <span className="text-purple-600 font-bold">JD {campaign.donations.toLocaleString()}</span>
//                   <ChevronRight size={16} className="mr-2 text-gray-400" />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Export Button */}
//         <div className="mt-8">
//           <button
//             onClick={exportToPDF}
//             className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 shadow-sm hover:cursor-pointer"
//           >
//             <FileText size={16} />
//             تصدير كـ PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reports;
import React, { useState } from 'react'
import {
  User,
  Bell,
  Shield,
  Globe,
  CreditCard,
  HelpCircle,
  ChevronRight,
} from 'lucide-react'
export default function SettingsTab() {
  const [activeTab, setActiveTab] = useState('profile')
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-4">
        <div className="p-6 border-l border-gray-200">
          <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
          <div className="space-y-1">
            <SettingsSidebarItem
              icon={<User size={18} />}
              text="الملف الشخصي"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
            <SettingsSidebarItem
              icon={<Bell size={18} />}
              text="الإشعارات"
              active={activeTab === 'notifications'}
              onClick={() => setActiveTab('notifications')}
            />
            <SettingsSidebarItem
              icon={<Shield size={18} />}
              text="الأمان والخصوصية"
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            />
            <SettingsSidebarItem
              icon={<Globe size={18} />}
              text="اللغة والمنطقة"
              active={activeTab === 'language'}
              onClick={() => setActiveTab('language')}
            />
            <SettingsSidebarItem
              icon={<CreditCard size={18} />}
              text="طرق الدفع"
              active={activeTab === 'payment'}
              onClick={() => setActiveTab('payment')}
            />
            <SettingsSidebarItem
              icon={<HelpCircle size={18} />}
              text="المساعدة والدعم"
              active={activeTab === 'help'}
              onClick={() => setActiveTab('help')}
            />
          </div>
        </div>
        <div className="col-span-3 p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6">إعدادات الملف الشخصي</h2>
              <div className="flex items-center mb-8">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=150&q=80"
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
                <div className="mr-6">
                  <h3 className="font-bold text-lg">أحمد محمد</h3>
                  <p className="text-gray-500">مدير النظام</p>
                  <button className="mt-2 text-blue-600 text-sm font-medium">
                    تغيير الصورة
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الأول
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue="أحمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الأخير
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue="محمد"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue="ahmed@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    defaultValue="+971 55 123 4567"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    العنوان
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    defaultValue="دبي، الإمارات العربية المتحدة"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md ml-2">
                  إلغاء
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold mb-6">إعدادات الإشعارات</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">
                    إشعارات البريد الإلكتروني
                  </h3>
                  <div className="space-y-4">
                    <NotificationSetting
                      title="الحجوزات الجديدة"
                      description="إشعار عند وجود حجز جديد"
                      enabled={true}
                    />
                    <NotificationSetting
                      title="الدفعات"
                      description="إشعار عند اكتمال الدفع"
                      enabled={true}
                    />
                    <NotificationSetting
                      title="الرسائل"
                      description="إشعار عند استلام رسالة جديدة"
                      enabled={false}
                    />
                    <NotificationSetting
                      title="تقييمات المستخدمين"
                      description="إشعار عند وجود تقييم جديد"
                      enabled={true}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">إشعارات التطبيق</h3>
                  <div className="space-y-4">
                    <NotificationSetting
                      title="تنبيهات النظام"
                      description="إشعارات مهمة حول النظام"
                      enabled={true}
                    />
                    <NotificationSetting
                      title="الأماكن الجديدة"
                      description="إشعار عند إضافة مكان جديد"
                      enabled={true}
                    />
                    <NotificationSetting
                      title="التحديثات"
                      description="إشعار عند توفر تحديثات جديدة"
                      enabled={false}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}
          {activeTab !== 'profile' && activeTab !== 'notifications' && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>المحتوى قيد الإنشاء</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
function SettingsSidebarItem({ icon, text, active, onClick }) {
  return (
    <button
      className={`flex items-center justify-between w-full p-3 rounded-md transition-colors ${active ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="ml-3">{icon}</span>
        <span>{text}</span>
      </div>
      <ChevronRight size={16} />
    </button>
  )
}
function NotificationSetting({ title, description, enabled }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={isEnabled}
          onChange={() => setIsEnabled(!isEnabled)}
          id={`toggle-${title}`}
        />
        <label
          htmlFor={`toggle-${title}`}
          className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${isEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span
            className={`block w-4 h-4 mt-1 mr-1 bg-white rounded-full transition-transform duration-200 ease-in-out ${isEnabled ? 'transform -translate-x-6' : ''}`}
          ></span>
        </label>
      </div>
    </div>
  )
}
