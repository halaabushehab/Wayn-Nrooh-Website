// import { Link } from "react-router-dom";
// import { MapPinIcon, SparklesIcon, StarIcon } from "lucide-react";

// export default function SuggestPlaceBox() {
//   return (
//     <div className="relative w-[70%] mx-auto mt-10 group">
//       {/* Animated decorative elements */}
//       <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-[#FFD700] opacity-30 group-hover:scale-150 transition-all duration-700"></div>
//       <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-[#115173] opacity-20 group-hover:scale-150 transition-all duration-700"></div>

//       {/* Main card with hover effect */}
//       <div className="relative bg-whit border-[#115173] rounded-2xl p-6 shadow-lg transform group-hover:-translate-y-2 transition-all duration-300 overflow-hidden z-10">
//         {/* Diagonal accent line */}
//         <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FFD700] rotate-45 opacity-20"></div>

//         <div className="flex flex-col items-center">
//           {/* Icon with animation */}
//           <div className="w-16 h-16 bg-[#022C43] rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-all">
//             <MapPinIcon size={28} className="text-[#FFD700]" />
//           </div>

//           <h2 className="text-[#022C43] text-2xl font-bold mb-3 text-center flex items-center gap-2">
//             <SparklesIcon size={18} className="text-[#FFD700]" />
//             هل زرت مكانًا مميزًا؟
//             <SparklesIcon size={18} className="text-[#FFD700]" />
//           </h2>

//           <p className="text-[#115173] text-center mb-6 leading-relaxed">
//             شاركنا تجربتك واقترح مكانًا رائعًا ليستمتع به الآخرون
//             <br />
//             في "وين نروح"
//           </p>

//           {/* Animated button */}
//           <Link
//             to="/suggest"
//             className="relative bg-[#FFD700] text-white font-bold px-8 py-3 rounded-xl overflow-hidden group-hover:shadow-xl transition-all duration-300 flex items-center gap-2 no-underline"
//             style={{ textDecoration: "none" }} // إضافي للتأكيد
//           >
//             <span className="relative z-10 flex items-center gap-2">
//               <StarIcon
//                 size={18}
//                 className="group-hover:rotate-45 transition-all"
//               />
//               اقترح مكان
//             </span>

//             <div className="absolute inset-0 w-0 bg-[#022C43] group-hover:w-full transition-all duration-300 z-0"></div>

//             <p className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 text-[#FFD700] flex items-center justify-center transition-opacity duration-300 z-20 m-0">
//               اقترح مكان
//             </p>
//           </Link>
//         </div>

//         {/* Small decorative corner */}
//         <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#115173] rounded-tl-xl"></div>
//       </div>
//     </div>
//   );
// }



// import React from "react";
// import { SparklesIcon, StarIcon } from "lucide-react";
// import { Link } from "react-router-dom";

// export default function NewsletterSection() {
//   return (
//     <div className="bg-[#f0f4f8] p-10 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
//       {/* Left Images */}
//       <div className="flex flex-col items-center gap-4">
//         <img
//           src="https://i.pinimg.com/1200x/dc/dc/4f/dcdc4f586234256cf18e7efd030c432a.jpg"
//           alt="Spyglass"
//           className="w-16 h-16 object-contain"
//         />
//         <img
//           src="https://i.pinimg.com/736x/91/f3/73/91f373f89535b2386499e9ab495e5a9f.jpg"
//           alt="Compass"
//           className="w-12 h-12 object-contain"
//         />
//       </div>

//       {/* Center Text + Button */}
//       <div className="text-center max-w-md">
//         <h2 className="text-[#022C43] text-2xl font-bold mb-3 flex justify-center items-center gap-2">
//           <SparklesIcon size={18} className="text-[#FFD700]" />
//           هل زرت مكانًا مميزًا؟
//           <SparklesIcon size={18} className="text-[#FFD700]" />
//         </h2>
//         <p className="text-[#115173] mb-6 leading-relaxed">
//           شاركنا تجربتك واقترح مكانًا رائعًا ليستمتع به الآخرون<br />في "وين نروح"
//         </p>

//         <Link
//           to="/suggest"
//           className="relative group bg-[#FFD700] text-white font-bold px-8 py-3 rounded-xl overflow-hidden transition-all duration-300 inline-flex items-center gap-2"
//         >
//           <span className="relative z-10 flex items-center gap-2">
//             <StarIcon size={18} className="group-hover:rotate-45 transition-all" />
//             اقترح مكان
//           </span>

//           <div className="absolute inset-0 w-0 bg-[#022C43] group-hover:w-full transition-all duration-300 z-0" />

//           <p className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 text-[#FFD700] flex items-center justify-center transition-opacity duration-300 z-20 m-0">
//             اقترح مكان
//           </p>
//         </Link>
//       </div>

//       {/* Right Images */}
//       <div className="flex flex-col items-center gap-4">
//         <img
//           src="https://i.pinimg.com/736x/b8/41/a9/b841a96c298c0627a8d96a1e689669c6.jpg"
//           alt="Map & Magnifier"
//           className="w-28 h-auto object-contain"
//         />
//         <img
//           src="https://i.pinimg.com/736x/b0/27/2a/b0272ad892f009cb287673a4a8e7bd12.jpg"
//           alt="Binoculars"
//           className="w-28 h-auto object-contain"
//         />
//       </div>
//     </div>
//   );
// }

