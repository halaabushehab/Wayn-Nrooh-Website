import React, { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, User, Mail, Phone } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from '../AdminDash/AddAdmin'; // استيراد المودال

export default function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5

  // جلب التوكن من الكوكيز
  const userCookie = Cookies.get('user')
  const parsedUser = userCookie ? JSON.parse(userCookie) : null
  const token = parsedUser?.token

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:9527/api/auth/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log('Users data:', response.data) // للتأكد من البيانات المستلمة
        setUsers(response.data.users || []) // استخدام القيمة الافتراضية [] في حالة عدم وجود users
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('حدث خطأ أثناء جلب بيانات المستخدمين')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchUsers()
    }
  }, [token])

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:9527/api/auth/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'blocked' } : user
      ))
      toast.success('تم حظر المستخدم بنجاح')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('حدث خطأ أثناء حظر المستخدم')
    }
  }

  const handleActivateUser = async (userId) => {
    try {
      await axios.put(`http://localhost:9527/api/auth/activate/${userId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'active' } : user
      ))
      toast.success('تم تفعيل المستخدم بنجاح')
    } catch (error) {
      console.error('Error activating user:', error)
      toast.error('حدث خطأ أثناء تفعيل المستخدم')
    }
  }

  // فلترة المستخدمين
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.username?.toLowerCase()?.includes(searchTerm.toLowerCase())) || 
      (user.email?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'admins' && user.isAdmin) ||
      (filter === 'users' && !user.isAdmin) ||
      (filter === 'blocked' && user.status === 'blocked')
    
    return matchesSearch && matchesFilter
  })

  // ترقيم الصفحات
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)


  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  
  const handleAddAdmin = (username, email, password) => {
    // الكود لإضافة الأدمن الجديد
    console.log('Adding admin', username, email, password);
  };

  return (
    <div className="space-y-6">
    <div>
      <button
        onClick={() => setShowModal(true)} 
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        إضافة أدمن جديد
      </button>

      {/* المودال */}
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onSubmit={handleAddAdmin}
      />
    </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2 space-x-reverse">
            <button 
              className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              onClick={() => setFilter('all')}
            >
              الكل ({users.length})
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filter === 'admins' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              onClick={() => setFilter('admins')}
            >
              مدراء ({users.filter(u => u.isAdmin).length})
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filter === 'users' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              onClick={() => setFilter('users')}
            >
              مستخدمين ({users.filter(u => !u.isAdmin).length})
            </button>
            <button 
              className={`px-4 py-2 rounded-md ${filter === 'blocked' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
              onClick={() => setFilter('blocked')}
            >
              محظورين ({users.filter(u => u.status === 'blocked').length})
            </button>
          </div>
          
          <div className="flex w-full md:w-auto space-x-2 space-x-reverse">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="بحث عن مستخدم..."
                className="w-full md:w-64 border border-gray-300 rounded-md px-3 py-2 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="border border-gray-300 rounded-md px-3 py-2 bg-white flex items-center">
              <Filter size={16} className="ml-2" />
              تصفية
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">جاري تحميل البيانات...</div>
        ) : (
          <>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-right min-w-[800px]">
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
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        onDelete={handleDeleteUser}
                        onActivate={handleActivateUser}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500">
                        {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : 'لا يوجد مستخدمين لعرضهم'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {filteredUsers.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  عرض {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} من {filteredUsers.length} مستخدم
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button 
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <svg className="rotate-90" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      className={`w-10 h-10 flex items-center justify-center rounded-md border ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-white'}`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button 
                    className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 bg-white"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <svg className="rotate-270" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function UserRow({ user, onDelete, onActivate }) {
  const [showActions, setShowActions] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return 'غير معروف'
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('ar-EG', options)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-amber-100 text-amber-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'نشط'
      case 'pending': return 'قيد التفعيل'
      case 'blocked': return 'محظور'
      default: return 'غير معروف'
    }
  }

  const getRoleClass = (isAdmin) => {
    return isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
  }

  const getRoleText = (isAdmin) => {
    return isAdmin ? 'مدير' : 'مستخدم'
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-4 min-w-[200px]">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-3">
          <img
  src={user.photo || '/default-avatar.jpg'}
  alt="Profile"
  className="w-10 h-10 rounded-full object-cover"
/>         </div>
          <div>
            <p className="font-medium">{user.username || 'مستخدم بدون اسم'}</p>
            <p className="text-gray-500 text-xs">آخر تسجيل دخول: غير معروف</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 min-w-[200px]">
        <div className="flex items-center">
          <Mail size={16} className="ml-2 text-gray-400" />
          {user.email || 'بريد غير معروف'}
        </div>
      </td>
      <td className="px-4 py-4 min-w-[150px]">
        <div className="flex items-center">
          <Phone size={16} className="ml-2 text-gray-400" />
          {user.phone || 'غير متوفر'}
        </div>
      </td>
      <td className="px-4 py-4 min-w-[150px]">
        {formatDate(user.createdAt)}
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleClass(user.isAdmin)}`}>
          {getRoleText(user.isAdmin)}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(user.status)}`}>
          {getStatusText(user.status)}
        </span>
      </td>
      <td className="px-4 py-4 min-w-[100px]">
        <div className="relative">
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical size={18} />
          </button>
          
          {showActions && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
              {user.status === 'blocked' ? (
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                  onClick={() => {
                    onActivate(user._id)
                    setShowActions(false)
                  }}
                >
                  تفعيل
                </button>
              ) : (
                <button
                  className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    onDelete(user._id)
                    setShowActions(false)
                  }}
                >
                  حظر
                </button>
              )}
          
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}