import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import GetDirections from "../landing/GetDirections";

// Custom Leaflet Icon
const venueIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom Control Component for "Get Directions" Button
function CustomControl({ position, children }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const control = L.control({ position });

      control.onAdd = () => {
        const div = L.DomUtil.create("div", "leaflet-bar");
        div.style.backgroundColor = "white";
        div.style.borderRadius = "4px";
        div.style.padding = "4px";
        div.style.boxShadow = "0 1px 5px rgba(0,0,0,0.4)";
        div.appendChild(children);
        return div;
      };

      control.addTo(map);

      // Cleanup on unmount
      return () => {
        control.remove();
      };
    }
  }, [map, position, children]);

  return null;
}

function VenueDetailMap({ venue }) {
  const [longitude, latitude] = venue.location.coordinates;

  return (
    <div className="mt-6 w-full lg:w-3/5 h-[450px] lg:h-[500px] bg-white shadow-lg rounded-xl">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          zIndex: "0",
        }}
        zoomControl={false}
      >
        {/* Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker */}
        <Marker position={[latitude, longitude]} icon={venueIcon}>
          <Popup>
            {venue.name} <br /> {venue.address}
          </Popup>
        </Marker>

        {/* Custom Get Directions Button Inside the Map (Top-Left Corner) */}
        <CustomControl position="topleft">
          <GetDirections destination={{ lat: latitude, lng: longitude }} />
        </CustomControl>

        {/* Zoom Control */}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}

export default VenueDetailMap;
