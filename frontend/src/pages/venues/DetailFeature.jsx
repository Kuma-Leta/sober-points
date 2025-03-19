import React from "react";
import RatingStars from "../landing/RatingStars";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaClock,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import MapComponent from "./mapComp";

const DetailFeature = ({
  venue,
  navigate,
  setIsUpdateModalOpen,
  setIsDeleteModalOpen,
  loading,
}) => {
  // Extract coordinates from the location object
  const coordinates = venue?.location?.coordinates
    ? [venue.location.coordinates[1], venue.location.coordinates[0]] // [latitude, longitude]
    : null;

  return (
    <div className="p-4 mt-2 pt-20 max-w-7xl mx-auto">
      {/* Header with Update and Delete Icons */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">
          {loading ? (
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          ) : (
            venue.name
          )}
        </h1>
      </div>

      {/* Single Container for All Content */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          {/* Back Icon */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <FaArrowLeft className="w-6 h-6 font-thin" />
          </button>

          {/* Update & Delete Icons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <FaEdit className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <FaTrash className="w-6 h-6" />
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Venue Details
        </h2>
        {/* Grid Layout for Left and Right Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Venue Details */}
          <div>
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              {loading ? (
                <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  {venue.description}
                </p>
              )}
            </div>

            {/* Menu */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Menu</h3>
              {loading ? (
                <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{venue.menu}</p>
              )}
            </div>

            {/* Address */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              {loading ? (
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              ) : (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {venue.address}
                  </p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Status</h3>
              {loading ? (
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
              ) : (
                <p
                  className={
                    venue.isVerified ? "text-green-500" : "text-yellow-500"
                  }
                >
                  {venue.isVerified ? "Verified" : "Pending"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              {loading ? (
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              ) : (
                <div className="flex items-center">
                  <FaPhone className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {venue.phone}
                  </p>
                </div>
              )}
            </div>

            {/* Website */}
            {loading ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Website</h3>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ) : (
              venue.website && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Website</h3>
                  <div className="flex items-center">
                    <FaGlobe className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {venue.website}
                    </a>
                  </div>
                </div>
              )
            )}

            {/* Timings */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Created At</h3>
              {loading ? (
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              ) : (
                <div className="flex items-center">
                  <FaClock className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                  <p className="text-gray-600 dark:text-gray-300">
                    {new Date(venue.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Rating</h3>
              {loading ? (
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              ) : (
                <div className="flex items-center">
                  <RatingStars rating={venue.rating || 0} />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                    ({venue.rating || 0})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Images and Map */}
          <div>
            {/* Venue Images */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Venue Images</h2>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ) : (
                <div
                  className={`grid gap-4 ${
                    venue.images.length === 1
                      ? "grid-cols-1" // 1 image: full width
                      : venue.images.length === 2
                      ? "grid-cols-1 sm:grid-cols-2" // 2 images: 1 column on mobile, 2 columns on larger screens
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" // 3+ images: 1 column on mobile, 2 columns on medium screens, 3 columns on large screens
                  }`}
                >
                  {venue.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000/${image.replace(/\\/g, "/")}`}
                      alt={`Venue Image ${index + 1}`}
                      loading="lazy"
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Location (Optional) */}
            {loading ? (
              <div>
                <h2 className="text-xl font-semibold mb-2">Location</h2>
                <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ) : (
              coordinates && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Location</h2>
                  <div className="h-96 w-full rounded-lg overflow-hidden">
                    <MapComponent
                      coordinates={coordinates} // Pass [latitude, longitude]
                      isStatic={true} // Set to true if the map should not be interactive
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFeature;
