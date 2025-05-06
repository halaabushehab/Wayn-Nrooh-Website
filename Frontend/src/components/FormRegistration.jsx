import { useState, useEffect } from "react";
import { Lock, Mail, User, Eye, EyeOff, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

export default function AuthForm() {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);    const error = useSelector((state) => state.auth.error);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [isSignUp, setIsSignUp] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(false);
        setTimeout(() => setAnimate(true), 10);
    }, [isSignUp]);


    // useEffect(() => {
    //   const token = Cookies.get("token");
    //   const userCookie = Cookies.get("user");
    
    //   if (token && userCookie) {
    //       const userData = JSON.parse(userCookie);
    //       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    //       setUser(userData);
    //       setIsLoggedIn(true);
    //       setIsOpen(false); // إضافة هذا السطر لإخفاء الفورم
    //       console.log("✅ User is still logged in after refresh:", userData);
    //   } else {
    //       console.log("🔴 User is not logged in.");
    //       setUser(null);
    //       setIsLoggedIn(false);
    //   }
    // }, []);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const { username, email, password } = formData;
        if (isSignUp && !username) {
            Swal.fire("خطأ", "الاسم مطلوب.", "error");
            return false;
        }
        if (!email) {
            Swal.fire("خطأ", "البريد الإلكتروني مطلوب.", "error");
            return false;
        }
        if (!password) {
            Swal.fire("خطأ", "كلمة المرور مطلوبة.", "error");
            return false;
        }
        if (email && !emailPattern.test(email)) {
            Swal.fire("خطأ", "صيغة البريد الإلكتروني غير صحيحة.", "error");
            return false;
        }
        return true;
    };


 const handleRegister = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const { username, email, password } = formData;
  axios.defaults.withCredentials = true; // إضافة هذا السطر

  // تأكد أن البيانات اللي راح ترسلها صحيحة
  console.log("📤 بيانات التسجيل:", { username, email, password });

  try {
    const response = await axios.post(
      "http://localhost:9527/api/auth/register",
      { username, email, password },
      { withCredentials: true } // إضافة هذا الخيار
    );

    // تأكد من أن الرد يحتوي على البيانات اللازمة
    console.log("✅ رد السيرفر:", response.data);

    const userData = response.data;
    const token = userData.token; // استخراج التوكن بشكل منفصل مثل handleLogin

    if (!token) {
      throw new Error("الرد لا يحتوي على توكن. تحقق من الباكيند.");
    }

    // تخزين بيانات المستخدم في الكوكيز بنفس طريقة handleLogin
    Cookies.set("user", JSON.stringify({
      token: token,
      username: userData.username,
      email: userData.email,
      userId: userData.userId,
      isAdmin: userData.isAdmin || false,
    }), { expires: 7 });

    // إعداد التوكن في الهيدر للطلبات الجاية
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setIsOpen(false); // نقل إغلاق الفورم هنا مثل handleLogin

    // عرض رسالة نجاح بنفس أسلوب handleLogin
    Swal.fire({
      title: `مرحبًا ${userData.username}! 👋`,
      text: "تم إنشاء الحساب بنجاح! تم تسجيل الدخول تلقائيًا.",
      icon: "success",
      confirmButtonText: "استكشاف الموقع",
      background: "#022C43", // إضافة إعدادات الألوان
      color: "#FFD700",
    }).then(() => {
      // إعادة تحميل الصفحة بعد تأخير مثل handleLogin
      setTimeout(() => {
        window.location.reload();
        navigate("/");
      }, 2000);
    });

    // إعادة تعيين الفورم
    setFormData({
      username: '',
      email: '',
      password: '',
      showPassword: false,
    });

  } catch (err) {
    console.error("❌ خطأ في التسجيل:", err.response?.data || err.message);

    Swal.fire({
      title: "فشل التسجيل",
      text: err.response?.data?.message || "حدث خطأ أثناء التسجيل. حاول مجددًا.",
      icon: "error",
      background: "#022C43", // إضافة إعدادات الألوان
      color: "#FFD700",
    });
  }
};
    

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    axios.defaults.withCredentials = true;

    try {
        console.log("📤 Sending login data:", { email, password });

        const response = await axios.post("http://localhost:9527/api/auth/login", 
            { email, password }, 
            { withCredentials: true }
        );

        const userData = response.data;
        const token = userData.token;

        console.log("✅ User data received:", userData);

        if (token) {
            // تخزين كل البيانات في كوكي واحدة باسم user
            Cookies.set("user", JSON.stringify({
                token: token,
                username: userData.username,
                email: userData.email,
                userId: userData.userId,
                isAdmin: userData.isAdmin || false,
            }), { expires: 7 });

            setIsOpen(false);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setFormData({
                username: '',
                email: '',
                password: '',
                showPassword: false,
            });

            // ✅ إظهار رسالة ترحيب مع اسم المستخدم
            Swal.fire({
                title: `مرحباً ${userData.username}!`,
                text: "تم تسجيل الدخول بنجاح.",
                icon: "success",
                confirmButtonText: "موافق",
                background: "#022C43",
                color: "#FFD700",
            });

            // إعادة تحميل الصفحة بعد فترة قصيرة
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }

    } catch (error) {
        console.error("❌ Error:", error.response ? error.response.data : error.message);
        Swal.fire({
            title: "فشل تسجيل الدخول",
            text: "يرجى التحقق من بيانات الدخول والمحاولة مجددًا.",
            icon: "error",
            confirmButtonText: "حسناً",
            background: "#022C43",
            color: "#FFD700",
        });
    }
};

  


