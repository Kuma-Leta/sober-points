import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/search";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/venues/nearby`);
    }
  };

  return (
    <section className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh] xl:h-screen flex flex-col justify-center items-center  text-center  relative   bg-[#1A1A1A]">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-2 sm:gap-4 mb-4 sm:mb-6"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
          Discover the Best Alcohol-Free Experiences
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl px-4 leading-relaxed"
      >
        Welcome to your ultimate guide for exploring top-notch alcohol-free
        venues. Join us in celebrating a vibrant lifestyle filled with delicious
        non-alcoholic offerings.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full max-w-md sm:max-w-lg mt-6"
      >
        <SearchBar
          setQuery={setQuery}
          onSearch={handleSearch}
          placeholder="Search location..."
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
