import { CameraIcon, CheckIcon, XIcon, PencilIcon, KeyIcon, MapPinIcon, UserIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { EditPasswordModal } from './EditPasswordModal';
import { UserActivities } from './UserActivities';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Initialize all fields with empty values
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const token = localStorage.getItem('token');
  const decodedToken = token ? jwt_decode(token) : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`http://localhost:9527/api/auth/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          const data = {
            username: response.data.username || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            city: response.data.city || '',
            bio: response.data.bio || '',
            photo: response.data.photo || '',
            role: response.data.role || '',
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
            role: '',
          };
          setUserData(fallbackData);
          setTempData(fallbackData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
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
  
  const handleSave = async () => {
    setSaveLoading(true);
    const formData = new FormData();
    
    formData.append('username', tempData.username);
    formData.append('email', tempData.email);
    formData.append('phone', tempData.phone);
    formData.append('city', tempData.city);
    formData.append('bio', tempData.bio);
    formData.append('image', selectedFile); // الاسم "image" لازم يطابق الموجود في multer

    

    try {
      const response = await axios.put(
        `http://localhost:9527/api/auth/profile/me/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("User updated successfully:", response.data);
      setUserData(tempData);
      setIsEditing(false);
      
      // Show success toast instead of alert
      showToast("تم تحديث البيانات بنجاح!", "success");
    } catch (error) {
      console.error("Error updating user data:", error.response ? error.response.data : error);
      showToast("حدث خطأ أثناء التحديث. يرجى المحاولة لاحقًا.", "error");
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleCancel = () => {
    setTempData(userData);
    setTempProfileImage(userData.photo || '/default-profile.png');
    setSelectedFile(null);
    setIsEditing(false);
  };

  // Toast notification system
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#022C43]"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto font-[system-ui] my-35 px-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <CheckIcon className="w-5 h-5 mr-2" />
            ) : (
              <XIcon className="w-5 h-5 mr-2" />
            )}
            <p>{toast.message}</p>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-br from-[#022C43] to-[#053F5E] rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute left-4 top-12 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute right-12 top-6 w-24 h-24 rounded-full bg-[#FFD700]"></div>
            <div className="absolute left-1/3 bottom-8 w-32 h-32 rounded-full bg-[#115173]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-full border-4 ${isEditing ? 'border-[#FFD700]' : 'border-white'} shadow-lg overflow-hidden transition-all duration-300`}>
                <img
                  src={tempProfileImage}
                  alt={userData.username}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {isEditing && (
                <label htmlFor="fileInput" className="absolute bottom-0 right-0 bg-[#FFD700] p-2 rounded-full shadow-md cursor-pointer hover:bg-yellow-400 transition-colors">
                  <CameraIcon size={18} className="text-[#022C43]" />
                </label>
              )}
              
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                <div>
                  <input
                    type="text"
                    name="username"
                    value={isEditing ? tempData.username : userData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="text-3xl font-bold text-white bg-transparent border-none p-0 focus:ring-0 disabled:text-white text-center md:text-right placeholder-white"
                    placeholder="اسم المستخدم"
                  />
                  <p className="text-[#FFD700] mt-1">{userData.role || 'مستخدم'}</p>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#FFD700] text-[#022C43] px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-2"
                  >
                    <PencilIcon size={16} />
                    <span>تعديل الملف</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-white/30 rounded-full hover:bg-white/10 transition-colors flex items-center gap-1"
                    >
                      <XIcon size={16} />
                      <span>إلغاء</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="px-4 py-2 bg-[#FFD700] text-[#022C43] rounded-full hover:bg-yellow-400 transition-colors flex items-center gap-1"
                    >
                      {saveLoading ? (
                        <div className="w-4 h-4 border-2 border-[#022C43] border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <CheckIcon size={16} />
                      )}
                      <span>حفظ</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-4 font-medium text-center transition-colors ${
              activeTab === 'profile' ? 'text-[#022C43] border-b-2 border-[#FFD700]' : 'text-gray-500 hover:text-[#022C43]'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            معلومات الملف
          </button>
          <button
            className={`flex-1 py-4 font-medium text-center transition-colors ${
              activeTab === 'activity' ? 'text-[#022C43] border-b-2 border-[#FFD700]' : 'text-gray-500 hover:text-[#022C43]'
            }`}
            onClick={() => setActiveTab('activity')}
          >
            النشاطات
          </button>
        </div>
        
        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-lg font-medium text-[#022C43] mb-4 flex items-center gap-2">
                    <UserIcon size={18} />
                    <span>معلومات أساسية</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center border-b border-gray-100 pb-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full">
                        <MailIcon size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1 mr-4">
                        <label className="block text-sm text-gray-500">البريد الإلكتروني</label>
                        <input
                          type="email"
                          name="email"
                          value={isEditing ? tempData.email : userData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
                          placeholder="أدخل البريد الإلكتروني"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center border-b border-gray-100 pb-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-green-50 rounded-full">
                        <PhoneIcon size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1 mr-4">
                        <label className="block text-sm text-gray-500">رقم الجوال</label>
                        <input
                          type="tel"
                          name="phone"
                          value={isEditing ? tempData.phone : userData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
                          placeholder="أدخل رقم الجوال"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex items-center justify-center bg-purple-50 rounded-full">
                        <MapPinIcon size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1 mr-4">
                        <label className="block text-sm text-gray-500">الموقع</label>
                        <input
                          type="text"
                          name="city"
                          value={isEditing ? tempData.city : userData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
                          placeholder="أدخل الموقع"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-50 p-4 rounded-xl text-[#022C43] hover:bg-gray-100 transition-colors"
                >
                  <KeyIcon size={18} />
                  <span>تغيير كلمة المرور</span>
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-lg font-medium text-[#022C43] mb-4">نبذة تعريفية</h3>
                <textarea
                  name="bio"
                  value={isEditing ? tempData.bio : userData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={8}
                  placeholder="اكتب نبذة عنك..."
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 focus:ring-[#022C43] focus:border-[#022C43] disabled:text-[#022C43] resize-none text-right"
                />
                
                {userData.bio ? (
                  <div className="mt-3 text-gray-500 text-sm">
                    <span>{userData.bio.length} / 300 حرف</span>
                  </div>
                ) : !isEditing && (
                  <div className="mt-3 text-gray-400 text-center py-6">
                    <p>لا توجد نبذة تعريفية بعد</p>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)} 
                        className="text-[#022C43] underline mt-2"
                      >
                        أضف نبذة الآن
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Activities Tab Content */}
        {activeTab === 'activity' && (
          <div className="bg-white p-6 md:p-8">
            <UserActivities />
          </div>
        )}
      </div>
      
      {showPasswordModal && (
        <EditPasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default ProfilePage;

























