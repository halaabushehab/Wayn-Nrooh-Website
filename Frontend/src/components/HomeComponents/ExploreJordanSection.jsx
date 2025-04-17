import React, { useEffect, useState } from 'react';
import { MapPin, Star, User, ChevronRight, CheckCircle, ChevronLeft, Award, Globe, Ticket, Calendar } from "lucide-react";
import axios from "axios";
import jwt_decode from 'jwt-decode';

const SuggestPlaceSection = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = localStorage.getItem('token');

  const seasons = [
        { id: 'spring', name: 'ربيع', icon: '🌸' },
        { id: 'summer', name: 'صيف', icon: '☀️' },
        { id: 'autumn', name: 'خريف', icon: '🍂' },
        { id: 'winter', name: 'شتاء', icon: '❄️' },
        { id: 'any', name: 'طوال السنة ', icon: '🔄' }
      ];

    const categories = [
    "أماكن أثرية", "طبيعة", "منتزهات", "دينية", 
    "ثقافة", "تسوق", "مطاعم", "ترفيه","متاحف","تعليمي"
  ];


  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    detailed_description: '',
    city: '',
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
    working_hours: '',
    ticket_price: 0,
    price: 0,
    categories: [],
    best_season: '',
    requires_tickets: null,
    is_free: false,
    suitable_for: [],
    contact: {
      phone: '',
      website: '',
      map_link: ''
    },
    images: [],
    gallery: [],
    status: 'pending',
    isDeleted: false
  });


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    
    const imagePreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: imagePreviews,
      gallery: imagePreviews
    }));
  };

  const toggleCategory = (category) => {
    setFormData(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: newCategories };
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const resetForm = () => {
    setFormData({
      name: '',
      short_description: '',
      detailed_description: '',
      city: '',
      location: {
        latitude: 0,
        longitude: 0,
        address: ''
      },
      working_hours: '',
      ticket_price: 0,
      price: 0,
      categories: [],
      best_season: '',
      requires_tickets: null,
      is_free: false,
      suitable_for: [],
      contact: {
        phone: '',
        website: '',
        map_link: ''
      },
      images: [],
      gallery: [],
      status: 'pending',
      isDeleted: false
    });
    setSelectedFiles([]);
    setStep(1);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: '',
      short_description: '',
      detailed_description: '',
      city: '',
      location: {
        latitude: 0,
        longitude: 0,
        address: ''
      },
      working_hours: '',
      ticket_price: 0,
      price: 0,
      categories: [],
      best_season: '',
      requires_tickets: null,
      is_free: false,
      suitable_for: [],
      contact: {
        phone: '',
        website: '',
        map_link: ''
      },
      images: [],
      gallery: [],
      status: 'pending',
      isDeleted: false
    };
    // تحقق من أن جميع الحقول المطلوبة مملوءة
    if (!formData.name || !formData.short_description || !formData.detailed_description || !formData.city || !formData.working_hours || !formData.categories.length || !formData.best_season || !formData.contact.phone || !formData.contact.website || !formData.contact.map_link) {
      alert("يرجى ملء جميع الحقول المطلوبة.");
      return;
  }
    try {
        const response = await axios.post('http://localhost:9527/places', formData, {
            headers: {
                Authorization: `Bearer ${token}`, // تأكد من أن التوكن موجود هنا
            }
        });
        console.log(response.data); // تأكيد على الاستجابة من السيرفر
    } catch (error) {
        console.error("Error submitting form:", error.response ? error.response.data : error);
    }
};
  

  const rewards = [
    { id: 1, title: "رحلة مجانية", points: 100, icon: <Globe className="text-[#FFD700]" size={18} /> },
    { id: 2, title: "خصومات حصرية", points: 50, icon: <Ticket className="text-[#FFD700]" size={18} /> },
    { id: 3, title: "ظهور اسمك", points: 30, icon: <User  className="text-[#FFD700]" size={18} /> },
    { id: 4, title: "دعوات فعاليات", points: 20, icon: <Calendar className="text-[#FFD700]" size={18} /> }
  ];

  const latestApproved = {
    user: "سمر الأردنية",
    date: "تمت إضافته قبل 3 أيام",
    place: "مطعم زهرة الياسمين",
    description: "اكتشفت هذا المطعم الرائع في جبل اللويبدة، يقدم أشهى المأكولات الأردنية التقليدية بطريقة عصرية وأجواء رائعة تطل على وسط البلد.",
    location: "جبل اللويبدة، عمان",
    rating: 4.9,
    status: "تمت الموافقة",
    reward: 150
};

  return (
    <section className="py-16 bg-gradient-to-b from-[#022C43]/5 to-white text-[#022C43]">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Rewards Section */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl border border-[#FFD700]/30 shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD700]/10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#115173]/10 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="bg-[#FFD700]/20 p-2 rounded-lg mr-3">
                  <Award className="text-[#FFD700]" size={24} />
                </div>
                <h3 className="text-xl font-bold">اكتشف كنوز الأردن واربح</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {rewards.map(reward => (
                  <div key={reward.id} className="bg-white p-3 rounded-lg border border-[#FFD700]/20 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center mb-2">
                      {reward.icon}
                      <span className="mr-2 font-medium">{reward.title}</span>
                    </div>
                    <span className="text-xs bg-[#FFD700]/20 text-[#022C43] px-2 py-1 rounded-full">
                      +{reward.points} نقطة
                    </span>
                  </div>
                ))}
              </div>

              {/* Latest Approved Suggestion */}
              <div className="bg-white p-4 rounded-lg border border-[#115173]/10 shadow-sm relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#115173] flex items-center justify-center mr-3 text-white">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="font-medium">{latestApproved.user}</h4>
                      <p className="text-sm text-[#444444]">{latestApproved.date}</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCircle className="mr-1" size={14} /> {latestApproved.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-lg mb-2">{latestApproved.place}</h3>
                <p className="text-[#444444] mb-3 text-sm">{latestApproved.description}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-sm text-[#444444]">
                    <MapPin className="mr-1" size={16} />
                    {latestApproved.location}
                  </div>
                  <div className="flex items-center">
                    <Star className="text-[#FFD700]" fill="#FFD700" size={16} />
                    <span className="ml-1">{latestApproved.rating}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-[#FFD700]/20 text-[#022C43] px-2 py-1 rounded-full">
                    +{latestApproved.reward} نقطة
                  </span>
                  <button className="text-[#115173] text-sm flex items-center group-hover:text-[#FFD700] transition">
                    عرض التفاصيل
                    <ChevronRight className="mr-1" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestion Form */}
        {/* Suggestion Form */}
<div className="md:col-span-2 bg-white p-6 rounded-xl border border-[#115173]/10 shadow-lg">
  <div className="mb-8 text-center md:text-right">
    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#FFD700] to-[#115173] bg-clip-text text-transparent">شارك تجربتك السياحية</h3>
    <h4 className="text-xl text-[#115173] mb-3">ساعدنا في اكتشاف كنوز الأردن المخفية</h4>
    <p className="text-[#444444] max-w-2xl mx-auto md:mr-0">
      كل مكان له قصة، وكل تجربة تستحق المشاركة. سجل اقتراحك اليوم وكن جزءاً من مجتمعنا الذي يكشف عن جمال الأردن.
    </p>
  </div>

  {/* Progress Bar */}
  <div className="flex mb-8 relative">
    <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#115173]/10 -z-10 transform -translate-y-1/2"></div>
    {[1, 2].map((stepNumber) => (
      <div key={stepNumber} className="flex-1 flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= stepNumber ? 'bg-[#FFD700] text-white' : 'bg-[#115173]/10 text-[#444444]'} ${step === stepNumber ? 'ring-4 ring-[#FFD700]/50' : ''}`}>
          {stepNumber}
        </div>
        <p className={`text-sm ${step === stepNumber ? 'font-bold text-[#022C43]' : 'text-[#444444]'}`}>
          {stepNumber === 1 && 'المعلومات'}
          {stepNumber === 2 && 'الصور'}
        </p>
      </div>
    ))}
  </div>

  {/* Step 1: Basic Information */}
  {step === 1 && (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm block text-right font-medium">اسم المكان*</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            type="text"
            className="w-full p-3 rounded-lg border border-[#115173]/20"
            placeholder="أدخل اسم المكان"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm block text-right font-medium">المدينة*</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            type="text"
            className="w-full p-3 rounded-lg border border-[#115173]/20"
            placeholder="أدخل اسم المدينة"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm block text-right font-medium">الوصف المختصر*</label>
        <textarea
          name="short_description"
          value={formData.short_description}
          onChange={handleInputChange}
          className="w-full p-3 rounded-lg border border-[#115173]/20 h-24"
          placeholder="وصف مختصر عن المكان"
          required
        ></textarea>
      </div>
      
      <div className="flex justify-end pt-2">
        <button
          onClick={nextStep}
          disabled={!formData.name || !formData.city || !formData.short_description}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFB700] text-[#022C43] px-6 py-3 rounded-lg font-medium transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
          <ChevronRight className="mr-1" size={18} />
        </button>
      </div>
    </div>
  )}

  {/* Step 2: Images */}
  {step === 2 && (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm block text-right font-medium">صور المكان*</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-3 rounded-lg border border-[#115173]/20"
          required
        />
        {selectedFiles.length > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            تم اختيار {selectedFiles.length} ملف(ات)
          </div>
        )}
      </div>
      
      {isSubmitted ? (
        <div className="bg-green-100 p-4 text-center rounded-md">
          <p className="text-lg font-medium">شكراً لك! تم إرسال اقتراحك بنجاح.</p>
        </div>
      ) : (
        <div className="flex justify-between pt-4">
          <button
            onClick={prevStep}
            className="bg-white border border-[#115173]/30 text-[#022C43] px-6 py-3 rounded-lg font-medium transition flex items-center hover:border-[#115173]/50 hover:shadow-sm"
          >
            <ChevronLeft className="ml-1" size={18} />
            السابق
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedFiles.length === 0}
            className="bg-gradient-to-r from-[#115173] to-[#053F5E] text-white px-6 py-3 rounded-lg font-medium transition flex items-center shadow-md hover:shadow-lg"
          >
            تأكيد وإرسال الاقتراح
            <CheckCircle className="mr-1" size={18} />
          </button>
        </div>
      )}
    </div>
  )}
</div>
  
        </div>
      </div>
    </section>
  );
};

export default SuggestPlaceSection;









































































