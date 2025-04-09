import React, { useState, useEffect } from "react";
import Modal from "../../ui/modal";
import MapComponent from "./mapComp";
import axiosInstance from "../../api/api";
import { FaCheck, FaTimes } from "react-icons/fa";
import Pagination from "../../ui/pagination";
import RatingStars from "../landing/venuedetail/RatingStars";
export default function VenueDetailModal({
  isOpen,
  onClose,
  selectedVenueDetails,
  onVerify,
}) {
  const backendBaseUrl = import.meta.env.VITE_API_URL;
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch reviews for the venue

  const handleVerifyClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmVerify = () => {
    onVerify();
    setShowConfirmation(false);
  };

  const handleCancelVerify = () => {
    setShowConfirmation(false);
  };

  // Verify/Unverify a review

  return (
    <>
      {/* Main Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="w-[1000px] max-w-[90vw]  p-8 dark:bg-darkCard rounded-lg bg-white shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white dark:bg-darkCard pb-6 z-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Venue Details
            </h2>
          </div>

          {/* Two-Column Layout */}
          <div className="max-h-[70vh] overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Side: Venue Details */}
              <div className="space-y-4">
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Venue Name:
                  </strong>
                  <span className="text-gray-900 dark:text-white">
                    {selectedVenueDetails?.name}
                  </span>
                </div>
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Created By:
                  </strong>
                  <span className="text-gray-900 dark:text-white">
                    {selectedVenueDetails?.createdBy?.name || "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Email:
                  </strong>
                  <span className="text-gray-900 dark:text-white">
                    {selectedVenueDetails?.createdBy?.email}
                  </span>
                </div>
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Phone:
                  </strong>
                  <span className="text-gray-900 dark:text-white">
                    {selectedVenueDetails?.phone || "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Website:
                  </strong>
                  <span className="text-gray-900 dark:text-white">
                    {selectedVenueDetails?.website || "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Status:
                  </strong>
                  <span
                    className="font-medium"
                    style={{
                      color: selectedVenueDetails?.isVerified
                        ? "#14B8A6"
                        : "#DC2626",
                    }}
                  >
                    {selectedVenueDetails?.isVerified
                      ? "Verified"
                      : "Unverified"}
                  </span>
                </div>
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Address:
                  </strong>
                  <span className="text-gray-900 dark:text-white">
                    {selectedVenueDetails?.address}
                  </span>
                </div>
                <div className="flex">
                  <strong className="w-32 text-gray-700 dark:text-gray-300">
                    Description:
                  </strong>
                  <span className="text-gray-900 dark:text-white">
                    {selectedVenueDetails?.description || "N/A"}
                  </span>
                </div>
              </div>

              {/* Right Side: Map and Images */}
              <div className="space-y-4">
                {/* Map Component */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Venue Location
                  </h3>
                  <div className="h-48 w-full rounded-lg overflow-hidden shadow-sm">
                    <MapComponent
                      coordinates={selectedVenueDetails?.location?.coordinates}
                      isStatic={false}
                    />
                  </div>
                </div>

                {/* Uploaded Images */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                    Uploaded Images
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedVenueDetails?.images?.map((image, index) => (
                      <img
                        key={index}
                        src={`${backendBaseUrl}/${image.replace(/\\/g, "/")}`}
                        alt={`Venue Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            {/* Verify Button (only for unverified venues) */}
            {!selectedVenueDetails?.isVerified && (
              <button
                onClick={handleVerifyClick}
                className="bg-ternary text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Verify Venue
              </button>
            )}

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={showConfirmation} onClose={handleCancelVerify}>
        <div className="p-6 dark:bg-darkCard rounded-lg bg-white shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Confirm Verification
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Are you sure you want to verify this venue?
          </p>
          <div className="flex justify-end space-x-4">
            {/* No Button */}
            <button
              onClick={handleCancelVerify}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              No
            </button>
            {/* Yes, of course Button */}
            <button
              onClick={handleConfirmVerify}
              className="bg-ternary text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Yes, of course
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
