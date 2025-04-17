import { CameraIcon, CheckIcon, XIcon, PencilIcon, KeyIcon } from 'lucide-react';
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
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      setTempProfileImage(URL.createObjectURL(file)); // عرض الصورة مؤقتًا
    }
  };
  


  const handleSave = async () => {
    const formData = new FormData();
    
    // إضافة بيانات المستخدم إلى FormData
    formData.append('username', tempData.username);
    formData.append('email', tempData.email);
    formData.append('phone', tempData.phone);
    formData.append('city', tempData.city);
    formData.append('bio', tempData.bio);

    // إضافة الصورة إذا كانت موجودة
    if (selectedFile) {
        formData.append('photo', selectedFile);
    }

    try {
        const response = await axios.put(
            `http://localhost:9527/api/auth/profile/me/${id}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // تأكد من استخدام multipart/form-data
                },
            }
        );

        console.log("User  updated successfully:", response.data);
        setUserData(tempData);
        setIsEditing(false);
        alert("تم تحديث البيانات بنجاح!");
    } catch (error) {
        console.error("Error updating user data:", error.response ? error.response.data : error);
        alert("❌ حدث خطأ أثناء التحديث. يرجى المحاولة لاحقًا.");
    }
};
  

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }








  
  return (
<div className="max-w-4xl mx-auto font-[system-ui] my-8">
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="bg-[#022C43] px-6 py-8 text-white">
      <h1 className="text-2xl font-bold text-center">الملف الشخصي</h1>
    </div>
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="relative">
  {/* input file */}
  <input
    type="file"
    accept="image/*"
    id="fileInput"
    onChange={handleFileChange}
    className="hidden"
  />

  {/* label linked to the input */}
  <label htmlFor="fileInput">
    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative cursor-pointer">
      <img
src={tempProfileImage || userData.photo || "/default-profile.png"}
alt={userData.photo}
        className="w-full h-full object-cover"
      />
    </div>
  </label>
</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <input
                type="text"
                name="username"
                value={isEditing ? tempData.username : userData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className="text-2xl font-bold text-[#022C43] bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
              />
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-[#115173] hover:text-[#053F5E] p-2"
              >
                <PencilIcon size={20} />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSave} // هذا الزر سيقوم بتحديث الصورة وبيانات المستخدم
                  className="px-4 py-2 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  حفظ
                </button>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-500">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={isEditing ? tempData.email : userData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">رقم الجوال</label>
              <input
                type="tel"
                name="phone"
                value={isEditing ? tempData.phone : userData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500">الموقع</label>
              <input
                type="text"
                name="city"
                value={isEditing ? tempData.city : userData.city}
                onChange={handleChange}
                disabled={!isEditing}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm text-gray-500">
                  نبذة تعريفية
                </label>
                <textarea
                  name="bio"
                  value={isEditing ? tempData.bio : userData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] resize-none text-right"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 text-[#115173] hover:text-[#053F5E]"
            >
              <span>تغيير كلمة المرور</span>
              <KeyIcon size={16} />
            </button>
          </div>
        </div>
      </div>
      <UserActivities />
      {showPasswordModal && (
        <EditPasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
};

export default ProfilePage;



























// import { CameraIcon, CheckIcon, XIcon, PencilIcon, KeyIcon } from 'lucide-react';
// import { EditPasswordModal } from './EditPasswordModal';
// import { UserActivities } from './UserActivities';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import jwt_decode from 'jwt-decode';
// import { useParams } from 'react-router-dom';




// const ProfilePage = () => {
//   const { id } = useParams();
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isEditingPhoto, setIsEditingPhoto] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Initialize all fields with empty values
//   const [userData, setUserData] = useState({
//     username: '',
//     email: '',
//     phone: '',
//     city: '',
//     bio: '',
//     photo: '',
//     role: '',
//   });

//   const [tempData, setTempData] = useState({ ...userData });
//   const [tempProfileImage, setTempProfileImage] = useState('/default-profile.png');
// const [selectedFile, setSelectedFile] = useState(null);

//   const token = localStorage.getItem('token');
//   const decodedToken = token ? jwt_decode(token) : null;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         if (!token) {
//           throw new Error('No token found');
//         }

//         const response = await axios.get(`http://localhost:9527/api/auth/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data) {
//           const data = {
//             username: response.data.username || '',
//             email: response.data.email || '',
//             phone: response.data.phone || '',
//             city: response.data.city || '',
//             bio: response.data.bio || '',
//             photo: response.data.photo || '',
//             role: response.data.role || '',
//           };
//           setUserData(data);
//           setTempData(data);
//           setTempProfileImage(response.data.photo || '/default-profile.png');
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         if (decodedToken) {
//           const fallbackData = {
//             username: decodedToken.username || '',
//             email: decodedToken.email || '',
//             phone: '',
//             city: '',
//             bio: '',
//             photo: '',
//             role: '',
//           };
//           setUserData(fallbackData);
//           setTempData(fallbackData);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [id, token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTempData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
// };

// const handleUpdatePhoto = async () => {
//   const userId = id;  // Use id from useParams
//   const formData = new FormData();

//   if (selectedFile) {
//     formData.append('photo', selectedFile);
//   } else {
//     console.error('No file selected');
//     return; // Exit if no file is selected
//   }

//   try {
//     const response = await fetch(`http://localhost:9527/api/auth/profile/${userId}/photo`, {
//       method: 'PUT',
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message);
//     }
//     // Handle success...
//   } catch (error) {
//     console.error('Error while updating photo:', error);
//   }
// };


  
  
  
  
//   const handleSave = async () => {
//     console.log("User  ID:", id);
    
//     const token = localStorage.getItem("token");
//     console.log("Token retrieved:", token);
  
//     if (!token) {
//       console.error("No token found");
//       return;
//     }
  
//     console.log("✅ Sending token:", `Bearer ${token}`);
//     try {
//       const response = await axios.put(
//         `http://localhost:9527/api/auth/profile/me/${id}`,
//         tempData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       console.log("User  updated successfully:", response.data);
//       setUserData(tempData);
//       setIsEditing(false);
//       alert("تم تحديث البيانات بنجاح!");  // إضافة إشعار للمستخدم عند النجاح
//     } catch (error) {
//       console.error("Error updating user data:", error.response ? error.response.data : error);
//       alert("❌ حدث خطأ أثناء التحديث. يرجى المحاولة لاحقًا.");
//     }
//   };
  

//   const handleCancel = () => {
//     setTempData(userData);
//     setIsEditing(false);
//   };

//   if (isLoading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto font-[system-ui] my-8">
//       <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//         <div className="bg-[#022C43] px-6 py-8 text-white">
//           <h1 className="text-2xl font-bold text-center">الملف الشخصي</h1>
//         </div>
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//             <div className="relative">
//               <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   id="fileInput"
//                   onChange={handleFileChange}
//                 />
//                 <img
//                   src={tempProfileImage || userData.photo || "/default-profile.png"}
//                   alt={userData.username}
//                   className="w-full h-full object-cover"
//                   onClick={() => document.getElementById("fileInput").click()}
//                 />
//               </div>
//               {!isEditingPhoto ? (
//                 <button
//                   onClick={() => setIsEditingPhoto(true)}
//                   className="absolute bottom-0 right-0 bg-[#FFD700] p-2 rounded-full shadow-md hover:bg-yellow-500 transition-colors"
//                 >
//                   <CameraIcon size={16} className="text-[#022C43]" />
//                 </button>
//               ) : (
//                 <div className="absolute bottom-0 right-0 flex space-x-2">
//                   <button
//                     onClick={handleUpdatePhoto}
//                     className="bg-green-500 p-2 rounded-full hover:bg-green-600 transition-colors"
//                   >
//                     <CheckIcon size={16} className="text-white" />
//                   </button>
//                   <button
//                     onClick={() => {
//                       setTempProfileImage(userData.photo);
//                       setIsEditingPhoto(false);
//                     }}
//                     className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
//                   >
//                     <XIcon size={16} className="text-white" />
//                   </button>
//                 </div>
//               )}
//             </div>
//             <div className="flex-1">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <input
//                     type="text"
//                     name="username" // تأكد من أن هذا يتطابق مع اسم الحقل في الحالة
//                     value={isEditing ? tempData.username : userData.username } // استخدام username بدلاً من name
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className="text-2xl font-bold text-[#022C43] bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
//                   />
//                   {/* <input
//                     type="text"
//                     name="city"
//                     value={isEditing ? tempData.role : userData.role}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className="text-[#115173] bg-transparent border-none p-0 focus:ring-0 disabled:text-[#115173] text-right"
//                   /> */}
//                 </div>
//                 {!isEditing ? (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="text-[#115173] hover:text-[#053F5E] p-2"
//                   >
//                     <PencilIcon size={20} />
//                   </button>
//                 ) : (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleCancel}
//                       className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       إلغاء
//                     </button>
//                     <button
//                       onClick={handleSave}
//                       className="px-4 py-2 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-yellow-500 transition-colors"
//                     >
//                       حفظ
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <div className="mt-6 space-y-4">
//                 <div>
//                   <label className="block text-sm text-gray-500">
//                     البريد الإلكتروني
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={isEditing ? tempData.email : userData.email}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500">
//                     رقم الجوال
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={isEditing ? tempData.phone : userData.phone}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-500">الموقع</label>
//                   <input
//                     type="text"
//                     name="city"
//                     value={isEditing ? tempData.city : userData.city}
//                     onChange={handleChange}
//                     disabled={!isEditing}
//                     className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] text-right"
//                   />
//                 </div>
//               </div>
//               <div className="mt-6">
//                 <label className="block text-sm text-gray-500">
//                   نبذة تعريفية
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={isEditing ? tempData.bio : userData.bio}
//                   onChange={handleChange}
//                   disabled={!isEditing}
//                   rows={3}
//                   className="w-full bg-transparent border-none p-0 focus:ring-0 disabled:text-[#022C43] resize-none text-right"
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <button
//               onClick={() => setShowPasswordModal(true)}
//               className="flex items-center gap-2 text-[#115173] hover:text-[#053F5E]"
//             >
//               <span>تغيير كلمة المرور</span>
//               <KeyIcon size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//       <UserActivities />
//       {showPasswordModal && (
//         <EditPasswordModal onClose={() => setShowPasswordModal(false)} />
//       )}
//     </div>
//   );
// };

// export default ProfilePage;













































// import { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import {
//   EnvelopeIcon,
//   PhoneIcon,
//   GlobeEuropeAfricaIcon,
//   PencilIcon,
//   PhotoIcon,
//   BookmarkIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";
// import axios from "axios";

// const UserProfile = () => {
//   const { id } = useParams();// استخراج Id من الرابط

//   // حالة لتخزين بيانات المستخدم
//   const [user, setUser] = useState({
//     username: "",
//     email: "",
//     phone: "",
//     city: "",
//     bio: "",
//     avatar: "",
//     joinDate: "",
//     birthdate:"",
//     favorites: [],
//   });

//   // حالة لتحميل البيانات
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // حالة لتعديل البيانات
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedUser, setEditedUser] = useState({ ...user });

//   // Ref لرفع الصورة
//   const fileInputRef = useRef(null);

//   // جلب بيانات المستخدم من الخادم
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9527/api/auth/${id}`);
//         console.log("Data from server:", response.data); // تحقق من البيانات
//         setUser(response.data.user);
//         setEditedUser(response.data.user);
//         console.log("Data from server111111111111:", response.data);
//         setLoading(false);
//       } catch (error) {
//         setError(error.message);
//         setLoading(false);
//       }
//     };
  
//     fetchUserData();
//   }, [id]);
  

//   // Handle image upload
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setEditedUser({ ...editedUser, avatar: reader.result });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target; // استخدم name بدلاً من username
//     setEditedUser ({ ...editedUser , [name]: value });
//   };
  

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://localhost:9527/api/auth/${id}`, editedUser);
//       setUser(editedUser);
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Failed to update user:", error);
//     }
//   };

//   // Cancel editing
//   const handleCancel = () => {
//     setEditedUser({ ...user });
//     setIsEditing(false);
//   };

//   if (loading) {
//     return <div className="text-center py-10">جاري التحميل...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-500">حدث خطأ: {error}</div>;
//   }

//   return (
//     <div className="bg-[#FFFFFF] min-h-screen p-4 md:p-8 my-25" dir="rtl">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-[#022C43]">الملف الشخصي</h1>
//           <p className="text-[#444444]">مرحباً بك في "وين نروح؟"</p>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Cover Photo */}
//           <div className="h-32 bg-gradient-to-r from-[#022C43] to-[#115173]"></div>

//           {/* Profile Info */}
//           <div className="relative px-4 sm:px-6 pb-6">
//             {/* Avatar */}
//             <div className="relative -mt-16 mb-4">
//               <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden mx-auto bg-[#053F5E]">
//                 <img
//                   src={user.avatar || "/placeholder.svg"}
//                   alt={user.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Edit Button */}
//               {!isEditing && (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="absolute top-22 right-91 -translate-y-1/100 bg-[#FFD700] text-[#022C43] p-2 rounded-full shadow-md hover:bg-yellow-400 transition-colors"
//                 >
//                   <PencilIcon className="h-3 w-3" />
//                 </button>
//               )}
//             </div>

//             {isEditing ? (
//               /* Edit Form */
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="text-center mb-6">
//                   <div
//                     onClick={() => fileInputRef.current.click()}
//                     className="cursor-pointer inline-flex items-center justify-center gap-2 text-[#053F5E] hover:text-[#022C43]"
//                   >
//                     <PhotoIcon className="h-5 w-5" />
//                     <span>تغيير الصورة</span>
//                   </div>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleImageUpload}
//                     className="hidden"
//                     accept="image/*"
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// <input
//   type="text"
//   name="username"
//   value={editedUser.username || ""}
//   onChange={handleChange}
//   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#053F5E]"
// />



//                   <div>
//                     <label className="block text-sm font-medium text-[#444444] mb-1">البريد الإلكتروني</label>
//                     <input
//                       type="email"
//                       username="email"
//                       value={editedUser.email}
//                       onChange={handleChange}
                      
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#053F5E]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-[#444444] mb-1">رقم الهاتف</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={editedUser.phone}
//                       onChange={handleChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#053F5E]"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-[#444444] mb-1">الموقع</label>
//                     <input
//                       type="text"
//                       username="location"
//                       value={editedUser.location}
//                       onChange={handleChange}
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#053F5E]"
//                     />
//                   </div>

//                 <div>
//   <label className="block text-sm font-medium text-[#444444] mb-1">تاريخ الميلاد</label>
//   <input
//     type="date"  // تغيير النوع إلى "date" لتحديد تاريخ
//     name="birthdate"  // تعديل name ليتناسب مع الحقل
//     value={editedUser.birthdate}  // ربط القيمة بحقل birthdate في حالة الاستخدام
//     onChange={handleChange}  // التعامل مع التغيير في القيمة
//     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#053F5E]"
//   />
// </div>


//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-[#444444] mb-1">نبذة عني</label>
//                     <textarea
//                       username="bio"
//                       value={editedUser.bio}
//                       onChange={handleChange}
//                       rows="4"
//                       className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#053F5E]"
//                     ></textarea>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
//                   >
//                     <XMarkIcon className="h-5 w-5" />
//                     إلغاء
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex items-center gap-2 px-4 py-2 bg-[#053F5E] text-white rounded-md hover:bg-[#022C43]"
//                   >
//                     <BookmarkIcon className="h-5 w-5" />
//                     حفظ التغييرات
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               /* Display Profile */
//               <div>
//                 <div className="text-center mb-6">
//                 <h2 className="text-2xl font-bold text-[#022C43]">{user.username}</h2>                  <p className="text-[#444444]">عضو منذ {user.joinDate}</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center gap-3">
//                       <div className="bg-[#053F5E] p-2 rounded-full">
//                         <EnvelopeIcon className="h-5 w-5 text-white" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-[#444444]">البريد الإلكتروني</p>
//                         <p className="font-medium">{user.email}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="bg-[#053F5E] p-2 rounded-full">
//                         <PhoneIcon className="h-5 w-5 text-white" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-[#444444]">رقم الهاتف</p>
//                         <p className="font-medium">{user.phone}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="bg-[#053F5E] p-2 rounded-full">
//                         <EnvelopeIcon className="h-5 w-5 text-white" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-[#444444]">الموقع</p>
//                         <p className="font-medium">{user.location}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="bg-[#053F5E] p-2 rounded-full">
//                         <GlobeEuropeAfricaIcon className="h-5 w-5 text-white" />
//                       </div>
//                       <div>
//                         <p className="text-sm text-[#444444]">الموقع الإلكتروني</p>
//                         <p className="font-medium">{user.website}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <div className="mb-4">
//                       <h3 className="text-lg font-semibold text-[#022C43] mb-2">نبذة عني</h3>
//                       <p className="text-[#444444]">{user.bio}</p>
//                     </div>

//                     <div>
//                       <h3 className="text-lg font-semibold text-[#022C43] mb-2">المواقع المفضلة</h3>
//                       {/* <div className="flex flex-wrap gap-2">
//                         {user.favorites.map((favorite, index) => (
//                           <span key={index} className="bg-[#115173] text-white px-3 py-1 rounded-full text-sm">
//                             {favorite}
//                           </span>
//                         ))}
//                       </div> */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Activity Section */}
//         {!isEditing && (
//           <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
//             <h3 className="text-xl font-semibold text-[#022C43] mb-4">نشاطاتي الأخيرة</h3>
//             <div className="space-y-4">
//               <div className="border-r-4 border-[#FFD700] pr-4">
//                 <p className="font-medium">إضافة موقع جديد: وادي الهيدان</p>
//                 <p className="text-sm text-[#444444]">منذ 3 أيام</p>
//               </div>
//               <div className="border-r-4 border-[#FFD700] pr-4">
//                 <p className="font-medium">تعليق على موقع: قلعة عجلون</p>
//                 <p className="text-sm text-[#444444]">منذ أسبوع</p>
//               </div>
//               <div className="border-r-4 border-[#FFD700] pr-4">
//                 <p className="font-medium">تحديث معلومات الملف الشخصي</p>
//                 <p className="text-sm text-[#444444]">منذ أسبوعين</p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserProfile















