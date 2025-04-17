// import React from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const Layout = () => {
//   const location = useLocation();
//   const hiddenRoutes = ["/dashboard", "/login", "/register"];

//   return (
//     <>
//       {!hiddenRoutes.includes(location.pathname.toLowerCase()) && <Navbar />}
//       <div style={{ minHeight: "100vh", paddingBottom: "80px" }}>
//         <Outlet />
//       </div>
//       {!hiddenRoutes.includes(location.pathname.toLowerCase()) && <Footer />}
//     </>
//   );
// };

// export default Layout;
