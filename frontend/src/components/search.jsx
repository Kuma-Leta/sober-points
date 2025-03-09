import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ setQuery, onSearch }) => {
  const navigate = useNavigate();
  const [showFindNearMe, setShowFindNearMe] = useState(false);
  const handleFindNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigate(`/venues/nearby?lat=${latitude}&lng=${longitude}`);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-md"
    >
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for venues..."
        className="w-full border rounded-full px-4 py-3 pl-12 text-grayColor dark:text-darkText bg-white dark:bg-darkCard shadow-md outline-none transition-all 
          border-gray-300 dark:border-grayColor focus:border-primary focus:ring-2 focus:ring-primaryLight"
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowFindNearMe(true)}
        onBlur={() => setTimeout(() => setShowFindNearMe(false), 200)}
        onKeyDown={onSearch}
      />
      <FaSearch className="absolute left-4 top-1/2 transform translate-y-1/2 text-grayColor  dark:text-darkText" />

      {/* Find Venues Near Me Button */}
      {showFindNearMe && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleFindNearMe}
          className="mt-3 w-full bg-primary text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-primaryDark transition-all"
        >
          <FaMapMarkerAlt />
          Find Venues Near Me
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;
