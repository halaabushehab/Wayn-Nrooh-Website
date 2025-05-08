import React from 'react';

function BookingTerms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-30 bg-white text-right" dir="rtl">
      <div className=" rounded-lg p-6 mb-8 shadow-lg">
        <h1 className="text-3xl font-bold text-[#FFD700] mb-2">شروط وأحكام الحجز</h1>
        <p className="text-lg text-[#FFD700]">
          نحرص في "وين نروح" على تقديم تجربة حجز سهلة وآمنة لجميع المستخدمين
        </p>
      </div>
      
      <div className="border-l-4 border-[#115173] pl-4 mb-6">
        <p className="text-lg text-gray-700">
          يرجى قراءة الشروط التالية بعناية قبل إتمام الحجز:
        </p>
      </div>
      
      <ul className="space-y-4">
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">1</span>
          <div>
            <h3 className="font-bold text-[#115173]">تأكيد الحجز</h3>
            <p className="text-gray-700">يجب تأكيد الحجز قبل 48 ساعة على الأقل من الموعد المحدد للزيارة.</p>
          </div>
        </li>
        
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">2</span>
          <div>
            <h3 className="font-bold text-[#115173]">الدفع المسبق</h3>
            <p className="text-gray-700">يتطلب إتمام الحجز دفعًا مسبقًا لتأكيد الحجز وضمان توفر الخدمة.</p>
          </div>
        </li>
        
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">3</span>
          <div>
            <h3 className="font-bold text-[#115173]">سياسة الإلغاء</h3>
            <p className="text-gray-700">في حال الإلغاء قبل 24 ساعة من الموعد، يتم استرداد المبلغ المدفوع. أما في حال الإلغاء خلال أقل من 24 ساعة، فلا يمكن استرداد المبلغ.</p>
          </div>
        </li>
        
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">4</span>
          <div>
            <h3 className="font-bold text-[#115173]">تعديل الحجز</h3>
            <p className="text-gray-700">يمكن تعديل تفاصيل الحجز (مثل التاريخ أو عدد الأشخاص) قبل 24 ساعة من الموعد المحدد، وذلك حسب توفر الخدمة.</p>
          </div>
        </li>
        
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">5</span>
          <div>
            <h3 className="font-bold text-[#115173]">الوصول في الوقت المحدد</h3>
            <p className="text-gray-700">يُرجى الالتزام بالوصول في الوقت المحدد للحجز. قد يؤدي التأخير إلى إلغاء الحجز دون استرداد المبلغ.</p>
          </div>
        </li>
        
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">6</span>
          <div>
            <h3 className="font-bold text-[#115173]">المسؤولية</h3>
            <p className="text-gray-700">"وين نروح" ليست مسؤولة عن أي تغييرات أو إلغاءات من قبل مقدمي الخدمات. سيتم إخطار المستخدمين بأي تغييرات في أقرب وقت ممكن.</p>
          </div>
        </li>
        
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">7</span>
          <div>
            <h3 className="font-bold text-[#115173]">الأسعار</h3>
            <p className="text-gray-700">الأسعار المعروضة تشمل الضرائب والرسوم، ما لم يُذكر خلاف ذلك.</p>
          </div>
        </li>
        
        <li className="flex items-start">
          <span className="bg-[#FFD700] text-[#022C43] rounded-full w-6 h-6 flex items-center justify-center mt-1 ml-2 flex-shrink-0">8</span>
          <div>
            <h3 className="font-bold text-[#115173]">التواصل</h3>
            <p className="text-gray-700">في حال وجود أي استفسارات أو مشكلات، يُرجى التواصل مع فريق الدعم عبر صفحة <a href="/contact" className="text-[#115173] underline font-medium">اتصل بنا</a>.</p>
          </div>
        </li>
      </ul>
      
      <div className="mt-8 p-4 bg-[#F8F9FA] border border-[#DEE2E6] rounded-lg">
        <p className="text-sm text-gray-600">
          * قد تختلف الشروط والأحكام حسب نوع الخدمة أو الوجهة. يُرجى مراجعة التفاصيل الخاصة بكل حجز قبل الإتمام.
        </p>
      </div>
    </div>
  );
}

export default BookingTerms;