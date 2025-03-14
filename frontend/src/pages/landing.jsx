import HeroSection from "./landing/HeroSection";
import Features from "./landing/Services";
import VenueList from "./landing/VenueList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      // ✅ Append `fromLanding=true` to the URL
      navigate(`/venues/nearby/?query=${query}&fromLanding=true`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-darkBg text-gray-900 dark:text-darkText">
      <HeroSection setQuery={setQuery} onSearch={handleSearch} />
      <VenueList />
      <Features />
      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;
