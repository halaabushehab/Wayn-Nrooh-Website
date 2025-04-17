// OverviewTab.jsx
import React from "react";

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
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">نظرة عامة</h2>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إجمالي الزيارات" value="12,345" change="+12%" />
        <StatCard title="الأماكن المقترحة" value="48" change="+5%" />
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
