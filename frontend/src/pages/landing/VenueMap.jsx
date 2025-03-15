import React, { useEffect, useState } from "react";
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

// Custom venue icon
const venueIcon = new L.Icon({
  iconUrl: logoMarker,
  iconSize: [40, 40], // Default size
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Smaller venue icon for mobile
const venueIconSmall = new L.Icon({
  iconUrl: logoMarker,
  iconSize: [30, 30], // Smaller size for mobile
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
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
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

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
        },
        (error) => console.warn("Geolocation error:", error.message)
      );
    }
  }, []);

  // Fetch nearby venues when map center changes
  useEffect(() => {
    if (mapCenter.lat && mapCenter.lng) {
      dispatch(fetchNearbyVenues({ lat: mapCenter.lat, lng: mapCenter.lng }));
    }
  }, [dispatch, mapCenter]);

  // Update map center if search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      const firstVenue = searchResults[0];
      if (firstVenue.location && firstVenue.location.coordinates) {
        const [lng, lat] = firstVenue.location.coordinates;
        setMapCenter({ lat, lng });
      }
    }
  }, [searchResults]);

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
      className="h-[70vh] w-full rounded-md" // Responsive height
      touchZoom={true} // Enable touch zoom
      doubleClickZoom={false} // Disable double-click zoom for better touch interaction
      zoomControl={!isMobile} // Hide zoom control on mobile for cleaner UI
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
            icon={isMobile ? venueIconSmall : venueIcon} // Use smaller icon on mobile
          >
            <Popup>
              <strong>{venue.name}</strong>
              <p>{venue.address}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default VenueMap;
