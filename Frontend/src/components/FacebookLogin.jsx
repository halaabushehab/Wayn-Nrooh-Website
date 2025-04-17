// // src/components/FacebookLogin.jsx
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import axios from "axios";

// const FacebookLogin = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const isHttps = window.location.protocol === "https:";
  
//     if (!isHttps) {
//       alert("يرجى تشغيل الموقع باستخدام HTTPS.");
//       window.location.href = "https://" + window.location.host + window.location.pathname;
//     }
  
//     if (!window.FB) {
//       window.fbAsyncInit = function () {
//         window.FB.init({
//           appId: "YOUR_FACEBOOK_APP_ID",
//           cookie: true,
//           xfbml: true,
//           version: "v18.0",
//         });
//       };
  
//       (function (d, s, id) {
//         if (d.getElementById(id)) return;
//         const js = d.createElement(s),
//           fjs = d.getElementsByTagName(s)[0];
//         js.id = id;
//         js.src = "https://connect.facebook.net/en_US/sdk.js";
//         fjs.parentNode.insertBefore(js, fjs);
//       })(document, "script", "facebook-jssdk");
//     }
//   }, []);
  

//   const handleFacebookLogin = () => {
//     if (window.location.protocol !== "https:") {
//       alert("فيسبوك يتطلب اتصال HTTPS آمن. يرجى استخدام HTTPS للموقع.");
//       return;
//     }

//     if (window.FB) {
//       window.FB.getLoginStatus((response) => {
//         if (response.status === "connected") {
//           sendFacebookData(response.authResponse);
//         } else {
//           window.FB.login(
//             (loginResponse) => {
//               if (loginResponse.authResponse) {
//                 sendFacebookData(loginResponse.authResponse);
//               } else {
//                 alert("تم إلغاء تسجيل الدخول عبر فيسبوك.");
//               }
//             },
//             { scope: "email,public_profile" }
//           );
//         }
//       });
//     } else {
//       alert("فشل تحميل Facebook SDK. تأكد من تشغيل الكود بعد تحميل SDK.");
//     }
//   };

//   const sendFacebookData = async (authResponse) => {
//     const { accessToken, userID } = authResponse;

//     try {
//       const apiResponse = await axios.post(
//         "http://localhost:9527/api/auth/facebook-login",
//         { accessToken, userID }
//       );

//       localStorage.setItem("token", apiResponse.data.token);
//       localStorage.setItem("user", JSON.stringify(apiResponse.data.user));

//       dispatch({ type: "LOGIN_SUCCESS", payload: apiResponse.data.user });

//       alert("تم تسجيل الدخول بنجاح عبر فيسبوك!");
//       navigate("/");
//     } catch (error) {
//       console.error("Facebook login failed:", error.response?.data || error.message);
//       dispatch({
//         type: "LOGIN_FAIL",
//         payload: error.response?.data?.message || "فشل تسجيل الدخول بواسطة فيسبوك",
//       });
//     }
//   };

//   return (
// <button
// type="button"
// onClick={handleFacebookLogin}
// className="py-3 px-6 rounded-lg text-white bg-[#1877F2] hover:bg-opacity-90 w-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
// >      تسجيل الدخول عبر فيسبوك
//     </button>
//   );
// };

// export default FacebookLogin;



// import React from 'react'

// function FacebookLogin() {
//   return (
//     <div>FacebookLogin</div>
//   )
// }

export default FacebookLogin