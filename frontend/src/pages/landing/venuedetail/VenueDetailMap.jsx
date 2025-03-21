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

// Custom Leaflet Icon
const venueIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Custom Leaflet Control for "Get Directions" Button
function GetDirectionsControl({ destination }) {
  const map = useMap();

  useEffect(() => {
    // Create control only if it doesn't already exist
    const controlDiv = L.control({ position: "topleft" });

    // Define the control to add
    controlDiv.onAdd = function () {
      const div = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-custom-button"
      );
      div.innerHTML = `
        <button class="bg-primary text-white px-3 py-2 rounded-md shadow-md hover:primaryLight transition">
          Get Directions
        </button>
      `;
      div.onclick = () => {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`,
          "_blank"
        );
      };
      return div;
    };

    // Add control to map
    controlDiv.addTo(map);

    // Cleanup function: remove the button when component unmounts or if destination changes
    return () => {
      map.removeControl(controlDiv);
    };
  }, [map, destination]); // The effect depends on the map and destination props

  return null;
}

function VenueDetailMap({ venue }) {
  const [longitude, latitude] = venue.location.coordinates;

  return (
    <div className="mt-6 w-full pl-6 lg:w-3/5 h-[400px] lg:h-[450px] bg-white shadow-lg rounded-xl">
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
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={venueIcon}>
          <Popup>
            {venue.name} <br /> {venue.address}
          </Popup>
        </Marker>

        {/* Custom Get Directions Button Inside the Map */}
        <GetDirectionsControl destination={{ lat: latitude, lng: longitude }} />

        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
}

export default VenueDetailMap;
