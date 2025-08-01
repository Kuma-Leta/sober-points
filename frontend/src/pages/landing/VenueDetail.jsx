import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import VenueLists from "./VenueLists";
import {
  fetchNearbyVenues,
  addVenueRating,
  updateVenueRating,
} from "../../redux/venue/venueSlice";
import GetDirections from "./GetDirections";
import axios from "axios";
import RatingStars from "./venuedetail/RatingStars";
import axiosInstance from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import VenueDetailMap from "./venuedetail/VenueDetailMap";
import VenueReviews from "./venuedetail/VenueReviews";
import SearchBar from "../../components/search";
import Tags from "./Tags";
import { FaFacebook, FaGlobe, FaInstagram } from "react-icons/fa";

const VenueDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [venue, setVenue] = useState(null);
  const [ratingService, setRatingService] = useState(0);
  const [ratingLocation, setRatingLocation] = useState(0);
  const [review, setReview] = useState("");
  const [wantRate, setWantRate] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for venue details
  const [error, setError] = useState(null); // Error state for venue details
  const { user, isAuthenticated } = useAuth(); // Get the authenticated user
  const navigate = useNavigate();

  // Fetch venue details by ID
  useEffect(() => {
    const fetchVenueById = async () => {
      try {
        const response = await axiosInstance.get(`/venues/${id}`);
        setVenue(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching venue details:", error);
        setError("Failed to fetch venue details. Please try again.");
        setLoading(false);
      }
    };

    fetchVenueById();
  }, [id]);

  // Fetch nearby venues when the venue is found
  useEffect(() => {
    if (venue) {
      dispatch(
        fetchNearbyVenues({
          lat: venue.location.coordinates[1],
          lng: venue.location.coordinates[0],
        })
      );
    }
  }, [venue, dispatch]);

  // Handle image click to open popup
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImagePopupOpen(true);
  };

  // Handle next image in the popup
  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex < venue.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Handle previous image in the popup
  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : venue.images.length - 1
    );
  };

  // Close the image popup
  const closeImagePopup = () => {
    setIsImagePopupOpen(false);
  };

  if (loading) {
    return (
      <p className="text-grayColor dark:text-darkText mt-4 text-center">
        Loading venue details...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-primary dark:text-primaryLight mt-4 text-center">
        {error}
      </p>
    );
  }

  if (!venue) {
    return (
      <p className="text-grayColor dark:text-darkText mt-4 text-center">
        Venue not found.
      </p>
    );
  }

  const [longitude, latitude] = venue.location.coordinates;

  return (
    <div className="max-w-7xl mx-auto bg-white mb-10 dark:bg-darkBg min-h-screen px-6 sm:px-8 lg:px-12">
      <ToastContainer />
      <div className="py-4">
        <SearchBar />
      </div>
      <Tags />
      {/* Venue Details */}
      <div className="w-full bg-white dark:bg-darkCard p-6 sm:p-8 rounded-lg my-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-darkText leading-tight mb-2">
          {venue.name}
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 flex items-center">
          <span className="mr-2">📍</span>
          <span className="hover:text-blue-500 transition-colors duration-200">
            {venue.address}
          </span>
        </p>

        {venue.website && (
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2 flex items-center transition-colors duration-200"
          >
            <span className="mr-2">🌐</span>
            <span className="underline">Visit Website</span>
            <span className="ml-1 text-sm">↗</span>
          </a>
        )}

        <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
          {venue.description}
        </p>
        <div className="flex gap-4 mt-3">
          {venue.socialMedia?.instagram && (
            <a
              href={`https://instagram.com/${venue.socialMedia.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 flex items-center transition-colors duration-200"
            >
              <FaInstagram className="mr-1" />
              <span className="underline">Instagram</span>
            </a>
          )}
          {venue.socialMedia?.facebook && (
            <a
              href={venue.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors duration-200"
            >
              <FaFacebook className="mr-1" />
              <span className="underline">Facebook</span>
            </a>
          )}
          {venue.socialMedia?.website && (
            <a
              href={venue.socialMedia.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center transition-colors duration-200"
            >
              <FaGlobe className="mr-1" />
              <span className="underline">website</span>
            </a>
          )}
        </div>
        {venue?.additionalInformation && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Additional Information
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {venue.additionalInformation}
            </p>
          </div>
        )}
        {/* Venue Checklist */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Venue Features
          </h3>
          <ul className="space-y-3">
            {[
              "This venue offers at least three alcohol-free drinks beyond basic soft drinks (e.g., alcohol-free beer, wine, cocktails, kombucha).",
              "The venue offers grown-up alcohol-free options, such as botanical sodas, adaptogenic drinks (like functional mushrooms or calming herbs), shrubs, or premium mixers.",
              "This venue offers alcohol-free beer on draught",
              "Alcohol-free options are clearly listed on the menu or drink board",
            ].map(
              (item, index) =>
                venue?.checklist &&
                venue?.checklist[index] && (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </li>
                )
            )}
          </ul>
        </div>

        {/* Rating */}
        <div className="flex items-center mt-4">
          <RatingStars rating={venue.rating || 0} />
          <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
            ({venue.rating?.toFixed(1) || "0.0"})
          </span>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          {/* You can add more venue details here if needed */}
        </div>
      </div>
      {/* Responsive Image Row */}
      {venue?.images?.length > 0 && (
        <div className="flex gap-4 overflow-hidden">
          {venue?.images?.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 aspect-square overflow-hidden rounded cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/${image.replace(
                  /\\/g,
                  "/"
                )}`}
                alt={`Venue ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Popup */}
      {isImagePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-darkCard p-4 rounded-lg max-w-4xl w-full">
            <button
              className="absolute top-2 right-2 text-grayColor dark:text-darkText hover:text-gray-800 dark:hover:text-gray-200"
              onClick={closeImagePopup}
            >
              &times;
            </button>
            <img
              src={`${import.meta.env.VITE_API_URL}/${venue.images[
                selectedImageIndex
              ].replace(/\\/g, "/")}`}
              alt={`Venue ${selectedImageIndex + 1}`}
              className="w-full h-96 object-contain rounded-lg"
            />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={handlePreviousImage}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={handleNextImage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="w-full">
        {latitude && longitude ? (
          <VenueDetailMap venue={venue} />
        ) : (
          <p className="text-grayColor dark:text-darkText mt-2 sm:mt-4">
            Location data not available.
          </p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-darkText">
          Reviews:
        </h3>
        <VenueReviews venueId={id} venue={venue} />
      </div>

      {/* Nearby Venues Section */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-darkText">
          Nearby Venues
        </h2>
        <VenueLists />
      </div>
    </div>
  );
};

export default VenueDetail;
