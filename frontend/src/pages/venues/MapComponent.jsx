import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate, useLocation } from "react-router-dom";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// Fix for default marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerIconShadow,
});

const MapClickHandler = ({ setMarkerPosition }) => {
  useMapEvents({
    click(e) {
      console.log("Map clicked at:", e.latlng);
      setMarkerPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export default function MapComponent() {
  const [markerPosition, setMarkerPosition] = useState([9.145, 40.489]); // Default: Ethiopia
  const navigate = useNavigate();
  const location = useLocation();
  const { formData } = location.state || {};

  console.log("Rendering MapComponent");
  console.log("Marker Position:", markerPosition);

  const handleSaveLocation = () => {
    navigate("/venue-form", {
      state: {
        formData: {
          ...formData,
          latitude: markerPosition[0],
          longitude: markerPosition[1],
        },
      },
    });
  };

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <MapContainer
        center={markerPosition}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler setMarkerPosition={setMarkerPosition} />
        <Marker position={markerPosition} />
      </MapContainer>
      <button
        type="button"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "10px 20px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handleSaveLocation}
      >
        Save Location
      </button>
    </div>
  );
}
