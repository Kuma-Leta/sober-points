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
import {
  FaBars,
  FaLocationArrow,
  FaMap,
  FaSearchLocation,
  FaMapMarker,
  FaMapSigns,
} from "react-icons/fa"; // Import icons for toggle button

const VenuesPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { venues, nearbyVenues, searchResults, loading, error } = useSelector(
    (state) => state.venues
  );

  // Track user's location
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865, // Default to London
    lng: -0.118092,
  });

  // Track map visibility
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
    <div className="flex flex-col min-h-screen bg-white mt-20 p-2  dark:bg-darkBg">
      {/* <div className="flex flex-col md:flex-row flex-1 pt-20">
        <div
          className={`w-full ${
            showMap ? "md:w-1/2" : "md:w-full"
          } p-6 bg-white dark:bg-darkCard overflow-y-auto h-screen`}
        >
          <div className="flex justify-between items-center mb-4">
            <SearchBar />

            <button
              onClick={() => setShowMap(!showMap)}
              title="Toggle Map"
              className="p-2 bg-black  rounded-md transition text-black-400 bg-white border-2 border-solid border-blgray rounded-lg p-3 duration-300"
            >
              {showMap ? <FaBars size={20} /> : <FaMapMarker size={20} />}
            </button>
          </div>
          <VenueLists isSideBySide={showMap} loading={loading} error={error} />
        </div>
        <div></div>

        {showMap && (
          <div className="w-full md:w-1/2 h-screen sticky top-6 z-0">
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
      </div> */}
      <div>
        {/* Header Section */}
        <div className="flex justify-between p-3 items-center mb-2">
          <SearchBar />
          <button
            onClick={() => setShowMap(!showMap)}
            title="Toggle Map"
            className="bg-black flex items-center justify-center p-2 rounded-md transition text-black-400 bg-white border-2 border-solid border-blgray rounded-lg duration-300"
          >
            {showMap ? <FaBars size={20} /> : <FaMapMarker size={20} />}
          </button>
        </div>

        {/* Tags Section */}
        <div>tags</div>

        {/* Main Content Section */}
        <div
          className={
            showMap
              ? "grid grid-cols-1 md:grid-cols-2 gap-4 z-0 relative"
              : "grid grid-cols-1 gap-4 z-0 relative"
          }
        >
          {/* VenueLists (Scrollable) */}
          <div
            className={
              showMap
                ? "h-[calc(100vh-200px)] overflow-y-auto" // Adjust height as needed
                : ""
            }
          >
            <VenueLists
              isSideBySide={showMap}
              loading={loading}
              error={error}
            />
          </div>

          {/* VenueMap (Sticky) */}
          {showMap && (
            <div className="w-full sticky top-0 h-[calc(100vh-100px)]">
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
    </div>
  );
};

export default VenuesPage;
