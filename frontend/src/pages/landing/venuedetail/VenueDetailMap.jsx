import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

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
    const controlDiv = L.control({ position: "topleft" });

    controlDiv.onAdd = function () {
      const div = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-custom-button"
      );
      div.innerHTML = `
        <button class="bg-primary text-white px-3 py-2 rounded-md shadow-md hover:bg-primaryLight transition">
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

    controlDiv.addTo(map);

    return () => {
      map.removeControl(controlDiv);
    };
  }, [map, destination]);

  return null;
}

// Dynamic Map Height Hook
const useDynamicHeight = () => {
  const [height, setHeight] = useState("400px");

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth < 640) {
        setHeight("300px"); // Mobile View
      } else if (window.innerWidth < 1024) {
        setHeight("400px"); // Tablet View
      } else {
        setHeight("500px"); // Desktop View
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return height;
};

function VenueDetailMap({ venue }) {
  const [longitude, latitude] = venue.location.coordinates;
  const mapHeight = useDynamicHeight();

  return (
    <div className="mt-6 w-full ">
      <div className="w-full h-full bg-white shadow-lg rounded overflow-hidden">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          style={{
            height: mapHeight,
            width: "100%",
            borderRadius: "5px",
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
          <GetDirectionsControl
            destination={{ lat: latitude, lng: longitude }}
          />

          <ZoomControl position="topright" />
        </MapContainer>
      </div>
    </div>
  );
}

export default VenueDetailMap;
