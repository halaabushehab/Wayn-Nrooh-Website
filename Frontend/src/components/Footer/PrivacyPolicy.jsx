// 


import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen" dir="rtl">
      {/* Header Banner */}
      <div className="bg-[#022C43] py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-[#FFD700] text-2xl font-bold">وين نروح</h1>
          <div className="flex space-x-4 space-x-reverse">
            <button className="text-white hover:text-[#FFD700] transition">الرئيسية</button>
            <button className="text-white hover:text-[#FFD700] transition">الوجهات</button>
            <button className="text-white hover:text-[#FFD700] transition">اتصل بنا</button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="border-r-4 border-[#FFD700] pr-4 mb-8">
            <h1 className="text-4xl font-bold text-[#022C43]">سياسة الخصوصية</h1>
            <p className="text-gray-500 mt-2">آخر تحديث: مايو 2025</p>
          </div>

          <p className="text-[#444444] leading-relaxed mb-8">
            في "وين نروح"، نلتزم بحماية خصوصيتك وضمان سرية معلوماتك الشخصية. تهدف هذه السياسة إلى توضيح كيفية جمعنا واستخدامنا وحمايتنا لبياناتك عند استخدامك لمنصتنا.
          </p>

          <div className="space-y-8">
            {/* Section 1 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
                المعلومات التي نجمعها
              </h2>
              <ul className="list-disc pr-8 text-[#444444] space-y-2">
                <li>الاسم الكامل</li>
                <li>البريد الإلكتروني</li>
                <li>رقم الهاتف</li>
                <li>معلومات الموقع الجغرافي (بناءً على إذنك)</li>
                <li>سجل التصفح والتفاعلات مع المنصة</li>
                <li>بيانات الحجز والتفضيلات</li>
                <li>معلومات الدفع (عند إجراء عمليات حجز مدفوعة)</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
                كيفية استخدام المعلومات
              </h2>
              <p className="text-[#444444] mb-4">
                نستخدم بياناتك الشخصية للأغراض التالية:
              </p>
              <ul className="list-disc pr-8 text-[#444444] space-y-2">
                <li>معالجة الحجوزات وتأكيدها</li>
                <li>تحسين تجربة المستخدم وتخصيص المحتوى</li>
                <li>إرسال إشعارات وتنبيهات متعلقة بالحجوزات</li>
                <li>الرد على الاستفسارات والدعم الفني</li>
                <li>تحليل البيانات لتحسين خدماتنا</li>
                <li>إرسال عروض ترويجية (بناءً على موافقتك المسبقة)</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">3</span>
                مشاركة المعلومات
              </h2>
              <p className="text-[#444444] mb-4">
                لا نقوم ببيع أو تأجير معلوماتك الشخصية لأي طرف ثالث. قد نشارك بياناتك مع:
              </p>
              <ul className="list-disc pr-8 text-[#444444] space-y-2">
                <li>شركاء الخدمة (مثل مقدمي خدمات الحجز)</li>
                <li>الجهات الحكومية أو القانونية عند الطلب وبما يتوافق مع القوانين المعمول بها</li>
                <li>مقدمي الخدمات التقنية (مثل خدمات البريد الإلكتروني والتحليلات) مع الالتزام بسياسات الخصوصية المناسبة</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">4</span>
                حماية البيانات
              </h2>
              <p className="text-[#444444] mb-4">
                نتخذ إجراءات أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الكشف أو التدمير. تشمل هذه الإجراءات:
              </p>
              <ul className="list-disc pr-8 text-[#444444] space-y-2">
                <li>تشفير البيانات أثناء النقل والتخزين</li>
                <li>استخدام جدران حماية وأنظمة كشف التسلل</li>
                <li>مراجعة دورية لإجراءات الأمان والتحديثات</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">5</span>
                ملفات تعريف الارتباط (Cookies)
              </h2>
              <p className="text-[#444444] leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع، مثل تذكر تفضيلاتك وتحليل استخدام الموقع. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال إعدادات متصفحك.
              </p>
            </div>

            {/* Section 6 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">6</span>
                حقوقك
              </h2>
              <p className="text-[#444444] mb-4">
                وفقًا للتشريعات المعمول بها، يحق لك:
              </p>
              <ul className="list-disc pr-8 text-[#444444] space-y-2">
                <li>الوصول إلى بياناتك الشخصية</li>
                <li>طلب تصحيح أو تحديث بياناتك</li>
                <li>طلب حذف بياناتك</li>
                <li>الاعتراض على معالجة بياناتك لأغراض معينة</li>
                <li>سحب موافقتك في أي وقت</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">7</span>
                التغييرات على سياسة الخصوصية
              </h2>
              <p className="text-[#444444] leading-relaxed">
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة مع تحديث تاريخ السريان.
              </p>
            </div>

            {/* Section 8 */}
            <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-[#022C43] mb-4 flex items-center">
                <span className="bg-[#FFD700] text-[#022C43] rounded-full w-8 h-8 flex items-center justify-center mr-2">8</span>
                الاتصال بنا
              </h2>
              <p className="text-[#444444]">
                إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يرجى التواصل معنا عبر البريد الإلكتروني:
              </p>
              <a href="mailto:privacy@wainnrouh.com" className="inline-block mt-2 text-white bg-[#022C43] hover:bg-[#033e5e] px-6 py-2 rounded-md transition">
                privacy@wainnrouh.com
              </a>
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
}

export default PrivacyPolicy;