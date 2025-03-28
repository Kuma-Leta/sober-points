import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../redux/venue/venueSlice";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite } from "../../redux/venue/venueSlice";

const FavoritesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, favorites } = useSelector((state) => state.venues);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Fetch favorites on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  // Handle favorite button click
  const handleFavoriteClick = (venueId, e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: window.location.pathname } });
      return;
    }

    // Check if the venue is already favorited
    const isFavorited = favorites?.some(
      (favorite) => favorite.venueId._id === venueId
    );

    if (isFavorited) {
      dispatch(removeFavorite(venueId));
    } else {
      dispatch(addFavorite(venueId));
    }
  };

  // Extract venue objects from favorites
  const favoriteVenues = favorites?.map((favorite) => favorite.venueId) || [];

  // Skeletal Loading
  if (loading) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-darkBg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
            Your Favorite Venues
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <motion.div
                key={skeleton}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * skeleton, duration: 0.5 }}
                className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-white dark:bg-darkCard p-4"
              >
                {/* Skeletal Loading for Image */}
                <div className="w-full h-48 sm:h-64 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>

                {/* Skeletal Loading for Text */}
                <div className="mt-4 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-darkBg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
            Your Favorite Venues
          </h2>
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </section>
    );
  }

  if (favoriteVenues.length === 0) {
    return (
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-darkBg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
            Your Favorite Venues
          </h2>
          <p className="text-center text-grayColor">
            You have no favorite venues yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:mt-5 bg-gray-50 dark:bg-darkBg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
          Your Favorite Venues
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {favoriteVenues.map((venue, index) => (
            <Link
              key={venue._id}
              to={`/venue/${venue._id}`}
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer bg-white dark:bg-darkCard p-4"
            >
              {/* Venue Image */}
              {venue?.images?.length > 0 && (
                <img
                  src={`http://localhost:5000/${venue?.images[0]?.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={venue.name}
                  loading="lazy"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg transition-transform duration-100 group-hover:scale-105"
                />
              )}

              <button
                onClick={(e) => handleFavoriteClick(venue._id, e)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
                aria-label="Save as favorite"
              >
                {favorites?.some(
                  (favorite) => favorite.venueId._id === venue._id
                ) ? (
                  <FaHeart className="text-red-500" /> // Red heart if favorited
                ) : (
                  <FaRegHeart className="text-gray-600" /> // Gray heart if not favorited
                )}
              </button>

              {/* Venue Name */}
              <h3 className="text-lg font-semibold mt-2 text-gray-800 dark:text-white">
                {venue.name}
              </h3>

              {/* Venue Address */}
              <p className="text-sm text-grayColor">{venue.address}</p>

              {/* Overlay */}
              {/* <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {venue.name}
                </span>
              </div> */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FavoritesList;
