import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/api";
import RatingStars from "./RatingStars";
import { formatDistanceToNow } from "date-fns";

const ReviewList = ({ venueId, updatedReview, newReview }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(
        `/ratings/${venueId}/getRating?page=${page}&limit=5`
      );
      if (response.data.ratings.length > 0) {
        setReviews(response.data.ratings);
        setTotalReviews(response.data.totalRatings);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page]);

  // Handle updated review
  useEffect(() => {
    if (updatedReview) {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
    }
  }, [updatedReview]);

  // Handle new review
  useEffect(() => {
    if (newReview) {
      // Remove the previous review from the same user (if it exists)
      setReviews((prevReviews) => {
        const filteredReviews = prevReviews.filter(
          (review) => review.user._id !== newReview.user._id
        );
        return [newReview, ...filteredReviews]; // Add the new review at the top
      });
    }
  }, [newReview]);

  return (
    <div className="mt-6 bg-white dark:bg-darkCard p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-dark dark:text-darkText mb-6">
        Reviews ({totalReviews})
      </h3>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review._id}
            className="border-b border-gray-300 dark:border-grayColor py-6 last:border-b-0"
          >
            <div className="flex items-center justify-between">
              {/* Left Side: Profile Icon + Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-semibold">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-dark dark:text-darkText">
                    {review.user.name}
                  </h4>
                  <span className="text-sm text-grayColor dark:text-darkText">
                    {formatDistanceToNow(new Date(review.createdAt))} ago
                  </span>
                </div>
              </div>

              {/* Right Side: Rating Stars */}
              <RatingStars rating={review.serviceRating} />
            </div>

            {/* Review Text */}
            <p className="mt-3 text-grayColor dark:text-darkText leading-relaxed">
              {review.review}
            </p>
          </div>
        ))
      ) : (
        <p className="text-grayColor dark:text-darkText mt-4">
          No reviews yet. Be the first to leave one!
        </p>
      )}

      {totalReviews > 7 && hasMore && (
        <div className="text-center mt-6">
          <button
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryLight dark:bg-primaryDark dark:hover:bg-primary transition-all duration-300"
            onClick={() => setPage(page + 1)}
          >
            View More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
