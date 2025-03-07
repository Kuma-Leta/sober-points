import React, { useState } from "react";
import { motion } from "framer-motion"; // For smooth animations
import logo from "../../assets/images/logo.jpg";
import Login from "../../auth/login";
import SearchBar from "../../components/search";

const HeroSection = () => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <Login />;
  }

  return (
    <section className="w-full h-screen flex flex-col justify-center items-center text-center bg-white dark:bg-darkBg px-6">
      {/* Logo & Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-4 mb-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-darkText">
          Discover the Best Sober-Friendly Venues
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg text-gray-600 dark:text-grayColor max-w-2xl"
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
      <motion.button
        onClick={() => setShowLogin(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full text-lg font-medium shadow-lg transition-all"
      >
        Get Started
      </motion.button>
    </section>
  );
};

export default HeroSection;
