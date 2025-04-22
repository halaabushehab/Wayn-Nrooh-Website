import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import logo from "./img/Screenshot 2025-01-24 235121.png";
import FormRegistration from "../components/FormRegistration";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from 'js-cookie';

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

  useEffect(() => {
    const loadUserFromCookies = () => {
      const userCookie = Cookies.get("user");
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          console.log("🧖 Loading user from cookies:", parsedUser);

          if (parsedUser.token) {
            setUser({
              username: parsedUser.username,
              userId: parsedUser.userId,
              isAdmin: parsedUser.isAdmin || false,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
          }
        } catch (error) {
          console.error("Error parsing user cookie:", error);
          Cookies.remove("user");
        }
      }
    };

    loadUserFromCookies();
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log("✅ تم تسجيل المستخدم:", userData);
    const userToStore = {
      token: userData.token,
      username: userData.username,
      userId: userData.userId,
      email: userData.email,
      isAdmin: userData.isAdmin || false
    };
    
    Cookies.set("user", JSON.stringify(userToStore), { expires: 7 });
    setUser({
      username: userData.username,
      userId: userData.userId,
      isAdmin: userData.isAdmin
    });

    setFormOpen(false);

    Swal.fire({
      title: `مرحباً ${userData.username}!`,
      text: "تم إنشاء الحساب بنجاح",
      icon: "success",
      confirmButtonColor: "#022C43",
      background: "#022C43",
      color: "#FFD700",
    });
  };

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
        Cookies.remove("user");
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsUserMenuOpen(false);
        navigate("/");
      }
    });
  };

  return (
    <>
      <header
        dir="rtl"
        className={`fixed top-0 w-full z-50 transition-all duration-300 shadow-md ${
          isScrolled ? "bg-[#022C43]/90 backdrop-blur-sm" : "bg-[#022C43]"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img className="h-15 md:h-15 w-auto" src={logo} alt="Logo" />
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
    className="hover:text-[#FFD700] transition py-2 no-underline text-white text-base  visited:no-underline" 
    to="/"
    onClick={() => setMenuOpen(false)}
  >
    الرئيسية
  </Link>
  
  <div className="relative" ref={citiesDropdownRef}>
    <button 
      onClick={() => setIsCitiesOpen(!isCitiesOpen)} 
      className="hover:text-[#FFD700] flex items-center py-2 no-underline text-white text-base"
    >
      المدن <ChevronDown className={`ml-1 transition-transform ${isCitiesOpen ? "rotate-180" : ""}`} />
    </button>
    <div 
      className={`absolute right-0 mt-2 w-48 bg-[#115173] rounded-md shadow-lg overflow-hidden ${
        isCitiesOpen ? "block" : "hidden"
      }`}
    >
      <Link 
        className="block px-4 py-2 text-white hover:bg-[#0d3a5a] no-underline text-base" 
        to="/places?city=عمان"
        onClick={() => {
          setIsCitiesOpen(false);
          setMenuOpen(false);
        }}
      >
        عمان
      </Link>
      <Link 
        className="block px-4 py-2 text-white hover:bg-[#0d3a5a] no-underline text-base" 
        to="/places?city=الزرقاء"
        onClick={() => {
          setIsCitiesOpen(false);
          setMenuOpen(false);
        }}
      >
        الزرقاء
      </Link>
      <Link 
        className="block px-4 py-2 text-white hover:bg-[#0d3a5a] no-underline text-base" 
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
    className="hover:text-[#FFD700] transition py-2 no-underline text-white text-base" 
    to="/article"
    onClick={() => setMenuOpen(false)}
  >
    المدونات
  </Link>
  <Link 
    className="hover:text-[#FFD700] transition py-2 no-underline text-white text-base" 
    to="/About"
    onClick={() => setMenuOpen(false)}
  >
    من نحن
  </Link>
  <Link 
    className="hover:text-[#FFD700] transition py-2 no-underline text-white text-base" 
    to="/contact"
    onClick={() => setMenuOpen(false)}
  >
    تواصل معنا
  </Link>

  {/* Mobile User Actions */}
  <div className="lg:hidden mt-4">
    {user ? (
      <div className="flex flex-col gap-2">
        <Link
          to={user.isAdmin ? "/AdminDash" : `/ProfilePage/${user.userId}`}
          className="flex items-center px-4 py-2 text-white hover:bg-[#0d3a5a] transition-colors rounded-lg no-underline text-base"
          onClick={() => setMenuOpen(false)}
        >
          <FaUser className="ml-2" />
          {user.isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-400 hover:bg-[#0d3a5a] transition-colors rounded-lg text-right no-underline text-base"
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
        className="w-full px-4 py-2 bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700]/10 transition-colors no-underline text-base"
      >
        تسجيل الدخول
      </button>
    )}
  </div>
</nav>

          {/* Desktop User Actions */}
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
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setFormOpen(false)}
          />
          
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