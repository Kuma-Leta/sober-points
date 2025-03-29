import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../redux/venue/venueSlice";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite } from "../../redux/venue/venueSlice";

const FavoritesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, favorites } = useSelector((state) => state.venues);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, isAuthenticated]);

  const handleFavoriteClick = (venueId, e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: window.location.pathname } });
      return;
    }

    const isFavorited = favorites?.some(
      (favorite) => favorite.venueId._id === venueId
    );

    if (isFavorited) {
      dispatch(removeFavorite(venueId));
    } else {
      dispatch(addFavorite(venueId));
    }
  };

  const favoriteVenues = favorites?.map((favorite) => favorite.venueId) || [];

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-darkBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12"
          >
            Your Favorite Venues
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <motion.div
                key={skeleton}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * skeleton, duration: 0.5 }}
                className="relative group overflow-hidden rounded-xl shadow-lg cursor-pointer bg-white dark:bg-gray-800 p-4 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                <div className="mt-5 space-y-3">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5 animate-pulse"></div>
                  <div className="flex items-center mt-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse mr-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
                  </div>
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
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-darkBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12">
            Your Favorite Venues
          </h2>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 max-w-2xl mx-auto text-center">
            <div className="text-red-500 dark:text-red-400 text-5xl mb-4">
              ⚠️
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Error Loading Favorites
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchFavorites())}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (favoriteVenues.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-darkBg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto w-24 h-24 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center mb-6">
              <FaHeart className="text-4xl text-pink-500 dark:text-pink-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              No Favorites Yet
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              You haven't saved any venues to your favorites yet. Start
              exploring and add venues you love!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/venues/nearby"
                className="px-8 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaSearch /> Explore Venues
              </Link>
              <Link
                to="/venues/nearby"
                className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaMapMarkerAlt /> View Map
              </Link>
            </div>
          </motion.div>

          {/* Suggested venues section */}
          <div className="mt-16">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Popular Venues You Might Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="p-5">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse mb-3"></div>
                    <div className="flex items-center text-yellow-400 mb-2">
                      <FaStar className="mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        4.8
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-darkBg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 sm:mb-12"
        >
          Your Favorite Venues
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {favoriteVenues.map((venue, index) => (
            <motion.div
              key={venue._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group overflow-hidden rounded-xl shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300"
            >
              <Link to={`/venue/${venue._id}`} className="block">
                {/* Venue Image */}
                {venue?.images?.length > 0 && (
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={`http://localhost:5000/${venue?.images[0]?.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt={venue.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                )}

                <button
                  onClick={(e) => handleFavoriteClick(venue._id, e)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 z-10"
                  aria-label="Save as favorite"
                >
                  {favorites?.some(
                    (favorite) => favorite.venueId._id === venue._id
                  ) ? (
                    <FaHeart className="text-red-500 text-lg" />
                  ) : (
                    <FaRegHeart className="text-gray-600 dark:text-gray-300 text-lg" />
                  )}
                </button>

                {/* Venue Info */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {venue.name}
                  </h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-300 mb-3">
                    <FaMapMarkerAlt className="mr-2 text-sm" />
                    <span className="text-sm">{venue.address}</span>
                  </div>

                  {venue.rating && (
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400 mr-2">
                        <FaStar className="mr-1" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {venue.rating.toFixed(1)}
                        </span>
                      </div>
                      {venue.priceRange && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          • {venue.priceRange}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {favoriteVenues.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              to="/venues/nearby"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-300"
            >
              <FaSearch className="mr-2" /> Explore More Venues
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoritesList;
