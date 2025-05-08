import React from 'react';

function ContactInfo() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-right bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#115173] mb-2 border-b-2 border-[#FFD700] pb-2 inline-block">
          معلومات التواصل
        </h1>
        <p className="text-lg text-[#022C43] mt-4 leading-relaxed">
          إذا كان لديك أي استفسار يتعلق بخدماتنا السياحية، يُرجى استخدام معلومات التواصل التالية.
          نحن نعمل جاهدين للرد على جميع الرسائل بأسرع وقت ممكن.
        </p>
      </div>

      <div className="space-y-4 text-[#022C43]">
        <p><strong>📞 الهاتف:</strong> +966 12 345 6789</p>
        <p><strong>📧 البريد الإلكتروني:</strong> info@travelagency.com</p>
        <p><strong>🕒 أوقات العمل:</strong> من الأحد إلى الخميس، من الساعة 9 صباحًا حتى 5 مساءً</p>
        <p><strong>📍 العنوان:</strong> شارع السياحة، الرياض، المملكة العربية السعودية</p>
      </div>

      <div className="mt-12 pt-6 border-t border-[#FFD700]">
        <p className="text-[#115173] text-sm">
          لمزيد من المعلومات أو الدعم، يُرجى متابعتنا على منصات التواصل الاجتماعي أو زيارتنا في مقرنا الرسمي.
        </p>
      </div>
    </div>
  );
}

export default ContactInfo;