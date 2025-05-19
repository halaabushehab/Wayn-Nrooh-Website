import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import footerBg from '../../src/components/img/3049ce18e2b7550a6196c6b640d0fc81.png';

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
            <a
              href="#"
              className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition relative group"
              title="رابط تويتر سيتوفر قريباً"
            >
              <Twitter size={16} />
              <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                سيتوفر قريباً
              </span>
            </a>
            <a 
              href="#"
              className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition relative group"
              title="رابط فيسبوك سيتوفر قريباً"
            >
              <Facebook size={16} />
              <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                سيتوفر قريباً
              </span>
            </a>
            <a 
              href="#"
              className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition relative group"
              title="رابط إنستغرام سيتوفر قريباً"
            >
              <Instagram size={16} />
              <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                سيتوفر قريباً
              </span>
            </a>
            <a 
              href="#"
              className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition relative group"
              title="رابط لينكدإن سيتوفر قريباً"
            >
              <Linkedin size={16} />
              <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                سيتوفر قريباً
              </span>
            </a>
          </div>
        </div>
      ),
      links: null
    },
    {
      title: "معلومات",
      links: [
        { name: "استعلام عبر الإنترنت", href: "/online-inquiry" },
        { name: "استفسارات عامة", href: "/general-questions" },
        { name: "شروط الحجز", href: "/booking-terms" },
        { name: "سياسة الخصوصية", href: "/privacy-policy" },
        { name: "تواصل معنا  ", href: "/contact" }
      ]
    },
    
    {
      title: "تجارب واقعية",
      links: [
        { name: "فلوغ وسط البلد – عمان", href: "https://www.youtube.com/watch?v=oHdYI93MUks" },
        { name: "قصة طالب زار الأردن", href: "https://uatfnns.com/..." },
        { name: "دليل السياحة في الأردن", href: "https://www.airalo.com/ar/blog/travel-guide-to-jordan" },
        { name: "7 مواقع سياحية بالأردن", href: "https://www.aljazeera.net/travel/..." },
        { name: "رحلة 3 أيام في الأردن", href: "https://www.alkhaleej.ae/..." }
      ]
    }
    ,    
    {
      title: "لديك استفسار؟",
      links: [
        {
          icon: <MapPin size={18} className="text-[#FFD700] mr-2" />,
          name: "نخدم جميع مناطق الأردن",
          href: "#"
        },
        {
          icon: <Phone size={18} className="text-[#FFD700] mr-2" />,
          name: "+962 6 123 4567",
          href: "tel:+96261234567"
        },
        {
          icon: <Mail size={18} className="text-[#FFD700] mr-2" />,
          name: "info@wainrooh.com",
          href: "mailto:info@wainrooh.com"
        }
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
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundPosition: "center"
        }}
      ></div>

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
                        className="flex items-center text-white hover:text-[#FFD700] text-sm no-underline transition"
                      >
                        {link.icon && link.icon}
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-300 pt-6 text-center">
          <p className="text-white text-sm">
            حقوق النشر ©{currentYear} جميع الحقوق محفوظة | تم تصميم هذا القالب بواسطة حلا ابوشهاب
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;