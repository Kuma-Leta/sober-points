import React from "react";
import RatingStars from "../landing/venuedetail/RatingStars";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaClock,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaWineGlassAlt,
  FaBeer,
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
    <div className="p-4 mt-4 max-w-7xl mx-auto">
      {/* Main Container */}
      <div className="bg-white dark:bg-darkCard rounded-xl shadow-lg overflow-hidden">
        {/* Header with Navigation and Action Buttons */}
        <div className="bg-gradient-to-r p-6 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className=" hover:text-gray-800 transition-colors duration-200 flex items-center gap-2"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold  text-center">
            {loading ? (
              <div className="h-8 bg-white bg-opacity-30 rounded w-32 animate-pulse"></div>
            ) : (
              venue.name
            )}
          </h1>
          
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/my-venue/${venue._id}/edit`)}
              className=" hover:text-blue-400 transition-colors duration-200 flex items-center gap-1"
            >
              <FaEdit className="w-5 h-5" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className=" hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
            >
              <FaTrash className="w-5 h-5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-200">
            Venue Details
          </h2>
          
          {/* Grid Layout for Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Side: Venue Details */}
            <div className="space-y-8">
              {/* Description */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Description
                </h3>
                {loading ? (
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {venue.description}
                  </p>
                )}
              </div>

              {/* Menu */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Menu
                </h3>
                {loading ? (
                  <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {venue.menu}
                  </p>
                )}
              </div>

              {/* Alcohol-Free Options */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Alcohol-Free Options
                </h3>
                {loading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Alcohol-Free Drink Brands */}
                    <div>
                      <div className="flex items-center mb-2">
                        <FaWineGlassAlt className="w-5 h-5 text-purple-500 dark:text-purple-400 mr-2" />
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          Alcohol-Free Drink Brands
                        </h4>
                      </div>
                      {venue.alcoholFreeDrinkBrands && venue.alcoholFreeDrinkBrands.trim() !== "" ? (
                        <div className="flex flex-wrap gap-2 ml-7">
                          {venue.alcoholFreeDrinkBrands.split(',').map((brand, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                            >
                              {brand.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 ml-7 italic">
                          No alcohol-free drink brands listed
                        </p>
                      )}
                    </div>
                    
                    {/* Alcohol-Free Beers on Tap */}
                    <div>
                      <div className="flex items-center mb-2">
                        <FaBeer className="w-5 h-5 text-amber-500 dark:text-amber-400 mr-2" />
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          Alcohol-Free Beers on Tap
                        </h4>
                      </div>
                      {venue.alcoholFreeBeersOnTap && venue.alcoholFreeBeersOnTap.trim() !== "" ? (
                        <div className="flex flex-wrap gap-2 ml-7">
                          {venue.alcoholFreeBeersOnTap.split(',').map((beer, index) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-sm"
                            >
                              {beer.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 ml-7 italic">
                          No alcohol-free beers on tap listed
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {/* Address */}
                  {loading ? (
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  ) : (
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="w-5 h-5 text-red-500 dark:text-red-400 mr-3" />
                      <p className="text-gray-700 dark:text-gray-300">
                        {venue.address}
                      </p>
                    </div>
                  )}

                  {/* Phone */}
                  {loading ? (
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  ) : (
                    <div className="flex items-center">
                      <FaPhone className="w-5 h-5 text-green-500 dark:text-green-400 mr-3" />
                      <p className="text-gray-700 dark:text-gray-300">
                        {venue.phone}
                      </p>
                    </div>
                  )}

                  {/* Website */}
                  {loading ? (
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  ) : venue.website && (
                    <div className="flex items-center">
                      <FaGlobe className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3" />
                      <a
                        href={venue.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {venue.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Status:</span>
                    {loading ? (
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        venue.isVerified 
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" 
                          : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                      }`}>
                        {venue.isVerified ? "Verified" : "Pending"}
                      </span>
                    )}
                  </div>

                  {/* Created At */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Created:</span>
                    {loading ? (
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                    ) : (
                      <div className="flex items-center">
                        <FaClock className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {new Date(venue.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Rating:</span>
                    {loading ? (
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                    ) : (
                      <div className="flex items-center">
                        <RatingStars rating={venue.rating || 0} />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          ({venue.rating || 0})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Images and Map */}
            <div className="space-y-8">
              {/* Venue Images */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                  Venue Images
                </h3>
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                ) : (
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {venue.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <img
                          src={`${import.meta.env.VITE_API_URL}/${image.replace(/\\/g, "/")}`}
                          alt={`Venue Image ${index + 1}`}
                          loading="lazy"
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Location Map */}
              {loading ? (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                    Location
                  </h3>
                  <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              ) : coordinates && (
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
                    Location
                  </h3>
                  <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
                    <MapComponent
                      coordinates={coordinates}
                      isStatic={true}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailFeature;
