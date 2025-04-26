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
      // إرسال الطلب إلى الخادم لحذف المستخدم
      await axios.delete(`http://localhost:9527/api/auth/delete/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // تعديل الحالة المحلية للمستخدم
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
      // تنفيذ عملية استرجاع المستخدم (إلغاء الحذف)
      await axios.delete(
        `http://localhost:9527/api/auth/restore/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // تعديل الحالة المحلية للمستخدم
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

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#022C43] flex items-center">
            <User className="mr-2" /> إدارة المستخدمين
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="bg-white text-[#115173] px-4 py-2 rounded-md border border-[#115173] shadow-sm hover:bg-gray-50 transition-all flex items-center"
            >
              <RefreshCw
                size={16}
                className={`ml-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              تحديث
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#115173] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#0a3c5c] transition-all flex items-center"
            >
              <Plus size={16} className="ml-2" />
              إضافة أدمن جديد
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#115173] to-[#022C43]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex bg-white/10 p-1 rounded-lg">
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === "all"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  الكل ({users.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === "admins"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("admins")}
                >
                  مدراء ({users.filter((u) => u.isAdmin).length})
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === "users"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("users")}
                >
مستخدمين ({users.filter(u => !u.isAdmin && !u.isDeleted).length})
</button>
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === "deleted"
                      ? "bg-white text-[#022C43] shadow-md"
                      : "text-white hover:bg-white/20"
                  }`}
                  onClick={() => setFilter("deleted")}
                >
                  المحذوفين ({users.filter((u) => u.isDeleted).length})
                </button>
              </div>

              <div className="relative w-full md:w-64">
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

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-[#115173] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-[#115173]">جاري تحميل البيانات...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
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

              {filteredUsers.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600">
                    عرض {indexOfFirstUser + 1}-
                    {Math.min(indexOfLastUser, filteredUsers.length)} من{" "}
                    {filteredUsers.length} مستخدم
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      className={`w-10 h-10 flex items-center justify-center rounded-md border ${
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

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          className={`w-10 h-10 flex items-center justify-center rounded-md border transition-colors ${
                            currentPage === number
                              ? "bg-[#115173] text-white border-[#115173]"
                              : "border-gray-300 hover:border-[#115173] hover:text-[#115173]"
                          }`}
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      )
                    )}

                    <button
                      className={`w-10 h-10 flex items-center justify-center rounded-md border ${
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
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#115173] to-[#022C43] flex items-center justify-center ml-3 overflow-hidden border-2 border-[#FFD700] shadow-md">
            {user.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                className="w-12 h-12 object-cover"
              />
            ) : (
              <span className="text-white text-lg font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-[#022C43]">
              {user.username || "مستخدم بدون اسم"}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              آخر تسجيل دخول: غير معروف
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-gray-700">
          <Mail size={16} className="ml-2 text-[#115173]" />
          <span className="truncate max-w-[200px]">
            {user.email || "بريد غير معروف"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center text-gray-700">
          <Phone size={16} className="ml-2 text-[#115173]" />
          {user.phone || "غير متوفر"}
        </div>
      </td>
      <td className="px-6 py-4 text-gray-700">{formatDate(user.createdAt)}</td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center w-fit ${roleDetails.class}`}
        >
          {roleDetails.icon}
          {roleDetails.text}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center w-fit ${statusDetails.class}`}
        >
          {statusDetails.icon}
          {statusDetails.text}
        </span>
      </td>
      <td className="px-6 py-4">
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
