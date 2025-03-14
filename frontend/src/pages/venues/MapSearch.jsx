import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

// Geocoding function to search for locations
const geocodeLocation = async (query) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.map((item) => ({
    name: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
};

export default function MapSearch({
  setMarkerPosition,
  setFormData,
  searchQuery,
  setSearchQuery,
}) {
  const [suggestions, setSuggestions] = useState([]);

  // Debugging: Log search query changes
  useEffect(() => {
    console.log("Search query updated:", searchQuery);
  }, [searchQuery]);

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    const locations = await geocodeLocation(searchQuery);
    setSuggestions(locations);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (location) => {
    setMarkerPosition([location.lat, location.lng]);
    setSearchQuery(location.name);
    setSuggestions([]); // Clear suggestions
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]); // Clear suggestions
  };

  // Automatically fetch suggestions as the user types
  useEffect(() => {
    if (searchQuery) {
      const fetchSuggestions = async () => {
        const locations = await geocodeLocation(searchQuery);
        setSuggestions(locations);
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  return (
    <div className="w-full  dark:bg-darkBg">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative pb-1">
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-md dark:bg-darkBg focus:outline-none focus:ring-2 focus:ring-red-600 pl-10 pr-10"
          />
          {/* Search Icon */}
          <button
            type="submit"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
          >
            <FaSearch className="w-5 h-5" />
          </button>
          {/* Clear Icon */}
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
      {/* Dropdown Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white dark:bg-darkBg border border-gray-300 rounded-lg shadow-lg mt-1">
          {suggestions.map((location, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(location)}
              className="p-2 hover:bg-red-500 dark:bg-darkBg cursor-pointer"
            >
              {location.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
