import { Plane, Pin, MapPin } from 'lucide-react';

import { motion } from "framer-motion"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from "react-helmet";
import SuggestedPlacesSection from '../../components/HomeComponents/SuggestedPlacesSection '
import Image1 from '../../components/img/images1.jpeg';
import Image2 from '../../components/img/images2.png';
import Image3 from '../../components/img/images3.jpeg';
import Video1 from '../../components/img/AmmanHero.mp4';




export default function TravelWebsite() {
  const [hoveredDestination, setHoveredDestination] = useState(null);
  const [placeCount, setPlaceCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [cityCount, setCityCount] = useState(3); // ثابت
  const [bookingCount, setBookingCount] = useState(0);

useEffect(() => {
  // عدد الأماكن السياحية
  axios.get('http://localhost:9527/api/places/count')
    .then(res => {
      setPlaceCount(res.data.count);
    })
    .catch(err => console.error("Error fetching place count:", err));

  // عدد التقييمات
  axios.get('http://localhost:9527/api/ratings/total/count')
    .then(res => {
      setRatingCount(res.data.totalRatings);
    })
    .catch(err => console.error("Error fetching rating count:", err));

  // عدد المدفوعات (الحجوزات)
  axios.get('http://localhost:9527/api/payments/payments')
    .then(res => {
      const payments = res.data.payments;
      setBookingCount(payments.length);
    })
    .catch(err => console.error("Error fetching payments:", err));
}, []);


useEffect(() => {
  console.log("Updated Rating count:", ratingCount);
}, [ratingCount]); // سيتم طباعة القيمة الجديدة لـ ratingCount عند تغييرها


  
  return (

    <>
      <Helmet>
        <title>من نحن | وين نروح</title>
        <meta name="description" content="تعرف على فريق عمل وين نروح ورؤيتنا لمساعدة الزوار في استكشاف الأماكن الفريدة بالأردن." />
        <meta name="keywords" content="من نحن, فريق, وين نروح, عن الموقع" />
      </Helmet>
    <div className="font-sans text-gray-800">
      {/* "url('https://static.vecteezy.com/system/resources/previews/012/658/075/non_2x/outline-amman-jordan-skyline-with-blue-buildings-vector.jpg')" */}
      {/* Hero Section */}
      <section
  className="relative h-[50vh] bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://static.tildacdn.com/tild3730-3836-4534-b735-346236376365/caption.jpg')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-10"></div>

  {/* Content */}
  <div
    dir="rtl"
    className="absolute inset-0 flex flex-col justify-center items-center px-6 text-white text-center z-10"
  >
    {/* Badge and subtitle */}
    <div className="flex items-center text-sm mb-4 space-x-2 space-x-reverse">
      <span className="bg-[#FFD700] text-black px-3 py-1 rounded-full text-xs font-bold">
        وين نروح
      </span>
      <span className="tracking-wide">من نحن</span>
    </div>

    {/* Title */}
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
      اكتشف الأردن من منظور جديد
    </h1>

    {/* Description */}
    <p className="mb-6 max-w-2xl text-base md:text-lg leading-relaxed">
      منصة تساعدك على استكشاف أماكن فريدة وتجارب لا تُنسى في أنحاء الأردن.
    </p>

  </div>
</section>



      {/* Emotional Section */}
      <section dir="rtl" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-16">
          {/* Image Section */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FFD700]/10 rounded-full -z-10"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#FFD700]/20 rounded-full -z-10"></div>

              {/* Main image */}
              <div className="relative w-full h-80 sm:h-96 md:h-[450px] rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://i.pinimg.com/736x/1a/f0/88/1af08855656916032def657d64930760.jpg"
                  alt="تجربة ركوب الفيل"
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105 hover:rotate-1"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            className="w-full md:w-1/2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="inline-block px-3 py-1 bg-[#FFD700]/10 rounded-full mb-4">
                <span className="text-sm font-medium text-amber-700">استكشف الأردن</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">!دع مشاعرك تقودك للمغامرة</h2>
            </div>

            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                <span className="font-semibold text-amber-700">وين نروح</span> هو موقع إلكتروني أُطلق في عام 2025 بهدف
                مساعدة المستخدمين على استكشاف أماكن جديدة ومميزة في الأردن بطريقة سهلة وتفاعلية.
              </p>
              <p>
                جاءت فكرة الموقع نتيجة الحاجة إلى منصة عربية تُقدم معلومات موثوقة ومفصلة عن الأماكن السياحية والترفيهية،
                خاصةً للعائلات والشباب الذين يبحثون عن تجارب محلية ممتعة.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">مميزاتنا:</h3>
              <ul className="space-y-4">
                {[
                  "اقتراحات مخصصة حسب موقعك واهتماماتك",
                  "معلومات دقيقة عن الأماكن: صور، أوقات العمل، التكاليف، الفئات المناسبة",
                  "تقييمات وتعليقات من الزوار لتساعدك في اتخاذ القرار",
                  "سهولة في الاستخدام وتجربة عربية بالكامل",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center mt-0.5">
                      <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              {/* <button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-[#FFD700] text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                استكشف الوجهات
              </button> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>











 {/* Stats Section */}
            <section className="py-16 px-6 md:px-16 lg:px-32 bg-white relative overflow-hidden" dir="rtl">
  {/* Decorative elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#115173] opacity-5"></div>
    <div className="absolute left-20 bottom-0 w-96 h-96 rounded-full bg-[#FFD700] opacity-3"></div>
  </div>

  {/* Section title */}
  <div className="relative mb-16 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-[#022C43] mb-4">
      لماذا تختار "وين نروح"؟
    </h2>
    <div className="w-20 h-1 bg-gradient-to-r from-[#FFD700] to-[#115173] mx-auto"></div>
  </div>







  {/* Statistics grid - quarter layout */}
  <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
    {/* Top left - Tourist destinations */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#115173]/10 hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#115173]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[#115173]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[#022C43] mb-1">
            <span className="counter" data-target="320">{placeCount}</span>+
          </h3>
          <p className="text-[#115173] font-medium">الاماكن المضافة </p>
        </div>
      </div>
    </div>
    {/* Top right - Ratings */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#115173]/10 hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[#022C43] mb-1">
            <span className="counter" data-target="1200">{ratingCount}</span>+
          </h3>
          <p className="text-[#115173] font-medium">تقييم من الزوار</p>
        </div>
      </div>
    </div>

    {/* Bottom left - Cities */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#115173]/10 hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#115173]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[#115173]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[#022C43] mb-1">
            <span className="counter" data-target="3">12</span>+
          </h3>
          <p className="text-[#115173] font-medium">مدن رئيسية</p>
        </div>
      </div>
    </div>

    {/* Bottom right - Bookings */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#115173]/10 hover:shadow-md transition duration-300">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#FFD700]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <div>
<h3 className="text-3xl font-bold text-[#022C43] mb-1">
  <span className="counter" data-target="850">{bookingCount}</span>+
</h3>

          <p className="text-[#115173] font-medium">حجز تم عبر المنصة</p>
        </div>
      </div>
    </div>
  </div>



  {/* Counter animation script (add this to your JS) */}
  <script dangerouslySetInnerHTML={{
    __html: `
      document.addEventListener('DOMContentLoaded', () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;
        
        const animateCounters = () => {
          counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
              counter.innerText = Math.ceil(count + increment);
              setTimeout(animateCounters, 1);
            } else {
              counter.innerText = target;
            }
          });
        };
        
        // Start animation when section is in view
        const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            animateCounters();
            observer.unobserve(entries[0].target);
          }
        }, { threshold: 0.5 });
        
        observer.observe(document.querySelector('section'));
      });
    `
  }}></script>
</section>

























      {/* our vision */}

<section dir="rtl" className="py-20 px-4 sm:px-6 md:px-16 lg:px-32 b relative overflow-hidden">
  {/* <!-- عناصر زخرفية --> */}
  <div className="absolute top-0 left-0 w-40 h-40 bg-[#FFD700]/10 rounded-full filter blur-3xl"></div>
  <div className="absolute bottom-10 right-20 w-60 h-60 bg-[#FF6B6B]/10 rounded-full filter blur-3xl"></div>
  
  <div className="max-w-6xl mx-auto relative z-10">
    {/* <!-- العنوان الرئيسي مع تأثير مميز --> */}
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        <span className="relative inline-block">
          <span className="relative z-10">رؤيتنا</span>
          <span className="absolute bottom-0 right-0 w-full h-3 bg-[#FFD700]/50 z-0 transform -rotate-1"></span>
        </span>
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] mx-auto rounded-full"></div>
    </div>

    {/* <!-- النص الرئيسي مع تأثيرات مرئية --> */}
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-sm border border-[#FFD700]/20 mb-12 transform transition-all hover:shadow-xl hover:-translate-y-1">
      <p className="text-gray-700 leading-relaxed text-lg md:text-xl text-center max-w-3xl mx-auto font-medium">
        نطمح لأن يصبح موقع 
        <span className="font-bold text-[#FF6B6B] relative px-1">
          <span className="relative z-10">وين نروح</span>
          <span className="absolute bottom-0 right-0 w-full h-2 bg-[#FFD700]/30 z-0"></span>
        </span> 
        الوجهة الأولى لاكتشاف التجارب المميزة في المملكة والعالم العربي، حيث نبتكر أدوات ذكية تجعل كل رحلة فريدة.
      </p>
    </div>

    {/* <!-- النقاط مع أيقونات مميزة --> */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {/* <!-- النقطة 1 --> */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#FFD700] hover:border-[#FF6B6B] transition-all">
        <div className="flex items-start">
          <div className="bg-[#FFF5E6] p-3 rounded-lg ml-4 flex-shrink-0">
            <svg className="w-6 h-6 text-[#FFA500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">ذكاء اصطناعي متطور</h3>
            <p className="text-gray-600">نظام اقتراحات ذكي يتعلم من تفضيلاتك ليقدم لك تجارب شخصية</p>
          </div>
        </div>
      </div>
      
      {/* <!-- النقطة 2 --> */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#FFD700] hover:border-[#FF6B6B] transition-all">
        <div className="flex items-start">
          <div className="bg-[#FFF5E6] p-3 rounded-lg ml-4 flex-shrink-0">
            <svg className="w-6 h-6 text-[#FFA500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">مشاركة التجارب</h3>
            <p className="text-gray-600">شارك رحلاتك عبر معرض صور تفاعلي وتقييمات مفصلة</p>
          </div>
        </div>
      </div>
      
      {/* <!-- النقطة 3 --> */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#FFD700] hover:border-[#FF6B6B] transition-all">
        <div className="flex items-start">
          <div className="bg-[#FFF5E6] p-3 rounded-lg ml-4 flex-shrink-0">
            <svg className="w-6 h-6 text-[#FFA500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">تطبيق محمول</h3>
            <p className="text-gray-600">تطبيق سريع ومرن مع ميزات حصرية للاكتشاف أثناء التنقل</p>
          </div>
        </div>
      </div>
      
      {/* <!-- النقطة 4 --> */}
      <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#FFD700] hover:border-[#FF6B6B] transition-all">
        <div className="flex items-start">
          <div className="bg-[#FFF5E6] p-3 rounded-lg ml-4 flex-shrink-0">
            <svg className="w-6 h-6 text-[#FFA500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">شراكات استراتيجية</h3>
            <p className="text-gray-600">تعاون مع أفضل الجهات السياحية لتقديم محتوى موثوق وحصري</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Offbeat Stays Section */}  
      <div className="flex flex-col items-center justify-center  bg-amber-50 p-8 relative">
  {/* Decorative border frame */}
  <div className="absolute inset-0 border-2 border-amber-200 m-6 pointer-events-none rounded-lg"></div>

  {/* Main content container */}
  <div className="w-full max-w-4xl py-8 px-6 relative z-10">
    {/* Elegant title */}
    <div className="bg-white rounded-full shadow-sm py-3 px-10 mb-8 mx-auto w-fit border border-amber-100">
      <h1 className="text-xl font-serif font-medium text-center text-amber-800 tracking-wide">
        "لحظات ساحرة من رحلاتكم حول العالم"
      </h1>
    </div>

    {/* Descriptive text */}
    <p className="text-lg text-center text-amber-900 mb-8 leading-relaxed font-serif">
      هنا نلتقط أنقى الذكريات التي عاشها زوارنا في رحلاتهم — لحظات تفيض بالبهجة، 
      <br />
      العجائب، والدفء الإنساني. قصص ترويها عدسة الكاميرا قبل الكلمات.
    </p>

    {/* Images section - now 3 in one row without scroll */}
    <div className="flex gap-10 justify-center items-start flex-wrap">
      {/* Image 1 */}
      <div className="relative transform -rotate-10 hover:rotate-0 transition-transform duration-500 w-64">
        <div className="relative group">
          <img
           src={Image1}  
            alt="العائلة في عمان"
            className="w-full h-64 object-cover shadow-lg rounded-sm 
            border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] 
            border-white transition-all duration-300 group-hover:shadow-xl"
          />
          <div className="absolute -top-3 -left-3 right-30">
            <Pin size={28} className="text-amber-600" />
          </div>
          <div className="absolute bottom-15 right-2 left-2 px-3 py-1 text-left">
            <p className="text-base font-serif font-semibold text-white">
              عمان - العاب غابة جينغو  
            </p>
          </div>
        </div>
      </div>
      {/* <div className="relative transform -rotate-10 hover:rotate-0 transition-transform duration-500 w-64">
  <div className="relative group">
    <video
      src={Video1} // ضع هنا رابط الفيديو أو متغير الاستيراد الخاص به
      alt="العائلة في عمان"
      className="w-full h-64 object-cover shadow-lg rounded-sm 
      border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] 
      border-white transition-all duration-300 group-hover:shadow-xl"
      autoPlay
      loop
      muted
      playsInline
    />
    <div className="absolute -top-3 -left-3 right-30">
      <Pin size={28} className="text-amber-600" />
    </div>
    <div className="absolute bottom-10 right-0 left-0 px-3 py-1 text-left">
      <p className="text-base font-serif font-semibold text-white">
        عمان - مزرعة السوسنة السوداء
      </p>
    </div>
  </div>
</div> */}


      {/* Image 2 */}
      <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500 w-64">
        <div className="relative group">
          <img
          src={Image2}      
      alt="العائلة في الزرقاء"
            className="w-full h-64 object-cover shadow-lg rounded-sm 
            border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] 
            border-white transition-all duration-300 group-hover:shadow-xl"
          />
          <div className="absolute -top-3 -left-3 right-30">
            <Pin size={28} className="text-amber-600" />
          </div>
          <div className="absolute bottom-15 right-2 left-2 px-3 py-1 text-left">
            <p className="text-base font-serif font-semibold text-white">
            عمان-فيرست أرتشر
            </p>
          </div>
        </div>
      </div>

      {/* Image 3 */}
      <div className="relative transform -rotate-4 hover:rotate-0 transition-transform duration-500 w-64">
        <div className="relative group">
          <img
          src={Image3}
            className="w-full h-64 object-cover shadow-lg rounded-sm 
            border-t-[15px] border-r-[15px] border-l-[15px] border-b-[60px] 
            border-white transition-all duration-300 group-hover:shadow-xl"
          />
          <div className="absolute -top-3 -left-3  right-30">
            <Pin size={28} className="text-amber-600" />
          </div>
          <div className="absolute bottom-15 right-2 left-2 px-3 py-1 text-left">
            <p className="text-base font-serif font-semibold text-white">
              عمان - معرض بانوراما عمان 
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Decorative quote */}
    <div className="mt-12 text-center">
      <p className="font-serif italic text-amber-700 text-lg">
        "كل صورة تحمل قصة، وكل قصة تصنع ذكرى"
      </p>
    </div>
  </div>
</div>


 

      {/* our  value */}
      <section dir="rtl" className="py-16 px-4 sm:px-6 md:px-16 lg:px-32 bg-white">
  <div className="max-w-6xl mx-auto space-y-6">
    <h2 className="text-3xl md:text-4xl font-bold text-[#022C43] text-center relative pb-4">
      قيمنا
      <span className="absolute bottom-0 right-1/2 transform translate-x-1/2 w-20 h-1 bg-[#FFD700] rounded-full"></span>
    </h2>

    <p className="text-[#115173] leading-relaxed text-lg text-center max-w-3xl mx-auto">
      في <span className="font-semibold text-[#022C43]">وين نروح</span>، نؤمن بأن نجاحنا لا يقوم فقط على التكنولوجيا والمحتوى، بل على المبادئ التي نلتزم بها في كل تفصيل نقدمه.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
      {/* <!-- Card 1 --> */}
      <div className="bg-white p-6 rounded-xl border-2 border-[#FFD700] hover:border-[#022C43] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2">
        <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#022C43]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-[#022C43] text-center">الشفافية</h3>
        <p className="text-[#115173] text-center text-sm leading-relaxed">نحرص على عرض معلومات دقيقة وموثوقة بكل وضوح وحيادية.</p>
      </div>
      
      {/* <!-- Card 2 --> */}
      <div className="bg-white p-6 rounded-xl border-2 border-[#FFD700] hover:border-[#022C43] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2">
        <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#022C43]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-[#022C43] text-center">الابتكار</h3>
        <p className="text-[#115173] text-center text-sm leading-relaxed">نبحث دائمًا عن طرق جديدة لتحسين تجربة المستخدم وتقديم محتوى مميز.</p>
      </div>
      
      {/* <!-- Card 3 --> */}
      <div className="bg-white p-6 rounded-xl border-2 border-[#FFD700] hover:border-[#022C43] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2">
        <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#022C43]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-[#022C43] text-center">الجودة</h3>
        <p className="text-[#115173] text-center text-sm leading-relaxed">نهتم بأدق التفاصيل لنقدم تجربة عالية المستوى للمستخدم.</p>
      </div>
      
      {/* <!-- Card 4 --> */}
      <div className="bg-white p-6 rounded-xl border-2 border-[#FFD700] hover:border-[#022C43] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2">
        <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#022C43]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-[#022C43] text-center">تجربة المستخدم</h3>
        <p className="text-[#115173] text-center text-sm leading-relaxed">نصمّم كل ميزة في المنصة لتكون بسيطة، مريحة، ومناسبة للمستخدم العربي.</p>
      </div>
      
      {/* <!-- Card 5 --> */}
      <div className="bg-white p-6 rounded-xl border-2 border-[#FFD700] hover:border-[#022C43] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2">
        <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mb-4 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#022C43]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-[#022C43] text-center">دعم السياحة المحلية</h3>
        <p className="text-[#115173] text-center text-sm leading-relaxed">نُبرز الأماكن المحلية ونشجع على استكشاف الجمال الموجود حولنا.</p>
      </div>
            {/* <!-- Card 6 --> */}

      <div className="bg-white p-6 rounded-xl border-2 border-[#FFD700] hover:border-[#022C43] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2">
  <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mb-4 mx-auto">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#022C43]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h3l3 8 4-16 3 8h3" />
    </svg>
  </div>
  <h3 className="font-bold text-xl mb-3 text-[#022C43] text-center">الشراكة والتعاون</h3>
  <p className="text-[#115173] text-center text-sm leading-relaxed">
    نؤمن بقوة الشراكة مع المجتمعات المحلية  لتعزيز تجربة المستخدم وتطوير المنصة  .
  </p>
</div>
    </div>
  </div>
</section>
   
 
      
      {/* contact Us */}
      <section dir="rtl" class="relative py-20 px-4 sm:px-6 md:px-16 lg:px-32 bg-white overflow-hidden">
  {/* <!-- عناصر زخرفية ديناميكية --> */}
  <div class="absolute top-0 left-0 w-full h-full opacity-10">
    <div class="absolute top-20 left-1/4 w-16 h-16 bg-[#FFD700] rounded-full filter blur-xl"></div>
    <div class="absolute bottom-10 right-1/3 w-24 h-24 bg-[#115173] rounded-full filter blur-xl"></div>
  </div>
  
  <div class="max-w-5xl mx-auto relative z-10">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold text-[#022C43] mb-4 animate-fadeIn">
        <span class="text-[#115173]">تواصل</span> مع فريقنا
      </h2>
      <div class="w-24 h-1 bg-[#FFD700] mx-auto mb-6"></div>
      <p class="text-xl text-[#022C43] max-w-2xl mx-auto leading-relaxed">
        نرحب بأفكارك واستفساراتك! فريقنا موجود دائماً لمساعدتك وتلقي ملاحظاتك.
      </p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-10 items-center">
      {/* <!-- بطاقة التواصل الرئيسية --> */}
      <div class="bg-[#FFFFFF] p-8 rounded-2xl shadow-2xl transform transition hover:scale-105 duration-300 border-t-4 border-[#FFD700]">
        <div class="text-center">
          <div class="w-20 h-20 bg-[#FFFFFF] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FFD700]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#115173]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-[#022C43] mb-3">راسلنا مباشرة</h3>
          <p class="text-[#115173] mb-6">للاستفسارات العامة وطلبات الشراكة</p>
          <a href="mailto:contact@wayn-nrouh.com" class="inline-block bg-[#FFD700] hover:bg-[#FFD700]/80 text-[#022C43] font-bold py-3 px-8 rounded-full transition duration-300 shadow-md">
            contact@wayn-nrouh.com
          </a>
        </div>
      </div>
      
      <div class="bg-[#FFFFFF] p-8 rounded-2xl shadow-2xl transform transition hover:scale-105 duration-300 border-t-4 border-[#115173]">
        <div class="text-center">
          <div class="w-20 h-20 bg-[#FFFFFF] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#115173]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-[#115173]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-[#022C43] mb-3">اتصل بنا</h3>
          <p class="text-[#115173] mb-6">متاحون للمساعدة من الأحد إلى الخميس</p>
          <a href="tel:+123456789" class="inline-block bg-[#115173] hover:bg-[#115173]/80 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-md">
            +962 787967253
          </a>
        </div>
      </div>
    </div>
    
    <div class="mt-16 text-center">
      <a href="/contact" class="inline-flex items-center px-8 py-4 bg-[#022C43] hover:bg-[#022C43]/80 text-white font-bold rounded-full transition duration-300 shadow-lg">
        <span>زيارة صفحة الاتصال </span>
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
</svg>

      </a>
    </div>
  </div>
</section>

    {/* <ExploreJordanSection /> */}
    <SuggestedPlacesSection  />
      
 
    </div>
    </>
  );
}