import { useEffect, useState, useRef } from "react";
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
} from "react-icons/fa";
import Tags from "./Tags";
import ContributePage from "./ContributePage";

const VenuesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { venues, nearbyVenues, searchResults, loading, error } = useSelector(
    (state) => state.venues
  );

  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });
  const [showMap, setShowMap] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const venueMapRef = useRef();

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
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page);

    if (lat && lng) {
      setMapCenter({ lat, lng });
      dispatch(fetchNearbyVenues({ lat, lng, page }));
    } else if (query) {
      dispatch(searchVenues(query));
    } else {
      dispatch(fetchVenues({ page }));
    }
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handleSuggestionSelect = (location) => {
    setMapCenter(location);
    if (!showMap) setShowMap(true);
    setTimeout(() => {
      venueMapRef.current?.flyToLocation(location);
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-[1440px] mx-auto bg-white p-2 dark:bg-darkBg">
      <div className="flex justify-between p-3 items-center mb-2">
        <SearchBar onSuggestionSelect={handleSuggestionSelect} />
        <button
          onClick={() => setShowMap(!showMap)}
          title="Toggle Map"
          className="bg-black flex items-center justify-center p-2 rounded-md transition text-black-400 bg-white border-2 border-solid border-blgray rounded-lg duration-300"
        >
          {showMap ? <FaBars size={20} /> : <FaMapMarker size={20} />}
        </button>
      </div>

      <Tags />

      <hr className="w-full text-gray-200" />
      <div
        className={`grid min-h-screen ${
          showMap ? "md:grid-cols-2" : "grid-cols-1"
        } gap-4`}
      >
        <div>
          <VenueLists
            isSideBySide={showMap}
            loading={loading}
            error={error}
            onPageChange={handlePageChange}
          />
        </div>

        {showMap && (
          <div className="w-[94%] md:w-full mx-auto h-screen md:sticky top-0">
            <VenueMap
              ref={venueMapRef}
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
      <ContributePage />
    </div>
  );
};

export default VenuesPage;
