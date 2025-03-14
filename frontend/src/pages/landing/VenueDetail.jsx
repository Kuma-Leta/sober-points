import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import VenueLists from "./VenueLists";
import {
  fetchNearbyVenues,
  addVenueRating,
} from "../../redux/venue/venueSlice";
import GetDirections from "./GetDirections";
import axios from "axios";
import RatingStars from "./RatingStars";
import axiosInstance from "../../api/api";

// Custom icon for the venue marker
const venueIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  );
};

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
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(true); // Loading state for venue details
  const [error, setError] = useState(null); // Error state for venue details

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

  // Fetch ratings for the venue
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ratings/${id}/getRating`
        );
        setRatings(response.data.ratings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    if (id) {
      fetchRatings();
    }
  }, [id]);

  const handleSubmitRating = async () => {
    if (ratingService > 0 && ratingLocation > 0 && review.trim()) {
      const averageRating = (ratingService + ratingLocation) / 2;
      try {
        await dispatch(
          addVenueRating({ venueId: id, rating: averageRating, review })
        ).unwrap();
        setReview("");
        setRatingService(0);
        setRatingLocation(0);
        setToast({
          show: true,
          message: "Rating submitted successfully!",
          type: "success",
        });
      } catch (error) {
        setToast({
          show: true,
          message: "Failed to submit rating. Please try again.",
          type: "error",
        });
      }
    } else {
      setToast({
        show: true,
        message: "Please rate both service and location and provide a review.",
        type: "error",
      });
    }
  };
  const renderRatings = () => {
    if (ratings.length === 0) {
      return <p className="text-gray-600">No ratings yet.</p>;
    }

    return (
      <div className="space-y-4 mt-4">
        {ratings.map((rating, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Circle with the first letter of the rater's name */}
                <div className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full mr-2">
                  <span className="text-sm font-semibold">
                    {rating.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-800">
                    {rating.user.name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {getTimeSince(rating.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <RatingStars rating={rating.rating} />
                <span className="ml-2 text-sm text-gray-600">
                  ({rating.rating})
                </span>
              </div>
            </div>
            <p className="text-gray-600 mt-2">{rating.review}</p>
          </div>
        ))}
      </div>
    );
  };
  const getTimeSince = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const timeDiff = now - reviewDate;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "1 day ago";
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks ago`;
    return `${Math.floor(daysDiff / 30)} months ago`;
  };

  const handleRatingChange = (ratingType, value) => {
    if (ratingType === "service") {
      setRatingService(value);
    } else if (ratingType === "location") {
      setRatingLocation(value);
    }
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImagePopupOpen(true);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex < venue.images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : venue.images.length - 1
    );
  };

  const closeImagePopup = () => {
    setIsImagePopupOpen(false);
  };

  if (loading) {
    return (
      <p className="text-gray-600 mt-4 text-center animate-pulse">
        Loading venue details...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500 mt-4 text-center">{error}</p>;
  }

  if (!venue) {
    return <p className="text-gray-600 mt-4 text-center">Venue not found.</p>;
  }

  const [longitude, latitude] = venue.location.coordinates;

  return (
    <div className="p-4 sm:p-1 sm:mt-2 md:p-5 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* Venue Header */}
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-1 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          {venue.name}
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2">
          📍 {venue.address}
        </p>
        <div className="flex items-center mt-1">
          <RatingStars rating={venue.rating || 0} />
          <span className="ml-2 text-sm text-gray-600">
            ({venue.rating || 0})
          </span>
        </div>

        {/* Display up to 3 images */}
        {venue.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {venue.images.slice(0, 3).map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${venue.images[index].replace(
                  /\\/g,
                  "/"
                )}`}
                alt={`Venue ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleImageClick(index)}
              />
            ))}
            {venue.images.length > 3 && (
              <div
                className="w-full h-32 flex items-center justify-center bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => handleImageClick(3)}
              >
                <span className="text-gray-600">
                  +{venue.images.length - 3}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Image Popup */}
        {isImagePopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
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

        {/* Map */}
        {latitude && longitude ? (
          <div className="mt-4 sm:mt-6">
            <MapContainer
              center={[latitude, longitude]}
              zoom={15}
              style={{
                height: "300px",
                width: "100%",
                borderRadius: "12px",
                zIndex: "0",
              }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[latitude, longitude]} icon={venueIcon}>
                <Popup>
                  {venue.name} <br /> {venue.address}
                </Popup>
              </Marker>
              <ZoomControl position="topright" />
            </MapContainer>

            {/* Get Directions Button */}
            <div className="mt-4 p-2 sm:p-3 rounded-md text-center">
              <GetDirections destination={{ lat: latitude, lng: longitude }} />
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-2 sm:mt-4">
            Location data not available.
          </p>
        )}

        {/* Rating Section */}
        <div className="mt-6 sm:mt-8">
          <button
            onClick={() => setWantRate(!wantRate)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded-md hover:bg-primaryLight transition duration-300 text-sm sm:text-base"
          >
            {wantRate ? "Close Rating" : "Rate this Venue"}
          </button>

          {wantRate && (
            <div className="mt-4 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Rate this Venue:
              </h3>

              {/* Service Rating */}
              <div className="mt-3 sm:mt-4">
                <span className="text-gray-700">Service: </span>
                <div className="flex space-x-1 sm:space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={`service-${star}`}
                      className={`cursor-pointer text-xl sm:text-2xl ${
                        star <= ratingService
                          ? "text-yellow-500"
                          : "text-gray-300"
                      } hover:text-yellow-400 transition duration-200`}
                      onClick={() => handleRatingChange("service", star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Location Rating */}
              <div className="mt-3 sm:mt-4">
                <span className="text-gray-700">Location: </span>
                <div className="flex space-x-1 sm:space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={`location-${star}`}
                      className={`cursor-pointer text-xl sm:text-2xl ${
                        star <= ratingLocation
                          ? "text-yellow-500"
                          : "text-gray-300"
                      } hover:text-yellow-400 transition duration-200`}
                      onClick={() => handleRatingChange("location", star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* Review Input */}
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a review..."
                className="mt-3 sm:mt-4 p-2 sm:p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                rows="3"
              ></textarea>

              <button
                onClick={handleSubmitRating}
                className="mt-3 sm:mt-4 px-4 py-1.5 sm:px-6 sm:py-2 bg-primary text-white rounded-md hover:bg-primaryLight transition duration-300 text-sm sm:text-base"
              >
                Submit
              </button>
            </div>
          )}
        </div>

        {/* Reviews Display */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Reviews:
          </h3>
          {renderRatings()}
        </div>

        {/* Nearby Venues */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Nearby Venues
          </h2>
          <VenueLists />
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
