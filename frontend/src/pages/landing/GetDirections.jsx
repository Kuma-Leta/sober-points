import React, { useState, useEffect } from "react";

const GetDirections = ({ destination }) => {
  const [userLocation, setUserLocation] = useState(null);

  // Get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Open Google Maps with directions
  const handleGetDirections = () => {
    if (userLocation && destination) {
      const origin = `${userLocation.lat},${userLocation.lng}`;
      const googleMapsUrl = `https://www.google.com/maps/dir/${origin}/${destination.lat},${destination.lng}/@${destination.lat},${destination.lng},16z?entry=ttu&g_ep=EgoyMDI1MDMwOC4wIKXMDSoASAFQAw%3D%3D`;
      window.open(googleMapsUrl, "_blank");
    } else {
      alert(
        "Unable to get your current location. Please ensure location services are enabled."
      );
    }
  };

  return (
    <button
      onClick={handleGetDirections}
      className="px-4 py-2 bg-primary text-white rounded-md hover:primaryLight transition duration-300 text-sm sm:text-base"
    >
      Get Directions
    </button>
  );
};

export default GetDirections;
