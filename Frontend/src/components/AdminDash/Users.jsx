import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Shield,
  ShieldOff,
  MoreVertical,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../AdminDash/AddAdmin";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const usersPerPage = 5;

  const userCookie = Cookies.get("user");
  const parsedUser = userCookie ? JSON.parse(userCookie) : null;
  const token = parsedUser?.token;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:9527/api/auth/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("حدث خطأ أثناء جلب بيانات المستخدمين");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:9527/api/auth/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isDeleted: true } : u))
      );

      toast.success("تم حظر المستخدم بنجاح");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("حدث خطأ أثناء حظر المستخدم");
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:9527/api/auth/restore/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isDeleted: false } : u))
      );

      toast.success("تم استرجاع المستخدم بنجاح");
    } catch (error) {
      console.error("Error restoring user:", error);
      toast.error("حدث خطأ أثناء استرجاع المستخدم");
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await axios.put(
        `http://localhost:9527/api/auth/activate/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, status: "active" } : user
        )
      );
      toast.success("تم تفعيل المستخدم بنجاح");
    } catch (error) {
      console.error("Error activating user:", error);
      toast.error("حدث خطأ أثناء تفعيل المستخدم");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase()?.includes(searchTerm.toLowerCase());

    switch (filter) {
      case "all":
        return !user.isDeleted && matchesSearch;
      case "admins":
        return user.isAdmin && !user.isDeleted && matchesSearch;
      case "users":
        return !user.isAdmin && !user.isDeleted && matchesSearch;
      case "blocked":
        return user.status === "blocked" && !user.isDeleted && matchesSearch;
      case "deleted":
        return user.isDeleted && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddAdmin = (username, email, password) => {
    console.log("Adding admin", username, email, password);
    // Implement your admin adding logic here
  };

  // Filter counters
  const filterCounts = {
    all: users.filter(u => !u.isDeleted).length,
    admins: users.filter(u => u.isAdmin && !u.isDeleted).length,
    users: users.filter(u => !u.isAdmin && !u.isDeleted).length,
    deleted: users.filter(u => u.isDeleted).length
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-3 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[#022C43] flex items-center">
            <User className="mr-2" /> إدارة المستخدمين
          </h1>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              className="flex-1 sm:flex-none bg-white text-[#115173] px-3 py-2 rounded-md border border-[#115173] shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              <RefreshCw
                size={16}
                className={`ml-1 sm:ml-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="text-sm sm:text-base">تحديث</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 sm:flex-none bg-[#115173] text-white px-3 py-2 rounded-md shadow-md hover:bg-[#0a3c5c] transition-all flex items-center justify-center"
            >
              <Plus size={16} className="ml-1 sm:ml-2" />
              <span className="text-sm sm:text-base">إضافة أدمن</span>
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          {/* Card Header with Filters */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#115173] to-[#022C43]">
            <div className="flex flex-col space-y-4">
              {/* Desktop Filters */}
              <div className="hidden md:flex bg-white/10 p-1 rounded-lg self-start">
                <button
                  className={`px-3 py-2 rounded-md transition-all text-sm ${
                    filter === "all"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  الكل ({filterCounts.all})
                </button>
                <button
                  className={`px-3 py-2 rounded-md transition-all text-sm ${
                    filter === "admins"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("admins")}
                >
                  مدراء ({filterCounts.admins})
                </button>
                <button
                  className={`px-3 py-2 rounded-md transition-all text-sm ${
                    filter === "users"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("users")}
                >
                  مستخدمين ({filterCounts.users})
                </button>
                <button
                  className={`px-3 py-2 rounded-md transition-all text-sm ${
                    filter === "deleted"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("deleted")}
                >
                  المحذوفين ({filterCounts.deleted})
                </button>
              </div>

              {/* Mobile Filters Button */}
              <div className="md:hidden flex justify-between items-center">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="bg-white/20 text-white px-3 py-2 rounded-md flex items-center text-sm"
                >
                  <Filter size={16} className="ml-2" />
                  {filter === "all" ? "الكل" : 
                   filter === "admins" ? "مدراء" : 
                   filter === "users" ? "مستخدمين" : "المحذوفين"}
                </button>
                
                {/* Mobile Filter Dropdown */}
                {mobileFiltersOpen && (
                  <div className="absolute top-0 right-0 mt-16 mr-4 z-20 bg-white rounded-lg shadow-xl p-2 border border-gray-200 w-40">
                    <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
                      <h3 className="font-medium text-gray-700">تصفية</h3>
                      <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400">
                        <X size={16} />
                      </button>
                    </div>
                    <button
                      className={`w-full text-right px-3 py-2 rounded-md text-sm mb-1 ${
                        filter === "all" ? "bg-[#115173] text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setFilter("all");
                        setMobileFiltersOpen(false);
                      }}
                    >
                      الكل ({filterCounts.all})
                    </button>
                    <button
                      className={`w-full text-right px-3 py-2 rounded-md text-sm mb-1 ${
                        filter === "admins" ? "bg-[#115173] text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setFilter("admins");
                        setMobileFiltersOpen(false);
                      }}
                    >
                      مدراء ({filterCounts.admins})
                    </button>
                    <button
                      className={`w-full text-right px-3 py-2 rounded-md text-sm mb-1 ${
                        filter === "users" ? "bg-[#115173] text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setFilter("users");
                        setMobileFiltersOpen(false);
                      }}
                    >
                      مستخدمين ({filterCounts.users})
                    </button>
                    <button
                      className={`w-full text-right px-3 py-2 rounded-md text-sm ${
                        filter === "deleted" ? "bg-[#115173] text-white" : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setFilter("deleted");
                        setMobileFiltersOpen(false);
                      }}
                    >
                      المحذوفين ({filterCounts.deleted})
                    </button>
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="بحث عن مستخدم..."
                  className="w-full bg-white bg-opacity-20 text-white border border-white/30 rounded-md px-4 py-2 pr-10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
                />
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-[#115173] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#115173]">جاري تحميل البيانات...</p>
            </div>
          ) : (
            <>
              {/* Mobile User Cards View */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <MobileUserCard
                      key={user._id}
                      user={user}
                      onDelete={handleDeleteUser}
                      onRestore={handleRestoreUser}
                      onActivate={handleActivateUser}
                    />
                  ))
                ) : (
                  <div className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      {searchTerm ? (
                        <>
                          <EyeOff size={48} className="mb-2 text-gray-400" />
                          <p>لا توجد نتائج مطابقة للبحث</p>
                        </>
                      ) : (
                        <>
                          <User size={48} className="mb-2 text-gray-400" />
                          <p>لا يوجد مستخدمين لعرضهم</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-right min-w-[800px]">
                  <thead className="bg-gray-50 text-[#115173]">
                    <tr>
                      <th className="px-6 py-4 font-semibold rounded-tr-lg">
                        المستخدم
                      </th>
                      <th className="px-6 py-4 font-semibold">
                        البريد الإلكتروني
                      </th>
                      <th className="px-6 py-4 font-semibold">رقم الهاتف</th>
                      <th className="px-6 py-4 font-semibold">تاريخ التسجيل</th>
                      <th className="px-6 py-4 font-semibold">الدور</th>
                      <th className="px-6 py-4 font-semibold">الحالة</th>
                      <th className="px-6 py-4 font-semibold rounded-tl-lg">
                        إجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <UserRow
                          key={user._id}
                          user={user}
                          onDelete={handleDeleteUser}
                          onRestore={handleRestoreUser}
                          onActivate={handleActivateUser}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-16">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            {searchTerm ? (
                              <>
                                <EyeOff
                                  size={48}
                                  className="mb-2 text-gray-400"
                                />
                                <p>لا توجد نتائج مطابقة للبحث</p>
                              </>
                            ) : (
                              <>
                                <User
                                  size={48}
                                  className="mb-2 text-gray-400"
                                />
                                <p>لا يوجد مستخدمين لعرضهم</p>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-right">
                    عرض {indexOfFirstUser + 1}-
                    {Math.min(indexOfLastUser, filteredUsers.length)} من{" "}
                    {filteredUsers.length} مستخدم
                  </div>
                  <div className="flex space-x-1 sm:space-x-2 space-x-reverse">
                    <button
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md border ${
                        currentPage === 1
                          ? "text-gray-400 border-gray-200"
                          : "border-[#115173] text-[#115173] hover:bg-[#115173] hover:text-white"
                      } transition-colors`}
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <svg
                        className="rotate-90"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {/* Simplified pagination for small screens */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => {
                        // On mobile, only show current page and adjacent pages
                        const isSmallScreen = window.innerWidth < 640;
                        const shouldShow = 
                          !isSmallScreen ||
                          number === 1 || 
                          number === totalPages ||
                          number === currentPage ||
                          number === currentPage - 1 ||
                          number === currentPage + 1;
                        
                        if (!shouldShow && number === currentPage - 2) {
                          return (
                            <span key="leftEllipsis" className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                              ...
                            </span>
                          );
                        }
                        
                        if (!shouldShow && number === currentPage + 2) {
                          return (
                            <span key="rightEllipsis" className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                              ...
                            </span>
                          );
                        }
                        
                        if (!shouldShow) return null;
                        
                        return (
                          <button
                            key={number}
                            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md border transition-colors ${
                              currentPage === number
                                ? "bg-[#115173] text-white border-[#115173]"
                                : "border-gray-300 hover:border-[#115173] hover:text-[#115173]"
                            }`}
                            onClick={() => paginate(number)}
                          >
                            {number}
                          </button>
                        );
                      }
                    )}

                    <button
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md border ${
                        currentPage === totalPages
                          ? "text-gray-400 border-gray-200"
                          : "border-[#115173] text-[#115173] hover:bg-[#115173] hover:text-white"
                      } transition-colors`}
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <svg
                        className="rotate-270"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* المودال */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddAdmin}
      />
    </div>
  );
}

// Mobile User Card Component
function MobileUserCard({ user, onDelete, onActivate, onRestore }) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "غير معروف";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "active":
        return {
          class: "bg-emerald-100 text-emerald-800 border-emerald-200",
          text: "نشط",
          icon: <Eye size={12} className="ml-1" />,
        };
      case "pending":
        return {
          class: "bg-amber-100 text-amber-800 border-amber-200",
          text: "قيد التفعيل",
          icon: <RefreshCw size={12} className="ml-1" />,
        };
      case "blocked":
        return {
          class: "bg-red-100 text-red-800 border-red-200",
          text: "محظور",
          icon: <EyeOff size={12} className="ml-1" />,
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800 border-gray-200",
          text: "غير معروف",
          icon: null,
        };
    }
  };

  const getRoleDetails = (isAdmin) => {
    return isAdmin
      ? {
          class: "bg-[#115173]/10 text-[#115173] border-[#115173]/20",
          text: "مدير",
          icon: <Shield size={12} className="ml-1" />,
        }
      : {
          class: "bg-gray-100 text-gray-700 border-gray-200",
          text: "مستخدم",
          icon: <User size={12} className="ml-1" />,
        };
  };

  const statusDetails = getStatusDetails(user.status);
  const roleDetails = getRoleDetails(user.isAdmin);

  return (
    <div className="p-4 bg-white">
      <div className="flex justify-between">
        {/* User Avatar and Basic Info */}
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#115173] to-[#022C43] flex items-center justify-center ml-3 overflow-hidden border-2 border-[#FFD700] shadow-md">
            {user.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                className="w-10 h-10 object-cover"
              />
            ) : (
              <span className="text-white text-sm font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-[#022C43] text-sm">
              {user.username || "مستخدم بدون اسم"}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center ${roleDetails.class}`}
              >
                {roleDetails.icon}
                {roleDetails.text}
              </span>
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center ${statusDetails.class}`}
              >
                {statusDetails.icon}
                {statusDetails.text}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            className="p-2 rounded-full transition-colors bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#115173]"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical size={18} />
          </button>

          {showActions && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden">
              {user.isDeleted ? (
                <button
                  className="block w-full text-right px-4 py-3 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center"
                  onClick={() => {
                    onRestore(user._id);
                    setShowActions(false);
                  }}
                >
                  <RefreshCw size={16} className="ml-2" />
                  استرجاع
                </button>
              ) : user.status === "blocked" ? (
                <button
                  className="block w-full text-right px-4 py-3 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center"
                  onClick={() => {
                    onActivate(user._id);
                    setShowActions(false);
                  }}
                >
                  <Eye size={16} className="ml-2" />
                  تفعيل
                </button>
              ) : (
                <button
                  className="block w-full text-right px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  onClick={() => {
                    onDelete(user._id);
                    setShowActions(false);
                  }}
                >
                  <ShieldOff size={16} className="ml-2" />
                  حظر
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Details */}
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center text-gray-700">
          <Mail size={14} className="ml-2 text-[#115173]" />
          <span className="truncate">{user.email || "بريد غير معروف"}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Phone size={14} className="ml-2 text-[#115173]" />
          <span>{user.phone || "غير متوفر"}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2 text-[#115173]"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

// Desktop User Row Component
function UserRow({ user, onDelete, onActivate, onRestore }) {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "غير معروف";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ar-EG", options);
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "active":
        return {
          class: "bg-emerald-100 text-emerald-800 border-emerald-200",
          text: "نشط",
          icon: <Eye size={12} className="ml-1" />,
        };
      case "pending":
        return {
          class: "bg-amber-100 text-amber-800 border-amber-200",
          text: "قيد التفعيل",
          icon: <RefreshCw size={12} className="ml-1" />,
        };
      case "blocked":
        return {
          class: "bg-red-100 text-red-800 border-red-200",
          text: "محظور",
          icon: <EyeOff size={12} className="ml-1" />,
        };
      default:
        return {
          class: "bg-gray-100 text-gray-800 border-gray-200",
          text: "غير معروف",
          icon: null,
        };
    }
  };

  const getRoleDetails = (isAdmin) => {
    return isAdmin
      ? {
          class: "bg-[#115173]/10 text-[#115173] border-[#115173]/20",
          text: "مدير",
          icon: <Shield size={12} className="ml-1" />,
        }
      : {
          class: "bg-gray-100 text-gray-700 border-gray-200",
          text: "مستخدم",
          icon: <User size={12} className="ml-1" />,
        };
  };

  const statusDetails = getStatusDetails(user.status);
  const roleDetails = getRoleDetails(user.isAdmin);

  return (
    <tr
      className={`transition-colors ${
        isHovered ? "bg-gray-50" : "hover:bg-gray-50"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#115173] to-[#022C43] flex items-center justify-center ml-2 sm:ml-3 overflow-hidden border-2 border-[#FFD700] shadow-md">
            {user.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-sm sm:text-lg font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-[#022C43] text-sm sm:text-base">
              {user.username || "مستخدم بدون اسم"}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              آخر تسجيل دخول: غير معروف
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center text-gray-700 text-sm">
          <Mail size={14} className="ml-2 text-[#115173]" />
          <span className="truncate max-w-[120px] sm:max-w-[200px]">
            {user.email || "بريد غير معروف"}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center text-gray-700 text-sm">
          <Phone size={14} className="ml-2 text-[#115173]" />
          {user.phone || "غير متوفر"}
        </div>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4 text-gray-700 text-sm">{formatDate(user.createdAt)}</td>
      <td className="px-4 py-3 sm:px-6 sm:py-4">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center w-fit ${roleDetails.class}`}
        >
          {roleDetails.icon}
          {roleDetails.text}
        </span>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center w-fit ${statusDetails.class}`}
        >
          {statusDetails.icon}
          {statusDetails.text}
        </span>
      </td>
      <td className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="relative">
          <button
            className={`p-2 rounded-full transition-colors ${
              isHovered
                ? "bg-gray-200 text-[#115173]"
                : "text-gray-500 hover:bg-gray-200 hover:text-[#115173]"
            }`}
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical size={18} />
          </button>

          {showActions && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden">
              {user.isDeleted ? (
                <button
                  className="block w-full text-right px-4 py-3 text-sm text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center"
                  onClick={() => {
                    onRestore(user._id);
                    setShowActions(false);
                  }}
                >
                  <RefreshCw size={16} className="ml-2" />
                  استرجاع
                </button>
              ) : user.status === "blocked" ? (
                <button
                  className="block w-full text-right px-4 py-3 text-sm text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center"
                  onClick={() => {
                    onActivate(user._id);
                    setShowActions(false);
                  }}
                >
                  <Eye size={16} className="ml-2" />
                  تفعيل
                </button>
              ) : (
                <button
                  className="block w-full text-right px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  onClick={() => {
                    onDelete(user._id);
                    setShowActions(false);
                  }}
                >
                  <ShieldOff size={16} className="ml-2" />
                  حظر
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}