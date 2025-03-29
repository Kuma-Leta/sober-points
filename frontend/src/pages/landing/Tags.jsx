import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  fetchMostRatedVenues,
  fetchNewestVenues,
  fetchNearestVenues,
} from "../../redux/venue/venueSlice";

const Tags = () => {
  const dispatch = useDispatch();

  // State to track the selected tag
  const [selectedTag, setSelectedTag] = useState(null);

  const handleMostRatedClick = () => {
    setSelectedTag("mostRated");
    dispatch(fetchMostRatedVenues());
  };

  const handleNewestClick = () => {
    setSelectedTag("newest");
    dispatch(fetchNewestVenues());
  };

  const handleNearestClick = () => {
    setSelectedTag("nearest");
    // Get user's current location (latitude and longitude)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchNearestVenues({ lat: latitude, lng: longitude }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex space-x-3 p-4">
      <button
        onClick={handleMostRatedClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md  ${
          selectedTag === "mostRated" ? "bg-primary text-white" : "bg-gray-200"
        }`}
      >
        Most Rated
      </button>
      <button
        onClick={handleNewestClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md  ${
          selectedTag === "newest" ? "bg-primary text-white" : "bg-gray-200"
        }`}
      >
        Newest
      </button>
      <button
        onClick={handleNearestClick}
        className={`px-4 py-2 text-sm font-semibold rounded-md  ${
          selectedTag === "nearest" ? "bg-primary text-white" : "bg-gray-200"
        }`}
      >
        Nearest
      </button>
    </div>
  );
};

export default Tags;
