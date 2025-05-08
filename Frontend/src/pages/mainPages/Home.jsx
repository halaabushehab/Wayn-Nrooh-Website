import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ExploreJordanSection from "../../components/HomeComponents/ExploreJordanSection"
import SeasonalDestinations from "../../components/HomeComponents/SeasonalDestinations";
import HeroSection  from "../../components/HomeComponents/HeroSection"
import CategorySection from "../../components/HomeComponents/CategorySection"
import AboutSection from "../../components/HomeComponents/AboutSection ";
import JordanDestinations from "../../components/HomeComponents/JordanDestinations";
import MapSection from '../../components/HomeComponents/Map'
import SuggestedPlacesSection  from '../../components/HomeComponents/SuggestedPlacesSection '
import SeasonalPopup from '../../components/HomeComponents/SeasonalPopup'; // تأكد من المسار الصحيح
import { Helmet } from "react-helmet";


import Offer from '../../components/HomeComponents/Offer'; // تأكد من المسار الصحيح

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowPopup(true);
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);;
return (
  <>
    <Helmet>
      <title>الرئيسية | وين نروح</title>
      <meta name="description" content="اكتشف أماكن سياحية رائعة ومميزة في الأردن مع وين نروح." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>

    {showPopup && <SeasonalPopup setShowPopup={setShowPopup} />}

    {/* ***** HERO Section ***** */}
    <HeroSection />
    {/* ***** Categories Section ***** */}
    <div className="my-40 mx-4 sm:mx-8 md:mx-12 lg:mx-16">
      <CategorySection />
    </div>

    {/* ***** About Section ***** */}
    <AboutSection />

    {/* ***** Jordan Destinations Section ***** */}
    <JordanDestinations />

    {/* ***** Map Section ***** */}
    <MapSection />

    {/* ***** Offer Section ***** */}
    <Offer />
  </>
);

};

export default Home;














