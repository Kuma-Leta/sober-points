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
import "leaflet/dist/leaflet.css"; // Ensure Leaflet CSS is imported
import L from "leaflet"; // Import Leaflet for custom icons
import VenueLists from "./VenueLists";
import { fetchNearbyVenues } from "../../redux/venue/venueSlice";

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
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const foundVenue = venues.find((v) => v._id === id);
    if (foundVenue) setVenue(foundVenue);
    fetchNearbyVenues(
      foundVenue.location.coordinates[1],
      foundVenue.location.coordinates[0]
    );
  }, [id, venues]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleSubmitRating = () => {
    if (rating > 0 && rating <= 5) {
      // Dispatch an action to update the rating in the backend (implement the action in Redux)
      dispatch(updateVenueRating(id, rating));
      setRating(0); // Clear the input after submitting
    } else {
      alert("Please provide a valid rating between 1 and 5.");
    }
  };

  if (loading) {
    return (
      <p className="text-grayColor mt-2 text-center">
        Loading venue details...
      </p>
    );
  }

  if (error) {
    return <p className="text-red-500 mt-2 text-center">{error}</p>;
  }

  if (!venue) {
    return <p className="text-grayColor mt-2 text-center">Venue not found.</p>;
  }

  // Extract latitude and longitude from the venue's location
  const [longitude, latitude] = venue.location.coordinates;

  return (
    <div className="p-16">
      <h1 className="text-3xl font-bold">{venue.name}</h1>
      <p className="text-lg text-gray-600">📍 {venue.address}</p>
      <p className="text-lg text-yellow-500">⭐ {venue.rating || "N/A"}</p>

      {/* Image */}
      {venue.images.length > 0 && (
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-80 object-cover mt-4 rounded-lg"
        />
      )}

      {latitude && longitude ? (
        <MapContainer
          center={[latitude, longitude]} // Use latitude and longitude
          zoom={15}
          style={{
            height: "400px",
            width: "100%",
            marginTop: "20px",
            borderRadius: "8px",
          }}
          zoomControl={false} // Disable default zoom control
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
      ) : (
        <p className="text-gray-500 mt-2">Location data not available.</p>
      )}

      {/* Rating */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold">Rate this Venue:</h3>
        <input
          type="number"
          value={rating}
          onChange={handleRatingChange}
          min="1"
          max="5"
          className="p-2 mt-2 border rounded-md"
          placeholder="Rate between 1 and 5"
        />
        <button
          onClick={handleSubmitRating}
          className="ml-2 p-2 bg-blue-500 text-white rounded-md"
        >
          Submit Rating
        </button>
      </div>
      <div>
        <h2>Nearby venues</h2>
        <VenueLists />
      </div>
    </div>
  );
};

export default VenueDetail;
