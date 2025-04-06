import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
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

const createVenueIcon = (isMobile, isHighlighted = false) => {
  const size = isMobile ? 50 : 60;
  const logoSize = isMobile ? 20 : 22;
  const pinColor = isHighlighted ? "#FF0000" : "#FFFFFF";

  return L.divIcon({
    html: `
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 24 24" width="${size}" height="${size}" 
             style="position: absolute; top: 0; left: 0; fill: ${pinColor}; z-index: 1;">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <img src="${logoMarker}" 
             style="position: absolute; 
                    top: 40%; 
                    left: 50%; 
                    transform: translate(-50%, -50%);
                    width: ${logoSize}px;
                    height: auto;
                    object-fit: contain;
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

const userIcon = new L.Icon.Default();

const UpdateMapView = ({ center, zoom, venueId }) => {
  const map = useMap();

  useEffect(() => {
    if (center.lat && center.lng) {
      map.flyTo([center.lat, center.lng], zoom, {
        duration: 1,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
};

const MapEvents = ({ setMapCenter, onMapMoveEnd }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
      if (onMapMoveEnd) {
        onMapMoveEnd({ lat: center.lat, lng: center.lng });
      }
    },
  });

  return null;
};

const VenueMap = forwardRef(
  ({ venues, center, userLocation, highlightedVenueId, onMapMoveEnd }, ref) => {
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [mapCenter, setMapCenter] = useState(center);
    const mapRef = useRef();
    const popupRefs = useRef({});

    useImperativeHandle(ref, () => ({
      flyToLocation: (location, zoomLevel = 18, venueId) => {
        if (mapRef.current) {
          mapRef.current.flyTo([location.lat, location.lng], zoomLevel, {
            duration: 1,
            easeLinearity: 0.25,
          });

          // Highlight the venue but don't open popup automatically
          if (venueId) {
            const marker = Object.values(mapRef.current._layers).find(
              (layer) => layer.options?.venueId === venueId
            );
            if (marker) {
              // Just update the marker appearance without opening popup
              marker.setIcon(createVenueIcon(isMobile, true));
            }
          }
        }
      },
    }));

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMapMoveEnd = ({ lat, lng }) => {
      dispatch(fetchNearbyVenues({ lat, lng }));
    };

    const handleMarkerClick = (venueId) => {
      const marker = popupRefs.current[venueId];
      if (marker) {
        marker.openPopup();
      }
    };

    return (
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        className="h-full w-full z-0 rounded-md"
        touchZoom={true}
        doubleClickZoom={false}
        zoomControl={!isMobile}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <UpdateMapView center={center} zoom={13} venueId={highlightedVenueId} />
        <MapEvents
          setMapCenter={setMapCenter}
          onMapMoveEnd={handleMapMoveEnd}
        />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
          >
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {venues
          ?.filter((venue) => venue.isVerified)
          .map((venue) => {
            if (!venue.location?.coordinates) return null;
            const [lng, lat] = venue.location.coordinates;
            const isHighlighted = highlightedVenueId === venue._id;
            const venueIcon = createVenueIcon(isMobile, isHighlighted);

            return (
              <Marker
                key={venue._id}
                position={[lat, lng]}
                icon={venueIcon}
                venueId={venue._id}
                eventHandlers={{
                  click: () => handleMarkerClick(venue._id),
                }}
              >
                <Popup
                  className={isHighlighted ? "highlighted-popup" : ""}
                  ref={(ref) => {
                    if (ref) {
                      popupRefs.current[venue._id] = ref;
                    } else {
                      delete popupRefs.current[venue._id];
                    }
                  }}
                >
                  <div className="max-w-[200px]">
                    {venue.images?.length > 0 && (
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
                    <p className="text-sm text-gray-600 mb-2">
                      {venue.address}
                    </p>
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
  }
);

export default VenueMap;
