import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVenues } from "../../redux/venue/venueSlice";
import { motion } from "framer-motion";

const VenueList = () => {
  const dispatch = useDispatch();
  const { venues, loading, error } = useSelector((state) => state.venues);

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center text-grayColor">Loading venues...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (venues.length === 0) {
    return <p className="text-center text-grayColor">No venues found.</p>;
  }

  return (
    <section className="py-12 bg-gray-50 dark:bg-darkBg">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Explore <span className="text-primary">Sober-Friendly</span> Venues
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {venues.map((venue, index) => (
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
                  className="w-full h-64 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default VenueList;
