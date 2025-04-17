
import { useState } from "react"
import { Bell, Search } from "lucide-react"

export default function NavBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([
    { id: 1, text: "تم اقتراح مكان جديد", time: "منذ 5 دقائق", read: false },
    { id: 2, text: "حجز جديد", time: "منذ 30 دقيقة", read: false },
    { id: 3, text: "رسالة جديدة", time: "منذ ساعة", read: true },
  ])

  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-30">
      {/* Search Bar */}
      <div className="relative ml-4">
        <input
          type="text"
          placeholder="بحث..."
          className="w-64 h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="flex-1"></div>

      {/* Notifications */}
      <div className="relative">
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#115173]"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="h-6 w-6 text-[#444444]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">الإشعارات</h3>
              <button className="text-sm text-[#115173] hover:text-[#022C43]" onClick={markAllAsRead}>
                تعيين الكل كمقروء
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  <div className="flex justify-between">
                    <p className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>{notification.text}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-gray-200 text-center">
              <button className="text-sm text-[#115173] hover:text-[#022C43]">عرض كل الإشعارات</button>
            </div>
          </div>
        )}
      </div>

      {/* User Menu */}
      <div className="relative mr-4">
        <button
          className="flex items-center space-x-2 rtl:space-x-reverse focus:outline-none focus:ring-2 focus:ring-[#115173] rounded-md p-1"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="w-8 h-8 rounded-full bg-[#022C43] flex items-center justify-center text-white">
            <span>أ</span>
          </div>
          <span className="text-sm font-medium">أحمد المدير</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

        {showUserMenu && (
          <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50">
            <div className="py-1">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                الملف الشخصي
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                الإعدادات
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                المساعدة
              </a>
              <div className="border-t border-gray-100"></div>
              <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                تسجيل الخروج
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

