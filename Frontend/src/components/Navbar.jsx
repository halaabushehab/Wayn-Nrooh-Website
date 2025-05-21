import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaSearch, FaPlus, FaGlobe } from "react-icons/fa";
import { GiModernCity } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";
import logo from "./img/Screenshot 2025-01-24 235121.png";
import FormRegistration from "../components/FormRegistration";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { FileHeart } from "lucide-react";

const Navbar = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [language, setLanguage] = useState('ar');
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
              photo: parsedUser.photo || "",
            });
            axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
    };
    loadUserFromCookies();
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);

    if (newLanguage === 'en') {
      navigate('/homeenglish');
    } else {
      navigate('/');
    }
  };

  const handleLoginSuccess = (userData) => {
    const userToStore = {
      token: userData.token,
      username: userData.username,
      userId: userData.userId,
      email: userData.email,
      isAdmin: userData.isAdmin || false,
    };

    Cookies.set("user", JSON.stringify(userToStore), { expires: 7 });
    setUser({
      username: userData.username,
      userId: userData.userId,
      isAdmin: userData.isAdmin,
    });

    setFormOpen(false);

    Swal.fire({
      title: `مرحباً ${userData.username}!`,
      text: "تم إنشاء الحساب بنجاح",
      icon: "success",
      iconColor: '#FFD700',
      confirmButtonColor: "#115173",
      background: "white",
      color: "#115173",
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: "تأكيد تسجيل الخروج",
      text: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      icon: "question",
      iconColor: '#FFD700',
      showCancelButton: true,
      confirmButtonColor: "#115173",
      cancelButtonColor: "#115173",
      confirmButtonText: "نعم، سجل خروج",
      cancelButtonText: "إلغاء",
      background: "#white",
      color: "#115173",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsUserMenuOpen(false);
        navigate("/");
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق القوائم المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header
        dir="rtl"
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-[#022C43] shadow-lg" : "bg-gradient-to-b from-[#022C43]/90 to-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              className="h-12 md:h-14 w-auto transition-transform group-hover:scale-105" 
              src={logo} 
              alt="Logo" 
              loading="lazy"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 flex flex-col items-end transition-all duration-300 ${menuOpen ? 'gap-0' : 'gap-1.5'}`}>
              <span className={`h-0.5 bg-[#FFD700] transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-0.5' : 'w-6'}`}></span>
              <span className={`h-0.5 bg-[#FFD700] transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-5'}`}></span>
              <span className={`h-0.5 bg-[#FFD700] transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-0.5' : 'w-4'}`}></span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav
            className={`lg:flex items-center gap-6 text-base md:text-lg transition-all duration-300 ${
              menuOpen
                ? "fixed top-16 right-0 w-full bg-[#022C43] p-4 shadow-xl flex flex-col rounded-b-lg"
                : "hidden"
            }`}
          >
            {[
              { path: "/", label: "الرئيسية" },
              { path: "/location", label: "الوجهات" },
              { path: "/article", label: "المدونات" },
              { path: "/seasonPage/:season", label: "وجهات موسمية" },
              { path: "/about", label: "من نحن" },
              { path: "/contact", label: "تواصل معنا" },
            ].map((link) => (
              <Link
                key={link.path}
                className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
                to={link.path}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* Mobile User Actions */}
            <div className="lg:hidden mt-3 flex flex-col gap-3 w-full px-2">
              <button
                onClick={toggleLanguage}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  isScrolled 
                    ? "bg-[#115173] text-white" 
                    : "bg-[#115173] text-white"
                }`}
              >
                <FaGlobe className="ml-2" />
                {language === 'ar' ? 'English' : 'العربية'}
              </button>

              {user ? (
                <div className="flex flex-col gap-2">
                  {user.isAdmin && (
                    <Link
                      to="/AdminDash"
                      className="flex items-center justify-center px-4 py-2 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-[#FFD700]/90 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaCog className="ml-2" />
                      لوحة التحكم
                    </Link>
                  )}
                  <Link
                    to={`/ProfilePage/${user.userId}`}
                    className="flex items-center justify-center px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#115173]/90 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser className="ml-2" />
                    الملف الشخصي
                  </Link>
                  <Link
                    to="/favorite"
                    className="flex items-center justify-center px-4 py-2 bg-[#115173] text-white rounded-lg hover:bg-[#115173]/90 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FileHeart className="ml-2" />
                    المفضلة
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center px-4 py-2 bg-transparent border border-red-400 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
                  >
                    <FaSignOutAlt className="ml-2" />
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setFormOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-[#FFD700]/90 transition-colors font-medium"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* <button
              onClick={toggleLanguage}
              className={`flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded transition-colors duration-200 ${
                isScrolled
                  ? "bg-transparent text-white border-white hover:bg-white/10"
                  : "bg-transparent text-white border-white hover:bg-white/10"
              }`}
            >
              <FaGlobe className="ml-2 text-sm md:text-base" />
              <span className="text-sm md:text-base">{language === 'ar' ? 'English' : 'العربية'}</span>
            </button> */}

            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded transition-colors duration-200 
                    ${
                      isScrolled
                        ? "bg-transparent text-white border-white hover:bg-white/10"
                        : "bg-transparent text-white border-white hover:bg-white/10"
                    }
                  `}
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-[#022C43] font-bold overflow-hidden">
                    {user.photo ? (
                      <img
                        src={user.photo}
                        alt="User Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.username.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm md:text-base">{user.username}</span>
                  <ChevronDown
                    className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 origin-top">
                    <Link
                      to={user.isAdmin ? "/AdminDash" : `/ProfilePage/${user.userId}`}
                      className="flex items-center px-4 py-2.5 text-[#022C43] hover:bg-[#F0F0F0] transition-colors text-sm md:text-base"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="ml-2 text-[#115173]" />
                      {user.isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
                    </Link>
                    <Link
                      to="/favorite"
                      className="flex items-center px-4 py-2.5 text-[#022C43] hover:bg-[#F0F0F0] transition-colors border-t border-[#F0F0F0] text-sm md:text-base"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FileHeart className="ml-2 text-[#115173]" />
                      المفضلة
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors border-t border-[#F0F0F0] text-sm md:text-base"
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
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-300 text-sm md:text-base ${
                  isScrolled 
                    ? "bg-[#FFD700] text-[#022C43] hover:bg-[#FFD700]/90 shadow-md" 
                    : "bg-[#022C43] text-[#ffffff] hover:bg-[#115173]/90"
                } hover:scale-105 font-medium`}
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setFormOpen(false)}
          />
          
          <div 
            className="relative z-50 bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)",
              border: "2px solid #FFD700"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#022C43] p-4 text-white flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-bold">تسجيل الدخول / إنشاء حساب</h2>
              <button
                onClick={() => setFormOpen(false)}
                className="text-[#FFD700] hover:text-[#022C43] transition-colors p-1 rounded-full"
                aria-label="Close"
              >
                <FaTimes size={18} />
              </button>
            </div>
            
            <div className="p-4 md:p-6">
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
    className={`w-4 h-4 ${className}`}
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