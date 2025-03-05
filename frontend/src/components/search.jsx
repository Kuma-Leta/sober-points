import React from "react";
import { FaSearch } from "react-icons/fa";

export default function Search({ setQuery }) {
  return (
    <div className="relative dark:bg-darkCard">
      <input
        type="text"
        placeholder="Search..."
        className="border dark:border-gray-500 rounded dark:bg-darkCard px-4 py-2 pl-10" // Add left padding to make space for the icon
        onChange={setQuery}
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    </div>
  );
}
