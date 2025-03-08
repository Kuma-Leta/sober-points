import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
});

// Geocoding function to search for locations
const geocodeLocation = async (query) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
};

// Component to update the map view when the location changes
const UpdateMapView = ({ center }) => {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
};

export default function MapComponent({ setFormData }) {
  const [markerPosition, setMarkerPosition] = useState([0, 0]); // Default: [0, 0] (will be updated)
  const [searchQuery, setSearchQuery] = useState("");

  // Get the user's current location when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
          setFormData((prev) => ({
            ...prev,
            latitude,
            longitude,
          }));
        },
        (error) => {
          console.error("Error getting current location:", error);
          // Fallback to a default location if geolocation fails
          setMarkerPosition([9.145, 40.489]); // Default: Ethiopia
          setFormData((prev) => ({
            ...prev,
            latitude: 9.145,
            longitude: 40.489,
          }));
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Fallback to a default location if geolocation is not supported
      setMarkerPosition([9.145, 40.489]); // Default: Ethiopia
      setFormData((prev) => ({
        ...prev,
        latitude: 9.145,
        longitude: 40.489,
      }));
    }
  }, [setFormData]);

  // Handle map click to update marker position
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    const location = await geocodeLocation(searchQuery);
    if (location) {
      setMarkerPosition([location.lat, location.lng]);
      setFormData((prev) => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng,
      }));
    } else {
      alert("Location not found. Please try another search.");
    }
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-4">
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Map Container */}
      <div className="relative h-80 w-full rounded-md border">
        <MapContainer
          center={markerPosition}
          zoom={13} // Higher zoom level for better visibility of the current location
          className="h-full w-full rounded-md"
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={markerPosition} />
          <UpdateMapView center={markerPosition} />
        </MapContainer>

        {/* Save Location Button */}
        <button
          type="button"
          className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600 transition"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              latitude: markerPosition[0],
              longitude: markerPosition[1],
            }))
          }
        >
          Save Location
        </button>
      </div>
    </div>
  );
}
