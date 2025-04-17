
// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
// import logo from "./img/Screenshot 2025-01-24 235121.png";
// import FormRegistration from "../components/FormRegistration";
// import Swal from "sweetalert2";
// import axios from "axios";

// const Navbar = () => {
//   const [isFormOpen, setFormOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isCitiesOpen, setIsCitiesOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const citiesDropdownRef = useRef(null);
//   const userDropdownRef = useRef(null);
//   const navigate = useNavigate();





//   // تحميل بيانات المستخدم عند التحميل
//   useEffect(() => {
//     const loadUserData = () => {
//       const token = localStorage.getItem("token");
//       const username = localStorage.getItem("username");
//       const userId = localStorage.getItem("userId");
//       const isAdmin = localStorage.getItem("isAdmin") === "true";

//       if (token && username && userId) {
//         setUser({
//           username,
//           userId,
//           isAdmin
//         });
//       }
//     };

//     loadUserData();
//   }, []);

//   const handleLoginSuccess = (userData) => {
//     console.log("تم تسجيل الدخول بنجاح", userData);
    
//     // 1. أغلق النموذج أولاً
//     setFormOpen(false);
  
//     // 2. ثم حدث حالة المستخدم
//     setUser({
//       username: userData.username,
//       userId: userData.userId,
//       isAdmin: userData.isAdmin,
//     });
  
