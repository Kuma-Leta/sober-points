import React from "react";
import HeroSection from "./landing/HeroSection";
import Features from "./landing/Services";
import VenueList from "./landing/VenueList";
import Pagination from "../ui/pagination";
import ListOfVenueLinks from "./landing/listOfVenuLinks";

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