useEffect(() => {
  const token = Cookies.get("token");
  const userCookie = Cookies.get("user");

  if (token && userCookie) {
    const userData = JSON.parse(userCookie);
    // إضافة التوكن إلى الهيدر لتوثيق الطلبات
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // تحديث حالة المستخدم
    setUser(userData);
    setIsLoggedIn(true);  // تأكد من أنك تحدث حالة تسجيل الدخول بشكل صحيح
    console.log("✅ User is still logged in:", userData);
  } else {
    console.log("🔴 User is not logged in.");
    setUser(null);
    setIsLoggedIn(false);
  }
}, []);




const toggleForm = () => {
  setIsSignUp((prev) => !prev);
  setFormErrors({});
  setError(""); // تصفير الأخطاء قبل التبديل
  setFormData({ username: "", email: "", password: "", showPassword: false });
};


const handleCancel = () => {
    setIsOpen(false);
    if (setFormData) {
      setFormData({ username: "", email: "", password: "", showPassword: false });
  }};

if (!isOpen) return null;

// ================================================================================================================

useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id:
        "433961052087-ksa4nir2mjgih7oudtn24lkb7l02m609.apps.googleusercontent.com",
      callback: handleGoogleLogin,
      ux_mode: "popup",
      scope: "profile email",  // إضافة الأذونات للحصول على بيانات المستخدم
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin-btn"),
      { theme: "white", size: "large" }  // تغيير الثيم والحجم
    );
  };
  document.body.appendChild(script);
}, [navigate]);

