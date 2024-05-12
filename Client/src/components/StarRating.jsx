import React, { useState, useEffect } from "react";

const StarRating = ({ value, onChange }) => {
  const [rating, setRating] = useState(value);

  const handleStarClick = (newValue) => {
    setRating(newValue);
    onChange(newValue);
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          style={{ cursor: "pointer" }}
          onClick={() => handleStarClick(index + 1)}
        >
          {index < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
