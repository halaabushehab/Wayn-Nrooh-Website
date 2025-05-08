import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function GeneralQuestions() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const toggleQuestion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  const faqs = [
    {
      question: "كيف يمكنني الحجز من خلال الموقع؟",
      answer: "يمكنك تصفح الوجهات المتاحة واختيار النشاط أو المكان الذي ترغب بزيارته، ثم النقر على زر \"احجز الآن\" واتباع التعليمات لإتمام الحجز."
    },
    {
      question: "هل تشمل الأسعار الضرائب والرسوم؟",
      answer: "نعم، جميع الأسعار المعروضة تشمل الضرائب والرسوم، ما لم يُذكر خلاف ذلك في تفاصيل النشاط."
    },
    {
      question: "ما هي طرق الدفع المتاحة؟",
      answer: "نوفر عدة طرق للدفع، بما في ذلك البطاقات الائتمانية، الدفع عبر المحافظ الإلكترونية، والدفع عند الوصول لبعض الأنشطة."
    },
    {
      question: "هل يمكنني تعديل أو إلغاء الحجز بعد إتمامه؟",
      answer: "نعم، يمكنك تعديل أو إلغاء الحجز من خلال حسابك على الموقع، وذلك وفقًا لسياسة الإلغاء الخاصة بالنشاط المحجوز."
    },
    {
      question: "كيف أستفيد من التوصيات الشخصية؟",
      answer: "بعد تسجيل الدخول، يمكنك استخدام ميزة \"اقتراح وجهة\" لتلقي توصيات مخصصة بناءً على اهتماماتك وموقعك الحالي."
    },
    {
      question: "هل يمكنني مشاركة تجربتي أو تقييم الأماكن؟",
      answer: "بالتأكيد! نشجع المستخدمين على مشاركة تجاربهم وتقييم الأماكن التي زاروها لمساعدة الآخرين في اتخاذ قراراتهم."
    },
    {
      question: "هل يتوفر دعم فني في حال واجهت مشكلة؟",
      answer: "نعم، يمكنك التواصل مع فريق الدعم الفني عبر صفحة اتصل بنا، وسنكون سعداء بمساعدتك."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-30 bg-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-right" style={{ color: '#022C43' }}>الأسئلة المتكررة</h1>
        <div className="w-20 h-1 mx-auto mt-2" style={{ backgroundColor: '#FFD700' }}></div>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            style={{ borderColor: expandedIndex === index ? '#FFD700' : '#e5e7eb' }}
          >
            <button
              className="w-full text-right p-4 flex items-center justify-between focus:outline-none"
              onClick={() => toggleQuestion(index)}
              style={{ backgroundColor: expandedIndex === index ? '#f8f9ff' : 'white' }}
            >
              <div className="flex-shrink-0 ml-3">
                {expandedIndex === index ? (
                  <ChevronUp size={20} style={{ color: '#022C43' }} />
                ) : (
                  <ChevronDown size={20} style={{ color: '#022C43' }} />
                )}
              </div>
              <span className="font-semibold text-lg flex-grow" style={{ color: '#022C43' }}>
                {faq.question}
              </span>
            </button>
            
            {expandedIndex === index && (
              <div className="p-4 pt-0 text-right bg-white">
                <p className="text-gray-600">{faq.answer}</p>
                {index === 6 && (
                  <div className="mt-2">
                    <a 
                      href="/contact" 
                      className="inline-block font-medium underline"
                      style={{ color: '#FFD700' }}
                    >
                      اتصل بنا
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GeneralQuestions;




// import React from 'react';

// function GeneralQuestions() {
//   return (
//     <div className="max-w-3xl mx-auto px-4 py-30 text-right bg-white">
//       <h1 className="text-3xl font-bold text-[#022C43] mb-6 border-b-2 border-[#FFD700] pb-2">
//         الأسئلة المتكررة
//       </h1>

//       <div className="space-y-6">
//         {faqItems.map((item, index) => (
//           <div key={index} className="group">
//             <div className="flex items-start gap-4">
//               <div className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mt-1 flex-shrink-0 font-bold">
//                 {index + 1}
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-[#115173] group-hover:text-[#022C43] transition-colors">
//                   {item.question}
//                 </h3>
//                 <p className="mt-2 text-[#555] leading-relaxed">
//                   {item.answer}
//                 </p>
//               </div>
//             </div>
//             {index !== faqItems.length - 1 && (
//               <div className="h-px bg-gradient-to-r from-transparent via-[#FFD700] to-transparent my-4"></div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// const faqItems = [
//   {
//     question: "كيف يمكنني الحجز من خلال الموقع؟",
//     answer: "يمكنك تصفح الوجهات المتاحة واختيار النشاط أو المكان الذي ترغب بزيارته، ثم النقر على زر 'احجز الآن' واتباع التعليمات لإتمام الحجز."
//   },
//   {
//     question: "هل تشمل الأسعار الضرائب والرسوم؟",
//     answer: "نعم، جميع الأسعار المعروضة تشمل الضرائب والرسوم، ما لم يُذكر خلاف ذلك في تفاصيل النشاط."
//   },
//   {
//     question: "ما هي طرق الدفع المتاحة؟",
//     answer: "نوفر عدة طرق للدفع، بما في ذلك البطاقات الائتمانية، الدفع عبر المحافظ الإلكترونية، والدفع عند الوصول لبعض الأنشطة."
//   },
//   {
//     question: "هل يمكنني تعديل أو إلغاء الحجز بعد إتمامه؟",
//     answer: "نعم، يمكنك تعديل أو إلغاء الحجز من خلال حسابك على الموقع، وذلك وفقًا لسياسة الإلغاء الخاصة بالنشاط المحجوز."
//   },
//   {
//     question: "كيف أستفيد من التوصيات الشخصية؟",
//     answer: "بعد تسجيل الدخول، يمكنك استخدام ميزة 'اقتراح وجهة' لتلقي توصيات مخصصة بناءً على اهتماماتك وموقعك الحالي."
//   },
//   {
//     question: "هل يمكنني مشاركة تجربتي أو تقييم الأماكن؟",
//     answer: "بالتأكيد! نشجع المستخدمين على مشاركة تجاربهم وتقييم الأماكن التي زاروها لمساعدة الآخرين في اتخاذ قراراتهم."
//   },
//   {
//     question: "هل يتوفر دعم فني في حال واجهت مشكلة؟",
//     answer: (
//       <>
//         نعم، يمكنك التواصل مع فريق الدعم الفني عبر صفحة{' '}
//         <a href="/contact" className="text-[#115173] hover:text-[#FFD700] font-medium underline transition-colors">
//           اتصل بنا
//         </a>
//         ، وسنكون سعداء بمساعدتك.
//       </>
//     )
//   }
// ];

// export default GeneralQuestions;