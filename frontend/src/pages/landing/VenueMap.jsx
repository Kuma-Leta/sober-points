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
import logoMarker from "../../assets/images/Logomark-Black.png";
import RatingStars from "./venuedetail/RatingStars";

// Create custom div elements for markers// Updated createVenueIcon function with larger logo
const createVenueIcon = (isMobile) => {
  const size = isMobile ? 50 : 60; // Location icon size
  const logoSize = isMobile ? 20 : 22; // Keep logo smaller than the icon

  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <!-- Solid Location Pin -->
        <svg viewBox="0 0 24 24" width="${size}" height="${size}" 
             style="position: absolute; top: 0; left: 0; fill: white; z-index: 1;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <!-- Logo centered and not stretched -->
        <img src="${logoMarker}" 
             style="position: absolute; 
                    top: 40%; 
                    left: 50%; 
                    transform: translate(-50%, -50%);
                    width: ${logoSize}px;
                    height: auto; /* Keeps original aspect ratio */
                    object-fit: contain; /* Prevents stretching */
                    z-index: 10;" 
             alt="Venue logo"/>
      </div>
    `,
    className: "custom-venue-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

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

// Handle map events
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
    lat: 51.509865,
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
  }, [dispatch, mapCenter.lat, mapCenter.lng]);

  // Update map center if search results change
  useEffect(() => {
    if (searchResults?.length > 0) {
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
      className="h-full w-full z-0 rounded-md "
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
      {venues?.filter((venue) => venue.isVerified)
        .map((venue) => {
          if (!venue.location || !venue.location.coordinates) {
            return null;
          }

          const [lng, lat] = venue.location.coordinates;
          const venueIcon = createVenueIcon(isMobile);

          return (
            <Marker key={venue._id} position={[lat, lng]} icon={venueIcon}>
              <Popup>
                <div className="max-w-[200px]">
                  {venue.images.length > 0 && (
                    <img
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/${venue.images[0].replace(/\\/g, "/")}`}
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
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default VenueMap;
