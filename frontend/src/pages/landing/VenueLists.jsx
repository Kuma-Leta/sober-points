import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars"; // Import the RatingStars component

const VenueLists = ({ isSideBySide = false }) => {
  const { venues, loading, error } = useSelector((state) => state.venues);

  if (!Array.isArray(venues) || venues.length === 0) {
    return <p className="text-grayColor mt-2 text-center">No venues found.</p>;
  }

  return (
    <div
      className={`mt-4 grid ${
        isSideBySide
          ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2" // Side-by-side layout
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" // Default layout
      } gap-4 sm:gap-6`}
    >
      {venues.map((venue, index) => (
        <motion.div
          key={venue._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="relative group overflow-hidden rounded-2xl  shadow-lg bg-white dark:bg-darkCard transition-all duration-300"
        >
          <Link to={`/venues/${venue._id}`}>
            {venue.images.length > 0 && (
              <img
                src={`http://localhost:5000/${venue.images[0].replace(
                  /\\/g,
                  "/"
                )}`}
                alt={venue.name}
                loading="lazy"
                className="w-full h-48 sm:h-56 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                {venue.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                📍 {venue.address}
              </p>
              {/* Use the RatingStars component */}
              <div className="flex items-center mt-2">
                <RatingStars rating={venue.rating || 0} />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  ({venue.rating || 0})
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default VenueLists;
