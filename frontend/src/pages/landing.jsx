import React from "react";
import HeroSection from "./company/HeroSection";
import Features from "./company/Services";
import VenueList from "./company/VenueList";
import Pagination from "../ui/pagination";
import ListOfVenueLinks from "./company/listOfVenuLinks";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-darkBg text-gray-900 dark:text-darkText">
      <HeroSection />

      <VenueList />
      <Features />
    </div>
  );
};

export default LandingPage;
