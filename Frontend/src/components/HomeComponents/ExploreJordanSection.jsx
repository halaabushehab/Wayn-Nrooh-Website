// import React, { useEffect, useState } from 'react';
// import { MapPin, Star, User, ChevronRight, CheckCircle, ChevronLeft, Award, Globe, Ticket, Calendar } from "lucide-react";
// import axios from "axios";
// import jwt_decode from 'jwt-decode';

// const SuggestPlaceSection = () => {
//   const [userId, setUserId] = useState(null);
//   const [username, setUsername] = useState(null);
//   const [step, setStep] = useState(1);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const token = localStorage.getItem('token');

//   const seasons = [
//     { id: 'spring', name: 'ربيع', icon: '🌸' },
//     { id: 'summer', name: 'صيف', icon: '☀️' },
//     { id: 'autumn', name: 'خريف', icon: '🍂' },
//     { id: 'winter', name: 'شتاء', icon: '❄️' },
//     { id: 'any', name: 'طوال السنة ', icon: '🔄' }
//   ];

//   const categories = [
//     "أماكن أثرية", "طبيعة", "منتزهات", "دينية", 
//     "ثقافة", "تسوق", "مطاعم", "ترفيه","متاحف","تعليمي"
//   ];

//   const [formData, setFormData] = useState({
//     name: '',
//     short_description: '',
//     detailed_description: '',
//     city: '',
//     location: {
//       latitude: '',
//       longitude: '',
//       address: ''
//     },
//     working_hours: '',
//     ticket_price: 0,
//     price: 0,
//     categories: [],
//     best_season: '',
//     requires_tickets: null,
//     is_free: false,
//     suitable_for: [],
//     contact: {
//       phone: '',
//       website: '',
//       map_link: ''
//     },
//     images: null,
//     gallery: null,
//     status: 'pending',
//     isDeleted: false
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: type === 'checkbox' ? checked : value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));
//     }
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
    
//     if (files.length > 8) {
//       alert("يرجى إضافة 8 صور كحد أقصى.");
//       return;
//     }
  
//     setFormData(prev => ({
//       ...prev,
//       images: files.slice(0, 3), // استخدام الملفات الحقيقية للـ images
//       gallery: files.slice(3, 8) // استخدام الملفات الحقيقية للـ gallery
//     }));
//   };

//   const toggleCategory = (category) => {
//     setFormData(prev => {
//       const newCategories = prev.categories.includes(category)
//         ? prev.categories.filter(c => c !== category)
//         : [...prev.categories, category];
//       return { ...prev, categories: newCategories };
//     });
//   };

//   const nextStep = () => setStep(prev => prev + 1);
//   const prevStep = () => setStep(prev => prev - 1);

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       short_description: '',
//       detailed_description: '',
//       city: '',
//       location: {
//         latitude: 0,
//         longitude: 0,
//         address: ''
//       },
//       working_hours: '',
//       ticket_price: 0,
//       price: 0,
//       categories: [],
//       best_season: '',
//       requires_tickets: null,
//       is_free: false,
//       suitable_for: [],
//       contact: {
//         phone: '',
//         website: '',
//         map_link: ''
//       },
//       images: [],
//       gallery: [],
//       status: 'pending',
//       isDeleted: false
//     });
//     setSelectedFiles([]);
//     setStep(1);
//     setIsSubmitted(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!token) {
//       alert("يرجى تسجيل الدخول.");
//       return;
//     }
  
//     // تحقق من أن الحقول المطلوبة مملوءة
//     if (!formData.name || !formData.city || !formData.short_description) {
//       alert("يرجى ملء جميع الحقول المطلوبة.");
//       return;
//     }
  
//     // تحقق من إحداثيات الموقع
//     const { latitude, longitude } = formData.location;
//     if (latitude <= 0 || longitude <= 0) {
//       alert("يرجى إدخال إحداثيات صحيحة.");
//       return;
//     }
  
//     // تحقق من الأسعار
//     if (isNaN(formData.price) || isNaN(formData.ticket_price)) {
//       alert("يرجى إدخال أسعار صحيحة.");
//       return;
//     }
  
//     // إنشاء كائن FormData
// const formDataToSend = new FormData();
// for (const key in formData) {
//   if (Array.isArray(formData[key])) {
//     formData[key].forEach((file, index) => {
//       formDataToSend.append(`${key}[${index}]`, file);
//     });
//   } else {
//     formDataToSend.append(key, formData[key]);
//   }
// }

