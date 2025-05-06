
import { useState } from 'react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="max-w-xl w-full text-center">
        {/* Large 404 Number */}
        <div className="relative">
          <h1 className="text-yellow-400 font-bold text-9xl">404</h1>
          
          {/* Small painting figure on the right side */}
          <div className="absolute bottom-0 right-0">
            <div className="relative">
              <div className="h-6 w-1 bg-gray-400 absolute right-2 bottom-0"></div>
              <div className="h-4 w-4 rounded-full bg-gray-300 absolute right-0 bottom-6"></div>
              <div className="h-8 w-4 bg-gray-300 absolute right-0 bottom-10 rounded-t-full"></div>
              <div className="h-1 w-6 bg-gray-500 absolute right-4 bottom-12"></div>
            </div>
          </div>
        </div>
        
        {/* Error messages */}
        <div className="mt-4 space-y-2 text-gray-700">
          <h2 className="text-2xl font-semibold">ERROR 404 - PAGE NOT FOUND</h2>
          <p className="text-xl">The Page You Requested</p>
          <p className="text-xl">Could Not Be Found</p>
        </div>
      </div>
    </div>
  );
}



//======================================================================================================


// import React from 'react'
// import { HomeIcon, ArrowLeftIcon, CarIcon } from 'lucide-react'
// export function PageNotFound() {
//   return (
//     <div className="bg-white min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
//       <div className="max-w-3xl w-full text-center">
//         {/* Road Sign with hover effect */}
//         <div className="relative inline-block mb-6 group cursor-pointer">
//           <div className="w-8 h-40 bg-[#115173] mx-auto rounded-sm transform group-hover:skew-x-2 transition-transform"></div>
//           <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-64 h-48 bg-[#FFD700] rounded-lg border-4 border-[#115173] flex items-center justify-center transform -rotate-3 shadow-lg hover:rotate-0 transition-all duration-300 group-hover:scale-105">
//             <div className="text-[#022C43] font-bold">
//               <span className="text-8xl block animate-bounce-gentle">404</span>
//               <span className="text-xl block mt-2">ROAD CLOSED</span>
//             </div>
//           </div>
//         </div>
//         <h1 className="text-3xl md:text-4xl font-bold text-[#115173] mt-12 mb-4">
//           Oops! You've Reached a Roadstop
//         </h1>
//         <p className="text-lg text-[#022C43] mb-8 max-w-lg mx-auto">
//           Looks like you've ventured off the mapped route. This roadside stop
//           doesn't lead anywhere, but we can help you get back on track.
//         </p>
//         {/* Road Illustration with moving cars */}
//         <div className="w-full max-w-md mx-auto h-24 bg-[#115173] relative rounded-md mb-12 overflow-hidden">
//           <div className="absolute top-1/2 left-0 right-0 h-2 bg-[#FFD700] flex">
//             <div className="animate-road-marks flex">
//               <div className="w-8 h-full bg-white"></div>
//               <div className="w-8 h-full bg-[#115173]"></div>
//               <div className="w-8 h-full bg-white"></div>
//               <div className="w-8 h-full bg-[#115173]"></div>
//               <div className="w-8 h-full bg-white"></div>
//               <div className="w-8 h-full bg-[#115173]"></div>
//               <div className="w-8 h-full bg-white"></div>
//               <div className="w-8 h-full bg-[#115173]"></div>
//               <div className="w-8 h-full bg-white"></div>
//               <div className="w-8 h-full bg-[#115173]"></div>
//             </div>
//           </div>
//           {/* Animated Cars */}
//           <div className="absolute top-1/4 transform -translate-y-1/2 animate-car-right">
//             <CarIcon className="text-[#FFD700] w-8 h-8" />
//           </div>
//           <div className="absolute top-3/4 transform -translate-y-1/2 animate-car-left">
//             <CarIcon className="text-[#FFD700] w-8 h-8 rotate-180" />
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//           <button
//             className="flex items-center gap-2 px-8 py-4 rounded-full relative overflow-hidden group"
//             onClick={() => window.history.back()}
//           >
//             <div className="absolute inset-0 bg-[#115173] transform transition-transform group-hover:scale-105"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-[#115173] to-[#022C43] opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             <ArrowLeftIcon
//               size={20}
//               className="relative z-10 text-white transform group-hover:-translate-x-1 transition-transform"
//             />
//             <span className="relative z-10 text-white font-medium">
//               Go Back
//             </span>
//           </button>
//           <button
//             className="flex items-center gap-2 px-8 py-4 rounded-full relative overflow-hidden group"
//             onClick={() => (window.location.href = '/')}
//           >
//             <div className="absolute inset-0 bg-[#FFD700] transform transition-transform group-hover:scale-105"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] to-[#e6c200] opacity-0 group-hover:opacity-100 transition-opacity"></div>
//             <HomeIcon
//               size={20}
//               className="relative z-10 text-[#022C43] transform group-hover:scale-110 transition-transform"
//             />
//             <span className="relative z-10 text-[#022C43] font-medium">
//               Back to Home
//             </span>
//           </button>
//         </div>
//       </div>
//       <style jsx>{`
//         @keyframes bounce-gentle {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }
//         @keyframes car-right {
//           from {
//             transform: translateX(-100%);
//           }
//           to {
//             transform: translateX(500%);
//           }
//         }
//         @keyframes car-left {
//           from {
//             transform: translateX(500%);
//           }
//           to {
//             transform: translateX(-100%);
//           }
//         }
//         @keyframes road-marks {
//           from {
//             transform: translateX(0);
//           }
//           to {
//             transform: translateX(-128px);
//           }
//         }
//         .animate-bounce-gentle {
//           animation: bounce-gentle 2s infinite;
//         }
//         .animate-car-right {
//           animation: car-right 8s linear infinite;
//         }
//         .animate-car-left {
//           animation: car-left 6s linear infinite;
//         }
//         .animate-road-marks {
//           animation: road-marks 2s linear infinite;
//         }
//       `}</style>
//     </div>
//   )
// }
// // ✅ هذا مطلوب
// export default PageNotFound;


