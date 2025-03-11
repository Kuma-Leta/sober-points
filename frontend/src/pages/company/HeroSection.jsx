import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/search";
import bgImage from "../../assets/images/netherlands3.jpg";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      // ✅ Append `fromLanding=true` to the URL
      navigate(`/venues?query=${query}&fromLanding=true`);
    }
  };

  return (
    <section
      className="w-full h-screen flex flex-col justify-center items-center text-center px-6 relative"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.2)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-4 mb-4 sm:mb-6"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Discover the Best Sober-Friendly Venues
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-base sm:text-lg text-gray-200 max-w-2xl px-4"
      >
        Explore sober-friendly restaurants, cafes, and social spots near you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full max-w-lg mt-6"
      >
        {/* Pass the `setQuery` and `onSearch` functions to the SearchBar */}
        <SearchBar setQuery={setQuery} onSearch={handleSearch} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
