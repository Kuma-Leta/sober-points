import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchNearbyVenues } from "../../redux/venue/venueSlice";

const VenueLists = () => {
  const { venues, loading, error } = useSelector((state) => state.venues);
  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         fetchNearbyVenues({ lat: latitude, lng: longitude });
  //       },
  //       (error) => console.error("Error getting location:", error)
  //     );
  //   }
  // }, []);

  if (!Array.isArray(venues) || venues.length === 0) {
    return <p className="text-grayColor mt-2 text-center">No venues found.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-3">
      {venues.map((venue, index) => (
        <motion.div
          key={venue._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="relative group overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-darkCard transition-all duration-300"
        >
          <Link to={`/venues/${venue._id}`}>
            {venue.images.length > 0 && (
              <img
                src={`http://localhost:5000/uploads/${venue.images[0]}`}
                alt={venue.name}
                loading="lazy"
                className="w-full h-40 sm:h-48 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <div className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                {venue.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                📍 {venue.address}
              </p>
              <p className="text-sm text-yellow-500">
                ⭐ {venue.rating || "N/A"}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default VenueLists;
