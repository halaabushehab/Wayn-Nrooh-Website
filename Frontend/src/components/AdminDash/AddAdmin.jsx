import React, { useState } from 'react';
import axios from 'axios';

const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:9527/dashboard/add-admin", 
        { username, email, password }, 
        { withCredentials: true }
      );

      if (response.status === 201) {
        setIsSuccess(true);
        onSubmit(username, email, password);
        setTimeout(() => {
          onClose();
          setIsSuccess(null);
        }, 1500);
      } else {
        setIsSuccess(false);
        setErrorMessage('حدث خطأ أثناء إضافة الأدمن');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      setIsSuccess(false);
      setErrorMessage(error.response?.data?.message || 'حدث خطأ أثناء إضافة الأدمن');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#022C43] bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl w-[90%] max-w-md relative shadow-2xl border border-[#FFD700]">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 text-[#115173] hover:text-[#022C43] transition-colors"
        >
          ✕
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#115173] mb-2">إضافة أدمن جديد</h2>
          <div className="w-20 h-1 bg-[#FFD700] mx-auto"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
  {/* Username Field */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-[#115173]">اسم المستخدم</label>
    <input
      type="text"
      value={username}
      onChange={(e) => {
        setUsername(e.target.value);
        setIsSuccess(null); // Reset success state on change
      }}
      required
      minLength={3}
      maxLength={20}
      pattern="[a-zA-Z0-9]+" // Only alphanumeric characters
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFD700] focus:border-[#115173] outline-none transition-all"
    />
    {username && username.length < 3 && (
      <p className="text-red-500 text-xs mt-1">
        يجب أن يكون اسم المستخدم 3 أحرف على الأقل
      </p>
    )}
    {username && !/^[a-zA-Z0-9]+$/.test(username) && (
      <p className="text-red-500 text-xs mt-1">
        يمكن أن يحتوي اسم المستخدم على أحرف وأرقام فقط
      </p>
    )}
  </div>

  {/* Email Field */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-[#115173]">البريد الإلكتروني</label>
    <input
      type="email"
      value={email}
      onChange={(e) => {
        setEmail(e.target.value);
        setIsSuccess(null);
      }}
      required
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFD700] focus:border-[#115173] outline-none transition-all"
    />
    {email && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email) && (
      <p className="text-red-500 text-xs mt-1">
        يرجى إدخال بريد إلكتروني صحيح
      </p>
    )}
  </div>

  {/* Password Field */}
  <div className="space-y-1">
    <label className="block text-sm font-medium text-[#115173]">كلمة المرور</label>
    <input
      type="password"
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        setIsSuccess(null);
      }}
      required
      minLength={8}
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FFD700] focus:border-[#115173] outline-none transition-all"
    />
    {password && password.length < 8 && (
      <p className="text-red-500 text-xs mt-1">
        يجب أن تكون كلمة المرور 8 أحرف على الأقل
      </p>
    )}
  </div>

  {/* Status Messages */}
  {isSuccess === false && (
    <div className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {errorMessage}
    </div>
  )}

  {isSuccess === true && (
    <div className="p-3 bg-green-50 text-green-600 rounded-lg border border-green-100 flex items-center">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
      تم إضافة الأدمن بنجاح!
    </div>
  )}

  <div className="flex justify-between pt-4">
    <button
      type="button"
      onClick={onClose}
      className="px-6 py-2 border border-[#115173] text-[#115173] rounded-lg hover:bg-[#115173] hover:text-white transition-colors duration-300"
    >
      إلغاء
    </button>
    <button
      type="submit"
      disabled={!username || !email || !password || password.length < 8 || username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username) || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)}
      className={`px-6 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center ${
        !username || !email || !password || password.length < 8 || username.length < 3 || !/^[a-zA-Z0-9]+$/.test(username) || !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[#115173] text-white hover:bg-[#022C43]'
      }`}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      حفظ
    </button>
  </div>
</form>
      </div>
    </div>
  );
};

export default Modal;