//     // 3. (اختياري) أظهر رسالة نجاح
//     Swal.fire({
//       title: `مرحباً ${userData.username}!`,
//       text: "تم تسجيل الدخول بنجاح",
//       icon: "success",
//       confirmButtonColor: "#022C43",
//       background: "#022C43",
//       color: "#FFD700",
//     });
//   };
//   // إغلاق القوائم المنسدلة عند النقر خارجها
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (citiesDropdownRef.current && !citiesDropdownRef.current.contains(event.target)) {
//         setIsCitiesOpen(false);
//       }
//       if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
//         setIsUserMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // تأثير التمرير مع تحسين الأداء
//   useEffect(() => {
//     let ticking = false;
    
//     const handleScroll = () => {
//       if (!ticking) {
//         window.requestAnimationFrame(() => {
//           setIsScrolled(window.scrollY > 50);
//           ticking = false;
//         });
//         ticking = true;
//       }
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     Swal.fire({
//       title: "تأكيد تسجيل الخروج",
//       text: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#022C43",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "نعم، سجل خروج",
//       cancelButtonText: "إلغاء",
//       background: "#022C43",
//       color: "#FFD700",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userId");
//         localStorage.removeItem("username");
//         localStorage.removeItem("isAdmin");
//         setUser(null);
//         navigate("/");
//       }
//     });
//   };


//   return (
//     <>
//       {/* Header */}
//       <header
//         dir="rtl"
//         className={`fixed top-0 w-full z-50 transition-all duration-300 shadow-md ${
//           isScrolled ? "bg-[#022C43]/90 backdrop-blur-sm" : "bg-[#022C43]"
//         }`}
//       >
//         <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img className="h-10 md:h-12 w-auto" src={logo} alt="Logo" />
//           </Link>

//           {/* Mobile Menu Button */}
//           <button 
//             className="lg:hidden text-white p-2"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
//           </button>

//           {/* Navigation Links */}
//           <nav
//             className={`lg:flex items-center gap-6 text-white text-lg ${
//               menuOpen
//                 ? "fixed top-16 right-0 w-full bg-[#022C43] p-6 shadow-lg flex flex-col"
//                 : "hidden"
//             }`}
//           >
//             <Link 
//               className="hover:text-[#FFD700] transition py-2" 
//               to="/"
//               onClick={() => setMenuOpen(false)}
//             >
//               الرئيسية
//             </Link>
            
//             {/* Cities Dropdown */}
//             <div className="relative" ref={citiesDropdownRef}>
//               <button 
//                 onClick={() => setIsCitiesOpen(!isCitiesOpen)} 
//                 className="hover:text-[#FFD700] flex items-center py-2"
//               >
//                 المدن <ChevronDown className={`ml-1 transition-transform ${isCitiesOpen ? "rotate-180" : ""}`} />
//               </button>
//               <div 
//                 className={`absolute right-0 mt-2 w-48 bg-[#115173] rounded-md shadow-lg overflow-hidden ${
//                   isCitiesOpen ? "block" : "hidden"
//                 }`}
//               >
//                 <Link 
//                   className="block px-4 py-2 text-white hover:bg-[#0d3a5a]" 
//                   to="/places?city=عمان"
//                   onClick={() => {
//                     setIsCitiesOpen(false);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   عمان
//                 </Link>
//                 <Link 
//                   className="block px-4 py-2 text-white hover:bg-[#0d3a5a]" 
//                   to="/places?city=الزرقاء"
//                   onClick={() => {
//                     setIsCitiesOpen(false);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   الزرقاء
//                 </Link>
//                 <Link 
//                   className="block px-4 py-2 text-white hover:bg-[#0d3a5a]" 
//                   to="/places?city=إربد"
//                   onClick={() => {
//                     setIsCitiesOpen(false);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   إربد
//                 </Link>
//               </div>
//             </div>

//             <Link 
//               className="hover:text-[#FFD700] transition py-2" 
//               to="/article"
//               onClick={() => setMenuOpen(false)}
//             >
//               المدونات
//             </Link>
//             <Link 
//               className="hover:text-[#FFD700] transition py-2" 
//               to="/About"
//               onClick={() => setMenuOpen(false)}
//             >
//               من نحن
//             </Link>
//             <Link 
//               className="hover:text-[#FFD700] transition py-2" 
//               to="/contact"
//               onClick={() => setMenuOpen(false)}
//             >
//               تواصل معنا
//             </Link>
//           </nav>

//           {/* User Actions */}
//           <div className="hidden lg:flex items-center gap-4">
//             {user ? (
//               <div className="relative" ref={userDropdownRef}>
//                 <button
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   className="flex items-center gap-2 px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#0d3a5a] transition-colors"
//                   aria-label="User menu"
//                 >
//                   <FaUser className="text-[#FFD700]" />
//                   <span>{user.username}</span>
//                   <ChevronDown className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
//                 </button>

//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-[#115173] rounded-md shadow-lg z-50 overflow-hidden">
//                     {user.isAdmin && (
//                       <Link
//                         to="/AdminDash"
//                         className="flex items-center px-4 py-3 text-white hover:bg-[#0d3a5a] transition-colors"
//                         onClick={() => setIsUserMenuOpen(false)}
//                       >
//                         <FaCog className="ml-2" />
//                         لوحة التحكم
//                       </Link>
//                     )}
//                     <Link
//                       to={user.isAdmin ? "/AdminDash" : `/ProfilePage/${user.userId}`}
//                       className="flex items-center px-4 py-3 text-white hover:bg-[#0d3a5a] transition-colors"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     >
//                       <FaUser className="ml-2" />
//                       {user.isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
//                     </Link>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-[#0d3a5a] transition-colors text-right"
//                     >
//                       <FaSignOutAlt className="ml-2" />
//                       تسجيل الخروج
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button
//                 onClick={() => setFormOpen(true)}
//                 className="px-4 py-2 bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700]/10 transition-colors"
//               >
//                 تسجيل الدخول
//               </button>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Login Form Modal */}
//       {isFormOpen && (
//         <div className="fixed inset-0 z-50">
//           {/* Overlay with blur effect */}
//           <div 
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setFormOpen(false)}
//           />
          
//           {/* Form Container */}
//           <div className="relative flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-lg w-full max-w-md z-50">
//               <FormRegistration 
//                 onClose={() => setFormOpen(false)} 
//                 onLogin={handleLoginSuccess}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// const ChevronDown = ({ className, ...props }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 20 20"
//     fill="currentColor"
//     className={`w-5 h-5 ${className}`}
//     {...props}
//   >
//     <path
//       fillRule="evenodd"
//       d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
//       clipRule="evenodd"
//     />
//   </svg>
// );

// export default Navbar;






import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import logo from "./img/Screenshot 2025-01-24 235121.png";
import FormRegistration from "../components/FormRegistration";
import Swal from "sweetalert2";
import axios from "axios";

const Navbar = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCitiesOpen, setIsCitiesOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const citiesDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();





  // تحميل بيانات المستخدم عند التحميل
  useEffect(() => {
    const loadUserData = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");
      const isAdmin = localStorage.getItem("isAdmin") === "true";

      if (token && username && userId) {
        setUser({
          username,
          userId,
          isAdmin
        });
      }
    };

    loadUserData();
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log("تم تسجيل الدخول بنجاح", userData);
    
    // 1. أغلق النموذج أولاً
    setFormOpen(false);
    
    // 2. حدث حالة المستخدم
    setUser({
      username: userData.username,
      userId: userData.userId,
      isAdmin: userData.isAdmin,
    });
    
    // 3. أعد التوجيه إلى الصفحة الرئيسية مع إعادة تحميل لضمان التحديث
    navigate('/', { replace: true });
    
    // 4. (اختياري) أظهر رسالة نجاح
    Swal.fire({
      title: `مرحباً ${userData.username}!`,
      text: "تم تسجيل الدخول بنجاح",
      icon: "success",
      confirmButtonColor: "#022C43",
      background: "#022C43",
      color: "#FFD700",
    });
  };
  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (citiesDropdownRef.current && !citiesDropdownRef.current.contains(event.target)) {
        setIsCitiesOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تأثير التمرير مع تحسين الأداء
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "تأكيد تسجيل الخروج",
      text: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#022C43",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، سجل خروج",
      cancelButtonText: "إلغاء",
      background: "#022C43",
      color: "#FFD700",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("isAdmin");
        setUser(null);
        navigate("/");
      }
    });
  };


  return (
    <>
      {/* Header */}
      <header
        dir="rtl"
        className={`fixed top-0 w-full z-50 transition-all duration-300 shadow-md ${
          isScrolled ? "bg-[#022C43]/90 backdrop-blur-sm" : "bg-[#022C43]"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img className="h-10 md:h-12 w-auto" src={logo} alt="Logo" />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Navigation Links */}
          <nav
            className={`lg:flex items-center gap-6 text-white text-lg ${
              menuOpen
                ? "fixed top-16 right-0 w-full bg-[#022C43] p-6 shadow-lg flex flex-col"
                : "hidden"
            }`}
          >
            <Link 
              className="hover:text-[#FFD700] transition py-2" 
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              الرئيسية
            </Link>
            
            {/* Cities Dropdown */}
            <div className="relative" ref={citiesDropdownRef}>
              <button 
                onClick={() => setIsCitiesOpen(!isCitiesOpen)} 
                className="hover:text-[#FFD700] flex items-center py-2"
              >
                المدن <ChevronDown className={`ml-1 transition-transform ${isCitiesOpen ? "rotate-180" : ""}`} />
              </button>
              <div 
                className={`absolute right-0 mt-2 w-48 bg-[#115173] rounded-md shadow-lg overflow-hidden ${
                  isCitiesOpen ? "block" : "hidden"
                }`}
              >
                <Link 
                  className="block px-4 py-2 text-white hover:bg-[#0d3a5a]" 
                  to="/places?city=عمان"
                  onClick={() => {
                    setIsCitiesOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  عمان
                </Link>
                <Link 
                  className="block px-4 py-2 text-white hover:bg-[#0d3a5a]" 
                  to="/places?city=الزرقاء"
                  onClick={() => {
                    setIsCitiesOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  الزرقاء
                </Link>
                <Link 
                  className="block px-4 py-2 text-white hover:bg-[#0d3a5a]" 
                  to="/places?city=إربد"
                  onClick={() => {
                    setIsCitiesOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  إربد
                </Link>
              </div>
            </div>

            <Link 
              className="hover:text-[#FFD700] transition py-2" 
              to="/article"
              onClick={() => setMenuOpen(false)}
            >
              المدونات
            </Link>
            <Link 
              className="hover:text-[#FFD700] transition py-2" 
              to="/About"
              onClick={() => setMenuOpen(false)}
            >
              من نحن
            </Link>
            <Link 
              className="hover:text-[#FFD700] transition py-2" 
              to="/contact"
              onClick={() => setMenuOpen(false)}
            >
              تواصل معنا
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#0d3a5a] transition-colors"
                  aria-label="User menu"
                >
                  <FaUser className="text-[#FFD700]" />
                  <span>{user.username}</span>
                  <ChevronDown className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#115173] rounded-md shadow-lg z-50 overflow-hidden">
                    {user.isAdmin && (
                      <Link
                        to="/AdminDash"
                        className="flex items-center px-4 py-3 text-white hover:bg-[#0d3a5a] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaCog className="ml-2" />
                        لوحة التحكم
                      </Link>
                    )}
                    <Link
                      to={user.isAdmin ? "/AdminDash" : `/ProfilePage/${user.userId}`}
                      className="flex items-center px-4 py-3 text-white hover:bg-[#0d3a5a] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="ml-2" />
                      {user.isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-400 hover:bg-[#0d3a5a] transition-colors text-right"
                    >
                      <FaSignOutAlt className="ml-2" />
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setFormOpen(true)}
                className="px-4 py-2 bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700]/10 transition-colors"
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay with blur effect */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setFormOpen(false)}
          />
          
          {/* Form Container */}
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg w-full max-w-md z-50">
              <FormRegistration 
                onClose={() => setFormOpen(false)} 
                onLogin={handleLoginSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChevronDown = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-5 h-5 ${className}`}
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

export default Navbar;