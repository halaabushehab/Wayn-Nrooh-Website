// import React from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Footer = () => {
//   return (
    
//         <footer className="bg-light text-dark pt-5 pb-3" style={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}>
//           <div className="container">
//             <div className="row text-right">
//               {/* عن الموقع */}
//               <div className="col-lg-3 col-md-6 mb-4">
//                 <h5 className="fw-bold mb-3">عن "وين نروح"</h5>
//                 <p className="text-muted">
//                   استكشف أفضل الوجهات السياحية في الأردن. نحن نساعدك على اكتشاف أماكن مذهلة وتخطيط رحلاتك بسهولة، من عمان إلى البحر الأحمر ومدينة البتراء.
//                 </p>
//                 {/* الأيقونات الاجتماعية */}
//                 <div className="d-flex gap-2">
//                   <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
//                   <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
//                   <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
//                   <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
//                 </div>
//               </div>
    
//               {/* الصفحات */}
//               <div className="col-lg-3 col-md-6 mb-4">
//                 <h5 className="fw-bold mb-3">الصفحات</h5>
//                 <ul className="list-unstyled">
//                   <li><a href="#" className="footer-link">المدن</a></li>
//                   <li><a href="#" className="footer-link">دليلك المثالي للسفر</a></li>
//                   <li><a href="#" className="footer-link">اتصل بنا</a></li>
//                 </ul>
//               </div>
    
//               {/* الموارد */}
//               <div className="col-lg-3 col-md-6 mb-4">
//                 <h5 className="fw-bold mb-3">الموارد</h5>
//                 <ul className="list-unstyled">
//                   <li><a href="#" className="footer-link">دليل السياحة في الأردن</a></li>
//                   <li><a href="#" className="footer-link">أفضل الوجهات</a></li>
//                   <li><a href="#" className="footer-link">مقالات سياحية</a></li>
//                 </ul>
//               </div>
    
//               {/* تواصل معنا */}
//               <div className="col-lg-3 col-md-6 mb-4">
//                 <h5 className="fw-bold mb-3">تواصل معنا</h5>
//                 <ul className="list-unstyled">
//                   <li><i className="fas fa-envelope text-primary"></i> <a href="mailto:info@wainrooh.com" className="footer-link">info@wainrooh.com</a></li>
//                   <li><i className="fas fa-phone text-primary"></i> <a href="#" className="footer-link">+962 6 123 4567</a></li>
//                   <li><i className="fas fa-map-marker-alt text-primary"></i> <a href="#" className="footer-link">عمان، الأردن</a></li>
//                 </ul>
//               </div>
//             </div>
//           </div>
    
//           {/* حقوق النشر */}
//           <div className="text-center text-muted mt-3">
//             <p className="mb-0">
//               جميع الحقوق محفوظة &copy; 2025. تم التصميم بحب بواسطة <strong className="text-dark">وين نروح</strong> وتنفيذ <strong className="text-dark">Hala abushehab</strong>.
//             </p>
//           </div>
    
//           {/* إضافة كود CSS داخل JSX */}
//           <style>
//             {`
//               body {
//                 font-family: 'Cairo', sans-serif;
//               }
    
//               .footer-link {
//                 text-decoration: none;
//                 color: #333;
//                 transition: color 0.3s ease-in-out;
//               }
              
//               .footer-link:hover {
//                 color: #f0ad4e;
//               }
    
//               .social-icon {
//                 display: inline-flex;
//                 align-items: center;
//                 justify-content: center;
//                 width: 40px;
//                 height: 40px;
//                 border-radius: 50%;
//                 background-color: #333;
//                 color: white;
//                 font-size: 18px;
//                 transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
//                 text-decoration: none;
//               }
    
//               .social-icon:hover {
//                 background-color: #f0ad4e;
//                 color: white;
//               }
    
//               ul.list-unstyled {
//                 padding: 0;
//               }
    
//               ul.list-unstyled li {
//                 margin-bottom: 8px;
//               }
//             `}
//           </style>
//         </footer>
      
    
    
    
//   );
// };

// export default Footer;




import { motion } from "framer-motion"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    {
      title: "",
      content: (
        <div className="mb-4 md:mb-0">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl font-bold"
          >
            <span className="text-[#FFD700]">وين</span> نروح
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-300 text-sm"
          >
            اكتشف كنوز الأردن المخفية
          </motion.p>
        </div>
      ),
      description: "استكشف أفضل الوجهات السياحية في الأردن. نحن نساعدك على اكتشاف أماكن مذهلة وتخطيط رحلاتك بسهولة، من عمان إلى البحر الأحمر ومدينة البتراء.",
      links: null
    },
    {
      title: "الصفحات",
      links: [
        { name: "المدن", href: "#" },
        { name: "دليلك المثالي للسفر", href: "#" },
        { name: "اتصل بنا", href: "#" }
      ]
    },
    {
      title: "الموارد",
      links: [
        { name: "دليل السياحة في الأردن", href: "#" },
        { name: "أفضل الوجهات", href: "#" },
        { name: "مقالات سياحية", href: "#" }
      ]
    },
    {
      title: "تواصل معنا",
      links: [
        { icon: <Mail size={16} />, name: "info@wainrooh.com", href: "mailto:info@wainrooh.com" },
        { icon: <Phone size={16} />, name: "+962 6 123 4567", href: "tel:+96261234567" },
        { icon: <MapPin size={16} />, name: "عمان، الأردن", href: "#" }
      ]
    }
  ]

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#" },
    { icon: <Instagram size={20} />, href: "#" },
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" }
  ]

  return (
    <footer 
      className="bg-[#022C43] text-white pt-12 pb-6"
      style={{ fontFamily: "Cairo, sans-serif", direction: "rtl" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h3 className="text-xl font-bold mb-4 text-[#FFD700]">{section.title}</h3>
              
              {section.content && section.content}
              
              {section.description && (
                <p className="text-gray-300 mb-4">{section.description}</p>
              )}
              
              {section.links && (
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        whileHover={{ x: -5, color: "#FFD700" }}
                        transition={{ duration: 0.2 }}
                        href={link.href}
                        className="flex items-center gap-2 text-gray-300 hover:text-[#FFD700]"
                      >
                        {link.icon && <span className="text-[#FFD700]">{link.icon}</span>}
                        {link.name}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              )}
              
              {index === 0 && (
                <div className="flex gap-4 mt-4">
                  {socialLinks.map((social, socialIndex) => (
                    <motion.a
                      key={socialIndex}
                      whileHover={{ y: -5, scale: 1.1, color: "#FFD700" }}
                      transition={{ duration: 0.2 }}
                      href={social.href}
                      className="text-white hover:text-[#FFD700]"
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-[#115173] pt-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            © {currentYear} وين نروح. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer