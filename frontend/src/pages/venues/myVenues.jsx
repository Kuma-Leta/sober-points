import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import RatingStars from "../landing/venuedetail/RatingStars";

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axiosInstance.get("/venues/my-venues");

        // Set the fetched venues in state
        setVenues(response.data.data);
      } catch (err) {
        console.error("Error fetching venues:", err);
        setError("Failed to fetch venues. Please try again later.");
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchVenues();
  }, []);

  // Function to handle card click
  const handleCardClick = (venueId) => {
    navigate(`/venues/my-venue/${venueId}`); // Navigate to the venue details page
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>; // Show loading state
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>; // Show error message

  return (
    <div className="p-4 mt-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        My Venues
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {venues.map((venue) => (
          <div
            key={venue._id}
            onClick={() => handleCardClick(venue._id)} // Make the entire card clickable
            className="bg-white dark:bg-darkCard shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
          >
            {/* Venue Image */}
            {venue.image && (
              <img
                src={`http://localhost:5000/${venue.image.replace(/\\/g, "/")}`}
                alt={venue.name}
                loading="lazy"
                className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-200"
              />
            )}

            {/* Venue Details */}
            <div className="p-4 relative">
              {/* Detail Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event from firing
                  handleCardClick(venue._id);
                }}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors duration-200"
                aria-label="View Details"
              >
                <FaInfoCircle className="w-6 h-6" />
              </button>

              <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
              <div className="flex items-center mt-2">
                <RatingStars rating={venue.rating || 0} />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  ({venue.rating || 0})
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyVenues;
