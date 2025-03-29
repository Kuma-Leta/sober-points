import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchVenues, fetchNearbyVenues } from "../redux/venue/venueSlice";
import axios from "axios";

const SearchBar = ({ setQuery, onSearch }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 2) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/venues/suggestions?query=${encodeURIComponent(
              searchTerm
            )}`
          );
          setSuggestions(response.data.suggestions);
        } catch (error) {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      dispatch(searchVenues(searchTerm));
      setSuggestions([]);
      if (onSearch) onSearch();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleSuggestionClick = (selectedPlace) => {
    setSearchTerm(selectedPlace.name);
    dispatch(
      fetchNearbyVenues({
        lat: selectedPlace.location[1],
        lng: selectedPlace.location[0],
      })
    );
    setIsInputFocused(false);
    navigate(`/venues/nearby`);
    setSuggestions([]);
    inputRef.current.blur();
  };

  const handleFindNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchNearbyVenues({ lat: latitude, lng: longitude }));
          navigate(`/venues/nearby/?lat=${latitude}&lng=${longitude}`);
          setLocationError(null);
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

  const handleClearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    if (setQuery) setQuery("");
    inputRef.current.focus();
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  // ... (keep other handler functions the same)

  return (
    <motion.div id="explore" className="relative w-full max-w-2xl">
      <div className="flex items-center gap-2">
        {/* Search Input Container */}
        <div className="relative flex-1">
          <input
            id="search"
            type="text"
            placeholder="Find venues near me"
            value={searchTerm}
            ref={inputRef}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (setQuery) setQuery(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />

          {/* Search Icon (Left inside input) */}
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />

          {/* Clear Button (Right inside input) */}
          {searchTerm && (
            <FaTimes
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
              onClick={handleClearSearch}
            />
          )}
        </div>

        {/* Search Button (Outside input) */}
        <button
          onClick={handleSearch}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-300 sm:hidden md:flex items-center gap-2"
        >
          <FaSearch />
          <span>Search</span>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions?.length > 0 && isInputFocused && (
        <ul className="absolute w-full bg-white shadow-md rounded-md mt-2 z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-semibold">{suggestion.name}</div>
              <div className="text-sm text-gray-600">{suggestion.address}</div>
            </li>
          ))}
        </ul>
      )}

      {/* Find Nearby Venues Button */}
      {isInputFocused && (
        <button
          onClick={handleFindNearMe}
          className="mt-2 w-full bg-primary text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-primary-dark transition duration-300"
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