// // Log the FormData content for debugging
// for (let pair of formDataToSend.entries()) {
//   console.log(pair[0]+ ', ' + pair[1]);
// }

  
//     // إرسال البيانات
//     try {
//       const response = await axios.post("http://localhost:9527/places/add", formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data' // تأكد من تعيين نوع المحتوى
//         }
//       });
//       console.log(response.data);
//       setIsSubmitted(true);
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting form:", error.response ? error.response.data : error);
//       alert("❌ حدث خطأ أثناء المعالجة");
//     }
//   };
  
  
//   console.log(formData)

//   const rewards = [
//     { id: 1, title: "رحلة مجانية", points: 100, icon: <Globe className="text-[#FFD700]" size={18} /> },
//     { id: 2, title: "خصومات حصرية", points: 50, icon: <Ticket className="text-[#FFD700]" size={18} /> },
//     { id: 3, title: "ظهور اسمك", points: 30, icon: <User  className="text-[#FFD700]" size={18} /> },
//     { id: 4, title: "دعوات فعاليات", points: 20, icon: <Calendar className="text-[#FFD700]" size={18} /> }
//   ];

//   const latestApproved = {
//     user: "سمر الأردنية",
//     date: "تمت إضافته قبل 3 أيام",
//     place: "مطعم زهرة الياسمين",
//     description: "اكتشفت هذا المطعم الرائع في جبل اللويبدة، يقدم أشهى المأكولات الأردنية التقليدية بطريقة عصرية وأجواء رائعة تطل على وسط البلد.",
//     location: "جبل اللويبدة، عمان",
//     status: "تمت الموافقة",
//     reward: 150
// };

//   return (
//     <section className="py-16 bg-gradient-to-b from-[#022C43]/5 to-white text-[#022C43]">
//       <div className="container mx-auto px-4">
//         <div className="grid md:grid-cols-3 gap-8">
//           {/* قسم المكافآت */}
//         <div className="md:col-span-1 bg-white p-6 rounded-xl border border-[#FFD700]/30 shadow-lg relative overflow-hidden">
//         <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD700]/10 rounded-full"></div>
//         <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#115173]/10 rounded-full"></div>
            
//             <div className="relative z-10">
//               <div className="flex items-center mb-6">
//                 <div className="bg-[#FFD700]/20 p-2 rounded-lg mr-3">
//                   <Award className="text-[#FFD700]" size={24} />
//                 </div>
//                 <h3 className="text-xl font-bold">اكتشف كنوز الأردن واربح</h3>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mb-8">
//                 {rewards.map(reward => (
//                   <div key={reward.id} className="bg-white p-3 rounded-lg border border-[#FFD700]/20 shadow-sm hover:shadow-md transition">
//                     <div className="flex items-center mb-2">
//                       {reward.icon}
//                       <span className="mr-2 font-medium">{reward.title}</span>
//                     </div>
//                     <span className="text-xs bg-[#FFD700]/20 text-[#022C43] px-2 py-1 rounded-full">
//                       +{reward.points} نقطة
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* آخر اقتراح تمت الموافقة عليه */}
//               <div className="bg-white p-4 rounded-lg border border-[#115173]/10 shadow-sm relative group overflow-hidden">
//                 <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
//                 <div className="flex items-center justify-between mb-3">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#115173] flex items-center justify-center mr-3 text-white">
//                       <User size={18} />
//                     </div>
//                     <div>
//                       <h4 className="font-medium">{latestApproved.user}</h4>
//                       <p className="text-sm text-[#444444]">{latestApproved.date}</p>
//                     </div>
//                   </div>
//                   <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
//                     <CheckCircle className="mr-1" size={14} /> {latestApproved.status}
//                   </span>
//                 </div>
                
