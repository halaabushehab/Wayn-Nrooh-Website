import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Components
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
// Pages - Main
import Home from "./pages/mainPages/Home.jsx";
import Blog from "./pages/mainPages/Blog.jsx";
import PlogDetails from "./pages/mainPages/PlogDetails.jsx";
import About from "./pages/mainPages/About.jsx";
import Contact from "./pages/mainPages/Contact.jsx";
import SeasonalDestinations from "./components/HomeComponents/SeasonalDestinations.jsx";
import SeasonPage from "./pages/places/seasonPage.jsx";
import Payments from "./pages/mainPages/Payments.jsx";
import PaymentSuccess from "./pages/mainPages/payment-success.jsx";

// Pages - Places
import CityPage from "./pages/places/palces.jsx";
import PlaceDetails from "./pages/places/PlaceDetails.jsx";
import ExploreJordanSection from "././components/HomeComponents/ExploreJordanSection.jsx";
import UpdatePlace from "./components/AdminDash/UpdatePlace.jsx";
import FavoritesPage from "./pages/places/FavoritesPage.jsx";
import SearchResultsPage from "./pages/mainPages/SearchResults .jsx";

// Pages - User
import Login from "./pages/user/Login.jsx";
import Register from "./pages/user/Register.jsx";
import ProfilePage from "./pages/user/ProfilePage.jsx";
import AdminDash from "./components/AdminDash/AdminDash.jsx";



// footer - Page
import OnlineInquiry from './components/Footer/OnlineInquiry.jsx';
import GeneralQuestions from './components/Footer/GeneralQuestions.jsx';
import BookingTerms from './components/Footer/BookingTerms.jsx';
import PrivacyPolicy from './components/Footer/PrivacyPolicy.jsx';




const AppContent = () => {
  // استخدام useLocation لتحديد الصفحة الحالية
  const location = useLocation();
  // إذا كان الـ pathname يبدأ بـ "/AdminDash" نقوم بإخفاء الـ Navbar والفوتر
  const hideLayout = location.pathname.startsWith("/AdminDash");

  return (
    <>
      {!hideLayout && <Navbar />}
      <div style={{ minHeight: "100vh", paddingBottom: "80px" }}>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/article" element={<Blog />} />
          <Route path="/article/:id" element={<PlogDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/seasonPage/:season" element={<SeasonPage />} />
          <Route
            path="/SeasonalDestinations"
            element={<SeasonalDestinations />}
          />
          <Route path="/pay/:id" element={<Payments />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Places Routes */}
          <Route path="/places" element={<CityPage />} />
          <Route path="/place-details/:id" element={<PlaceDetails />} />
          <Route path="/suggest" element={<ExploreJordanSection />} />
          <Route
            path="/dashboard/places/update/:id"
            element={<UpdatePlace />}
          />
          <Route path="/favorite" element={<FavoritesPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={<PageNotFound />} />
          {/* User Routes */}
          <Route path="/ProfilePage/:id" element={<ProfilePage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/AdminDash" element={<AdminDash />} />
       
           {/* Footer Routes */}
           <Route path="/online-inquiry" element={<OnlineInquiry />} />
      <Route path="/general-questions" element={<GeneralQuestions />} />
      <Route path="/booking-terms" element={<BookingTerms />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
       
       
        </Routes>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
