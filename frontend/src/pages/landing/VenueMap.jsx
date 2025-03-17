import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchNearbyVenues } from "../../redux/venue/venueSlice";
import logoMarker from "../../assets/images/logo.png";
import RatingStars from "./RatingStars";

// Custom venue icon
const venueIcon = new L.Icon({
  iconUrl: logoMarker,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Smaller venue icon for mobile
const venueIconSmall = new L.Icon({
  iconUrl: logoMarker,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Default user icon
const userIcon = new L.Icon.Default();

// Update map center while preserving zoom level
const UpdateMapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center.lat && center.lng) {
      const currentZoom = map.getZoom();
      map.setView([center.lat, center.lng], currentZoom);
    }
  }, [center, map]);

  return null;
};

// Handle map events (e.g., user moving the map)
const MapEvents = ({ setMapCenter }) => {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
};

const VenueMap = () => {
  const dispatch = useDispatch();
  const { venues, searchResults } = useSelector((state) => state.venues);

  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865, // Default: London
    lng: -0.118092,
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // useRef to store the previous map center
  const prevCenterRef = useRef(mapCenter);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter = { lat: latitude, lng: longitude };
          setUserLocation(newCenter);
          setMapCenter(newCenter);
          prevCenterRef.current = newCenter;
        },
        (error) => console.warn("Geolocation error:", error.message)
      );
    }
  }, []);

  // Fetch nearby venues only when map center changes
  useEffect(() => {
    // Compare new center with previous center to avoid unnecessary dispatches.
    if (
      mapCenter.lat !== prevCenterRef.current.lat ||
      mapCenter.lng !== prevCenterRef.current.lng
    ) {
      dispatch(fetchNearbyVenues({ lat: mapCenter.lat, lng: mapCenter.lng }));
      prevCenterRef.current = mapCenter;
    }
  }, [dispatch, mapCenter]);

  // Update map center if search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      const firstVenue = searchResults[0];
      if (firstVenue.location && firstVenue.location.coordinates) {
        const [lng, lat] = firstVenue.location.coordinates;
        const newCenter = { lat, lng };
        // Only update if the center has really changed
        if (
          newCenter.lat !== mapCenter.lat ||
          newCenter.lng !== mapCenter.lng
        ) {
          setMapCenter(newCenter);
        }
      }
    }
  }, [searchResults, mapCenter]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={13}
      className="h-[70vh] w-full rounded-md"
      touchZoom={true}
      doubleClickZoom={false}
      zoomControl={!isMobile}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <UpdateMapCenter center={mapCenter} />
      <MapEvents setMapCenter={setMapCenter} />

      {/* User Location Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}

      {/* Venue Markers */}
      {venues.map((venue) => {
        if (!venue.location || !venue.location.coordinates) {
          return null;
        }

        const [lng, lat] = venue.location.coordinates;

        return (
          <Marker
            key={venue._id}
            position={[lat, lng]}
            icon={isMobile ? venueIconSmall : venueIcon}
          >
            <Popup>
              <div className="max-w-[200px]">
                {venue.images.length > 0 && (
                  <img
                    src={`http://localhost:5000/${venue.images[0].replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={venue.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                )}
                <h3 className="text-lg font-semibold text-gray-800">
                  {venue.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{venue.address}</p>
                <div className="flex items-center mb-2">
                  <RatingStars rating={venue.rating || 0} />
                  <span className="ml-2 text-sm text-gray-600">
                    ({venue.rating || 0})
                  </span>
                </div>
                {venue.description && (
                  <p className="text-sm text-gray-600">{venue.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default VenueMap;
