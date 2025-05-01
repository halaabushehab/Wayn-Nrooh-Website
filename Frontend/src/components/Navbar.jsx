import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaSearch, FaPlus } from "react-icons/fa";
import { GiModernCity } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";
import logo from "./img/Screenshot 2025-01-24 235121.png";
import FormRegistration from "../components/FormRegistration";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";
import { FileHeart  } from "lucide-react";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        dir="rtl"
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-[#022C43] shadow-lg" : "bg-gradient-to-b from-[#022C43]/90 to-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
          {/* Logo with modern design */}
          <Link to="/" className="flex items-center group">
            <img className="h-14 md:h-15 w-auto transition-transform group-hover:scale-105" src={logo} alt="Logo" />
            {/* <span className="hidden md:block text-[#FFD700] font-bold text-xl mr-2">EXPLORE</span> */}
          </Link>

          {/* Mobile Menu Button with animation */}
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

          {/* Navigation Links with modern hover effects */}
          <nav
            className={`lg:flex items-center gap-8 text-lg transition-all duration-300 ${
              menuOpen
                ? "fixed top-20 right-0 w-full bg-[#022C43] p-6 shadow-xl flex flex-col rounded-b-lg"
                : "hidden"
            }`}
          >
            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              الرئيسية
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <div className="relative" ref={citiesDropdownRef}>
              <button
                onClick={() => setIsCitiesOpen(!isCitiesOpen)}
                className="flex items-center py-2 px-1 text-white hover:text-[#FFD700] transition-colors group"
              >
                <GiModernCity className="ml-1 text-[#FFD700]" />
                المدن
                <ChevronDown
                  className={`ml-1 transition-transform ${isCitiesOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 origin-top ${
                  isCitiesOpen ? "scale-y-100 opacity-100" : "scale-y-95 opacity-0 pointer-events-none"
                }`}
              >
                <Link
                  className="block px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors flex items-center"
                  to="/places?city=عمان"
                  onClick={() => {
                    setIsCitiesOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <MdTravelExplore className="ml-2 text-[#FFD700]" />
                  عمان
                </Link>
                <Link
                  className="block px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors flex items-center"
                  to="/places?city=الزرقاء"
                  onClick={() => {
                    setIsCitiesOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <MdTravelExplore className="ml-2 text-[#FFD700]" />
                  الزرقاء
                </Link>
                <Link
                  className="block px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors flex items-center"
                  to="/places?city=إربد"
                  onClick={() => {
                    setIsCitiesOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  <MdTravelExplore className="ml-2 text-[#FFD700]" />
                  إربد
                </Link>
              </div>
            </div>

            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/article"
              onClick={() => setMenuOpen(false)}
            >
              المدونات
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/seasonPage/:season"
              onClick={() => setMenuOpen(false)}
            >
             وجهات موسمية
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/contact"
              onClick={() => setMenuOpen(false)}
            >
              تواصل معنا
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mobile User Actions */}
            <div className="lg:hidden mt-4 flex flex-col gap-3 w-full">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full px-4 py-2.5 bg-[#115173] text-white rounded-lg hover:bg-[#115173]/90 transition-colors flex items-center justify-center"
              >
                <FaSearch className="ml-2" />
                بحث
              </button>

              {user ? (
                <div className="flex flex-col gap-2">
                  {user.isAdmin && (
                    <Link
                      to="/AdminDash"
                      className="flex items-center px-4 py-2.5 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-[#FFD700]/90 transition-colors justify-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaCog className="ml-2" />
                      لوحة التحكم
                    </Link>
                  )}
                  <Link
                    to={`/ProfilePage/${user.userId}`}
                    className="flex items-center px-4 py-2.5 bg-[#115173] text-white rounded-lg hover:bg-[#115173]/90 transition-colors justify-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser className="ml-2" />
                    الملف الشخصي
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2.5 bg-transparent border border-red-400 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors justify-center"
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
                  className="w-full px-4 py-2.5 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-[#FFD700]/90 transition-colors font-medium"
                >
                  تسجيل الدخول
                </button>
              )}
            </div>
          </nav>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Button with modern style */}
            <button
  onClick={() => setIsSearchOpen(true)}
  className={`
    flex items-center gap-2 px-4 py-2 rounded transition-colors duration-200 border
    ${
      isScrolled
        ? "bg-transparent text-white border-[#022C43] hover:bg-[#022C4320]"
        : "bg-transparent text-white  border-[#115173] hover:bg-[#11517320]"
    }
  `}
  aria-label="Search"
>
  <FaSearch />
  <span>بحث</span>
</button>


            {user ? (
              <div className="relative" ref={userDropdownRef}>
              <button
  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
  className={`
    flex items-center gap-2 px-4 py-2 rounded transition-colors duration-200 border
    ${
      isScrolled
        ? "bg-transparent text-white border-white hover:bg-white/10"
        : "bg-transparent text-white border-white hover:bg-white/10"
    }
  `}
  aria-label="User menu"
>
  <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-[#022C43] font-bold">
  <img
  src="https://i.pinimg.com/736x/db/0e/ac/db0eacda4a065cce5e396845a502e13e.jpg" // صورة افتراضية مؤقتة
  alt="User Profile"
  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
/>  </div>
  <span>{user.username}</span>
  <ChevronDown
    className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
  />
</button>


                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 origin-top">
                    {/* <div className="p-4 border-b border-[#F0F0F0] bg-[#022C43] text-white">
                      <p className="font-medium">مرحباً {user.username}</p>
                      <p className="text-sm text-[#FFD700]">{user.isAdmin ? "مدير النظام" : "مستخدم"}</p>
                    </div> */}
                    <Link
                      to={user.isAdmin ? "/AdminDash" : `/ProfilePage/${user.userId}`}
                      className="flex items-center px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="ml-2 text-[#115173]" />
                      {user.isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/add-article"
                        className="flex items-center px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaPlus className="ml-2 text-[#115173]" />
                        إضافة مقال جديد
                      </Link>
                    )}
                    <button>
                    <Link
  to="/favorite"
  className="w-full flex items-center px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors border-t border-[#F0F0F0]"
  onClick={() => setIsUserMenuOpen(false)}
>
  <FileHeart  className="ml-2 text-[#115173]" />
المفضلة</Link>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-[#F0F0F0]"
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
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isScrolled 
                    ? "bg-[#FFD700] text-[#022C43] hover:bg-[#FFD700]/90 shadow-md" 
                    : "bg-white text-[#115173] hover:bg-[#115173]/90"
                } hover:scale-105 font-medium`}
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Modern Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div 
              className="bg-white rounded-xl w-full max-w-2xl z-50 p-6 shadow-2xl transform transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)"
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#022C43]">ابحث عن وجهاتك المفضلة</h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-500 hover:text-[#022C43] transition-colors p-1 rounded-full"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن مدينة، مقال، أو وجهة..."
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-right text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#FFD700] p-2 rounded-lg hover:bg-[#FFD700]/90 transition-colors"
                  >
                    <FaSearch className="text-[#022C43]" />
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSearchQuery("عمان")}
                    className="px-3 py-1.5 bg-[#F0F0F0] text-[#022C43] rounded-full text-sm hover:bg-[#115173] hover:text-white transition-colors"
                  >
                    عمان
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("الزرقاء")}
                    className="px-3 py-1.5 bg-[#F0F0F0] text-[#022C43] rounded-full text-sm hover:bg-[#115173] hover:text-white transition-colors"
                  >
                    الزرقاء
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("إربد")}
                    className="px-3 py-1.5 bg-[#F0F0F0] text-[#022C43] rounded-full text-sm hover:bg-[#115173] hover:text-white transition-colors"
                  >
                    إربد
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("مقالات")}
                    className="px-3 py-1.5 bg-[#F0F0F0] text-[#022C43] rounded-full text-sm hover:bg-[#115173] hover:text-white transition-colors"
                  >
                    مقالات
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modern Login Form Modal */}
  {isFormOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* الخلفية */}
    <div 
      className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      onClick={(e) => {
        e.stopPropagation();
        setFormOpen(false);
      }}
    />
    
    {/* النموذج */}
    <div 
      className="relative z-50 bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)",
        border: "2px solid #FFD700"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="bg-[#022C43] p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">تسجيل الدخول / إنشاء حساب</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFormOpen(false);
          }}
          className="text-[#FFD700] hover:text-white transition-colors p-1 rounded-full"
          aria-label="Close"
        >
          <FaTimes size={18} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6">
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






// import { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaSearch, FaPlus } from "react-icons/fa";
// import { GiModernCity } from "react-icons/gi";
// import { MdTravelExplore } from "react-icons/md";
// import logo from "./img/Screenshot 2025-01-24 235121.png";
// import FormRegistration from "../components/FormRegistration";
// import Swal from "sweetalert2";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { FileHeart  } from "lucide-react";

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
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     const loadUserFromCookies = () => {
//       const userCookie = Cookies.get("user");
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie);
//           if (parsedUser.token) {
//             setUser({
//               username: parsedUser.username,
//               userId: parsedUser.userId,
//               isAdmin: parsedUser.isAdmin || false,
//             });
//             axios.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
//           }
//         } catch (error) {
//           console.error("Error parsing user cookie:", error);
//           Cookies.remove("user");
//         }
//       }
//     };
//     loadUserFromCookies();
//   }, []);

//   const handleLoginSuccess = (userData) => {
//     const userToStore = {
//       token: userData.token,
//       username: userData.username,
//       userId: userData.userId,
//       email: userData.email,
//       isAdmin: userData.isAdmin || false,
//     };

//     Cookies.set("user", JSON.stringify(userToStore), { expires: 7 });
//     setUser({
//       username: userData.username,
//       userId: userData.userId,
//       isAdmin: userData.isAdmin,
//     });

//     setFormOpen(false);

//     Swal.fire({
//       title: `مرحباً ${userData.username}!`,
//       text: "تم إنشاء الحساب بنجاح",
//       icon: "success",
//       confirmButtonColor: "#022C43",
//       background: "#022C43",
//       color: "#FFD700",
//     });
//   };

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
//         Cookies.remove("user");
//         delete axios.defaults.headers.common["Authorization"];
//         setUser(null);
//         setIsUserMenuOpen(false);
//         navigate("/");
//       }
//     });
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
//       setIsSearchOpen(false);
//       setSearchQuery("");
//     }
//   };

// return (
//   <>
//     <header
//       dir="rtl"
//       className={`fixed top-0 w-full z-50 transition-all duration-500 ${
//         isScrolled 
//           ? "bg-[#1A3045] shadow-md" 
//           : "bg-gradient-to-b from-[#1A3045]/95 to-transparent"
//       }`}
//     >
//       <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-4">
//         {/* Logo with classic design */}
//         <Link to="/" className="flex items-center group relative">
//           <div className="relative">
//             <img 
//               className="h-12 md:h-14 w-auto transition-all duration-300 group-hover:opacity-95" 
//               src={logo} 
//               alt="Logo" 
//             />
//             <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C9A227] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
//           </div>
//         </Link>

//         {/* Mobile Menu Button with elegant animation */}
//         <button
//           className="lg:hidden p-2 focus:outline-none border border-[#C9A227]/30 rounded"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle menu"
//         >
//           <div className={`w-6 flex flex-col items-end transition-all duration-300 ${menuOpen ? 'gap-0' : 'gap-1.5'}`}>
//             <span className={`h-0.5 bg-[#C9A227] transition-all duration-300 ${menuOpen ? 'w-6 rotate-45 translate-y-0.5' : 'w-6'}`}></span>
//             <span className={`h-0.5 bg-[#C9A227] transition-all duration-300 ${menuOpen ? 'opacity-0' : 'w-5'}`}></span>
//             <span className={`h-0.5 bg-[#C9A227] transition-all duration-300 ${menuOpen ? 'w-6 -rotate-45 -translate-y-0.5' : 'w-4'}`}></span>
//           </div>
//         </button>

//         {/* Navigation Links with classic hover effects */}
//         <nav
//           className={`lg:flex items-center gap-8 text-lg transition-all duration-500 ${
//             menuOpen
//               ? "fixed top-20 right-0 w-full bg-[#1A3045] p-6 shadow-xl flex flex-col rounded-b-lg border-t border-[#C9A227]/20"
//               : "hidden"
//           }`}
//         >
//           <Link
//             className="relative group py-2 px-1 text-white font-serif hover:text-[#C9A227] transition-colors"
//             to="/"
//             onClick={() => setMenuOpen(false)}
//           >
//             الرئيسية
//             <span className="absolute bottom-0 right-1/4 left-1/4 h-0.5 bg-[#C9A227] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//           </Link>

//           <div className="relative" ref={citiesDropdownRef}>
//             <button
//               onClick={() => setIsCitiesOpen(!isCitiesOpen)}
//               className="flex items-center py-2 px-1 text-white font-serif hover:text-[#C9A227] transition-colors group"
//             >
//               <GiModernCity className="ml-1 text-[#C9A227]" />
//               المدن
//               <ChevronDown
//                 className={`ml-1 transition-transform duration-300 ${isCitiesOpen ? "rotate-180" : ""}`}
//               />
//             </button>
//             <div
//               className={`absolute right-0 mt-2 w-56 bg-[#FBF7EA] rounded-md shadow-xl overflow-hidden transition-all duration-300 origin-top ${
//                 isCitiesOpen ? "scale-y-100 opacity-100" : "scale-y-95 opacity-0 pointer-events-none"
//               }`}
//             >
//               <div className="p-2 bg-[#1A3045] text-[#C9A227] text-sm font-medium border-b border-[#C9A227]/30">اختر المدينة</div>
//               <Link
//                 className="block px-4 py-3 text-[#1A3045] hover:bg-[#1A3045]/10 transition-colors flex items-center"
//                 to="/places?city=عمان"
//                 onClick={() => {
//                   setIsCitiesOpen(false);
//                   setMenuOpen(false);
//                 }}
//               >
//                 <MdTravelExplore className="ml-2 text-[#C9A227]" />
//                 عمان
//               </Link>
//               <Link
//                 className="block px-4 py-3 text-[#1A3045] hover:bg-[#1A3045]/10 transition-colors flex items-center border-t border-[#C9A227]/10"
//                 to="/places?city=الزرقاء"
//                 onClick={() => {
//                   setIsCitiesOpen(false);
//                   setMenuOpen(false);
//                 }}
//               >
//                 <MdTravelExplore className="ml-2 text-[#C9A227]" />
//                 الزرقاء
//               </Link>
//               <Link
//                 className="block px-4 py-3 text-[#1A3045] hover:bg-[#1A3045]/10 transition-colors flex items-center border-t border-[#C9A227]/10"
//                 to="/places?city=إربد"
//                 onClick={() => {
//                   setIsCitiesOpen(false);
//                   setMenuOpen(false);
//                 }}
//               >
//                 <MdTravelExplore className="ml-2 text-[#C9A227]" />
//                 إربد
//               </Link>
//             </div>
//           </div>

//           <Link
//             className="relative group py-2 px-1 text-white font-serif hover:text-[#C9A227] transition-colors"
//             to="/article"
//             onClick={() => setMenuOpen(false)}
//           >
//             المدونات
//             <span className="absolute bottom-0 right-1/4 left-1/4 h-0.5 bg-[#C9A227] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//           </Link>

//           <Link
//             className="relative group py-2 px-1 text-white font-serif hover:text-[#C9A227] transition-colors"
//             to="/About"
//             onClick={() => setMenuOpen(false)}
//           >
//             من نحن
//             <span className="absolute bottom-0 right-1/4 left-1/4 h-0.5 bg-[#C9A227] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//           </Link>

//           <Link
//             className="relative group py-2 px-1 text-white font-serif hover:text-[#C9A227] transition-colors"
//             to="/contact"
//             onClick={() => setMenuOpen(false)}
//           >
//             تواصل معنا
//             <span className="absolute bottom-0 right-1/4 left-1/4 h-0.5 bg-[#C9A227] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//           </Link>

//           {/* Mobile User Actions */}
//           <div className="lg:hidden mt-6 flex flex-col gap-3 w-full border-t border-[#C9A227]/20 pt-4">
//             <button
//               onClick={() => setIsSearchOpen(true)}
//               className="w-full px-4 py-2.5 bg-[#1A3045] text-white rounded-md border border-[#C9A227]/40 hover:border-[#C9A227] transition-all flex items-center justify-center"
//             >
//               <FaSearch className="ml-2 text-[#C9A227]" />
//               بحث
//             </button>

//             {user ? (
//               <div className="flex flex-col gap-2">
//                 {user.isAdmin && (
//                   <Link
//                     to="/AdminDash"
//                     className="flex items-center px-4 py-2.5 bg-[#C9A227]/10 text-[#1A3045] rounded-md border border-[#C9A227] hover:bg-[#C9A227]/20 transition-colors justify-center"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     <FaCog className="ml-2 text-[#C9A227]" />
//                     لوحة التحكم
//                   </Link>
//                 )}
//                 <Link
//                   to={`/ProfilePage/${user.userId}`}
//                   className="flex items-center px-4 py-2.5 bg-[#1A3045] text-white rounded-md border border-[#C9A227]/40 hover:border-[#C9A227] transition-all justify-center"
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   <FaUser className="ml-2 text-[#C9A227]" />
//                   الملف الشخصي
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center px-4 py-2.5 bg-transparent border border-red-400 text-red-400 rounded-md hover:bg-red-400/10 transition-colors justify-center"
//                 >
//                   <FaSignOutAlt className="ml-2" />
//                   تسجيل الخروج
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={() => {
//                   setFormOpen(true);
//                   setMenuOpen(false);
//                 }}
//                 className="w-full px-4 py-2.5 bg-[#C9A227] text-[#1A3045] rounded-md hover:bg-[#C9A227]/90 transition-colors font-medium"
//               >
//                 تسجيل الدخول
//               </button>
//             )}
//           </div>
//         </nav>

//         {/* Desktop User Actions */}
//         <div className="hidden lg:flex items-center gap-4">
//           {/* Search Button with classic style */}
//           <button
//             onClick={() => setIsSearchOpen(true)}
//             className={`
//               flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 border
//               ${
//                 isScrolled
//                   ? "bg-transparent text-white border-[#C9A227]/50 hover:border-[#C9A227] hover:bg-[#C9A227]/10"
//                   : "bg-transparent text-white border-[#C9A227]/30 hover:border-[#C9A227] hover:bg-[#C9A227]/10"
//               }
//             `}
//             aria-label="Search"
//           >
//             <FaSearch className="text-[#C9A227]" />
//             <span>بحث</span>
//           </button>

//           {user ? (
//             <div className="relative" ref={userDropdownRef}>
//               <button
//                 onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                 className={`
//                   flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300
//                   ${
//                     isScrolled
//                       ? "bg-[#C9A227]/10 text-white border border-[#C9A227]/50 hover:border-[#C9A227]"
//                       : "bg-[#C9A227]/10 text-white border border-[#C9A227]/30 hover:border-[#C9A227]"
//                   }
//                 `}
//                 aria-label="User menu"
//               >
//                 <div className="w-8 h-8 rounded-full bg-[#C9A227]/20 flex items-center justify-center text-[#C9A227] font-bold border border-[#C9A227]/50 overflow-hidden">
//                   <img
//                     src="https://i.pinimg.com/736x/db/0e/ac/db0eacda4a065cce5e396845a502e13e.jpg"
//                     alt="User Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <span>{user.username}</span>
//                 <ChevronDown
//                   className={`transition-transform duration-300 text-[#C9A227] ${isUserMenuOpen ? "rotate-180" : ""}`}
//                 />
//               </button>

//               {isUserMenuOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-[#FBF7EA] rounded-md shadow-xl z-50 overflow-hidden transition-all duration-300 origin-top border border-[#C9A227]/30">
//                   <div className="p-3 border-b border-[#C9A227]/20 bg-[#1A3045] text-white">
//                     <p className="font-medium text-[#C9A227]">مرحباً {user.username}</p>
//                     <p className="text-sm text-white/80">{user.isAdmin ? "مدير النظام" : "مستخدم"}</p>
//                   </div>
//                   <Link
//                     to={user.isAdmin ? "/AdminDash" : `/ProfilePage/${user.userId}`}
//                     className="flex items-center px-4 py-3 text-[#1A3045] hover:bg-[#1A3045]/10 transition-colors"
//                     onClick={() => setIsUserMenuOpen(false)}
//                   >
//                     <FaUser className="ml-2 text-[#1A3045]" />
//                     {user.isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
//                   </Link>
//                   {user.isAdmin && (
//                     <Link
//                       to="/add-article"
//                       className="flex items-center px-4 py-3 text-[#1A3045] hover:bg-[#1A3045]/10 transition-colors border-t border-[#C9A227]/20"
//                       onClick={() => setIsUserMenuOpen(false)}
//                     >
//                       <FaPlus className="ml-2 text-[#1A3045]" />
//                       إضافة مقال جديد
//                     </Link>
//                   )}
//                   <Link
//                     to="/favorite"
//                     className="w-full flex items-center px-4 py-3 text-[#1A3045] hover:bg-[#1A3045]/10 transition-colors border-t border-[#C9A227]/20"
//                     onClick={() => setIsUserMenuOpen(false)}
//                   >
//                     <FileHeart className="ml-2 text-[#1A3045]" />
//                     المفضلة
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-[#C9A227]/20"
//                   >
//                     <FaSignOutAlt className="ml-2" />
//                     تسجيل الخروج
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <button
//               onClick={() => setFormOpen(true)}
//               className={`px-5 py-2 rounded-md transition-all duration-300 ${
//                 isScrolled 
//                   ? "bg-[#C9A227] text-[#1A3045] hover:bg-[#C9A227]/90 shadow-md" 
//                   : "bg-[#C9A227] text-[#1A3045] hover:bg-[#C9A227]/90"
//               } border border-[#C9A227] hover:shadow-lg font-medium`}
//             >
//               تسجيل الدخول
//             </button>
//           )}
//         </div>
//       </div>
//     </header>

//     {/* Classical Search Modal with Ornamental Design */}
//     {isSearchOpen && (
//       <div className="fixed inset-0 z-50">
//         <div
//           className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
//           onClick={() => setIsSearchOpen(false)}
//         />
//         <div className="relative flex items-center justify-center min-h-screen p-4">
//           <div 
//             className="bg-[#FBF7EA] rounded-lg w-full max-w-2xl z-50 p-6 shadow-2xl transform transition-all duration-300 border-2 border-[#C9A227]"
//           >
//             {/* Decorative header */}
//             <div className="relative mb-6 pb-4 border-b border-[#C9A227]/30">
//               <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#C9A227]"></div>
//               <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#C9A227]"></div>
              
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-serif font-bold text-[#1A3045]">ابحث عن وجهاتك المفضلة</h2>
//                 <button
//                   onClick={() => setIsSearchOpen(false)}
//                   className="text-[#1A3045] hover:text-[#C9A227] transition-colors p-1 rounded-full"
//                 >
//                   <FaTimes size={20} />
//                 </button>
//               </div>
              
//               <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#C9A227]"></div>
//               <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#C9A227]"></div>
//             </div>
            
//             <form onSubmit={handleSearch}>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="ابحث عن مدينة، مقال، أو وجهة..."
//                   className="w-full p-4 pr-12 border-2 border-[#C9A227]/60 rounded-md focus:outline-none focus:border-[#C9A227] text-right text-lg bg-white/80"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   autoFocus
//                 />
//                 <button
//                   type="submit"
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#C9A227] p-2 rounded-md hover:bg-[#C9A227]/90 transition-colors"
//                 >
//                   <FaSearch className="text-[#1A3045]" />
//                 </button>
//               </div>
              
//               <div className="mt-6">
//                 <h3 className="text-lg font-medium text-[#1A3045] mb-2">اقتراحات البحث:</h3>
//                 <div className="flex flex-wrap gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setSearchQuery("عمان")}
//                     className="px-4 py-2 bg-white border border-[#C9A227]/40 text-[#1A3045] rounded-md text-sm hover:bg-[#C9A227]/10 hover:border-[#C9A227] transition-colors"
//                   >
//                     عمان
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setSearchQuery("الزرقاء")}
//                     className="px-4 py-2 bg-white border border-[#C9A227]/40 text-[#1A3045] rounded-md text-sm hover:bg-[#C9A227]/10 hover:border-[#C9A227] transition-colors"
//                   >
//                     الزرقاء
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setSearchQuery("إربد")}
//                     className="px-4 py-2 bg-white border border-[#C9A227]/40 text-[#1A3045] rounded-md text-sm hover:bg-[#C9A227]/10 hover:border-[#C9A227] transition-colors"
//                   >
//                     إربد
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setSearchQuery("مقالات")}
//                     className="px-4 py-2 bg-white border border-[#C9A227]/40 text-[#1A3045] rounded-md text-sm hover:bg-[#C9A227]/10 hover:border-[#C9A227] transition-colors"
//                   >
//                     مقالات
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Classic Login Form Modal with Ornamental Design */}
//     {isFormOpen && (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//         {/* الخلفية */}
//         <div 
//           className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
//           onClick={(e) => {
//             e.stopPropagation();
//             setFormOpen(false);
//           }}
//         />
        
//         {/* النموذج */}
//         <div 
//           className="relative z-50 bg-[#FBF7EA] rounded-lg w-full max-w-md overflow-hidden shadow-2xl border-2 border-[#C9A227]"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header with ornamental design */}
//           <div className="bg-[#1A3045] p-4 text-white flex justify-between items-center relative">
//             <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#C9A227]"></div>
//             <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#C9A227]"></div>
            
//             <h2 className="text-xl font-serif font-bold">تسجيل الدخول / إنشاء حساب</h2>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setFormOpen(false);
//               }}
//               className="text-[#C9A227] hover:text-white transition-colors p-1 rounded-full"
//               aria-label="Close"
//             >
//               <FaTimes size={18} />
//             </button>
            
//             <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#C9A227]"></div>
//             <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#C9A227]"></div>
//           </div>
          
//           {/* Content */}
//           <div className="p-6 relative">
//             <div className="absolute inset-0 opacity-10 pointer-events-none">
//               <div className="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-[#C9A227]"></div>
//               <div className="absolute bottom-6 right-6 w-20 h-20 border-r-2 border-b-2 border-[#C9A227]"></div>
//             </div>
            
//             <FormRegistration
//               onClose={() => setFormOpen(false)}
//               onLogin={handleLoginSuccess}
//             />
//           </div>
//         </div>
//       </div>
//     )}
//   </>
// );
// };

// const ChevronDown = ({ className, ...props }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 20 20"
//     fill="currentColor"
//     className={`w-4 h-4 ${className}`}
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



