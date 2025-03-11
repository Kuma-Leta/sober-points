import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logoMarker from "../../assets/images/logo.png"; // Ensure correct path

// ✅ **Custom Sober Points Icon**
const customIcon = new L.Icon({
  iconUrl: logoMarker,
  iconSize: [40, 40], // Adjust size if needed
  iconAnchor: [20, 40], // Center the icon properly
  popupAnchor: [0, -40],
});

const VenueMap = ({ venues, center }) => {
  if (!Array.isArray(venues) || venues.length === 0) {
    return (
      <p className="text-center text-grayColor">No venues found on the map.</p>
    );
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={13}
      className="h-full w-full rounded-md"
      style={{ height: "500px" }} // Add a fixed height
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* ✅ **Properly Display Markers for Each Venue** */}
      {venues.map((venue) => {
        if (!venue.location || !venue.location.coordinates) return null;

        const [lng, lat] = venue.location.coordinates; // Backend provides [longitude, latitude]

        return (
          <Marker key={venue._id} position={[lat, lng]} icon={customIcon}>
            <Popup>
              <strong>{venue.name}</strong>
              <p>{venue.address}</p>
              {venue.images && venue.images.length > 0 && (
                <img
                  src={venue.images[0]} // Use the transformed image URL
                  alt={venue.name}
                  className="w-32 h-24 object-cover rounded-md mt-2"
                />
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default VenueMap;
