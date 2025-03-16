import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchVenues, fetchNearbyVenues } from "../redux/venue/venueSlice";

const SearchBar = ({ setQuery, onSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Fixed spelling
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchTerm
            )}`
          );
          const data = await response.json();
          setSuggestions(
            data.map((item) => ({
              name: item.display_name,
              lat: item.lat,
              lng: item.lon,
            }))
          );
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      dispatch(searchVenues(searchTerm));
      setSuggestions([]);
      if (onSearch) onSearch(e); // Trigger the parent's search handler
    }
  };

  const handleSuggestionClick = (selectedPlace) => {
    setSearchTerm(selectedPlace.name);
    dispatch(
      fetchNearbyVenues(
        selectedPlace.Lat,
        selectedPlace.Lng,
        selectedPlace.name
      )
    );
    navigate(`/venues/nearby`);
    setSuggestions([]);
  };

  const handleFindNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchNearbyVenues({ lat: latitude, lng: longitude }));
          navigate(`/venues/nearby/?lat=${latitude}&lng=${longitude}`); // Navigate with fetched location
          setLocationError(null); // Clear any previous errors
        },
        (error) => {
          console.error("Error getting location", error);
          setLocationError(
            "Unable to fetch your location. Please enable location access."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <motion.div id="explore" className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search for venues..."
          value={searchTerm}
          className="w-full border rounded-full px-4 py-2 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (setQuery) setQuery(e.target.value); // Update the parent's query state
          }}
          onKeyDown={handleSearch}
          onFocus={() => setIsInputFocused(true)} // Show the "Find Venues Near Me" button
          // onBlur={() => setIsInputFocused(false)} // Hide the button when input loses focus
        />
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white shadow-md rounded-md mt-2 z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}

      {/* Find Nearby Venues Button */}
      {isInputFocused && (
        <button
          onClick={handleFindNearMe} // Trigger location request and navigation
          className="mt-1 w-full bg-primary text-white py-2 rounded-full flex items-center justify-center gap-2 text-sm sm:text-base sm:py-2"
        >
          <FaMapMarkerAlt className="text-sm sm:text-base" />
          <span>Find Venues Near Me</span>
        </button>
      )}

      {/* Location Error Message */}
      {locationError && (
        <p className="text-red-500 text-sm mt-2 text-center">{locationError}</p>
      )}
    </motion.div>
  );
};

export default SearchBar;
