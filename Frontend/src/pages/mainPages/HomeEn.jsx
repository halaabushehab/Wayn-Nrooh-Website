import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import ExploreJordanSection from "../../components/HomeComponents/ExploreJordanSection";
// import SeasonalDestinations from "../../components/HomeComponents/SeasonalDestinations";
import HeroSection from "../../components/HomeComponents English/HeroSectionEN";
import CategorySection from "../../components/HomeComponents English/CategorySectionEN";
import AboutSection from "../../components/HomeComponents English/AboutSectionEN ";
import JordanDestinations from "../../components/HomeComponents English/JordanDestinationsEN";
import MapSection from '../../components/HomeComponents English/MapEN';
// import SuggestedPlacesSection from '../../components/HomeComponents/SuggestedPlacesSection';
import { Helmet } from "react-helmet";
import Offer from '../../components/HomeComponents English/OfferEN';
import NavbarEN  from "../../components/NavbarEN.jsx";"./components/NavbarEN.jsx"
import FooterEN  from "../../components/FooterEN.jsx"


const Home = () => {

  return (
    <>
    <NavbarEN />
      <Helmet>
        <title>Home | Where To Go</title>
        <meta name="description" content="Discover amazing and unique tourist places in Jordan with Where To Go." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>


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
       <FooterEN />
    </>
  );
};

export default Home;