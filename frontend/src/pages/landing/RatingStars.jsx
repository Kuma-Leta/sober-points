import React from "react";

const RatingStars = ({ rating }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating); // Number of full stars
  const hasHalfStar = rating % 1 !== 0; // Check if there's a half star

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        if (index < fullStars) {
          // Full star
          return (
            <span key={index} className="text-yellow-500 text-xl">
              ★
            </span>
          );
        } else if (hasHalfStar && index === fullStars) {
          // Half star
          return (
            <span key={index} className="text-yellow-500 text-xl">
              ★
            </span>
          );
        } else {
          // Gray star
          return (
            <span key={index} className="text-gray-300 text-xl">
              ★
            </span>
          );
        }
      })}
    </div>
  );
};

export default RatingStars;