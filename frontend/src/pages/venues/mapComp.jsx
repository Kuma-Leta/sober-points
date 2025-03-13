import React, { useEffect, useRef } from "react";
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

export default function MapComponent({ coordinates, isStatic }) {
  const mapRef = useRef(null); // Ref to access the MapContainer instance
  const [longitude, latitude] = coordinates || [0, 0];
  const center = [latitude, longitude]; // Leaflet expects [latitude, longitude]

  // Update the map view when coordinates change
  useEffect(() => {
    if (mapRef.current && coordinates) {
      mapRef.current.setView(center, 15); // Set new center and zoom level
    }
  }, [coordinates, center]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={!isStatic}
        dragging={!isStatic}
        doubleClickZoom={!isStatic}
        touchZoom={!isStatic}
        zoomControl={!isStatic}
        style={{
          height: "100%",
          width: "100%",
          pointerEvents: isStatic ? "none" : "auto",
        }}
        ref={mapRef} // Attach the ref to the MapContainer
      >
        {/* Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker */}
        <Marker position={center} icon={defaultIcon}>
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
