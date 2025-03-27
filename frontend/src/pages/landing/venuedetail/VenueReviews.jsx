import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewStats from "./ReviewStats";
import ReviewList from "./ReviewList";
import useAuth from "../../../hooks/useAuth";

const VenueReviews = ({ venueId, venue }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [newReview, setNewReview] = useState(null);
  const [updatedReview, setUpdatedReview] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const userRating = venue?.reviews.find(
    (review) => review.user === user?._id
  );
console.log(venue.reviews)
  const handleReviewButtonClick = () => {
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: `/venue/${venueId}` } });
    } else {
      setShowReviewForm(true);
    }
  };

  return (
    <div className="mt-6">
      {showReviewForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowReviewForm(false)}
            >
              ✖
            </button>
            <ReviewForm
              venueId={venueId}
              existingReview={existingReview}
              setExistingReview={setExistingReview}
              setShowReviewForm={setShowReviewForm}
              setNewReview={setNewReview}
              setUpdatedReview={setUpdatedReview}
            />
          </div>
        </div>
      )}

      {/* Pass newReview and updatedReview to ReviewStats */}
      {venue.reviews.length > 0 && (
        <ReviewStats
          venueId={venueId}
          venue={venue}
          newReview={newReview}
          updatedReview={updatedReview}
        />
      )}
<div className="flex justify-center items-center">
      <a
        className="cursor-pointer text-blue-500"
        onClick={handleReviewButtonClick}
      >
        {userRating ? "Update Your Review" : "Write a Review"}
      </a>
  </div>

      <ReviewList
        venueId={venueId}
        venue={venue}
        updatedReview={updatedReview}
        newReview={newReview}
      />
    </div>
  );
};

export default VenueReviews;