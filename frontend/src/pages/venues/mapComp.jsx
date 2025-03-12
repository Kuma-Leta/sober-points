import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React-Leaflet
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapComponent({ coordinates, isStatic, onClick }) {
  const [latitude, longitude] = coordinates || [0, 0];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        scrollWheelZoom={!isStatic}
        dragging={!isStatic} // Disable dragging if the map is static
        doubleClickZoom={!isStatic} // Disable double-click zoom if the map is static
        style={{ height: "100%", width: "100%" }}
        onClick={onClick} // Handle map click events
      >
        {/* Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker */}
        <Marker position={[latitude, longitude]} icon={defaultIcon}>
          <Popup className="font-medium">
            Venue Location: <br />
            Latitude: {latitude.toFixed(4)}, <br />
            Longitude: {longitude.toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
