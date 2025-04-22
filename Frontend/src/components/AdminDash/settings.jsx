import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Globe, CreditCard, HelpCircle, ChevronRight } from 'lucide-react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SettingsTab() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [notificationSettings, setNotificationSettings] = useState({
    newBookings: true,
    payments: true,
    messages: false,
    reviews: true,
    systemAlerts: true,
    newPlaces: true,
    updates: false
  });

  // جلب بيانات المستخدم من الكوكيز بشكل صحيح
  const [userCookie, setUserCookie] = useState(null);
  const [decodedToken, setDecodedToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUserFromCookies = () => {
      const cookie = Cookies.get('user');
      if (cookie) {
        try {
          const parsedUser = JSON.parse(cookie);
          setUserCookie(parsedUser);
          
          if (parsedUser.token) {
            const decoded = jwt_decode(parsedUser.token);
            setDecodedToken(decoded);
            setUserId(decoded.userId);
            setIsAdmin(decoded.isAdmin || false);
            
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove('user');
        }
      }
    };

    loadUserFromCookies();
  }, []);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    photo: '',
    role: '',
  });

  const [tempData, setTempData] = useState({ ...userData });
  const [tempProfileImage, setTempProfileImage] = useState('/default-profile.png');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userCookie || !userId) {
          throw new Error('No user data found');
        }

        const response = await axios.get(`http://localhost:9527/api/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${userCookie.token}`,
          },
        });

        if (response.data) {
          const data = {
            username: response.data.username || decodedToken?.username || '',
            email: response.data.email || decodedToken?.email || '',
            phone: response.data.phone || '',
            city: response.data.city || '',
            bio: response.data.bio || '',
            photo: response.data.photo || '',
            role: response.data.role || (isAdmin ? 'admin' : 'user'),
          };
          setUserData(data);
          setTempData(data);
          setTempProfileImage(response.data.photo || '/default-profile.png');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (decodedToken) {
          const fallbackData = {
            username: decodedToken.username || '',
            email: decodedToken.email || '',
            phone: '',
            city: '',
            bio: '',
            photo: '',
            role: isAdmin ? 'admin' : 'user',
          };
          setUserData(fallbackData);
          setTempData(fallbackData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && userCookie) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [userCookie, userId, isAdmin, decodedToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setTempProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    if (!userCookie || !userCookie.token) {
      toast.error('يجب تسجيل الدخول أولاً');
      return;
    }

    const formData = new FormData();
    formData.append('username', tempData.username);
    formData.append('email', tempData.email);
    formData.append('phone', tempData.phone);
    formData.append('city', tempData.city);
    formData.append('bio', tempData.bio);

    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    try {
      const response = await axios.put(
        `http://localhost:9527/api/auth/profile/me/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userCookie.token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUserData(tempData);
      setIsEditing(false);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('حدث خطأ أثناء تحديث الملف الشخصي');
    }
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  const handleNotificationToggle = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const saveNotificationSettings = async () => {
    try {
      await axios.put(
        `http://localhost:9527/api/auth/notifications/${id}`,
        { notifications: notificationSettings },
        {
          headers: {
            Authorization: `Bearer ${parsedCookie.token}`,
          },
        }
      );
      toast.success('تم حفظ إعدادات الإشعارات بنجاح');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const SettingsSidebarItem = ({ icon, text, active, onClick }) => (
    <button
      className={`flex items-center justify-between w-full p-3 rounded-md transition-colors ${
        active ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span className="ml-3">{icon}</span>
        <span>{text}</span>
      </div>
      <ChevronRight size={16} />
    </button>
  );

  const NotificationSetting = ({ title, description, settingKey }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={notificationSettings[settingKey]}
          onChange={() => handleNotificationToggle(settingKey)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <ToastContainer position="top-right" rtl={true} />
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
              text="الأمان"
              active={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
            />
          </div>
        </div>
        <div className="col-span-3 p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6">إعدادات الملف الشخصي</h2>
              <div className="flex items-center mb-8">
                <div className="relative">
                  <img
                    src={tempProfileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </label>
                  )}
                </div>
                <div className="mr-4">
                  <h3 className="text-lg font-semibold">{tempData.username}</h3>
                  <p className="text-gray-600">{tempData.role === 'admin' ? 'مدير' : 'مستخدم'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={tempData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={tempData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={tempData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المدينة
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={tempData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نبذة عنك
                  </label>
                  <textarea
                    name="bio"
                    value={tempData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      حفظ التغييرات
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    تعديل الملف الشخصي
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-xl font-bold mb-6">إعدادات الإشعارات</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">إشعارات البريد الإلكتروني</h3>
                  <div className="space-y-3">
                    <NotificationSetting
                      title="الحجوزات الجديدة"
                      description="إشعار عند وجود حجز جديد"
                      settingKey="newBookings"
                    />
                    <NotificationSetting
                      title="الدفعات"
                      description="إشعار عند اكتمال الدفع"
                      settingKey="payments"
                    />
                    <NotificationSetting
                      title="الرسائل"
                      description="إشعار عند استلام رسالة جديدة"
                      settingKey="messages"
                    />
                    <NotificationSetting
                      title="تقييمات المستخدمين"
                      description="إشعار عند وجود تقييم جديد"
                      settingKey="reviews"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">إشعارات التطبيق</h3>
                  <div className="space-y-3">
                    <NotificationSetting
                      title="تنبيهات النظام"
                      description="إشعارات مهمة حول النظام"
                      settingKey="systemAlerts"
                    />
                    <NotificationSetting
                      title="الأماكن الجديدة"
                      description="إشعار عند إضافة مكان جديد"
                      settingKey="newPlaces"
                    />
                    <NotificationSetting
                      title="التحديثات"
                      description="إشعار عند توفر تحديثات جديدة"
                      settingKey="updates"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveNotificationSettings}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold mb-6">إعدادات الأمان</h2>
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">المصادقة الثنائية</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    قم بتمكين المصادقة الثنائية لحسابك لمزيد من الأمان
                  </p>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    تفعيل المصادقة الثنائية
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



{/* <SettingsSidebarItem
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
/> */}
