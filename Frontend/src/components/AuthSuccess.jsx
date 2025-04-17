// // AuthSuccess.jsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthSuccess = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get("token");

//     if (token) {
//       localStorage.setItem("google_token", token);
//       navigate("/dashboard"); // أو أي صفحة تريد تحويل المستخدم لها
//     } else {
//       navigate("/login");
//     }
//   }, []);

//   return <div>جارٍ تسجيل الدخول...</div>;
// };

// export default AuthSuccess;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthSuccess = ({ setUser , setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // تخزين التوكن في localStorage بعد التحقق من وجوده في الـ URL
      localStorage.setItem("google_token", token);
      
      // هنا يمكنك استدعاء دالة تسجيل الدخول باستخدام التوكن
      handleGoogleLogin(token);
    } else {
      // إذا لم يكن هناك توكن في الـ URL، يمكن أن تقوم بتوجيهه إلى الصفحة الرئيسية أيضًا
      navigate("/home"); // أو صفحة أخرى حسب الرغبة
    }
  }, [navigate]);

  const handleGoogleLogin = async (token) => {
    try {
      const response = await axios.post("http://localhost:9527/api/auth/google/login", { token });
      const userData = response.data;

      if (userData) {
        const isAdmin = userData.isAdmin;

        // تحديث حالة المستخدم
        setUser (userData);
        setIsLoggedIn(true);

        // تخزين التوكن وبيانات المستخدم في localStorage
        localStorage.setItem("token", userData.token);
        localStorage.setItem("username", userData.username);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("userId", userData.userId);
        localStorage.setItem("isAdmin", isAdmin);

        // توجيه المستخدم إلى الصفحة الرئيسية أو لوحة التحكم
        setTimeout(() => {
          if (isAdmin) {
            navigate("/admin"); // للمسؤول
          } else {
            navigate("/home"); // للمستخدم العادي
          }
        }, 1500); // تأخير بعد الرسالة
      } else {
        throw new Error("المستخدم غير موجود");
      }
    } catch (error) {
      console.error("❌ Error:", error.response ? error.response.data : error.message);
      Swal.fire({
        title: "فشل تسجيل الدخول",
        text: "يرجى التحقق من بيانات الدخول والمحاولة مجددًا.",
        icon: "error",
        confirmButtonText: "حسناً",
      });
    }
  };

  return <div>جارٍ تسجيل الدخول...</div>;
};

export default AuthSuccess;