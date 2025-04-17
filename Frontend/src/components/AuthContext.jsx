// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// // إنشاء السياق
// export const AuthContext = createContext();

// // مزود السياق (Context Provider)
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // حالة المستخدم

//   // التحقق من تسجيل الدخول عند تحميل الصفحة
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get("http://localhost:9527/auth/me", { withCredentials: true });
//         setUser(response.data);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//         setUser(null);
//       }
//     };

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
