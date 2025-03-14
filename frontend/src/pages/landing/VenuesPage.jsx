import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVenues,
  fetchNearbyVenues,
  searchVenues,
} from "../../redux/venue/venueSlice";
import VenueLists from "./VenueLists";
import VenueMap from "./VenueMap";
import SearchBar from "../../components/search";
import Header from "../../components/common/header";

const VenuesPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { venues, nearbyVenues, searchResults, loading, error } = useSelector(
    (state) => state.venues
  );

  // ✅ Track user's location
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865, // Default to London
    lng: -0.118092,
  });

  // ✅ Check if the user came from the LandingPage
  const fromLanding = searchParams.get("fromLanding") === "true";

  // ✅ Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  useEffect(() => {
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    const query = searchParams.get("query");

    if (lat && lng) {
      setMapCenter({ lat, lng });
      dispatch(fetchNearbyVenues({ lat, lng }));
    } else if (query) {
      dispatch(searchVenues(query));
    } else {
      dispatch(fetchVenues());
    }
  }, [dispatch, searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-darkBg">
      {/* <Header /> */}
      <div className="flex flex-col md:flex-row flex-1 pt-20">
        <div
          className={`w-full ${
            fromLanding ? "md:w-full" : "md:w-1/2"
          } p-6 bg-white dark:bg-darkCard overflow-y-auto h-screen`}
        >
          <SearchBar />
          {loading ? (
            <p className="text-gray-500">Loading venues...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <VenueLists
              venues={
                searchResults.length > 0
                  ? searchResults
                  : nearbyVenues.length > 0
                  ? nearbyVenues
                  : venues
              }
              isSideBySide={true}
            />
          )}
        </div>

        {/* Conditionally render the map */}
        {!fromLanding && (
          <div className="w-full md:w-1/2 h-screen sticky top-0 z-0">
            <VenueMap
              venues={
                searchResults.length > 0
                  ? searchResults
                  : nearbyVenues.length > 0
                  ? nearbyVenues
                  : venues
              }
              center={mapCenter}
              userLocation={userLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;
