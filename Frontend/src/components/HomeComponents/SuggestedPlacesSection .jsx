import { useState } from 'react';
import { StarIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NewsletterArabic = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    alert(`تم تسجيل البريد الإلكتروني: ${email}`);
    setEmail('');
  };

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto my-20"
      style={{ backgroundColor: '#ffffff' }} // خلفية بيضاء واضحة
    >
      <div className="hidden md:block w-64 h-64 mr-4">
        <img 
          src="https://i.pinimg.com/736x/55/a1/98/55a1987d73befaa68d245786bdcbbd73.jpg" 
          alt="صورة زخرفية" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* القسم الأوسط - النص وزر الإقتراح */}
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
      
      {/* القسم الأيمن - صورة زخرفية */}
      <div className="hidden md:block w-64 h-64 mr-4">
        <img 
          src="https://i.pinimg.com/736x/04/fa/5a/04fa5aa69af8b601c992056390391707.jpg" 
          alt="صورة زخرفية" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default NewsletterArabic;
