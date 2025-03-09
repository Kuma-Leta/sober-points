import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Tooltip, // Import Tooltip from react-leaflet
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaSearch, FaTimes } from "react-icons/fa"; // Import icons

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
  return data.map((item) => ({
    name: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
};

// Component to update map view when marker position changes
const UpdateMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export default function MapComponent({ setFormData }) {
  const [markerPosition, setMarkerPosition] = useState([9.145, 40.489]); // Default: Ethiopia
  const [searchQuery, setSearchQuery] = useState("");
  const [showLocationCard, setShowLocationCard] = useState(false); // State for location card
  const [suggestions, setSuggestions] = useState([]); // State for search suggestions

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
      setMarkerPosition([9.145, 40.489]); // Default: Ethiopia
      setFormData((prev) => ({
        ...prev,
        latitude: 9.145,
        longitude: 40.489,
      }));
    }
  }, [setFormData]);

  // Handle map double-click to update marker position and show location card
  const MapClickHandler = () => {
    useMapEvents({
      dblclick(e) {
        const { lat, lng } = e.latlng;
        if (isNaN(lat) || isNaN(lng)) {
          console.error("Invalid latitude or longitude values.");
          return;
        }
        setMarkerPosition([lat, lng]);
        setShowLocationCard(true); // Show location card on double-click
      },
    });
    return null;
  };

  // Handle location search
  const handleSearch = async (e) => {
    e.preventDefault();
    const locations = await geocodeLocation(searchQuery);
    setSuggestions(locations);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (location) => {
    setMarkerPosition([location.lat, location.lng]);
    setSearchQuery(location.name);
    setSuggestions([]); // Clear suggestions
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
    setSuggestions([]); // Clear suggestions
  };

  // Handle confirmation to save location
  const handleConfirmLocation = () => {
    console.log("Marker Position:", markerPosition); // Debugging
    if (isNaN(markerPosition[0]) || isNaN(markerPosition[1])) {
      console.error("Invalid latitude or longitude values.");
      return;
    }

    // Update the parent component's formData with the selected latitude and longitude
    setFormData((prev) => ({
      ...prev,
      latitude: markerPosition[0],
      longitude: markerPosition[1],
    }));

    setShowLocationCard(false); // Hide location card
  };

  // Handle cancellation of location selection
  const handleCancelLocation = () => {
    setShowLocationCard(false); // Hide location card
  };

  // Automatically fetch suggestions as the user types
  useEffect(() => {
    if (searchQuery) {
      const fetchSuggestions = async () => {
        const locations = await geocodeLocation(searchQuery);
        setSuggestions(locations);
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  return (
    <div className="w-full">
      {/* Flex container for search and map */}
      <div className="w-full mb-4 dark:bg-darkBg">
        {/* Left: Search Bar and Suggestions */}

        <form onSubmit={handleSearch} className="w-full">
          <div className="relative pb-1">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full  px-3 py-2 border rounded-lg shadow-md dark:bg-darkBg focus:outline-none focus:ring-2 focus:ring-red-600 pl-10 pr-10"
            />
            {/* Search Icon */}
            <button
              type="submit"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition"
            >
              <FaSearch className="w-5 h-5" />
            </button>
            {/* Clear Icon */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
        {/* Dropdown Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white dark:bg-darkBg border border-gray-300 rounded-lg shadow-lg mt-1">
            {suggestions.map((location, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(location)}
                className="p-2 hover:bg-red-500 dark:bg-darkBg cursor-pointer"
              >
                {location.name}
              </div>
            ))}
          </div>
        )}

        {/* Right: Map Container */}

        <div className="relative w-full h-80 z-0">
          <MapContainer
            center={markerPosition}
            zoom={13} // Higher zoom level for better visibility of the current location
            className="h-full w-full rounded-md"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marker with Tooltip */}
            <Marker
              position={markerPosition}
              key={`${markerPosition[0]}-${markerPosition[1]}`} // Force re-render on position change
            >
              <Tooltip
                direction="top" // Position of the tooltip
                offset={[0, -10]} // Adjust the offset for better positioning
                permanent={false} // Show only on hover
                opacity={0.9} // Slightly transparent
                className="font-medium text-sm" // Custom styling
              >
                Double-click to select this location
              </Tooltip>
            </Marker>
            {/* Map Click Handler */}
            <MapClickHandler />
            {/* Update Map View */}
            <UpdateMapView center={markerPosition} />
          </MapContainer>

          {/* Floating Location Card */}
          {showLocationCard && (
            <div className="absolute  top-4 right-4 z-[1000]">
              <div className="bg-white p-6 dark:bg-darkBg rounded-lg shadow-lg w-72">
                <h3 className="text-lg font-semibold  mb-4">
                  Selected Location
                </h3>
                <p className="mb-2">
                  <span className="font-medium">Latitude:</span>{" "}
                  {markerPosition[0].toFixed(4)}
                </p>
                <p className="mb-4">
                  <span className="font-medium">Longitude:</span>{" "}
                  {markerPosition[1].toFixed(4)}
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancelLocation}
                    className="bg-gray-400 px-4 py-2 rounded text-white hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmLocation}
                    className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
