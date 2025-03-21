import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/api";
import RatingStars from "./RatingStars";

const ReviewStats = ({ venueId, venue, newReview, updatedReview }) => {
  const [ratingDistribution, setRatingDistribution] = useState({
    5: { count: 0, percentage: 0 },
    4: { count: 0, percentage: 0 },
    3: { count: 0, percentage: 0 },
    2: { count: 0, percentage: 0 },
    1: { count: 0, percentage: 0 },
  });
  const [totalRatings, setTotalRatings] = useState(0);

  const fetchRatingDistribution = async () => {
    try {
      const response = await axiosInstance.get(
        `/ratings/distribution/${venueId}`
      );
      const { distribution, totalRatings } = response.data;

      if (totalRatings > 0) {
        const updatedDistribution = {};

        Object.keys(distribution).forEach((rating) => {
          updatedDistribution[rating] = {
            count: distribution[rating].count,
            percentage: ((distribution[rating].count / totalRatings) * 100).toFixed(1),
          };
        });

        setRatingDistribution(updatedDistribution);
      }

      setTotalRatings(totalRatings);
    } catch (error) {
      console.error("Error fetching rating distribution:", error);
    }
  };

  // Fetch rating distribution on component mount
  useEffect(() => {
    fetchRatingDistribution();
  }, [venueId]);

  // Re-fetch rating distribution when a new review is added or an existing review is updated
  useEffect(() => {
    if (newReview || updatedReview) {
      fetchRatingDistribution();
    }
  }, [newReview, updatedReview]);

  // Show message when there are no reviews
  if (totalRatings === 0) {
    return (
      <div className="mb-6 bg-white dark:bg-darkCard p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-dark dark:text-darkText mb-4">
          Rating Distribution
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white dark:bg-darkCard p-6 rounded-lg ">
      <h3 className="text-xl font-semibold text-dark dark:text-darkText mb-4">
        Rating Distribution
      </h3>

      {/* Container for Average Rating and Rating Distribution Bars */}
      <div className="grid items-start  md:flex gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-inner">
          <span className="text-8xl font-bold text-dark dark:text-darkText">
            {venue.rating.toFixed(1)}
          </span>
          <RatingStars rating={venue.rating} />
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {totalRatings} reviews
          </p>
        </div>

        {/* Rating Distribution Bars */}
        <div className="flex-1 space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center">
              <span className="w-8 text-sm text-gray-700 dark:text-gray-300">
                {star} Star
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded ml-2 relative">
                <div
                  className="bg-yellow-500 h-2 rounded absolute top-0 left-0 transition-all duration-500"
                  style={{
                    width: `${ratingDistribution[star]?.percentage || 0}%`,
                  }}
                ></div>
              </div>
              <span className="w-12 text-sm text-gray-700 dark:text-gray-300 ml-2">
                {ratingDistribution[star]?.percentage || "0"}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;