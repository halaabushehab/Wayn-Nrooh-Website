import { useState, useEffect } from "react"
import { Calendar, MessageSquare, MapPin, CreditCard, Home, Users, Settings, Menu, X, LogOut } from 'lucide-react'
import OverviewTabComponent from "../AdminDash/Overview"
import PlacesTabComponent from "../AdminDash/places"
import MessagesTabComponent from "../AdminDash/messages"
import BookingsTabComponent from "../AdminDash/bookings"
import UsersTab from "../AdminDash/Users"
import PlogAdd from "../AdminDash/PlogAdd"
import SettingsTab from "../AdminDash/settings"
import NavBarComponent from "../AdminDash/nav"
import { useNavigate } from "react-router-dom";
import AdminReports from "../AdminDash/AdminReports";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div dir="rtl" className="flex h-screen bg-gradient-to-br from-[#F4F6F9] to-[#E8EBF0] text-[#2D2D2D] font-sans overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button
        className={`fixed top-4 right-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#053F5E] to-[#022C43] text-white shadow-lg md:hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={() => setSidebarOpen(true)}
        style={{ transition: 'opacity 0.3s ease' }}
        aria-label="Open sidebar"
      >
        <Menu size={24} className="transform transition-transform duration-300 hover:rotate-180" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-72 bg-gradient-to-b from-[#022C43] to-[#014C69] text-white 
        transition-all duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        md:translate-x-0 md:relative`}
        style={{ transitionProperty: 'transform' }}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            className="absolute top-4 left-4 p-2 text-white hover:text-[#FFD700] transition-colors duration-200"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}
        
        <div className="p-2 border-b border-[#115173] shadow-lg bg-gradient-to-r from-[#053F5E] to-[#022C43]">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFEC8B]">
            لوحة التحكم
          </h1>
          <p className="text-xs text-[#7FB3D5] mt-1">الإصدار 2.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar">
          <SidebarItem
            icon={<Home className="transition-transform duration-300 group-hover:scale-110" />}
            text="نظرة عامة"
            active={activeTab === "overview"}
            onClick={() => {
              setActiveTab("overview")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "overview"}
            onHover={() => setHoveredItem("overview")}
          />
          <SidebarItem
            icon={<MapPin className="transition-transform duration-300 group-hover:scale-110" />}
            text="الأماكن المقترحة"
            active={activeTab === "places"}
            onClick={() => {
              setActiveTab("places")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "places"}
            onHover={() => setHoveredItem("places")}
          />
          <SidebarItem
            icon={<MessageSquare className="transition-transform duration-300 group-hover:scale-110" />}
            text="الرسائل"
            active={activeTab === "messages"}
            onClick={() => {
              setActiveTab("messages")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "messages"}
            onHover={() => setHoveredItem("messages")}
          />
          <SidebarItem
            icon={<Calendar className="transition-transform duration-300 group-hover:scale-110" />}
            text="التقارير"
            active={activeTab === "reports"}
            onClick={() => {
              setActiveTab("reports")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "reports"}
            onHover={() => setHoveredItem("reports")}
          />
          <SidebarItem
            icon={<CreditCard className="transition-transform duration-300 group-hover:scale-110" />}
            text="المقالات"
            active={activeTab === "articles"}
            onClick={() => {
              setActiveTab("articles")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "articles"}
            onHover={() => setHoveredItem("articles")}
          />
          <SidebarItem
            icon={<Calendar className="transition-transform duration-300 group-hover:scale-110" />}
            text="الحجوزات"
            active={activeTab === "bookings"}
            onClick={() => {
              setActiveTab("bookings")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "bookings"}
            onHover={() => setHoveredItem("bookings")}
          />
          <SidebarItem
            icon={<Users className="transition-transform duration-300 group-hover:scale-110" />}
            text="المستخدمين"
            active={activeTab === "users"}
            onClick={() => {
              setActiveTab("users")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "users"}
            onHover={() => setHoveredItem("users")}
          />
          <SidebarItem
            icon={<Settings className="transition-transform duration-300 group-hover:scale-110" />}
            text="الإعدادات"
            active={activeTab === "settings"}
            onClick={() => {
              setActiveTab("settings")
              if (isMobile) setSidebarOpen(false)
            }}
            hovered={hoveredItem === "settings"}
            onHover={() => setHoveredItem("settings")}
          />
          
          {/* Logout Button */}
          <div className="pt-4 mt-4 border-t border-[#115173]">
            <SidebarItem
              icon={<LogOut className="transition-transform duration-300 group-hover:scale-110" />}
              text="تسجيل الخروج"
              active={false}
              onClick={() => {
                handleLogout()
                if (isMobile) setSidebarOpen(false)
              }}
              hovered={hoveredItem === "logout"}
              onHover={() => setHoveredItem("logout")}
              isLogout={true}
            />
          </div>
          
          {/* Sidebar Footer */}
          <div className="p-4 text-center text-xs text-[#7FB3D5] border-t border-[#115173] mt-4">
            © 2023 <span className="font-semibold text-[#FFD700]">نظام الإدارة</span> – جميع الحقوق محفوظة.
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBarComponent />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-[#F9F9F9] to-[#F0F2F5] p-4 md:p-6">
          <div className="transition-all duration-300">
            {activeTab === "overview" && <OverviewTabComponent />}
            {activeTab === "places" && <PlacesTabComponent />}
            {activeTab === "messages" && <MessagesTabComponent />}
            {activeTab === "bookings" && <BookingsTabComponent />}
            {activeTab === "articles" && <PlogAdd />}
            {activeTab === "reports" && <AdminReports />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>

      {/* Add this to your CSS file or style tag */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #115173 #022C43;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #022C43;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #115173;
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}

function SidebarItem({ icon, text, active, onClick, hovered, onHover, isLogout = false }) {
  return (
    <button
      className={`group flex items-center w-full p-3 rounded-xl transition-all duration-300 
        ${isLogout ? 
          'hover:bg-gradient-to-r from-[#FF3E3E] to-[#FF6B6B] text-white' : 
          active ? 
            'bg-gradient-to-r from-[#053F5E] to-[#115173] text-[#FFD700] shadow-md' : 
            hovered ? 
              'bg-gradient-to-r from-[#115173] to-[#1A6B8A] text-[#FFD700]' : 
              'text-white hover:text-[#FFD700]'
        }`}
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={() => onHover(null)}
    >
      <span className={`mr-3 transition-all duration-300 ${active || hovered ? 'scale-110' : ''}`}>
        {icon}
      </span>
      <span className="font-medium">{text}</span>
      {(active || hovered) && !isLogout && (
        <span className="mr-auto w-1 h-6 bg-[#FFD700] rounded-full transition-all duration-300"></span>
      )}
    </button>
  )
}