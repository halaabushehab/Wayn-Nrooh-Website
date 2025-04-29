import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import {Link} from "react-router-dom"
import { color } from "framer-motion";
import footerBg from '../../src/components/img/3049ce18e2b7550a6196c6b640d0fc81.png'; // عدّل المسار حسب مكان الصورة

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "من نحن",
      content: (
        <div className="mb-4 md:mb-0">
          <p className="text-white text-sm mb-4">
            اكتشف كنوز الأردن المخفية. نحن نساعدك على استكشاف أفضل الوجهات السياحية في الأردن وتخطيط رحلاتك بسهولة، من عمان إلى البحر الأحمر ومدينة البتراء.
          </p>
          <div className="flex gap-3 mt-4">
            {/* أيقونات السوشال ميديا مع تناسق بحجم موحد */}
            <a href="#" className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
              <Twitter size={16} />
            </a>
            <a href="#" className="w-8 h-8  bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-8 h-8  bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      ),
      links: null
    },
    {
      title: "معلومات",
      links: [
        { name: "استعلام عبر الإنترنت", href: "#" },
        { name: "استفسارات عامة", href: "#" },
        { name: "شروط الحجز", href: "#" },
        { name: "سياسة الخصوصية", href: "#" },
        { name: "سياسة الاسترداد", href: "#" },
        { name: "اتصل بنا", href: "#" }
      ]
    },
    {
      title: "التجارب",
      links: [
        { name: "المغامرات", href: "#" },
        { name: "الفنادق والمطاعم", href: "#" },
        { name: "الشاطئ", href: "#" },
        { name: "الطبيعة", href: "#" },
        { name: "التخييم", href: "#" },
        { name: "الفعاليات", href: "#" }
      ]
    },
    {
      title: "لديك استفسار؟",
      links: [
        { icon: <MapPin size={18} className="text-[#FFD700]" />, name: "عمان، الأردن، شارع الاستقلال", href: "#" },
        { icon: <Phone size={18} className="text-[#FFD700]" />, name: "+962 6 123 4567", href: "tel:+96261234567" },
        { icon: <Mail size={18} className="text-[#FFD700]" />, name: "info@wainrooh.com", href: "mailto:info@wainrooh.com" }
      ]
    }
  ];

  return (
<footer
  className="relative pt-12 pb-8 bg-[#022C43] bg-blend-overlay bg-cover bg-center bg-no-repeat overflow-hidden"
  style={{
    fontFamily: "Cairo, sans-serif",
    direction: "rtl",
    backgroundColor: "#022C43",
  }}
>
      {/* خلفية */}
  {/* صورة تزيين في الأسفل */}
  <div
  className="absolute bottom-0 left-0 w-full h-100 bg-no-repeat bg-cover opacity-30 pointer-events-none z-0"
  style={{
    backgroundImage: `url(${footerBg})`,
    backgroundPosition: "center  px" // ← نزّل الصورة 30px لتحت داخل العنصر
  }}
></div>
      {/* محتوى الفوتر */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {footerLinks.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-lg font-extrabold mb-4 text-white">
                {section.title}
              </h3>
              
              {section.content}
              
              {section.links && (
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.href}
                        className="flex items-center gap-2 text-white hover:text-[#FFD700] text-sm no-underline transition"

                      >
                        {link.icon && <span>{link.icon}</span>}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* حقوق النشر */}
        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-white text-sm">
            حقوق النشر ©{currentYear} جميع الحقوق محفوظة | تم تصميم هذا القالب بواسطة  حلا ابوشهاب
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
