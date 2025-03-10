import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchNearbyVenues } from "../../redux/venue/venueSlice";
import logoMarker from "../../assets/images/logo.png";

const venueIcon = new L.Icon({
  iconUrl: logoMarker,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const userIcon = new L.Icon.Default();

function MapEvents({ setMapCenter }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      console.log("Map center updated:", center);
      setMapCenter({ lat: center.lat, lng: center.lng });
    },
  });

  return null;
}

const VenueMap = ({ userLocation, venues }) => {
  const dispatch = useDispatch();
  const [mapCenter, setMapCenter] = useState({
    lat: userLocation ? userLocation.lat : 51.509865,
    lng: userLocation ? userLocation.lng : -0.118092,
  });
  console.log("User Location:", userLocation);
  useEffect(() => {
    if (mapCenter.lat && mapCenter.lng) {
      console.log("Fetching venues for:", mapCenter);
      dispatch(fetchNearbyVenues({ lat: mapCenter.lat, lng: mapCenter.lng }));
    }
  }, [dispatch, mapCenter]);

  console.log("Venues prop:", venues);

  if (!Array.isArray(venues) || venues.length === 0) {
    return (
      <p className="text-center text-grayColor">No venues found on the map.</p>
    );
  }

  return (
    <MapContainer
      center={[mapCenter.lat, mapCenter.lng]}
      zoom={13}
      className="h-full w-full rounded-md"
      style={{ height: "500px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <MapEvents setMapCenter={setMapCenter} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}

      {venues.map((venue) => {
        if (!venue.location || !venue.location.coordinates) {
          console.warn("Invalid venue:", venue);
          return null;
        }

        const [lng, lat] = venue.location.coordinates;

        return (
          <Marker key={venue._id} position={[lat, lng]} icon={venueIcon}>
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
