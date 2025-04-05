import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import RatingStars from "./venuedetail/RatingStars";
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../../redux/venue/venueSlice";

const VenueLists = ({ isSideBySide = false, error, onPageChange }) => {
  const { venues, loading, favorites, pagination } = useSelector(
    (state) => state.venues
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle favorite button click
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

  // Handle page change
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((skeleton) => (
          <div
            key={skeleton}
            className="animate-pulse p-4 border rounded-lg shadow-md bg-gray-300 dark:bg-gray-700"
          >
            <div className="h-32 bg-gray-400 dark:bg-gray-600 rounded-md"></div>
            <div className="mt-2 h-4 bg-gray-400 dark:bg-gray-600 w-3/4 rounded"></div>
            <div className="mt-2 h-3 bg-gray-400 dark:bg-gray-600 w-1/2 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!venues || venues.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-300 text-center">
        No venues found.
      </p>
    );
  }

  return (
    <div className="mt-4">
      {/* Pagination Controls */}
      {pagination && (
        <div className="flex justify-center p-2 items-center mt-3 space-x-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className={`p-2 text-sm font-semibold border rounded-md transition ${
              pagination.currentPage === 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500"
            }`}
          >
            <FaChevronLeft />
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className={`p-2 text-sm font-semibold border rounded-md transition ${
              pagination.currentPage === pagination.totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-700 dark:hover:bg-gray-500"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Venue Grid */}
      <div
        className={`grid w-full ${
          isSideBySide
            ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        } gap-4 sm:gap-6`}
      >
        {venues
          ?.filter((venue) => venue.isVerified === true)
          .map((venue) => (
            <Link
              key={venue._id}
              to={`/venue/${venue._id}`}
              className="block border rounded shadow-md hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-darkCard dark:border-gray-700"
            >
              {venue.images?.length > 0 && (
                <div className="relative max-h-[200px] h-max w-full rounded-t-md overflow-hidden">
                  <img
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/${venue.images[0].replace(/\\/g, "/")}`}
                    alt={venue.name}
                    className="flex w-full h-[200px] object-cover"
                  />
                  {/* Heart Icon */}
                  <button
                    onClick={(e) => handleFavoriteClick(venue._id, e)}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300"
                    aria-label="Save as favorite"
                  >
                    {favorites?.some(
                      (favorite) => favorite.venueId._id === venue._id
                    ) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart className="text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                </div>
              )}
              <div className="p-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-darkText">
                  {venue.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {venue.address}
                </p>
                {venue.distance && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round(venue.distance)} meters away
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <RatingStars rating={venue.rating || 0} />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({venue.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default VenueLists;
