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
  const [language, setLanguage] = useState('en'); // Default to English
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

  // Language toggle function
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
      title: `Welcome ${userData.username}!`,
      text: "Account created successfully",
      icon: "success",
      iconColor: '#FFD700',
      confirmButtonColor: "#115173",
      background: "white",
      color: "#115173",
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to logout?",
      icon: "question",
      iconColor: '#FFD700',
      showCancelButton: true,
      confirmButtonColor: "#115173",
      cancelButtonColor: "#115173",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      background: "white",
      color: "#115173",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsUserMenuOpen(false);
        navigate("/homeenglish");
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

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-[#022C43] shadow-lg" : "bg-gradient-to-b from-[#022C43]/90 to-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
          {/* Logo on the left */}
          <div className="flex items-center gap-75">
            <Link to="/homeenglish" className="flex items-center group">
              <img className="h-14 md:h-15 w-auto transition-transform group-hover:scale-105" src={logo} alt="Logo" />
            </Link>

            {/* Navigation Links - Desktop */}
              <nav className="hidden lg:flex items-center gap-6 text-lg">
              
              <Link
                className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
                to="/about"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
              </Link>
           
             
                  <Link
                className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
                to="/article"
              >
                Blogs
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link
                className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
                to="/seasonPage/:season"
              >
                Seasonal
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
              </Link>
                 <Link
                className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
                to="/location"
              >
                Locations
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
              </Link>
                 <Link
                className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
                to="/homeenglish"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
          </div>

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

          {/* User Actions - Right side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language toggle for desktop */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center px-4 py-2 rounded transition-colors duration-200 ${
                isScrolled
                  ? "bg-transparent text-white border-white hover:bg-white/10"
                  : "bg-transparent text-white border-white hover:bg-white/10"
              }`}
            >
              <FaGlobe className="mr-2" />
              {language === 'en' ? 'العربية' : 'English'}
            </button>

            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded transition-colors duration-200 
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
                      src="https://i.pinimg.com/736x/db/0e/ac/db0eacda4a065cce5e396845a502e13e.jpg"
                      alt="User Profile"
                      style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                    />
                  </div>
                  <span>{user.username}</span>
                  <ChevronDown
                    className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-300 origin-top">
                    <Link
                      to={user.isAdmin ? "/AdminDash" : `/ProfilePage/${user.userId}`}
                      className="flex items-center px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaUser className="mr-2 text-[#115173]" />
                      {user.isAdmin ? "Dashboard" : "Profile"}
                    </Link>
               
                    <button>
                      <Link
                        to="/favorite"
                        className="w-full flex items-center px-4 py-3 text-[#022C43] hover:bg-[#F0F0F0] transition-colors border-t border-[#F0F0F0]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FileHeart className="mr-2 text-[#115173]" />
                        Favorites
                      </Link>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 transition-colors border-t border-[#F0F0F0]"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
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
                    : "bg-[#022C43] text-[#ffffff] hover:bg-[#115173]/90"
                } hover:scale-105 font-medium`}
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <div className="lg:hidden fixed top-20 left-0 w-full bg-[#022C43] p-6 shadow-xl flex flex-col rounded-b-lg z-40">
            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/homeenglish"
              onClick={() => setMenuOpen(false)}
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/location"
              onClick={() => setMenuOpen(false)}
            >
              Destinations
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>
    
            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/article"
              onClick={() => setMenuOpen(false)}
            >
              Blogs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/seasonPage/:season"
              onClick={() => setMenuOpen(false)}
            >
              Seasonal
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              className="relative group py-2 px-1 text-white hover:text-[#FFD700] transition-colors"
              to="/about"
              onClick={() => setMenuOpen(false)}
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mobile User Actions */}
            <div className="mt-4 flex flex-col gap-3 w-full">
              {/* Language toggle button for mobile */}
              <button
                onClick={toggleLanguage}
                className={`flex items-center justify-center px-4 py-2 rounded-lg ${
                  isScrolled 
                    ? "bg-[#115173] text-white" 
                    : "bg-[#115173] text-white"
                }`}
              >
                <FaGlobe className="mr-2" />
                {language === 'en' ? 'العربية' : 'English'}
              </button>

              {user ? (
                <div className="flex flex-col gap-2">
                  {user.isAdmin && (
                    <Link
                      to="/AdminDash"
                      className="flex items-center px-4 py-2.5 bg-[#FFD700] text-[#022C43] rounded-lg hover:bg-[#FFD700]/90 transition-colors justify-center"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaCog className="mr-2" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to={`/ProfilePage/${user.userId}`}
                    className="flex items-center px-4 py-2.5 bg-[#115173] text-white rounded-lg hover:bg-[#115173]/90 transition-colors justify-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2.5 bg-transparent border border-red-400 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors justify-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
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
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Login Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setFormOpen(false);
            }}
          />
          
          {/* Form */}
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
              <h2 className="text-xl font-bold">Login / Register</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFormOpen(false);
                }}
                className="text-[#FFD700] hover:text-[#022C43] transition-colors p-1 rounded-full"
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