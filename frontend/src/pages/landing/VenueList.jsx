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
    <section className="py-8 sm:py-12 bg-gray-50 dark:bg-darkBg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
          Explore Sober-Friendly Venues
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {venues.map((venue, index) => (
            <motion.div
              key={venue._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-white dark:bg-darkCard p-4"
            >
              {/* Venue Image */}
              {venue.images.length > 0 && (
                <img
                  src={`http://localhost:5000/${venue.images[0].replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={venue.name}
                  loading="lazy"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg transition-transform duration-100 group-hover:scale-105"
                />
              )}

              {/* Venue Name */}
              <h3 className="text-lg font-semibold mt-2 text-gray-800 dark:text-white">
                {venue.name}
              </h3>

              {/* Venue Address */}
              <p className="text-sm text-grayColor">{venue.address}</p>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