const handleGoogleLogin = async (response) => {
  try {
    const res = await axios.post(
      "http://localhost:9527/api/auth/google-login",
      { credential: response.credential }
    );

    console.log("🔍 Google login response:", res.data); // تحقق من استجابة الخادم

    const userData = res.data;

    if (userData.token) {
      // تخزين التوكن وبيانات المستخدم في الكوكيز
      Cookies.set("user", JSON.stringify({
        token: userData.token,
        username: userData.username,
        email: userData.email,
        userId: userData.user_id, // تأكد من استخدام user_id
        isAdmin: userData.isAdmin || false,
      }), { expires: 7 });

      // تعيين التوكن في الـ headers الخاص بـ axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;

      // عرض رسالة نجاح تسجيل الدخول باستخدام Google
      Swal.fire({
        icon: "success",
        title: `مرحباً ${userData.username}!`,
        text: "تم تسجيل الدخول باستخدام Google بنجاح!",
        background: "#FFFFFF",
      }).then(() => {
        window.location.reload();  // إعادة تحميل الصفحة
        navigate("/");  // إعادة التوجيه إلى الصفحة الرئيسية أو أي صفحة أخرى
      });
    } else {
      throw new Error("Token not received");
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "تم رفض الوصول",
      text: error.response?.data?.message || "فشل في التوثيق عبر Google.",
      background: "#FFFFFF",
      color: "#115173",
      confirmButtonColor: "#115173",
    });
  }
};

  
return (
  <div
    dir="rtl"
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{
      background: "url('https://images.pexels.com/photos/3293854/pexels-photo-3293854.jpeg?auto=compress&cs=tinysrgb&w=600') center/cover no-repeat"
    }}
  >
    {/* Enhanced glass overlay */}
    <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-lg" />
    
    <div
      className={`bg-white/20 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden text-right transition-all duration-500 transform ${
        animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
      }`}
      style={{
        border: "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.18)",
        backdropFilter: "blur(12px)"
      }}
    >
      {/* Glass header */}
      <div 
        className="p-5 text-white relative border-b border-white/20"
        style={{
          background: "linear-gradient(90deg, rgba(17,81,115,0.9) 0%, rgba(17,81,115,0.9) 100%)",
          backdropFilter: "blur(8px)"
        }}
      >
        <h2 className="text-xl font-bold text-center">
          {isSignUp ? "تسجيل حساب جديد" : "تسجيل الدخول"}
        </h2>
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 text-white/90 hover:text-white transition-colors rounded-full p-1"
          style={{
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255,255,255,0.15)"
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Floating icon */}
      <div className="relative h-12 flex justify-center -mt-6">
        <div 
          className="absolute w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-20 border-2 border-white/50"
          style={{
            background: "linear-gradient(135deg, rgba(17,81,115,0.9) 0%, rgba(17,81,115,0.9) 100%)",
            backdropFilter: "blur(4px)"
          }}
        >
          {isSignUp ? (
            <User size={20} color="#ffffff" />
          ) : (
            <Lock size={20} color="#ffffff" />
          )}
        </div>
      </div>

      {/* Transparent form container */}
      <div 
        className="p-6 pt-6 overflow-y-auto max-h-[70vh]"
        style={{
          backdropFilter: "blur(8px)"
        }}
      >
        {error && (
          <div 
            className="text-red-600 text-center mb-4 p-3 rounded-lg border border-red-200/50"
            style={{
              background: "rgba(254, 226, 226, 0.7)",
              backdropFilter: "blur(4px)"
            }}
          >
            {error}
          </div>
        )}
        
        <form onSubmit={isSignUp ? handleRegister : handleLogin} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <label className="block font-medium mb-1 text-white/90 pr-2">
                الاسم الكامل *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full p-3 pr-9 border border-white/30 rounded-lg focus:border-white focus:ring-1 focus:ring-white/50 outline-none text-right placeholder-white/70"
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    color: "white"
                  }}
                  placeholder="أدخل اسمك الكامل"
                />
                <User
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70"
                  size={16}
                />
              </div>
            </div>
          )}

          <div className="relative">
            <label className="block font-medium mb-1 text-white/90 pr-2">
              البريد الإلكتروني *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 pr-9 border border-white/30 rounded-lg focus:border-white focus:ring-1 focus:ring-white/50 outline-none text-right placeholder-white/70"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "white"
                }}
                placeholder="example@email.com"
              />
              <Mail
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70"
                size={16}
              />
            </div>
          </div>

          <div className="relative">
            <label className="block font-medium mb-1 text-white/90 pr-2">
              كلمة المرور *
            </label>
            <div className="relative">
              <input
                type={formData.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 pr-9 border border-white/30 rounded-lg focus:border-white focus:ring-1 focus:ring-white/50 outline-none text-right placeholder-white/70"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  color: "white"
                }}
                placeholder="************"
              />
              <Lock
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70"
                size={16}
              />
              <button
                type="button"
                onClick={() => setFormData(prevState => ({
                  ...prevState,
                  showPassword: !prevState.showPassword
                }))}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                {formData.showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
            <div className="mt-1 flex items-center justify-end">
              <label
                htmlFor="showPassword"
                className="text-white/80 ml-2 text-sm cursor-pointer"
              >
                إظهار كلمة المرور
              </label>
              <input
                type="checkbox"
                id="showPassword"
                checked={formData.showPassword}
                onChange={(e) => setFormData({
                  ...formData,
                  showPassword: e.target.checked
                })}
                className="mr-2 h-3 w-3 accent-white cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3 space-y-3">
            <button
              type="submit"
              className="py-3 px-6 rounded-lg text-white font-bold w-full transition-all hover:shadow-lg"
              style={{
                background: "linear-gradient(90deg, rgba(17,81,115,0.9) 0%, rgba(17,81,115,0.9) 100%)",
                border: "1px solid rgba(255,255,255,0.3)"
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{isSignUp ? "تسجيل حساب" : "تسجيل الدخول"}</span>
                <Lock size={16} color="#ffffff" />
              </div>
            </button>

            <div className="relative text-center py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-white/70 text-sm" style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(4px)"
                }}>أو</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full py-2 px-4 rounded-lg text-white/90 hover:text-white transition-colors text-center"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)"
              }}
            >
              {isSignUp ? "لديك حساب؟ سجل الدخول" : "ليس لديك حساب؟ سجل الآن"}
            </button>

            <button
              type="button"
              id="google-signin-btn" 
              className="py-2 px-6 rounded-lg w-full transition-all flex items-center justify-center gap-2"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                backdropFilter: "blur(4px)"
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="18px"
                height="18px"
                className="ml-2"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span>تسجيل الدخول باستخدام جوجل</span>
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={handleCancel}
            className="text-white/80 hover:text-white transition-colors underline text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>

      {/* Glass footer */}
      <div 
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, rgba(17,81,115,0.6) 0%, rgba(17,81,115,0.6) 100%)",
          backdropFilter: "blur(4px)"
        }}
      ></div>
    </div>
  </div>
);



}