import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/api";
import VenueLists from "./VenueLists";
import VenueMap from "./VenueMap";
import SearchBar from "../../components/search";
import Header from "../../components/common/header";

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [query, setQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({
    lat: 51.509865,
    lng: -0.118092,
  }); // Default London
  const [showMap, setShowMap] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const lat = parseFloat(searchParams.get("lat"));
    const lng = parseFloat(searchParams.get("lng"));
    const queryParam = searchParams.get("query");

    if (lat && lng) {
      setMapCenter({ lat, lng });
      setShowMap(true);
      fetchVenues(lat, lng, queryParam);
    } else if (queryParam) {
      setShowMap(false);
      setQuery(queryParam);
      fetchVenues(mapCenter.lat, mapCenter.lng, queryParam);
    }
  }, [searchParams]);

  // ✅ **Fetch Nearby Venues**
  const fetchVenues = async (lat, lng, query = "") => {
    try {
      const response = await axiosInstance.get(
        `/venues/nearby/?lat=${lat}&lng=${lng}`
      );

      // ✅ **Transform image paths to valid URLs**
      const transformedVenues = response.data.map((venue) => ({
        ...venue,
        images: venue.images.map(
          (image) => `http://localhost:5000/uploads/${image.split("\\").pop()}`
        ),
      }));

      setVenues(transformedVenues);
      console.log(transformedVenues);
    } catch (error) {
      console.error("Error fetching venues:", error);
      setVenues([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-darkBg">
      {/* ✅ **Header Section** */}
      <Header />

      {/* ✅ **Main Content Layout** */}
      <div className="flex flex-col md:flex-row flex-1 pt-20">
        {/* ✅ **Map - Full Width on Mobile, 50% on Desktop** */}
        {/* ✅ **Venue List - Full Width on Mobile, 50% on Desktop** */}
        <div className="w-full md:w-1/2 p-6 bg-white dark:bg-darkCard overflow-y-auto">
          <SearchBar setQuery={setQuery} />
          <VenueLists venues={venues} />
        </div>
        {showMap && (
          <div className="w-full md:w-1/2 h-80 md:h-full z-0">
            <VenueMap venues={venues} center={mapCenter} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesPage;
