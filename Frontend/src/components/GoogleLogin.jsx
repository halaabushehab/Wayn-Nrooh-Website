const handleGoogleLogin = () => {
    const redirectUri = "http://localhost:9527/api/auth/google";
  
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
  
    const googleAuthUrl = redirectUri;
  
    const loginWindow = window.open(
      googleAuthUrl,
      "googleLogin",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
  
    const checkLogin = setInterval(() => {
      if (localStorage.getItem("user")) {
        clearInterval(checkLogin);
        loginWindow.close();
        window.location.href = "/dashboard";
      }
    }, 1000);
  };
  
  export default handleGoogleLogin; // ✅ تصدير الدالة فقط
  