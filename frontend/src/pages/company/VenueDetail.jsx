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
import GetDirections from "./GetDirections"; // Import the GetDirections component

// Custom icon for the venue marker
const venueIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const VenueDetail = () => {
  const { id } = useParams();
  const { venues, loading, error } = useSelector((state) => state.venues);
  const dispatch = useDispatch();
  const [venue, setVenue] = useState(null);
  const [ratingService, setRatingService] = useState(0);
  const [ratingLocation, setRatingLocation] = useState(0);
  const [review, setReview] = useState("");
  const [wantRate, setWantRate] = useState(false);

  useEffect(() => {
    const foundVenue = venues.find((v) => v._id === id);
    if (foundVenue) setVenue(foundVenue);
    if (foundVenue) {
      dispatch(
        fetchNearbyVenues({
          lat: foundVenue.location.coordinates[1],
          lng: foundVenue.location.coordinates[0],
        })
      );
    }
  }, [id, venues, dispatch]);

  const handleRatingChange = (ratingType, value) => {
    if (ratingType === "service") {
      setRatingService(value);
    } else if (ratingType === "location") {
      setRatingLocation(value);
    }
  };

  const handleSubmitRating = () => {
    if (ratingService > 0 && ratingLocation > 0 && review.trim()) {
      const averageRating = (ratingService + ratingLocation) / 2;
      dispatch(addVenueRating({ venueId: id, rating: averageRating, review }));
      setReview(""); // Clear the review input after submitting
      setRatingService(0);
      setRatingLocation(0);
    } else {
      alert("Please rate both service and location and provide a review.");
    }
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

  // Extract latitude and longitude from the venue's location
  const [longitude, latitude] = venue.location.coordinates;

  return (
    <div className="p-4 sm:p-1 sm:mt-2 md:p-5 bg-gray-50 min-h-screen">
      {/* Venue Header */}
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-1 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
          {venue.name}
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2">
          📍 {venue.address}
        </p>
        <p className="text-sm sm:text-lg text-yellow-500 mt-1">
          ⭐ {venue.rating || "N/A"}
        </p>

        {/* Image */}
        {venue.images.length > 0 && (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="w-full h-48 sm:h-64 md:h-80 object-cover mt-4 rounded-lg shadow-sm"
          />
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
            <div className="mt-4  p-2 sm:p-3 rounded-md text-center">
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
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm sm:text-base"
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
        {venue.reviews && venue.reviews.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Reviews:
            </h3>
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              {venue.reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="text-gray-700 text-sm sm:text-base">
                    <strong className="text-blue-600">{review.user}</strong>{" "}
                    says:
                  </p>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    {review.text}
                  </p>
                  <p className="text-yellow-500 mt-1 text-sm sm:text-base">
                    Rating: {review.rating}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

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