//                 <h3 className="font-bold text-lg mb-2">{latestApproved.place}</h3>
//                 <p className="text-[#444444] mb-3 text-sm">{latestApproved.description}</p>
                
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center text-sm text-[#444444]">
//                     <MapPin className="mr-1" size={16} />
//                     {latestApproved.location}
//                   </div>
//                   <div className="flex items-center">
//                     <Star className="text-[#FFD700]" fill="#FFD700" size={16} />
//                     <span className="ml-1">{latestApproved.rating}</span>
//                   </div>
//                 </div>
                
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm bg-[#FFD700]/20 text-[#022C43] px-2 py-1 rounded-full">
//                     +{latestApproved.reward} نقطة
//                   </span>
//                   <button className="text-[#115173] text-sm flex items-center group-hover:text-[#FFD700] transition">
//                     عرض التفاصيل
//                     <ChevronRight className="mr-1" size={16} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* نموذج الاقتراح */}
//           <div className="md:col-span-2 bg-white p-6 rounded-xl border border-[#115173]/10 shadow-lg">
//             <div className="mb-8 text-center md:text-right">
//               <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FFD700] to-[#115173] bg-clip-text text-transparent">شارك تجربتك السياحية</h3>
//               <h4 className="text-xl text-[#115173] mb-3">ساعدنا في اكتشاف كنوز الأردن المخفية</h4>
//               <p className="text-[#444444] max-w-2xl mx-auto md:mr-0">
//                 كل مكان له قصة، وكل تجربة تستحق المشاركة. سجل اقتراحك اليوم وكن جزءاً من مجتمعنا الذي يكشف عن جمال الأردن.
//               </p>
//             </div>

//             {/* شريط التقدم */}
//             <div className="flex mb-8 relative">
//               <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#115173]/10 -z-10 transform -translate-y-1/2"></div>
//               {[1, 2, 3].map((stepNumber) => (
//                 <div key={stepNumber} className="flex-1 flex flex-col items-center">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= stepNumber ? 'bg-[#FFD700] text-white' : 'bg-[#115173]/10 text-[#444444]'} ${step === stepNumber ? 'ring-4 ring-[#FFD700]/50' : ''}`}>
//                     {stepNumber}
//                   </div>
//                   <p className={`text-sm ${step === stepNumber ? 'font-bold text-[#022C43]' : 'text-[#444444]'}`}>
//                     {stepNumber === 1 && 'المعلومات'}
//                     {stepNumber === 2 && 'التفاصيل'}
//                     {stepNumber === 3 && 'التأكيد'}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {step === 1 && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-sm block text-right font-medium">اسم المكان*</label>
//                     <input
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       type="text"
//                       className="w-full p-3 rounded-lg border border-[#115173]/20"
//                       placeholder="أدخل اسم المكان"
//                       required
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
//                     <label className="text-sm block text-right font-medium">المدينة*</label>
//                     <input
//                       name="city"
//                       value={formData.city}
//                       onChange={handleInputChange}
//                       type="text"
//                       className="w-full p-3 rounded-lg border border-[#115173]/20"
//                       placeholder="أدخل اسم المدينة"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="text-sm block text-right font-medium">الموقع*</label>
//                   <input
//                     name="location.address"
//                     value={formData.location.address}
//                     onChange={handleInputChange}
//                     type="text"
//                     className="w-full p-3 rounded-lg border border-[#115173]/20"
//                     placeholder="رابط google map"
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="text-sm block text-right font-medium">الوصف المختصر*</label>
//                   <textarea
//                     name="short_description"
//                     value={formData.short_description}
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-lg border border-[#115173]/20 h-24"
//                     placeholder="وصف مختصر عن المكان"
//                     required
//                   ></textarea>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label className="text-sm block text-right font-medium">الوصف التفصيلي*</label>
//                   <textarea
//                     name="detailed_description"
//                     value={formData.detailed_description}
//                     onChange={handleInputChange}
//                     className="w-full p-3 rounded-lg border border-[#115173]/20 h-32"
//                     placeholder="وصف تفصيلي عن المكان"
//                     required
//                   ></textarea>
//                 </div>
                
//                 <div className="flex justify-end pt-2">
//                   <button
//                     onClick={nextStep}
//                     disabled={!formData.name || !formData.city || !formData.location.address || !formData.short_description || !formData.detailed_description}
//                     className="bg-gradient-to-r from-[#FFD700] to-[#FFB700] text-[#022C43] px-6 py-3 rounded-lg font-medium transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     التالي
//                     <ChevronRight className="mr-1" size={18} />
//                   </button>
//                 </div>
//               </div>
//             )}

//             {step === 2 && (
//               <div className="space-y-6">
//                 <div className="space-y-2">
//                   <label className="text-sm block text-right font-medium">اختر الفئات*</label>
//                   <div className="flex flex-wrap gap-3">
//                     {categories.map((category) => (
//                       <button
//                         key={category}
//                         type="button"
//                         onClick={() => toggleCategory(category)}
//                         className={`px-4 py-2 rounded-lg text-sm border transition-all ${
//                           formData.categories.includes(category)
//                             ? "bg-gradient-to-br from-[#FFD700] to-[#FFB700] border-[#FFD700] text-[#022C43] shadow-md"
//                             : "bg-white border-[#115173]/20 text-[#444444] hover:border-[#115173]/40 hover:shadow-sm"
//                         }`}
//                       >
//                         {category}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="text-sm block text-right font-medium">الموسم الأنسب*</label>
//                     <div className="grid grid-cols-3 gap-3">
//                       {seasons.map((season) => (
//                         <button
//                           key={season.id}
//                           type="button"
//                           onClick={() => setFormData({...formData, best_season: season.id})}
//                           className={`p-2 rounded-lg border flex flex-col items-center transition-all ${
//                             formData.best_season === season.id
//                               ? "bg-[#FFD700]/10 border-[#FFD700] shadow-inner"
//                               : "bg-white border-[#115173]/20 hover:border-[#115173]/40"
//                           }`}
//                         >
//                           <span className="text-xl mb-1">{season.icon}</span>
//                           <span className="text-sm">{season.name}</span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-sm block text-right font-medium">هل يتطلب تذاكر؟*</label>
//                     <div className="flex items-center justify-end gap-4">
//                       <label className="inline-flex items-center cursor-pointer">
//                         <input
//                           type="radio"
//                           name="requires_tickets"
//                           checked={formData.requires_tickets === true}
//                           onChange={() => setFormData({...formData, requires_tickets: true, is_free: false})}
//                           className="form-radio h-5 w-5 text-[#FFD700] focus:ring-[#FFD700] border-[#115173]/30"
//                           required
//                         />
//                         <span className="mr-2">نعم</span>
//                       </label>
//                       <label className="inline-flex items-center cursor-pointer">
//                         <input
//                           type="radio"
//                           name="requires_tickets"
//                           checked={formData.requires_tickets === false}
//                           onChange={() => setFormData({...formData, requires_tickets: false, is_free: true})}
//                           className="form-radio h-5 w-5 text-[#FFD700] focus:ring-[#FFD700] border-[#115173]/30"
//                           required
//                         />
//                         <span className="mr-2">لا</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {formData.requires_tickets && (
//                   <div className="space-y-2">
//                     <label className="text-sm block text-right font-medium">سعر التذكرة (دينار أردني)*</label>
//                     <input
//                       name="ticket_price"
//                       value={formData.ticket_price}
//                       onChange={handleInputChange}
//                       type="number"
//                       className="w-full p-3 rounded-lg border border-[#115173]/20"
//                       placeholder="أدخل سعر التذكرة"
//                       required={formData.requires_tickets}
//                     />
//                   </div>
//                 )}

//                 <div className="space-y-2">
//                   <label className="text-sm block text-right font-medium">متوسط سعر الزيارة (دينار أردني)*</label>
//                   <input
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     type="number"
//                     className="w-full p-3 rounded-lg border border-[#115173]/20"
//                     placeholder="أدخل متوسط سعر الزيارة"
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-sm block text-right font-medium">ساعات العمل*</label>
//                   <input
//                     name="working_hours"
//                     value={formData.working_hours}
//                     onChange={handleInputChange}
//                     type="text"
//                     className="w-full p-3 rounded-lg border border-[#115173]/20"
//                     placeholder="مثال: 10:00 صباحًا - 10:00 مساءً"
//                     required
//                   />
//                 </div>

//                 <div className="flex justify-between pt-4">
//                   <button
//                     onClick={prevStep}
//                     className="bg-white border border-[#115173]/30 text-[#022C43] px-6 py-3 rounded-lg font-medium transition flex items-center hover:border-[#115173]/50 hover:shadow-sm"
//                   >
//                     <ChevronLeft className="ml-1" size={18} />
//                     السابق
//                   </button>
//                   <button
//                     onClick={nextStep}
//                     disabled={formData.categories.length === 0 || !formData.best_season || formData.requires_tickets === null || !formData.price || !formData.working_hours}
//                     className="bg-gradient-to-r from-[#FFD700] to-[#FFB700] text-[#022C43] px-6 py-3 rounded-lg font-medium transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     التالي
//                     <ChevronRight className="mr-1" size={18} />
//                   </button>
//                 </div>
//               </div>
//             )}
// {step === 3 && (
//   <div className="space-y-6">
//     <div className="space-y-2">
//       <label className="text-sm block text-right font-medium">رقم الهاتف</label>
//       <input
//         name="contact.phone"
//         value={formData.contact.phone}
//         onChange={handleInputChange}
//         type="text"
//         className="w-full p-3 rounded-lg border border-[#115173]/20"
//         placeholder="+962 6 123 4567"
//       />
//     </div>

//     <div className="space-y-2">
//       <label className="text-sm block text-right font-medium">الموقع الإلكتروني</label>
//       <input
//         name="contact.website"
//         value={formData.contact.website}
//         onChange={handleInputChange}
//         type="url"
//         className="w-full p-3 rounded-lg border border-[#115173]/20"
//         placeholder="https://example.com"
//       />
//     </div>

//     <div className="space-y-2">
//       <label className="text-sm block text-right font-medium">رابط الخريطة*</label>
//       <input
//         name="contact.map_link"
//         value={formData.contact.map_link}
//         onChange={handleInputChange}
//         type="url"
//         className="w-full p-3 rounded-lg border border-[#115173]/20"
//         placeholder="https://maps.google.com/..."
//         required
//       />
//     </div>

//     <div className="space-y-2">
//       <label className="text-sm block text-right font-medium">إحداثيات الموقع</label>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm mb-1">خط العرض</label>
//           <input
//             type="number"
//             name="location.latitude"
//             value={formData.location.latitude}
//             onChange={handleInputChange}
//             className="w-full p-3 rounded-lg border border-[#115173]/20"
//             step="0.0001"
//           />
//         </div>
//         <div>
//           <label className="block text-sm mb-1">خط الطول</label>
//           <input
//             type="number"
//             name="location.longitude"
//             value={formData.location.longitude}
//             onChange={handleInputChange}
//             className="w-full p-3 rounded-lg border border-[#115173]/20"
//             step="0.0001"
//           />
//         </div>
//       </div>
//     </div>

//     <div className="space-y-2">
//       <label className="text-sm block text-right font-medium">صور المكان*</label>
//       <input
//         type="file"
//         name="photo"
//         id="images"
//         multiple
//         accept="image/*"
//         onChange={handleImageChange}
//         className="w-full p-3 rounded-lg border border-[#115173]/20"
//       />
//     </div>

//     {isSubmitted ? (
//       <div className="bg-green-100 p-4 text-center rounded-md">
//         <p className="text-lg font-medium">شكراً لك! تم إرسال اقتراحك بنجاح.</p>
//       </div>
//     ) : (
//       <div className="flex justify-between pt-4">
//         <button
//           onClick={prevStep}
//           className="bg-white border border-[#115173]/30 text-[#022C43] px-6 py-3 rounded-lg font-medium transition flex items-center hover:border-[#115173]/50 hover:shadow-sm"
//         >
//           <ChevronLeft className="ml-1" size={18} />
//           السابق
//         </button>
//         <button
//           onClick={handleSubmit}
//           disabled={!formData.contact.map_link}
//           className="bg-gradient-to-r from-[#115173] to-[#053F5E] text-white px-6 py-3 rounded-lg font-medium transition flex items-center shadow-md hover:shadow-lg"
//         >
//           تأكيد وإرسال الاقتراح
//           <CheckCircle className="mr-1" size={18} />
//         </button>
//       </div>
//     )}
//   </div>
// )}

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SuggestPlaceSection;

// ====================================================================
// import React, { useState } from "react";

// const AddPlaceForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     short_description: "",
//     detailed_description: "",
//     city: "",
//     working_hours: "",
//     rating: "",
//     ticket_price: "",
//     best_season: "",
//     is_free: false,
//     map_link: "",
//     categories: "",
//     suitable_for: "",
//     phone: "",
//     website: "",
//     images: "",
//     gallery: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [isExpanded, setIsExpanded] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);

//     // Split inputs that expect arrays
//     const data = {
//       ...formData,
//       rating: parseFloat(formData.rating) || 0,
//       ticket_price: parseFloat(formData.ticket_price) || 0,
//       categories: formData.categories ? formData.categories.split(",").map((c) => c.trim()) : [],
//       suitable_for: formData.suitable_for ? formData.suitable_for.split(",").map((s) => s.trim()) : [],
//       images: formData.images ? formData.images.split(",").map((url) => url.trim()) : [],
//       gallery: formData.gallery ? formData.gallery.split(",").map((url) => url.trim()) : [],
//       contact: {
//         phone: formData.phone,
//         website: formData.website,
//       },
//       location: {
//         latitude: 0,
//         longitude: 0,
//       },
//       status: "pending",
//       isDeleted: false,
//     };

//     try {
//       const response = await fetch("http://localhost:9527/api/places/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();
//       console.log("تم الإرسال بنجاح:", result);
//       setSubmitStatus("success");
//       // Reset form after successful submission
//       setFormData({
//         name: "",
//         short_description: "",
//         detailed_description: "",
//         city: "",
//         working_hours: "",
//         rating: "",
//         ticket_price: "",
//         best_season: "",
//         is_free: false,
//         map_link: "",
//         categories: "",
//         suitable_for: "",
//         phone: "",
//         website: "",
//         images: "",
//         gallery: "",
//       });
//       // Collapse form after successful submission
//       setIsExpanded(false);
//     } catch (error) {
//       console.error("خطأ أثناء الإرسال:", error);
//       setSubmitStatus("error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Custom styles based on the provided color scheme
//   const colors = {
//     primary: "#115173", // Dark blue
//     accent: "#FFD700", // Gold
//     secondary: "#022C43", // Darker blue
//     white: "#FFFFFF"
//   };

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div 
//       className={`mx-auto bg-white rounded-2xl my-45 shadow-lg transition-all duration-300 ${isExpanded ? 'max-w-4xl p-8' : 'max-w-md p-6'}`}
//       dir="rtl"
//     >
//       <div 
//         className="mb-6 text-center cursor-pointer"
//         onClick={toggleExpand}
//       >
//         <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>
//           إضافة مكان جديد
//           <span className="mr-2 inline-block transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
//             ▾
//           </span>
//         </h2>
//         <div className="w-24 h-1 mx-auto mt-3 rounded" style={{ backgroundColor: colors.accent }}></div>
//       </div>

//       {submitStatus === "success" && (
//         <div className="mb-6 p-4 bg-green-50 border-r-4 border-green-500 rounded">
//           <p className="text-green-700">تم إرسال معلومات المكان بنجاح!</p>
//         </div>
//       )}

//       {submitStatus === "error" && (
//         <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded">
//           <p className="text-red-700">حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.</p>
//         </div>
//       )}

//       <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>اسم المكان</label>
//             <input 
//               name="name" 
//               value={formData.name}
//               placeholder="أدخل اسم المكان" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right"
//               style={{ borderColor: colors.primary }} 
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>المدينة</label>
//             <input 
//               name="city" 
//               value={formData.city}
//               placeholder="المدينة" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//               required
//             />
//           </div>

//           <div className="input-group col-span-1 md:col-span-2">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>وصف قصير</label>
//             <input 
//               name="short_description" 
//               value={formData.short_description}
//               placeholder="وصف مختصر للمكان" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//               required
//             />
//           </div>

//           <div className="input-group col-span-1 md:col-span-2">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>وصف تفصيلي</label>
//             <textarea 
//               name="detailed_description" 
//               value={formData.detailed_description}
//               placeholder="وصف تفصيلي للمكان وما يتميز به" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 h-32 text-right" 
//               style={{ borderColor: colors.primary }}
//             ></textarea>
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>ساعات العمل</label>
//             <input 
//               name="working_hours" 
//               value={formData.working_hours}
//               placeholder="مثال: 09:00 - 17:00" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>تقييم</label>
//             <input 
//               name="rating" 
//               type="number" 
//               value={formData.rating}
//               min="0" 
//               max="5" 
//               step="0.1" 
//               placeholder="تقييم من 0 إلى 5" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>سعر التذكرة</label>
//             <input 
//               name="ticket_price" 
//               type="number" 
//               value={formData.ticket_price}
//               min="0" 
//               placeholder="سعر التذكرة" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>أفضل موسم للزيارة</label>
//             <select 
//               name="best_season" 
//               value={formData.best_season}
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             >
//               <option value="">اختر الموسم</option>
//               <option value="الربيع">الربيع</option>
//               <option value="الصيف">الصيف</option>
//               <option value="الخريف">الخريف</option>
//               <option value="الشتاء">الشتاء</option>
//               <option value="جميع المواسم">جميع المواسم</option>
//             </select>
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>رابط الخريطة</label>
//             <input 
//               name="map_link" 
//               value={formData.map_link}
//               type="url" 
//               placeholder="رابط الموقع على الخريطة" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>التصنيفات</label>
//             <input 
//               name="categories" 
//               value={formData.categories}
//               placeholder="تصنيفات مفصولة بفواصل (مثال: سياحي، تاريخي)" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>مناسب لـ</label>
//             <input 
//               name="suitable_for" 
//               value={formData.suitable_for}
//               placeholder="مناسب لـ (مثال: العائلات، الأطفال)" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>رقم الهاتف</label>
//             <input 
//               name="phone" 
//               value={formData.phone}
//               placeholder="رقم هاتف المكان" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>الموقع الإلكتروني</label>
//             <input 
//               name="website" 
//               value={formData.website}
//               type="url" 
//               placeholder="رابط الموقع الإلكتروني" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group col-span-1 md:col-span-2">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>روابط الصور</label>
//             <input 
//               name="images" 
//               value={formData.images}
//               placeholder="روابط الصور مفصولة بفواصل" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="input-group col-span-1 md:col-span-2">
//             <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>معرض الصور</label>
//             <input 
//               name="gallery" 
//               value={formData.gallery}
//               placeholder="روابط صور معرض المكان مفصولة بفواصل" 
//               onChange={handleChange} 
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-right" 
//               style={{ borderColor: colors.primary }}
//             />
//           </div>

//           <div className="col-span-1 md:col-span-2 flex items-center space-x-3 mb-2 mt-2 flex-row-reverse">
//             <label className="font-medium mr-3" style={{ color: colors.secondary }}>دخول مجاني</label>
//             <input 
//               type="checkbox" 
//               name="is_free" 
//               checked={formData.is_free}
//               onChange={handleChange} 
//               className="w-5 h-5" 
//               style={{ accentColor: colors.accent }}
//             />
//           </div>

//           <div className="col-span-1 md:col-span-2 mt-6">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full p-4 rounded-lg font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center"
//               style={{ 
//                 backgroundColor: isSubmitting ? '#999' : colors.primary,
//                 borderBottom: `4px solid ${colors.accent}`
//               }}
//             >
//               {isSubmitting ? "جاري الإرسال..." : "إضافة المكان"}
//             </button>
//           </div>
//         </form>
//       </div>
      
//       {!isExpanded && (
//         <div className="text-center mt-4">
//           <button
//             onClick={toggleExpand}
//             className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg"
//             style={{
//               backgroundColor: colors.primary,
//               borderBottom: `4px solid ${colors.accent}`
//             }}
//           >
//             افتح نموذج الإضافة
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddPlaceForm;
// =======================================================================
import React, { useState } from "react";

const AddPlaceForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    detailed_description: "",
    city: "",
    working_hours: "",
    rating: "",
    ticket_price: "",
    best_season: "",
    is_free: false,
    map_link: "",
    categories: "",
    suitable_for: "",
    phone: "",
    website: "",
    images: "",
    gallery: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Split inputs that expect arrays
    const data = {
      ...formData,
      rating: parseFloat(formData.rating) || 0,
      ticket_price: parseFloat(formData.ticket_price) || 0,
      categories: formData.categories ? formData.categories.split(",").map((c) => c.trim()) : [],
      suitable_for: formData.suitable_for ? formData.suitable_for.split(",").map((s) => s.trim()) : [],
      images: formData.images ? formData.images.split(",").map((url) => url.trim()) : [],
      gallery: formData.gallery ? formData.gallery.split(",").map((url) => url.trim()) : [],
      contact: {
        phone: formData.phone,
        website: formData.website,
      },
      location: {
        latitude: 0,
        longitude: 0,
      },
      status: "pending",
      isDeleted: false,
    };

    try {
      const response = await fetch("http://localhost:9527/api/places/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("تم الإرسال بنجاح:", result);
      setSubmitStatus("success");
      // Reset form after successful submission
      setFormData({
        name: "",
        short_description: "",
        detailed_description: "",
        city: "",
        working_hours: "",
        rating: "",
        ticket_price: "",
        best_season: "",
        is_free: false,
        map_link: "",
        categories: "",
        suitable_for: "",
        phone: "",
        website: "",
        images: "",
        gallery: "",
      });
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Custom styles based on the provided color scheme
  const colors = {
    primary: "#115173", // Dark blue
    accent: "#FFD700", // Gold
    secondary: "#022C43", // Darker blue
    white: "#FFFFFF"
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg my-40">
      <div className="mb-8 text-center ">
        <h2 className="text-3xl font-bold" style={{ color: colors.primary }}>إضافة مكان جديد</h2>
        <div className="w-24 h-1 mx-auto mt-3 rounded" style={{ backgroundColor: colors.accent }}></div>
      </div>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-green-700">تم إرسال معلومات المكان بنجاح!</p>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700">حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>اسم المكان</label>
          <input 
            name="name" 
            value={formData.name}
            placeholder="أدخل اسم المكان" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: colors.primary, focusRing: colors.accent }} 
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>المدينة</label>
          <input 
            name="city" 
            value={formData.city}
            placeholder="المدينة" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>وصف قصير</label>
          <input 
            name="short_description" 
            value={formData.short_description}
            placeholder="وصف مختصر للمكان" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>وصف تفصيلي</label>
          <textarea 
            name="detailed_description" 
            value={formData.detailed_description}
            placeholder="وصف تفصيلي للمكان وما يتميز به" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 h-32" 
            style={{ borderColor: colors.primary }}
          ></textarea>
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>ساعات العمل</label>
          <input 
            name="working_hours" 
            value={formData.working_hours}
            placeholder="مثال: 09:00 - 17:00" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>تقييم</label>
          <input 
            name="rating" 
            type="number" 
            value={formData.rating}
            min="0" 
            max="5" 
            step="0.1" 
            placeholder="تقييم من 0 إلى 5" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>سعر التذكرة</label>
          <input 
            name="ticket_price" 
            type="number" 
            value={formData.ticket_price}
            min="0" 
            placeholder="سعر التذكرة" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>أفضل موسم للزيارة</label>
          <select 
            name="best_season" 
            value={formData.best_season}
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          >
            <option value="">اختر الموسم</option>
            <option value="الربيع">الربيع</option>
            <option value="الصيف">الصيف</option>
            <option value="الخريف">الخريف</option>
            <option value="الشتاء">الشتاء</option>
            <option value="جميع المواسم">جميع المواسم</option>
          </select>
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>رابط الخريطة</label>
          <input 
            name="map_link" 
            value={formData.map_link}
            type="url" 
            placeholder="رابط الموقع على الخريطة" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>التصنيفات</label>
          <input 
            name="categories" 
            value={formData.categories}
            placeholder="تصنيفات مفصولة بفواصل (مثال: سياحي، تاريخي)" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>مناسب لـ</label>
          <input 
            name="suitable_for" 
            value={formData.suitable_for}
            placeholder="مناسب لـ (مثال: العائلات، الأطفال)" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>رقم الهاتف</label>
          <input 
            name="phone" 
            value={formData.phone}
            placeholder="رقم هاتف المكان" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>الموقع الإلكتروني</label>
          <input 
            name="website" 
            value={formData.website}
            type="url" 
            placeholder="رابط الموقع الإلكتروني" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>روابط الصور</label>
          <input 
            name="images" 
            value={formData.images}
            placeholder="روابط الصور مفصولة بفواصل" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="input-group col-span-1 md:col-span-2">
          <label className="block mb-1 font-medium" style={{ color: colors.secondary }}>معرض الصور</label>
          <input 
            name="gallery" 
            value={formData.gallery}
            placeholder="روابط صور معرض المكان مفصولة بفواصل" 
            onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2" 
            style={{ borderColor: colors.primary }}
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex items-center space-x-3 mb-2 mt-2">
          <input 
            type="checkbox" 
            name="is_free" 
            checked={formData.is_free}
            onChange={handleChange} 
            className="w-5 h-5" 
            style={{ accentColor: colors.accent }}
          />
          <label className="font-medium" style={{ color: colors.secondary }}>دخول مجاني</label>
        </div>

        <div className="col-span-1 md:col-span-2 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 rounded-lg font-bold text-white transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center"
            style={{ 
              backgroundColor: isSubmitting ? '#999' : colors.primary,
              borderBottom: `4px solid ${colors.accent}`
            }}
          >
            {isSubmitting ? "جاري الإرسال..." : "إضافة المكان"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlaceForm;