// background: "url('https://i.pinimg.com/736x/2f/50/7d/2f507d4611eb45dbd2f0ec5cee94e36b.jpg')",
// background: "url('https://i.pinimg.com/736x/03/20/b1/0320b175e8f788883bb717ff8ed57500.jpg')",
// background: "url('https://i.pinimg.com/736x/79/41/92/7941928fc49fbea3cb3d4114798ccace.jpg')",





// import React from "react";
// import { Link } from "react-router-dom";
// import { SparklesIcon, StarIcon, MapPinIcon, PalmtreeIcon } from "lucide-react";

// export default function NewsletterSection() {
//   return (
//     <div 
//       className="relative p-10 rounded-2xl shadow-lg overflow-hidden"
//       style={{
//         background: "url('https://i.pinimg.com/736x/2f/50/7d/2f507d4611eb45dbd2f0ec5cee94e36b.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       {/* التراكب الشفاف لتحسين قراءة النص */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>

//       <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        
//         {/* العناصر الزخرفية اليسرى */}
//         <div className="flex flex-col items-center gap-4"></div>

//         {/* محتوى النص والزر */}
//         <div className="text-center max-w-md py-8">

//           <h2 className="text-white text-3xl font-bold mb-3 flex justify-center items-center gap-2" dir="rtl">
//             هل زرت مكانًا مميزًا؟
//           </h2>

//           <div className="mb-2 flex justify-center">
//             <div className="h-0.5 w-20 bg-yellow-400 rounded-full"></div>
//           </div>

//           <p className="text-white mb-8 leading-relaxed text-lg" dir="rtl">
//             شاركنا تجربتك واقترح مكانًا رائعًا ليستمتع به الآخرون
//             <br />
//             في "وين نروح"
//           </p>

//           {/* زر باستخدام Link */}
//           <Link
//   to="/suggest"
//   className="group relative bg-[#115173]  w-50 hover:bg-yellow-500 text-white font-bold text-base px-6 py-3 rounded-xl overflow-hidden transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
//   dir="rtl"
// >
//   <span className="relative z-10 flex items-center gap-2">
//     <MapPinIcon size={16} className="group-hover:animate-pulse  transition-all" />
//     اقترح مكان
//   </span>
//   <div className="absolute inset-0 w-0 bg-white group-hover:w-full transition-all duration-300 z-0 opacity-20"></div>
// </Link>


//         </div>

//         {/* العناصر الزخرفية اليمنى */}
//         <div className="flex flex-col items-center gap-4"></div>
        
//       </div>
//     </div>
//   );
// }





import React, { useState } from 'react';
import { SparklesIcon, StarIcon, MapPinIcon, PalmtreeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NewsletterArabic = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    alert(`تم تسجيل البريد الإلكتروني: ${email}`);
    setEmail('');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-sm w-full max-w-6xl mx-auto my-20">
   <div className="hidden md:block w-64 h-64 mr-4">
  <img 
  
  src="https://i.pinimg.com/736x/55/a1/98/55a1987d73befaa68d245786bdcbbd73.jpg" 
  // src="https://i.pinimg.com/736x/22/c0/3a/22c03a8808e1ebd7b33b424c9134cbe7.jpg" 
    alt="صورة زخرفية" 
    className="w-full h-full object-cover rounded-lg"
  />
</div>
      
      {/* القسم الأوسط - النص وحقل الإدخال */}
      <div className="flex flex-col items-center flex-1 px-6 mb-4 md:mb-0">
  <div className="text-center w-full mb-4" dir="rtl">
    <h2 className="text-[#022C43] text-2xl font-bold mb-3 text-center flex items-center justify-center gap-2">
      هل زرت مكانًا مميزًا؟
    </h2>

    <p className="text-[#115173] text-center mb-6 leading-relaxed">
      شاركنا تجربتك واقترح مكانًا رائعًا ليستمتع به الآخرون
      <br />
      في "وين نروح"
    </p>
  </div>

  <Link
    to="/suggest"
    className="relative bg-[#FFD700] text-white font-bold px-8 py-3 rounded-xl overflow-hidden group-hover:shadow-xl transition-all duration-300 flex items-center gap-2 no-underline"
    style={{ textDecoration: "none" }}
  >
    <span className="relative z-10 flex items-center gap-2">
      <StarIcon
        size={18}
        className="group-hover:rotate-45 transition-all"
      />
      اقترح مكان
    </span>
  </Link>
</div>

      
      {/* القسم الأيمن - الصورة */}
      <div className="hidden md:block w-64 h-64 mr-4">
  <img 
    // src="https://i.pinimg.com/736x/04/fa/5a/04fa5aa69af8b601c992056390391707.jpg" 
    // src="https://i.pinimg.com/736x/4a/79/f2/4a79f27ba8e183c272896d8a3cadeb64.jpg" 
    src="https://i.pinimg.com/736x/04/fa/5a/04fa5aa69af8b601c992056390391707.jpg" 
    alt="صورة زخرفية" 
    className="w-full h-full object-cover  w-45 h-45 rounded-lg"
  />
</div>
      
    </div>
  );
};

export default NewsletterArabic;