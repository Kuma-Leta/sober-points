import React, { useState } from "react";
import { motion } from "framer-motion"; // For animations
import Login from "../../auth/login";
import SearchBar from "../../components/search";
import bgImage from "../../assets/images/netherlands3.jpg"; // Replace with your actual image path

const HeroSection = () => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <Login />;
  }

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
      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-4 mb-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Discover the Best Sober-Friendly Venues
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-gray-200 max-w-2xl"
      >
        Explore sober-friendly restaurants, cafes, and social spots near you.
      </motion.p>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="w-full max-w-lg mt-6"
      >
        <SearchBar />
      </motion.div>

      {/* Call to Action */}
    </section>
  );
};

export default HeroSection;
