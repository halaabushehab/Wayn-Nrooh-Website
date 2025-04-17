import React from 'react'
import { HeartIcon, StarIcon, MapPinIcon, ClockIcon } from 'lucide-react'
export const UserActivities = () => {
  const favorites = [
    {
      id: 1,
      type: 'place',
      name: 'الحديقة العامة',
      date: 'تمت الإضافة منذ يومين',
      image:
        'https://images.unsplash.com/photo-1517773015382-bc3f1771dec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      type: 'place',
      name: 'المعرض الفني',
      date: 'تمت الإضافة منذ أسبوع',
      image:
        'https://images.unsplash.com/photo-1554907984-15263bfd63bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  ]
  const recentActivities = [
    {
      id: 1,
      action: 'زيارة',
      place: 'متحف الفن الحديث',
      date: 'منذ ساعتين',
      icon: MapPinIcon,
    },
    {
      id: 2,
      action: 'حفظ',
      place: 'الحدائق النباتية',
      date: 'منذ يوم واحد',
      icon: HeartIcon,
    },
    {
      id: 3,
      action: 'تقييم',
      place: 'حديقة المدينة',
      date: 'منذ ٣ أيام',
      icon: StarIcon,
    },
  ]
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold text-[#022C43] mb-6">نشاطاتك</h2>
      {/* Favorite Places */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-[#115173] mb-4 flex items-center">
          <HeartIcon size={20} className="ml-2 text-[#FFD700]" />
          الأماكن المفضلة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((favorite) => (
            <div
              key={favorite.id}
              className="flex bg-[#F5F7F9] rounded-lg overflow-hidden"
            >
              <div className="flex-1 p-4 text-right">
                <h4 className="font-medium text-[#022C43]">{favorite.name}</h4>
                <p className="text-sm text-[#444444] mt-1 flex items-center justify-end">
                  {favorite.date}
                  <ClockIcon size={14} className="mr-1" />
                </p>
              </div>
              <div className="w-24 h-24">
                <img
                  src={favorite.image}
                  alt={favorite.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recent Activities */}
      <div>
        <h3 className="text-lg font-semibold text-[#115173] mb-4 flex items-center">
          <ClockIcon size={20} className="ml-2 text-[#FFD700]" />
          النشاطات الأخيرة
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center bg-[#F5F7F9] p-4 rounded-lg"
            >
              <div className="flex-1 text-right">
                <p className="text-[#022C43] font-medium">
                  <span className="text-[#115173]">{activity.place}</span>{' '}
                  {activity.action}
                </p>
                <p className="text-sm text-[#444444] mt-1">{activity.date}</p>
              </div>
              <div className="w-10 h-10 bg-[#022C43] rounded-full flex items-center justify-center mr-4">
                <activity.icon size={20} className="text-[#FFD700]" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* View All Button */}
      <div className="mt-6 text-center">
        <button className="px-6 py-2 bg-[#022C43] text-white rounded-lg hover:bg-[#053F5E] transition-colors">
          عرض كل النشاطات
        </button>
      </div>
    </div>
  )
}
