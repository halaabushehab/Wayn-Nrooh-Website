import { useEffect, useRef, useState } from 'react';
import ammanVideo from '../../components/img/AmmanHero.mp4';
import { useNavigate } from 'react-router-dom';

export default function HeroSectionEN() {
  const featuresSectionRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (featuresSectionRef.current) {
      observer.observe(featuresSectionRef.current);
    }

    return () => {
      if (featuresSectionRef.current) {
        observer.unobserve(featuresSectionRef.current);
      }
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="relative min-h-screen w-full flex flex-col items-start sm:items-center justify-start sm:justify-center overflow-hidden bg-[#022C43] text-white py-8 sm:py-16 text-left">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={ammanVideo} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#115173]/20 via-[#115173]/20 to-[#022C43]/20"></div>

        {/* Content */}
<div className="relative z-10 text-center px-4 sm:px-6 max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-6xl mx-auto">          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-4 animate-fade-in">
            <span className="text-4xl sm:text-6xl md:text-8xl inline-block transform transition hover:scale-105 duration-700 text-[#FFD700]">
         Wayn Nrooh
            </span>
          </h1>

          <p className="mt-2 sm:mt-3 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-gray-200 animate-fade-in-delay">
            Discover unique destinations and hidden gems across Jordan – from natural landscapes to unknown historical spots.
            <span className="hidden md:inline"> Enjoy new experiences and explore what this beautiful country has to offer.</span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center mt-4 sm:mt-6 animate-fade-in-delay-2 w-fit mx-auto">
            <button
              className="bg-[#022C43] hover:bg-[#115173]/80 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm md:text-base"
              onClick={() => navigate('/location')}
            >
              Explore New Destinations
            </button>
            <button
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm md:text-base mt-2 xs:mt-0"
              onClick={() => navigate('/suggest')}
            >
              Suggest a Place
            </button>
          </div>

          {/* Features */}
          <div
            ref={featuresSectionRef}
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 md:mt-12 max-w-full sm:max-w-2xl md:max-w-4xl mx-auto transition-opacity duration-1000 ${
              featuresVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Feature 1 */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transform transition-all duration-500 hover:scale-105 hover:bg-[#115173]/20 hover:shadow-lg hover:shadow-[#115173]/20">
              <div className="bg-[#FFD700]/70 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-[#115173] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-0.5">Hidden Adventures</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Explore lesser-known places like Wadi Birta and Seil Hesban, filled with serene waterfalls and mountain hiking trails.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transform transition-all duration-500 hover:scale-105 hover:bg-[#115173]/20 hover:shadow-lg hover:shadow-[#115173]/20">
              <div className="bg-[#FFD700]/70 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-[#115173] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L6 21h12l-3.75-4M12 3v14" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-0.5 sm:mb-1">Cultural Museums</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Visit unique museums like the Wax Museum and photo galleries. Enjoy immersive night tours that bring history to life.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4 transform transition-all duration-500 hover:scale-105 hover:bg-[#115173]/20 hover:shadow-lg hover:shadow-[#115173]/20 sm:col-span-2 lg:col-span-1">
              <div className="bg-[#FFD700]/70 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-[#115173] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-0.5 sm:mb-1">Culinary Experiences</h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Enjoy interactive cooking experiences and try dishes from diverse cultures in settings full of flavor and tradition.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="hidden sm:flex absolute bottom-1 left-1/2 transform -translate-x-1/2 flex-col items-center animate-bounce cursor-pointer z-20"
          onClick={() => scrollToSection('attractions')}
        >
          <span className="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2">Scroll down to explore more</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>
    </>
  );
}