//======================================================================================================



// import React, { useEffect, useState } from 'react';
// import { Home, ArrowLeft, Car, AlertTriangle, Map } from 'lucide-react';

// export function PageNotFound() {
//   const [isLoaded, setIsLoaded] = useState(false);
  
//   useEffect(() => {
//     // تأثير دخول الصفحة
//     setIsLoaded(true);
//   }, []);

//   return (
//     <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden my-10">
//       <div className={`max-w-4xl w-full text-center transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
//         {/* لافتة الطريق مع تأثيرات حركية محسنة */}
//         <div className="relative inline-block mb-8 group cursor-pointer">
//           <div className="w-10 h-48 bg-gray-700 mx-auto rounded-full transform group-hover:skew-x-2 transition-transform shadow-md"></div>
//           <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-72 h-52 bg-yellow-400 rounded-lg border-4 border-gray-700 flex items-center justify-center transform -rotate-2 shadow-xl hover:rotate-0 transition-all duration-300 group-hover:scale-105">
//             <div className="text-gray-800 font-bold">
//               <span className="text-8xl block">404</span>
//               <span className="text-2xl block mt-2 font-sans">الطريق مغلق</span>
//             </div>
//           </div>
//         </div>
        
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-10 mb-4 font-sans">
//           عذراً! لقد وصلت إلى طريق مسدود
//         </h1>
        
//         <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
//           يبدو أنك خرجت عن المسار المحدد. هذا الطريق لا يؤدي إلى أي مكان، لكن يمكننا مساعدتك للعودة إلى المسار الصحيح.
//         </p>
        
//         {/* رسم الطريق المحسن مع سيارات متحركة */}
//         <div className="w-full max-w-md mx-auto h-32 bg-gray-700 relative rounded-lg mb-12 overflow-hidden shadow-lg">
//           {/* علامات الطريق */}
//           <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-800 flex">
//             <div className="animate-road-marks flex">
//               {[...Array(10)].map((_, i) => (
//                 <React.Fragment key={i}>
//                   <div className="w-12 h-full bg-yellow-400"></div>
//                   <div className="w-12 h-full bg-gray-800"></div>
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
          
//           {/* سيارات متحركة */}
//           <div className="absolute top-1/4 transform -translate-y-1/2 animate-car-right">
//             <Car className="text-red-500 w-10 h-10" />
//           </div>
          
//           <div className="absolute bottom-1/4 transform -translate-y-1/2 animate-car-left">
//             <Car className="text-blue-400 w-10 h-10 rotate-180" />
//           </div>
          
//           {/* إشارات الطريق */}
//           <div className="absolute left-6 top-2">
//             <AlertTriangle className="text-yellow-400 w-6 h-6" />
//           </div>
          
//           <div className="absolute right-6 top-2">
//             <Map className="text-white w-6 h-6" />
//           </div>
//         </div>
        
//         {/* أزرار التنقل */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
//           <button
//             className="flex items-center gap-2 px-8 py-4 rounded-lg relative overflow-hidden group"
//             onClick={() => window.history.back()}
//           >
//             <div className="absolute inset-0 bg-gray-700 transform transition-transform group-hover:scale-105 rounded-lg"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
//             <ArrowLeft
//               size={20}
//               className="relative z-10 text-white transform group-hover:-translate-x-1 transition-transform"
//             />
//             <span className="relative z-10 text-white font-medium">
//               رجوع
//             </span>
//           </button>
          
//           <button
//             className="flex items-center gap-2 px-8 py-4 rounded-lg relative overflow-hidden group"
//             onClick={() => (window.location.href = '/')}
//           >
//             <div className="absolute inset-0 bg-yellow-400 transform transition-transform group-hover:scale-105 rounded-lg"></div>
//             <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
//             <Home
//               size={20}
//               className="relative z-10 text-gray-800 transform group-hover:scale-110 transition-transform"
//             />
//             <span className="relative z-10 text-gray-800 font-medium">
//               الصفحة الرئيسية
//             </span>
//           </button>
//         </div>
//       </div>
      
//       {/* تذييل الصفحة */}
//       {/* <div className={`mt-12 text-sm text-gray-500 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
//         © {new Date().getFullYear()} - جميع الحقوق محفوظة
//       </div> */}
      
//       <style jsx>{`
//         @keyframes bounce-gentle {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-10px);
//           }
//         }
        
//         @keyframes car-right {
//           from {
//             transform: translateX(-100%);
//           }
//           to {
//             transform: translateX(500%);
//           }
//         }
        
//         @keyframes car-left {
//           from {
//             transform: translateX(500%) rotate(180deg);
//           }
//           to {
//             transform: translateX(-100%) rotate(180deg);
//           }
//         }
        
//         @keyframes road-marks {
//           from {
//             transform: translateX(0);
//           }
//           to {
//             transform: translateX(-192px);
//           }
//         }
        
//         .animate-bounce-gentle {
//           animation: bounce-gentle 2s infinite ease-in-out;
//         }
        
//         .animate-car-right {
//           animation: car-right 12s linear infinite;
//         }
        
//         .animate-car-left {
//           animation: car-left 8s linear infinite;
//         }
        
//         .animate-road-marks {
//           animation: road-marks 1.5s linear infinite;
//         }
//       `}</style>
//     </div>
//   );
// }

// export default PageNotFound;