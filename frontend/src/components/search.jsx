import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

const SearchBar = ({ setQuery }) => {
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-md"
    >
      <input
        type="text"
        placeholder="Search for venues..."
        className={`w-full border rounded-full px-4 py-3 pl-12 text-gray-700 dark:text-darkText bg-white dark:bg-darkCard shadow-md outline-none transition-all ${
          inputFocused
            ? "border-red-500 ring-2 ring-red-300"
            : "border-gray-300"
        }`}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </motion.div>
  );
};

export default SearchBar;
