import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addVenueRating,
  updateVenueRating,
} from "../../../redux/venue/venueSlice";
import RatingStars from "./RatingStars";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const ReviewForm = ({
  venueId,
  existingReview,
  setExistingReview,
  setShowReviewForm,
  setNewReview,
  setUpdatedReview,
}) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const [serviceRating, setServiceRating] = useState(
    existingReview?.serviceRating || 0
  );
  const [locationRating, setLocationRating] = useState(
    existingReview?.locationRating || 0
  );
  const [review, setReview] = useState(existingReview?.review || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (serviceRating === 0 || locationRating === 0) {
      toast.error("Please provide ratings for both service and location.");
      return;
    }

    if (review.trim() === "") {
      toast.error("Please write a review.");
      return;
    }

    const action = existingReview
      ? updateVenueRating({
          ratingId: existingReview._id,
          serviceRating,
          locationRating,
          review,
        })
      : addVenueRating({
          venueId,
          serviceRating,
          locationRating,
          review,
        });

    dispatch(action)
      .unwrap()
      .then((result) => {
        toast.success(
          existingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );

        const newReview = {
          _id: result._id,
          user: {
            _id: user._id,
            name: user.name,
          },
          serviceRating,
          locationRating,
          review,
          createdAt: new Date().toISOString(),
        };

        if (existingReview) {
          setUpdatedReview(newReview); // Update the existing review
        } else {
          setNewReview(newReview); // Add the new review
        }

        setExistingReview(null);
        setServiceRating(0);
        setLocationRating(0);
        setReview("");
        setShowReviewForm(false);
      })
      .catch((error) => {
        toast.error(error || "Failed to submit review.");
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        {existingReview ? "Update Your Review" : "Write a Review"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Rating
          </label>
          <RatingStars
            rating={serviceRating}
            onRatingChange={setServiceRating}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location Rating
          </label>
          <RatingStars
            rating={locationRating}
            onRatingChange={setLocationRating}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Share your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {existingReview ? "Update Review" : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
