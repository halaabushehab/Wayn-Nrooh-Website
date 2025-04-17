import React from 'react'
import { Search, Filter, MoreVertical, User, Mail, Phone } from 'lucide-react'
export default function UsersTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">المستخدمين</h1>
          <p className="text-gray-500">إدارة حسابات المستخدمين والصلاحيات</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          إضافة مستخدم جديد
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2 space-x-reverse">
            <button className="px-4 py-2 rounded-md bg-blue-100 text-blue-700">
              الكل (345)
            </button>
            <button className="px-4 py-2 rounded-md bg-gray-100">
              مدراء (12)
            </button>
            <button className="px-4 py-2 rounded-md bg-gray-100">
              مستخدمين (320)
            </button>
            <button className="px-4 py-2 rounded-md bg-gray-100">
              محظورين (13)
            </button>
          </div>
          <div className="flex w-full md:w-auto space-x-2 space-x-reverse">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="بحث عن مستخدم..."
                className="w-full md:w-64 border border-gray-300 rounded-md px-3 py-2 pr-10"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button className="border border-gray-300 rounded-md px-3 py-2 bg-white flex items-center">
              <Filter size={16} className="ml-2" />
              تصفية
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 rounded-tr-lg">المستخدم</th>
                <th className="px-4 py-3">البريد الإلكتروني</th>
                <th className="px-4 py-3">رقم الهاتف</th>
                <th className="px-4 py-3">تاريخ التسجيل</th>
                <th className="px-4 py-3">الدور</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3 rounded-tl-lg">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <UserRow
                user={{
                  name: 'أحمد محمد',
                  email: 'ahmed@example.com',
                  phone: '+971 55 123 4567',
                  image:
                    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=150&q=80',
                }}
                date="12 يناير 2023"
                role="مدير"
                status="active"
              />
              <UserRow
                user={{
                  name: 'سارة أحمد',
                  email: 'sara@example.com',
                  phone: '+971 55 234 5678',
                  image:
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=150&q=80',
                }}
                date="15 فبراير 2023"
                role="مستخدم"
                status="active"
              />
              <UserRow
                user={{
                  name: 'محمد علي',
                  email: 'mohamed@example.com',
                  phone: '+971 55 345 6789',
                  image:
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=150&q=80',
                }}
                date="3 مارس 2023"
                role="مستخدم"
                status="active"
              />
              <UserRow
                user={{
                  name: 'فاطمة حسن',
                  email: 'fatima@example.com',
                  phone: '+971 55 456 7890',
                  image:
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29tYW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=150&q=80',
                }}
                date="22 أبريل 2023"
                role="مدير"
                status="active"
              />
              <UserRow
                user={{
                  name: 'عمر خالد',
                  email: 'omar@example.com',
                  phone: '+971 55 567 8901',
                  image:
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=150&q=80',
                }}
                date="8 مايو 2023"
                role="مستخدم"
                status="blocked"
              />
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">عرض 1-5 من 345 مستخدم</div>
          <div className="flex space-x-2 space-x-reverse">
            <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white">
              <svg
                className="rotate-90"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-blue-600 text-white">
              1
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white">
              2
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white">
              3
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white">
              <svg
                className="rotate-270"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
function UserRow({ user, date, role, status }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-amber-100 text-amber-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'نشط'
      case 'pending':
        return 'قيد التفعيل'
      case 'blocked':
        return 'محظور'
      default:
        return 'غير معروف'
    }
  }
  const getRoleClass = (role) => {
    switch (role) {
      case 'مدير':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4">
        <div className="flex items-center">
          <img
            src={user.image}
            alt={user.name}
            className="w-10 h-10 rounded-full ml-3"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500 text-xs">آخر تسجيل دخول: منذ ساعتين</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center">
          <Mail size={16} className="ml-2 text-gray-400" />
          {user.email}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center">
          <Phone size={16} className="ml-2 text-gray-400" />
          {user.phone}
        </div>
      </td>
      <td className="px-4 py-4">{date}</td>
      <td className="px-4 py-4">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleClass(role)}`}
        >
          {role}
        </span>
      </td>
      <td className="px-4 py-4">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(status)}`}
        >
          {getStatusText(status)}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="relative">
          <button className="text-gray-500 hover:text-gray-700">
            <MoreVertical size={18} />
          </button>
        </div>
      </td>
    </tr>
  )
}
