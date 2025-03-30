import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaCheckCircle,
  FaImage,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaPlus,
} from "react-icons/fa";
import RatingStars from "../landing/venuedetail/RatingStars";

const SkeletonCard = () => (
  <div className="bg-white dark:bg-darkCard shadow-md rounded-lg overflow-hidden animate-pulse">
    <div className="w-full h-48 sm:h-56 bg-gray-300 dark:bg-gray-700"></div>
    <div className="p-4">
      <div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-700 rounded-md mb-2"></div>
      <div className="w-1/2 h-4 bg-gray-300 dark:bg-gray-700 rounded-md mb-2"></div>
      <div className="w-1/4 h-4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
    </div>
  </div>
);

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axiosInstance.get("/venues/my-venues");
        setVenues(response.data.data);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to fetch venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleCardClick = (venueId) => {
    navigate(`/venues/my-venue/${venueId}`);
  };

  const handleAddVenue = () => {
    navigate("/venue/form");
  };

  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;

  return (
    <div className="p-4 mt-4  max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center sm:text-left">
          My Venues
        </h1>
        <button
          onClick={handleAddVenue}
          className="flex items-center gap-2 bg-primary hover:bg-primaryLight text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <FaPlus className="text-lg" />
          <span>Contribute New Venue</span>
        </button>
      </div>

      {!loading && venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-darkCard rounded-lg shadow-md">
          <FaBuilding className="text-6xl text-gray-400 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Venues Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
            You haven't added any venues yet. Start by adding your first venue!
          </p>
          <button
            onClick={handleAddVenue}
            className="flex items-center gap-2 bg-primary hover:bg-primaryLight text-white px-6 py-3 rounded-lg transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
            <span>Contribute Your First Venue</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array(6)
                .fill(null)
                .map((_, index) => <SkeletonCard key={index} />)
            : venues.map((venue) => (
                <div
                  key={venue._id}
                  onClick={() => handleCardClick(venue._id)}
                  className="bg-white dark:bg-darkCard shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group transform hover:-translate-y-1"
                >
                  {venue.image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/${venue.image.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={venue.name}
                      loading="lazy"
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FaImage className="text-4xl text-gray-400 dark:text-gray-600" />
                    </div>
                  )}
                  <div className="p-4 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(venue._id);
                      }}
                      className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                      aria-label="View Details"
                    >
                      <FaInfoCircle className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" />
                      {venue.name}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-300 mt-2 flex items-center gap-2">
                      <FaCheckCircle
                        className={
                          venue.status === "Verified"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      />
                      Status:{" "}
                      <span
                        className={
                          venue.status === "Verified"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }
                      >
                        {venue.status}
                      </span>
                    </p>
                    <div className="flex items-center mt-2">
                      <RatingStars rating={venue.rating || 0} />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                        ({venue.rating || 0})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};

export default MyVenues;
