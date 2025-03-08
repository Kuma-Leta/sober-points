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
        className={`w-full border rounded-full px-4 py-3 pl-12 text-grayColor dark:text-darkText bg-white dark:bg-darkCard shadow-md outline-none transition-all ${
          inputFocused
            ? "border-primary ring-2 ring-primaryLight"
            : "border-gray-300 dark:border-grayColor"
        }`}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
      />
      <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-grayColor dark:text-darkText" />
    </motion.div>
  );
};

export default SearchBar;
