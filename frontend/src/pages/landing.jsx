import HeroSection from "./landing/HeroSection";
import Features from "./landing/Services";
import VenueLists from "./landing/VenueLists";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsLetter from "./landing/NewsLetter";
import FAQ from "./landing/FAQ";
import ContactUs from "./landing/ContactUs";
import VenueSubmissionPage from "./landing/VenueSubmissionPage";
const LandingPage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      // ✅ Append `fromLanding=true` to the URL
      navigate(`/venues/nearby`);
    }
  };

  return (
    <div className="min-h-screen bg-white mx-auto dark:bg-darkBg text-gray-900 dark:text-darkText">
      <HeroSection setQuery={setQuery} onSearch={handleSearch} />

      <Features />
      <VenueSubmissionPage />
      <NewsLetter />
    </div>
  );
};

export default LandingPage;
