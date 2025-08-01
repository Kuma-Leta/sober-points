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
    <section className="w-full h-[70vh] font-sans xs:h-[80vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] xl:h-screen flex flex-col justify-center items-center text-center relative bg-[#1A1A1A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-2 sm:gap-4 mb-4 sm:mb-6 px-4"
        >
          <h1 className="text-3xl xs:text-[56px] sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Discover the Best Alcohol-Free Experiences
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-gray-200 mx-autopx-4 font-sans font-normal leading-relaxed"
        >
          Welcome to your ultimate guide for exploring top-notch alcohol-free
          venues. Join us in celebrating a vibrant lifestyle filled with
          delicious non-alcoholic offerings.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-md mx-auto sm:max-w-lg mt-6 px-4"
        >
          <SearchBar
            setQuery={setQuery}
            onSearch={handleSearch}
            placeholder="Search location..."
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
