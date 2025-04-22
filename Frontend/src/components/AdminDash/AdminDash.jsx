import { useState } from "react"
import { Calendar, MessageSquare, MapPin, CreditCard, Home, Users, Settings, Menu, X, LogOut } from 'lucide-react'
import OverviewTabComponent from "../AdminDash/Overview"
import PlacesTabComponent from "../AdminDash/places"
import MessagesTabComponent from "../AdminDash/messages"
import BookingsTabComponent from "../AdminDash/bookings"
import UsersTab from "../AdminDash/Users"
import SettingsTab from "../AdminDash/settings"
import NavBarComponent from "../AdminDash/nav"
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const navigate = useNavigate();
  const Admin= localStorage.getItem("isAdmin") ;
  const token = localStorage.getItem("token");
  console.log("Token retrieved:", token);
  
  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div dir="rtl" className="flex h-screen bg-gradient-to-br from-[#F4F6F9] to-[#E8EBF0] text-[#2D2D2D] font-sans">
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-gradient-to-r from-[#053F5E] to-[#022C43] text-white shadow-lg md:hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <X size={24} className="transform transition-transform duration-300 hover:rotate-90" />
        ) : (
          <Menu size={24} className="transform transition-transform duration-300 hover:rotate-180" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"} 
        md:translate-x-0 z-40 w-72 bg-gradient-to-b from-[#022C43] to-[#014C69] text-white 
        transition-all duration-500 ease-in-out md:static md:inset-auto md:translate-x-0
        shadow-2xl`}
      >
        <div className="p-5 border-b border-[#115173] shadow-lg bg-gradient-to-r from-[#053F5E] to-[#022C43]">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFEC8B]">
            لوحة التحكم
          </h1>
          <p className="text-xs text-[#7FB3D5] mt-1">الإصدار 2.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem
            icon={<Home className="transition-transform duration-300 group-hover:scale-110" />}
            text="نظرة عامة"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            hovered={hoveredItem === "overview"}
            onHover={() => setHoveredItem("overview")}
          />
          <SidebarItem
            icon={<MapPin className="transition-transform duration-300 group-hover:scale-110" />}
            text="الأماكن المقترحة"
            active={activeTab === "places"}
            onClick={() => setActiveTab("places")}
            hovered={hoveredItem === "places"}
            onHover={() => setHoveredItem("places")}
          />
          <SidebarItem
            icon={<MessageSquare className="transition-transform duration-300 group-hover:scale-110" />}
            text="الرسائل"
            active={activeTab === "messages"}
            onClick={() => setActiveTab("messages")}
            hovered={hoveredItem === "messages"}
            onHover={() => setHoveredItem("messages")}
          />
          <SidebarItem
            icon={<Calendar className="transition-transform duration-300 group-hover:scale-110" />}
            text="الحجوزات"
            active={activeTab === "bookings"}
            onClick={() => setActiveTab("bookings")}
            hovered={hoveredItem === "bookings"}
            onHover={() => setHoveredItem("bookings")}
          />
          <SidebarItem
            icon={<CreditCard className="transition-transform duration-300 group-hover:scale-110" />}
            text="المدفوعات"
            active={activeTab === "payments"}
            onClick={() => setActiveTab("payments")}
            hovered={hoveredItem === "payments"}
            onHover={() => setHoveredItem("payments")}
          />
          <SidebarItem
            icon={<Users className="transition-transform duration-300 group-hover:scale-110" />}
            text="المستخدمين"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            hovered={hoveredItem === "users"}
            onHover={() => setHoveredItem("users")}
          />
          <SidebarItem
            icon={<Settings className="transition-transform duration-300 group-hover:scale-110" />}
            text="الإعدادات"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            hovered={hoveredItem === "settings"}
            onHover={() => setHoveredItem("settings")}
          />
          
          {/* Logout Button with special styling */}
          <div className="pt-4 mt-4 border-t border-[#115173]">
            <SidebarItem
              icon={<LogOut className="transition-transform duration-300 group-hover:scale-110" />}
              text="تسجيل الخروج"
              active={false}
              onClick={handleLogout}
              hovered={hoveredItem === "logout"}
              onHover={() => setHoveredItem("logout")}
              isLogout={true}
            />
          </div>
        </nav>
    
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBarComponent />
        <div className="flex-1 overflow-auto bg-gradient-to-br from-[#F9F9F9] to-[#F0F2F5]">
          <div className="p-6 transition-all duration-300">
            {activeTab === "overview" && <OverviewTabComponent />}
            {activeTab === "places" && <PlacesTabComponent />}
            {activeTab === "messages" && <MessagesTabComponent />}
            {activeTab === "bookings" && <BookingsTabComponent />}
            {activeTab === "payments" && <PaymentsTabComponent />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
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