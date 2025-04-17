import React, { useState } from 'react'
import { XIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'

export const EditPasswordModal = ({ onClose }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // التأكد من وجود token صالح
  const token = localStorage.getItem('token')
  let decodedToken = null
  if (token) {
    try {
      decodedToken = jwt_decode(token)
    } catch (error) {
      setError('رمز الدخول غير صالح أو منتهي الصلاحية')
      return
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    // Basic validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError('جميع الحقول مطلوبة')
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة')
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل')
      setIsLoading(false)
      return
    }

    // التأكد من وجود الـ token قبل إجراء الطلب
    if (!token) {
      setError('يرجى تسجيل الدخول أولاً')
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.put(
        "http://localhost:9527/api/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Response:', response.data); // تسجيل الاستجابة للتأكد

      if (response.data.success) {
        setSuccess('تم تغيير كلمة المرور بنجاح')
        setTimeout(() => {
          onClose()
        }, 1500)
      }
    } catch (error) {
      console.error('Error changing password:', error)
      if (error.response) {
        console.error('Response data:', error.response.data); // تسجيل بيانات الخطأ من الاستجابة
        if (error.response.status === 401) {
          setError('كلمة المرور الحالية غير صحيحة')
        } else {
          setError('حدث خطأ أثناء تغيير كلمة المرور')
        }
      } else {
        setError('حدث خطأ في الاتصال بالخادم')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="text-[#444444] hover:text-[#022C43]"
          >
            <XIcon size={20} />
          </button>
          <h2 className="text-xl font-bold text-[#022C43]">
            تغيير كلمة المرور
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-right">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-right">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[#444444] mb-2 font-medium text-right">
              كلمة المرور الحالية
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] text-right"
                placeholder="أدخل كلمة المرور الحالية"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#444444]"
              >
                {showCurrentPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[#444444] mb-2 font-medium text-right">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] text-right"
                placeholder="أدخل كلمة المرور الجديدة"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#444444]"
              >
                {showNewPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-[#444444] text-right">
              كلمة المرور يجب أن تكون على الأقل 8 أحرف
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-[#444444] mb-2 font-medium text-right">
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] text-right"
                placeholder="تأكيد كلمة المرور الجديدة"
                required
                minLength="8"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#444444]"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-start space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-[#FFD700] text-[#022C43] font-medium rounded-lg hover:bg-yellow-500 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#444444] text-[#444444] rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
