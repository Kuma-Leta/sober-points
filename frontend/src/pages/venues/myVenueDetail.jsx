import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaClock,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaTimes, // Import the close icon
} from "react-icons/fa";
import MapComponent from "./mapComp"; // Import the MapComponent
import VenueForm from "./VenueForm"; // Import the VenueForm component
import Modal from "react-modal"; // Import a modal library (e.g., react-modal)
import RatingStars from "../landing/venuedetail/RatingStars";

// Set app element for accessibility (required by react-modal)
Modal.setAppElement("#root");

const MyVenueDetail = () => {
  const { venueId } = useParams(); // Get venueId from the URL
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // State for update modal

  // Fetch venue details
  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        console.log("Fetching venue details...");
        const response = await axiosInstance.get(`/venues/my-venue/${venueId}`);
        console.log("API Response:", response.data);

        if (!response.data.success) {
          throw new Error("Venue not found");
        }

        // Set the fetched venue details in state
        setVenue(response.data.data);
      } catch (err) {
        console.error("Error fetching venue details:", err);
        setError(
          err.message ||
            "Failed to fetch venue details. Please try again later."
        );
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  // Handle delete venue
  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/venues/${venueId}`);

      if (response.data.message === "Venue deleted successfully") {
        navigate("/my-venue"); // Redirect to the venues list after deletion
      } else {
        console.error("Delete API Error:", response.data.message); // Debugging
        setError(
          response.data.message ||
            "Failed to delete venue. Please try again later."
        );
      }
    } catch (err) {
      console.error("Error deleting venue:", err.response?.data || err.message); // Debugging
      if (err.response?.status === 403) {
        setError("You are not authorized to delete this venue.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to delete venue. Please try again later."
        );
      }
    }
  };

  // Handle update venue
  const handleUpdate = (updatedVenue) => {
    if (updatedVenue) {
      setVenue(updatedVenue); // Update the venue in state
    } else {
      setError("Failed to update venue. Please try again.");
    }
    setIsUpdateModalOpen(false); // Close the update modal
  };

  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>; // Show error message
  if (!venue && !loading)
    return <p className="text-center mt-20">Venue not found.</p>; // Handle case where venue is not found

  return (
    <>
      {/* Render DetailFeature component */}
      <DetailFeature
        venue={venue}
        navigate={navigate}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        loading={loading} // Pass loading state
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Venue Confirmation"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <div className="bg-white dark:bg-darkBg p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Delete Venue</h2>
          <p className="mb-6">Are you sure you want to delete this venue?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              No
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Venue Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        className="fixed inset-0 flex items-center dark:bg-darkBg justify-center p-4 bg-black bg-opacity-50"
      >
        <div className="bg-white dark:bg-darkBg p-6 z-51 rounded-lg shadow-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto relative">
          <VenueForm
            mode="edit"
            venueId={venueId}
            onUpdate={handleUpdate}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        </div>
      </Modal>
    </>
  );
};

export default MyVenueDetail;
