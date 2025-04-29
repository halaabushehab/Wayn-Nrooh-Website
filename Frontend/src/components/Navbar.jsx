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
              to="/About"
              onClick={() => setMenuOpen(false)}
            >
              من نحن
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? "bg-[#FFD700] text-[#022C43] hover:bg-[#FFD700]/90 shadow-md" 
                  : "bg-[#115173] text-white hover:bg-[#115173]/90"
              } hover:scale-105`}
              aria-label="Search"
            >
              <FaSearch />
              <span>بحث</span>
            </button>

            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isScrolled 
                      ? "bg-[#022C43] text-white hover:bg-[#022C43]/90 shadow-md" 
                      : "bg-[#115173] text-white hover:bg-[#115173]/90"
                  } hover:scale-105`}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-[#022C43] font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
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
                    : "bg-[#115173] text-white hover:bg-[#115173]/90"
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
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setFormOpen(false)}
          />
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div 
              className="bg-white rounded-xl w-full max-w-md z-50 overflow-hidden shadow-2xl transform transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)",
                border: "2px solid #FFD700"
              }}
            >
              <div className="bg-[#022C43] p-4 text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">تسجيل الدخول / إنشاء حساب</h2>
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-[#FFD700] hover:text-white transition-colors p-1 rounded-full"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              <div className="p-6">
                <FormRegistration
                  onClose={() => setFormOpen(false)}
                  onLogin={handleLoginSuccess}
                />
              </div>
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
// import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog,FaSearch } from "react-icons/fa";
// import logo from "./img/Screenshot 2025-01-24 235121.png";
// import FormRegistration from "../components/FormRegistration";
// import Swal from "sweetalert2";
// import axios from "axios";
// import Cookies from "js-cookie";

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

//   useEffect(() => {
//     const loadUserFromCookies = () => {
//       const userCookie = Cookies.get("user");
//       if (userCookie) {
//         try {
//           const parsedUser = JSON.parse(userCookie);
//           console.log("🧖 Loading user from cookies:", parsedUser);

//           if (parsedUser.token) {
//             setUser({
//               username: parsedUser.username,
//               userId: parsedUser.userId,
//               isAdmin: parsedUser.isAdmin || false,
//             });

//             axios.defaults.headers.common[
//               "Authorization"
//             ] = `Bearer ${parsedUser.token}`;
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
//     console.log("✅ تم تسجيل المستخدم:", userData);
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
//       if (
//         citiesDropdownRef.current &&
//         !citiesDropdownRef.current.contains(event.target)
//       ) {
//         setIsCitiesOpen(false);
//       }
//       if (
//         userDropdownRef.current &&
//         !userDropdownRef.current.contains(event.target)
//       ) {
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
//       if (window.scrollY > 50) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <>
//      <header
//   dir="rtl"
//   className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//     isScrolled ? "bg-gray-100 shadow-md" : "bg-transparent"
//   }`}
// >

//         <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
//           {/* Logo */}
//           <Link to="/" className="flex items-center">
//             <img className="h-15 md:h-15 w-auto" src={logo} alt="Logo" />
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
//             className={`lg:flex items-center gap-12 text-lg transition-colors duration-300 ${
//               menuOpen
//                 ? "fixed top-16 right-0 w-full bg-[#022C43] p-6 shadow-lg flex flex-col"
//                 : "hidden"
//             } ${isScrolled ? "text-black" : "text-white"}`}
//           >
//             <Link
//               className="hover:text-[#FFD700] transition py-2 text-base"
//               to="/"
//               onClick={() => setMenuOpen(false)}
//             >
//               الرئيسية
//             </Link>
  
//             <div className="relative" ref={citiesDropdownRef}>
//               <button
//                 onClick={() => setIsCitiesOpen(!isCitiesOpen)}
//                 className={`hover:text-[#FFD700] flex items-center py-2 text-base ${
//                   isScrolled ? "text-black" : "text-white"
//                 }`}
//               >
//                 المدن{" "}
//                 <ChevronDown
//                   className={`ml-1 transition-transform ${
//                     isCitiesOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>
//               <div
//                 className={`absolute right-0 mt-2 w-48 bg-[#ffffff] rounded-md shadow-lg overflow-hidden ${
//                   isCitiesOpen ? "block" : "hidden"
//                 }`}
//               >
//                 <Link
//                   className="block px-4 py-2 text-black hover:bg-[#F0F0F0] text-base"
//                   to="/places?city=عمان"
//                   onClick={() => {
//                     setIsCitiesOpen(false);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   عمان
//                 </Link>
//                 <Link
//                   className="block px-4 py-2 text-black hover:bg-[#F0F0F0] text-base"
//                   to="/places?city=الزرقاء"
//                   onClick={() => {
//                     setIsCitiesOpen(false);
//                     setMenuOpen(false);
//                   }}
//                 >
//                   الزرقاء
//                 </Link>
//                 <Link
//                   className="block px-4 py-2 text-black hover:bg-[#F0F0F0] text-base"
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
//               className={`hover:text-[#FFD700] transition py-2 text-base ${
//                 isScrolled ? "text-black" : "text-white"
//               }`}
//               to="/article"
//               onClick={() => setMenuOpen(false)}
//             >
//               المدونات
//             </Link>
//             <Link
//               className={`hover:text-[#FFD700] transition py-2 text-base ${
//                 isScrolled ? "text-black" : "text-white"
//               }`}
//               to="/About"
//               onClick={() => setMenuOpen(false)}
//             >
//               من نحن
//             </Link>
//             <Link
//               className={`hover:text-[#FFD700] transition py-2 text-base ${
//                 isScrolled ? "text-black" : "text-white"
//               }`}
//               to="/contact"
//               onClick={() => setMenuOpen(false)}
//             >
//               تواصل معنا
//             </Link>
  
//             {/* Mobile User Actions */}
//             <div className="lg:hidden mt-4">
//               {/* Mobile Search Button */}
//               <div className="mb-2">
//                 <button
//                   onClick={() => setSearchOpen(!isSearchOpen)}
//                   className="w-full px-4 py-2 bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700]/10 transition-colors text-base flex items-center justify-center"
//                 >
//                   <FaSearch className="ml-2" />
//                   بحث
//                 </button>
//               </div>
  
//               {user ? (
//                 <div className="flex flex-col gap-2">
//                   <Link
//                     to={
//                       user.isAdmin
//                         ? "/AdminDash"
//                         : `/ProfilePage/${user.userId}`
//                     }
//                     className="flex items-center px-4 py-2 text-white hover:bg-[#0d3a5a] transition-colors rounded-lg text-base"
//                     onClick={() => setMenuOpen(false)}
//                   >
//                     <FaUser className="ml-2" />
//                     {user.isAdmin ? "لوحة التحكم" : "الملف الشخصي"}
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="flex items-center px-4 py-2 text-red-400 hover:bg-[#0d3a5a] transition-colors rounded-lg text-right text-base"
//                   >
//                     <FaSignOutAlt className="ml-2" />
//                     تسجيل الخروج
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setFormOpen(true);
//                     setMenuOpen(false);
//                   }}
//                   className="w-full px-4 py-2 bg-transparent border border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700]/10 transition-colors text-base"
//                 >
//                   تسجيل الدخول
//                 </button>
//               )}
//             </div>
//           </nav>
  
//           {/* Desktop User Actions */}
//           <div className="hidden lg:flex items-center gap-4">
//             {/* Search Button */}
//             <button
//               onClick={() => setSearchOpen(!isSearchOpen)}
//               className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
//                 isScrolled 
//                   ? "bg-white text-[#022C43] hover:bg-gray-100" 
//                   : "bg-transparent border border-white text-white hover:bg-white/10"
//               }`}
//               aria-label="Search"
//             >
//               <FaSearch />
//               <span>بحث</span>
//             </button>
  
//             {user ? (
//               <div className="relative" ref={userDropdownRef}>
//                 <button
//                   onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//                     isScrolled 
//                       ? "bg-white text-[#022C43] hover:bg-gray-100" 
//                       : "bg-[#115173] text-white hover:bg-[#0d3a5a]"
//                   }`}
//                   aria-label="User menu"
//                 >
//                   <FaUser className="text-[#FFD700]" />
//                   <span>{user.username}</span>
//                   <ChevronDown
//                     className={`transition-transform ${
//                       isUserMenuOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
  
//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-56 bg-[#115173] rounded-md shadow-lg z-50 overflow-hidden">
//                     <Link
//                       to={
//                         user.isAdmin
//                           ? "/AdminDash"
//                           : `/ProfilePage/${user.userId}`
//                       }
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
//                 className={`px-4 py-2 rounded-lg transition-colors ${
//                   isScrolled 
//                     ? "bg-[#022C43] text-white hover:bg-[#033c5a]" 
//                     : "bg-transparent border border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
//                 }`}
//               >
//                 تسجيل الدخول
//               </button>
//             )}
//           </div>
//         </div>
//       </header>
  
//       {/* Search Modal */}
//       {isSearchOpen && (
//         <div className="fixed inset-0 z-50">
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setSearchOpen(false)}
//           />
//           <div className="relative flex items-center justify-center min-h-screen p-4">
//             <div className="bg-white rounded-lg w-full max-w-md z-50 p-4">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-bold">البحث</h2>
//                 <button
//                   onClick={() => setSearchOpen(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="ابحث هنا..."
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#022C43] text-right"
//                 />
//                 <button
//                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#022C43]"
//                 >
//                   <FaSearch />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
  
//       {/* Login Form Modal */}
//       {isFormOpen && (
//         <div className="fixed inset-0 z-50">
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-sm"
//             onClick={() => setFormOpen(false)}
//           />
  
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


























































































