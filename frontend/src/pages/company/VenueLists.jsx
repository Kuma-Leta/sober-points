import React from "react";
import { motion } from "framer-motion";

const VenueLists = ({ venues }) => {
  if (!Array.isArray(venues)) {
    return <p className="text-grayColor mt-2 text-center">No venues found.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
      {venues.length === 0 ? (
        <p className="text-grayColor mt-2 text-center">No venues found.</p>
      ) : (
        venues.map((venue, index) => (
          <motion.div
            key={venue._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="relative group overflow-hidden rounded-2xl shadow-lg bg-white dark:bg-darkCard transition-all duration-300"
          >
            {/* Venue Image */}
            {venue.images.length > 0 && (
              <img
                src={venue.images[0]}
                alt={venue.name}
                loading="lazy"
                className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
              />
            )}

            {/* Venue Details */}
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {venue.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                📍 {venue.address}
              </p>
            </div>

            {/* Gradient Overlay & Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-end justify-center p-4">
              <span className="text-white text-lg font-semibold">
                {venue.name}
              </span>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default VenueLists;
