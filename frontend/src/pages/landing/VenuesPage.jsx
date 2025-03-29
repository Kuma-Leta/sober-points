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
import { FaBars, FaMapMarker } from "react-icons/fa";
import Tags from "./Tags";

const VenuesPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { venues, nearbyVenues, searchResults, loading, error } = useSelector(
    (state) => state.venues
  );

  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865, // Default to London
    lng: -0.118092,
  });

  const [showMap, setShowMap] = useState(true);

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
    <div className="flex flex-col min-h-screen bg-white p-2 dark:bg-darkBg">
      {/* Header Section */}
      <div className="flex justify-between p-3 items-center mb-2">
        <SearchBar />
        <button
          onClick={() => setShowMap(!showMap)}
          title="Toggle Map"
          className="bg-white flex items-center justify-center p-2 border-2 border-gray-300 rounded-md transition duration-300"
        >
          {showMap ? <FaBars size={20} /> : <FaMapMarker size={20} />}
        </button>
      </div>

      {/* Tags Section */}
      <Tags />

      {/* Main Content Section */}
      <hr className="w-full text-gray-200" />
      <div
        className={`flex ${
          showMap ? "md:flex-row" : "flex-col"
        } h-screen gap-4`}
      >
        {/* VenueLists (Scrollable) */}
        <div className="h-full w-full overflow-y-auto flex-1">
          <VenueLists isSideBySide={showMap} loading={loading} error={error} />
        </div>

        {/* VenueMap (Full Height) */}
        {showMap && (
          <div className="h-full w-full flex-1">
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
