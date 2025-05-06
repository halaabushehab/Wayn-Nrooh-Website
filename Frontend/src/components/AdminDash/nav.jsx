// import { useState, useEffect } from "react"
// import { Bell, Search } from "lucide-react"
// import Cookies from 'js-cookie'
// import jwt_decode from 'jwt-decode'

// export default function NavBar() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [notifications, setNotifications] = useState([
//     { id: 1, text: "تم اقتراح مكان جديد", time: "منذ 5 دقائق", read: false },
//     { id: 2, text: "حجز جديد", time: "منذ 30 دقيقة", read: false },
//     { id: 3, text: "رسالة جديدة", time: "منذ ساعة", read: true },
//   ])

//   const [showNotifications, setShowNotifications] = useState(false)
//   const [userData, setUserData] = useState(null)

//   // جلب بيانات المستخدم من الكوكيز
//   useEffect(() => {
//     const loadUserData = () => {
//       const userCookie = Cookies.get('user')
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie)
//           if (parsedUser.token) {
//             const decoded = jwt_decode(parsedUser.token)
//             setUserData({
//               username: decoded.username || 'مستخدم',
//               isAdmin: decoded.isAdmin || false
//             })
//           }
//         } catch (error) {
//           console.error("Error parsing user cookie:", error)
//         }
//       }
//     }

//     loadUserData()
//   }, [])

//   const unreadCount = notifications.filter((n) => !n.read).length

//   const markAllAsRead = () => {
//     setNotifications(notifications.map((n) => ({ ...n, read: true })))
//   }

//   const handleNotificationClick = (id) => {
//     setNotifications(notifications.map(n => 
//       n.id === id ? {...n, read: true} : n
//     ))
//   }

//   return (
//     <div className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-30">
//       {/* Search Bar */}
//       <div className="relative ml-4">
//         <input
//           type="text"
//           placeholder="بحث..."
//           className="w-64 h-10 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#115173] focus:border-transparent"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
//       </div>

//       <div className="flex-1"></div>

//       {/* Notifications */}
//       <div className="relative">
//         <button
//           className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#115173]"
//           onClick={() => setShowNotifications(!showNotifications)}
//         >
//           <Bell className="h-6 w-6 text-[#444444]" />
//           {unreadCount > 0 && (
//             <span className="absolute top-1 left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//               {unreadCount}
//             </span>
//           )}
//         </button>

//         {showNotifications && (
//           <div className="absolute left-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
//             <div className="p-3 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="font-medium">الإشعارات</h3>
//               <button className="text-sm text-[#115173] hover:text-[#022C43]" onClick={markAllAsRead}>
//                 تعيين الكل كمقروء
//               </button>
//             </div>
//             <div className="max-h-96 overflow-y-auto">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
//                   onClick={() => handleNotificationClick(notification.id)}
//                 >
//                   <div className="flex justify-between">
//                     <p className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>{notification.text}</p>
//                     <span className="text-xs text-gray-500">{notification.time}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="p-2 border-t border-gray-200 text-center">
//               <button className="text-sm text-[#115173] hover:text-[#022C43]">عرض كل الإشعارات</button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* User Info (without dropdown) */}
//       <div className="flex items-center mr-4">
//         <div className="w-8 h-8 rounded-full bg-[#022C43] flex items-center justify-center text-white">
//           <span>{userData?.username?.charAt(0) || 'م'}</span>
//         </div>
//         <span className="text-sm font-medium mr-2">
//           {userData?.username || 'مستخدم'} {userData?.isAdmin ? '' : ''}
//         </span>
//       </div>
//     </div>
//   )
// }

import React from 'react'

function nav() {
  return (
    <div></div>
  )
}

export default nav