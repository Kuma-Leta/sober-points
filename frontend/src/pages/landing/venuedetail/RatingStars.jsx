import React from "react";

const RatingStars = ({ rating, onRatingChange }) => {
  const handleClick = (newRating) => {
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-2xl cursor-pointer ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
