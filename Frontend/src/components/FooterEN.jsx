import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import footerBg from "../../src/components/img/3049ce18e2b7550a6196c6b640d0fc81.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "About Us",
      content: (
        <div className="mb-4 md:mb-0">
          <p className="text-white text-sm mb-4">
            Discover Jordan's hidden gems. We help you explore the best tourist destinations across Jordan and plan your trips easily — from Amman to the Red Sea and Petra.
          </p>
          <div className="flex gap-3 mt-4">
            {[
              { icon: <Twitter size={16} />, title: "Twitter link coming soon" },
              { icon: <Facebook size={16} />, title: "Facebook link coming soon" },
              { icon: <Instagram size={16} />, title: "Instagram link coming soon" },
              { icon: <Linkedin size={16} />, title: "LinkedIn link coming soon" },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 bg-[#FFD700] rounded-full flex items-center justify-center text-white hover:bg-red-600 transition relative group"
                title={item.title}
              >
                {item.icon}
                <span className="absolute -top-8 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  Coming Soon
                </span>
              </a>
            ))}
          </div>
        </div>
      ),
      links: null,
    },
    {
      title: "Information",
      links: [
        { name: "Online Inquiry", href: "/online-inquiry" },
        { name: "General Questions", href: "/general-questions" },
        { name: "Booking Terms", href: "/booking-terms" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Real Experiences",
      links: [
        {
          name: "Downtown Amman Vlog",
          href: "https://www.youtube.com/watch?v=oHdYI93MUks",
        },
        {
          name: "Student's Visit Story",
          href: "https://uatfnns.com/...",
        },
        {
          name: "Jordan Travel Guide",
          href: "https://www.airalo.com/ar/blog/travel-guide-to-jordan",
        },
        {
          name: "Top 7 Tourist Sites in Jordan",
          href: "https://www.aljazeera.net/travel/...",
        },
        {
          name: "3-Day Trip in Jordan",
          href: "https://www.alkhaleej.ae/...",
        },
      ],
    },
    {
      title: "Need Help?",
      links: [
        {
          icon: <MapPin size={18} className="text-[#FFD700] mr-2" />,
          name: "Serving All Areas of Jordan",
          href: "#",
        },
        {
          icon: <Phone size={18} className="text-[#FFD700] mr-2" />,
          name: "+962 6 123 4567",
          href: "tel:+96261234567",
        },
        {
          icon: <Mail size={18} className="text-[#FFD700] mr-2" />,
          name: "info@wainrooh.com",
          href: "mailto:info@wainrooh.com",
        },
      ],
    },
  ];

  return (
    <footer
      className="relative pt-12 pb-8 bg-[#022C43] bg-blend-overlay bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        fontFamily: "Cairo, sans-serif",
        direction: "ltr",
        backgroundColor: "#022C43",
      }}
    >
      <div
        className="absolute bottom-0 left-0 w-full h-full bg-no-repeat bg-cover opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundPosition: "center",
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
            © {currentYear} All rights reserved | Template designed by Hala Abu Shehab
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
