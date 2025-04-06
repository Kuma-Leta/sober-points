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
import { FaBars, FaMapMarker } from "react-icons/fa";
import Tags from "./Tags";
import ContributePage from "./ContributePage";

const VenuesPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    venues,
    topVenue,
    nearbyVenues,
    searchResults,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.venues);

  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });
  const [showMap, setShowMap] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedVenueId, setHighlightedVenueId] = useState(null);
  const venueMapRef = useRef();

  // Hide map if no venues are found in search results
  useEffect(() => {
    if (searchResults.length === 0) {
      setShowMap(false);
    }
  }, [searchResults]);

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
      setShowMap(true); // Ensure map is shown for location-based searches
    } else if (query) {
      dispatch(searchVenues(query));
    } else {
      dispatch(fetchVenues({ page }));
      setShowMap(true); // Ensure map is shown for general venue listing
    }
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const handleSuggestionSelect = ({ lat, lng, venueId }) => {
    setMapCenter({ lat, lng });
    setHighlightedVenueId(venueId);
    setShowMap(true); // Always show map when selecting a suggestion
    setTimeout(() => {
      venueMapRef.current?.flyToLocation({ lat, lng }, 18, venueId);
    }, 100);
  };
  const handleSearchComplete = (searchResults) => {
    if (searchResults?.length > 0) {
      // Get the first venue from search results
      const topVenue = searchResults[0];
      if (topVenue.location?.coordinates) {
        const [lng, lat] = topVenue.location.coordinates;
        setMapCenter({ lat, lng });
        setHighlightedVenueId(topVenue._id);
        setShowMap(true);
        console.log("topVenue coordinates", topVenue.location.coordinates);
        // Fly to the top venue location
        setTimeout(() => {
          venueMapRef.current?.flyToLocation({ lat, lng }, 15, topVenue._id);
        }, 100);
      }
    } else {
      setShowMap(false);
    }
  };
  return (
    <div className="flex flex-col min-h-screen max-w-[1440px] mx-auto bg-white p-2 dark:bg-darkBg">
      <div className="flex justify-between p-3 items-center mb-2">
        <SearchBar
          onSuggestionSelect={handleSuggestionSelect}
          onSearch={handleSearchComplete}
        />
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
              highlightedVenueId={highlightedVenueId}
            />
          </div>
        )}
      </div>
      <ContributePage />
    </div>
  );
};

export default VenuesPage;
