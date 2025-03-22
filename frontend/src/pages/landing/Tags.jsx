import React from "react";
import { useDispatch } from "react-redux";
import {
  fetchMostRatedVenues,
  fetchNewestVenues,
  fetchNearestVenues,
} from "../../redux/venue/venueSlice";

const Tags = () => {
  const dispatch = useDispatch();

  const handleMostRatedClick = () => {
    dispatch(fetchMostRatedVenues());
  };

  const handleNewestClick = () => {
    dispatch(fetchNewestVenues());
  };

  const handleNearestClick = () => {
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
        className="px-4 py-2 text-sm font-semibold bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Most Rated
      </button>
      <button
        onClick={handleNewestClick}
        className="px-4 py-2 text-sm font-semibold bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Newest
      </button>
      <button
        onClick={handleNearestClick}
        className="px-4 py-2 text-sm font-semibold bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Nearest
      </button>
    </div>
  );
};

export default Tags;
