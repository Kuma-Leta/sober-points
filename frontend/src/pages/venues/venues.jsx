import React, { useEffect, useState } from "react";
import VenueForm from "./VenueForm"; // Assuming you have a VenueForm component
import axiosInstance from "../../api/api";
import Table from "../../ui/table";
import Modal from "../../ui/modal";
import Pagination from "../../ui/pagination";
import Search from "../../components/search";
import { useSelector } from "react-redux";
import { FaEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import VenueDetailModal from "./VenueDetailModal"; // Import the new component

export default function Venues() {
  const columns = [
    "VENUE NAME",
    "CREATED BY",
    "EMAIL",
    "STATUS",
    "ADDRESS",
    "ACTION",
  ];

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [page, setPage] = useState(1); // Page state
  const [limit] = useState(10); // Items per page
  const [query, setQuery] = useState(""); // Search query
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [selectedVenueDetails, setSelectedVenueDetails] = useState(null); // For detail modal
  // const [isFormOpen, setIsFormOpen] = useState(false);

  // Fetch venues with pagination and search query
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/venues`, {
          params: { page, limit, q: query }, // Pass page, limit, and search query
        });
        setVenues(res.data.venues);
        setTotalPages(res.data.totalPages); // Assuming API returns total pages
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching venues");
        setLoading(false);
      }
    };
    fetchVenues();
  }, [page, query, limit]);

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/venues/${confirmDelete}`);
        setVenues(venues.filter((venue) => venue._id !== confirmDelete));
        setConfirmDelete(null);
      } catch (error) {
        console.error("Error deleting venue:", error);
      }
    }
  };

  const handleEdit = (venueId) => {
    setSelectedVenueId(venueId);
  };

  const handleCloseModal = () => {
    setSelectedVenueId(null);
    setIsCreating(false);
    setConfirmDelete(null);
    setSelectedVenueDetails(null); // Close detail modal
  };

  const handleUpdate = async () => {
    const res = await axiosInstance.get(`/venues`, {
      params: { page, limit, q: query },
    });
    setVenues(res.data.venues);
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleVerify = async (venueId) => {
    try {
      await axiosInstance.patch(`/venues/${venueId}/verify`, {
        isVerified: true,
      });
      // Update the venue's status in the state
      setVenues((prevVenues) =>
        prevVenues.map((venue) =>
          venue._id === venueId ? { ...venue, isVerified: true } : venue
        )
      );
      setSelectedVenueDetails((prevDetails) => ({
        ...prevDetails,
        isVerified: true,
      }));
    } catch (error) {
      console.error("Error verifying venue:", error);
    }
  };

  const [mappedVenues, setMappedVenues] = useState([]);
  useEffect(() => {
    const mapped = venues.map((venue) => ({
      "VENUE NAME": venue.name,
      "CREATED BY": venue.createdBy?.name || "N/A",
      EMAIL: venue.createdBy?.email || "N/A",
      STATUS: (
        <span
          style={{
            color: venue.isVerified ? "#14B8A6" : "#DC2626", // Teal for Verified, Red for Unverified
            fontWeight: "500",
          }}
        >
          {venue.isVerified ? "Verified" : "Unverified"}
        </span>
      ),
      ADDRESS: venue.address,
      ACTION: (
        <Action
          venueId={venue._id}
          onDelete={() => setConfirmDelete(venue._id)} // Set venueId for deletion
          onEdit={handleEdit}
          onView={() => setSelectedVenueDetails(venue)} // Set venue details for modal
        />
      ),
    }));
    setMappedVenues(mapped);
    if (venues.length > 0) {
      setError(null);
    }
  }, [venues]);

  const handleCreate = () => {
    setIsCreating(true);
  };

  const user = useSelector((state) => state.auth.user);

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center mb-4 justify-between">
        <Search setQuery={handleSearchChange} />{" "}
        <button
          onClick={handleCreate}
          className="bg-ternary h-min text-white px-4 py-2 rounded"
        >
          Add Venue
        </button>
      </div>

      <Table
        error={error}
        loading={loading}
        data={mappedVenues}
        columns={columns}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)} // Update page on change
      />

      <Modal
        isOpen={isCreating || selectedVenueId !== null}
        onClose={handleCloseModal}
      >
        <div className="overflow-auto max-h-screen p-4">
          <VenueForm
            mode={isCreating ? "create" : "edit"}
            venueId={selectedVenueId}
            onClose={handleCloseModal}
            onUpdate={handleUpdate}
            // onCloses={() => setIsFormOpen(false)}
          />
        </div>
      </Modal>

      <Modal isOpen={confirmDelete !== null} onClose={handleCloseModal}>
        <div className=" p-8 dark:bg-darkCard rounded bg-white">
          <p>Are you sure you want to delete this venue?</p>
          <div className="flex justify-end space-x-4  mt-4 -lg">
            <button
              disabled={user?._id === confirmDelete}
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Yes, Delete
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Render the VenueDetailModal component with verification function */}
      <VenueDetailModal
        isOpen={selectedVenueDetails !== null}
        onClose={handleCloseModal}
        selectedVenueDetails={selectedVenueDetails}
        onVerify={() => handleVerify(selectedVenueDetails._id)} // Pass the verify function
      />
    </div>
  );
}

const Action = ({ venueId, onDelete, onEdit, onView }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      <div className="flex items-center gap-3 justify-center mx-auto ">
        <FaRegTrashAlt
          onClick={onDelete}
          className="cursor-pointer text-red-500 hover:text-red-700"
        />
        <FaEdit
          onClick={() => {
            onEdit(venueId);
          }}
          className=" cursor-pointer text-ternary hover:text-primary"
        />
        <FaEye
          onClick={onView}
          className="cursor-pointer text-blue-500 hover:text-blue-700"
        />
      </div>
    </div>
  );
};
