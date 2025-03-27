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
  const [isCreating, setIsCreating] = useState(false);
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

  if (loading) return <p className="text-center mt-20">Loading...</p>; // Show loading state
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>; // Show error message
  if (!venue) return <p className="text-center mt-20">Venue not found.</p>; // Handle case where venue is not found

  // Extract coordinates from the location object
  const coordinates = venue.location?.coordinates
    ? [venue.location.coordinates[1], venue.location.coordinates[0]] // [latitude, longitude]
    : null;

  return (
    <div className="p-4 mt-4 max-w-7xl mx-auto">
      {/* Header with Update and Delete Icons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
      </div>

      {/* Single Container for All Content */}
      <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          {/* Back Icon */}
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <FaArrowLeft className="w-6 h-6" />
          </button>

          {/* Update & Delete Icons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
            >
              <FaEdit className="w-6 h-6" />
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <FaTrash className="w-6 h-6" />
            </button>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Venue Details
        </h2>
        {/* Grid Layout for Left and Right Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Venue Details */}
          <div>
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {venue.description}
              </p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Rating</h3>
              <div className="flex items-center">
                <RatingStars rating={venue.rating || 0} />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  ({venue.rating || 0})
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Address</h3>
              <div className="flex items-center">
                <FaMapMarkerAlt className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  {venue.address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <div className="flex items-center">
                <FaPhone className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  {venue.phone}
                </p>
              </div>
            </div>

            {/* Website */}
            {venue.website && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Website</h3>
                <div className="flex items-center">
                  <FaGlobe className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                  <a
                    href={venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {venue.website}
                  </a>
                </div>
              </div>
            )}

            {/* Menu */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Menu</h3>
              <p className="text-gray-600 dark:text-gray-300">{venue.menu}</p>
            </div>

            {/* Status */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Status</h3>
              <p
                className={
                  venue.isVerified ? "text-green-500" : "text-yellow-500"
                }
              >
                {venue.isVerified ? "Verified" : "Pending"}
              </p>
            </div>

            {/* Timings */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Created At</h3>
              <div className="flex items-center">
                <FaClock className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  {new Date(venue.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Images and Map */}
          <div>
            {/* Venue Images */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Venue Images</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {venue.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image.replace(/\\/g, "/")}`}
                    alt={`Venue Image ${index + 1}`}
                    loading="lazy"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>

            {/* Location (Optional) */}
            {coordinates && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Location</h2>
                <div className="h-96 w-full rounded-lg overflow-hidden">
                  <MapComponent
                    coordinates={coordinates} // Pass [latitude, longitude]
                    isStatic={true} // Set to true if the map should not be interactive
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
        contentLabel="Update Venue"
        className="fixed inset-0 flex items-center dark:bg-darkBg justify-center p-4 bg-black bg-opacity-50"
      >
        <div className="bg-white dark:bg-darkBg p-6 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          <h2 className="text-2xl font-semibold mb-4">Update Venue</h2>
          <VenueForm
            mode={isCreating ? "create" : "edit"}
            venueId={venueId}
            onUpdate={handleUpdate}
            onClose={() => setIsUpdateModalOpen(false)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default MyVenueDetail;
