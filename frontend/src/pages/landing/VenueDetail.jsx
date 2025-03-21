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
        const response = await axiosInstance.get(
          `http://localhost:5000/api/venues/${id}`
        );
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
      <p className="text-grayColor mt-4 text-center">
        Loading venue details...
      </p>
    );
  }

  if (error) {
    return <p className="text-primary mt-4 text-center">{error}</p>;
  }

  if (!venue) {
    return <p className="text-grayColor mt-4 text-center">Venue not found.</p>;
  }

  const [longitude, latitude] = venue.location.coordinates;

  return (
    <div className="mt-16 sm:p-1 sm:mt-6 md:mt-16 bg-white min-h-screen">
      <ToastContainer />
      <div className="pl-6 sm:pl-8 lg:pl-12 py-4">
        <SearchBar />
      </div>

 {/* Responsive Image Row */}
{venue.images.length > 0 && (
  <div className="flex gap-4  overflow-hidden">
    {venue.images.slice(0, 3).map((image, index) => (
      <div
        key={index}
        className="relative flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 aspect-square overflow-hidden rounded-lg cursor-pointer"
        onClick={() => handleImageClick(index)}
      >
        <img
          src={`http://localhost:5000/${image.replace(/\\/g, "/")}`}
          alt={`Venue ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
)}


      {/* Venue Details */}
      <div className="w-full mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          {venue.name}
        </h1>

        <p className="text-lg text-gray-600 mt-2 flex items-center">
          📍 <span className="ml-1">{venue.address}</span>
        </p>

        <p className="text-gray-700 mt-4 leading-relaxed">
          {venue.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mt-4">
          {/* <RatingStars rating={venue.rating || 0} />
          <span className="ml-2 text-gray-600 text-sm font-medium">
            ({venue.rating || 0})
          </span> */}
        </div>
      </div>

      {/* Image Popup */}
      {isImagePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full">
            <button
              className="absolute top-2 right-2 text-grayColor hover:text-gray-800"
              onClick={closeImagePopup}
            >
              &times;
            </button>
            <img
              src={`http://localhost:5000/${venue.images[
                selectedImageIndex
              ].replace(/\\/g, "/")}`}
              alt={`Venue ${selectedImageIndex + 1}`}
              className="w-full h-96 object-contain rounded-lg"
            />
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                onClick={handlePreviousImage}
              >
                Previous
              </button>
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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
          <p className="text-grayColor mt-2 sm:mt-4">
            Location data not available.
          </p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mt-6 sm:mt-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Reviews:
        </h3>
        <VenueReviews venueId={id} venue={venue} />
      </div>

      {/* Nearby Venues Section */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Nearby Venues
        </h2>
        <VenueLists />
      </div>
    </div>
  );
};

export default VenueDetail;